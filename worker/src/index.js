/**
 * CCM Social media upload Worker
 *
 * POST /upload  — accepts multipart file, validates CF Access JWT, stores in R2
 * GET  /file/*  — public read for uploaded media (used by scheduler + embeds)
 */

const ALLOWED_ORIGIN = 'https://social.amditis.tech';
const CF_ACCESS_TEAM  = 'amditis';
const MEDIA_PREFIX    = 'social-media';

// MIME types allowed for upload
const ALLOWED_TYPES = new Set([
  'image/jpeg', 'image/png', 'image/gif', 'image/webp',
  'video/mp4', 'video/quicktime', 'video/webm',
]);

function corsHeaders(origin) {
  const allowed = origin === ALLOWED_ORIGIN ? origin : ALLOWED_ORIGIN;
  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, CF-Access-JWT-Assertion',
    'Access-Control-Max-Age': '86400',
  };
}

function json(data, status = 200, origin) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) },
  });
}

async function verifyAccessJWT(jwt) {
  if (!jwt) return false;

  // Fetch Cloudflare Access public certs
  try {
    const res = await fetch(`https://${CF_ACCESS_TEAM}.cloudflareaccess.com/cdn-cgi/access/certs`);
    if (!res.ok) return false;
    const { keys } = await res.json();

    // Decode JWT header to find kid
    const [headerB64] = jwt.split('.');
    const header = JSON.parse(atob(headerB64.replace(/-/g, '+').replace(/_/g, '/')));
    const key = keys.find(k => k.kid === header.kid);
    if (!key) return false;

    // Import public key and verify
    const cryptoKey = await crypto.subtle.importKey(
      'jwk', key,
      { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
      false, ['verify']
    );

    const [, payloadB64, sigB64] = jwt.split('.');
    const signingInput = new TextEncoder().encode(`${headerB64}.${payloadB64}`);
    const sig = Uint8Array.from(atob(sigB64.replace(/-/g, '+').replace(/_/g, '/')), c => c.charCodeAt(0));

    const valid = await crypto.subtle.verify('RSASSA-PKCS1-v1_5', cryptoKey, sig, signingInput);
    if (!valid) return false;

    // Check expiry
    const payload = JSON.parse(atob(payloadB64.replace(/-/g, '+').replace(/_/g, '/')));
    return payload.exp > Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
}

async function handleUpload(request, env, origin) {
  // Validate CF Access JWT
  const jwt = request.headers.get('CF-Access-JWT-Assertion');
  const valid = await verifyAccessJWT(jwt);
  if (!valid) {
    return json({ error: 'Unauthorized' }, 401, origin);
  }

  let formData;
  try {
    formData = await request.formData();
  } catch {
    return json({ error: 'Invalid multipart form data' }, 400, origin);
  }

  const file = formData.get('file');
  if (!file || typeof file === 'string') {
    return json({ error: 'No file field in form data' }, 400, origin);
  }

  // Validate MIME type
  if (!ALLOWED_TYPES.has(file.type)) {
    return json({ error: `File type not allowed: ${file.type}` }, 415, origin);
  }

  // Sanitize filename and generate key
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 100);
  const key = `${MEDIA_PREFIX}/${Date.now()}-${safeName}`;

  // Store in R2
  await env.MEDIA_BUCKET.put(key, file.stream(), {
    httpMetadata: {
      contentType: file.type,
      cacheControl: 'public, max-age=31536000, immutable',
    },
  });

  const publicUrl = `https://upload.social.amditis.tech/file/${key}`;
  return json({ url: publicUrl, key }, 201, origin);
}

async function handleFileGet(request, env, key, origin) {
  const obj = await env.MEDIA_BUCKET.get(key);
  if (!obj) {
    return new Response('Not found', { status: 404 });
  }

  const headers = new Headers({
    'Content-Type': obj.httpMetadata?.contentType || 'application/octet-stream',
    'Cache-Control': 'public, max-age=31536000, immutable',
    'Access-Control-Allow-Origin': '*',
  });

  return new Response(obj.body, { headers });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const origin = request.headers.get('Origin') || '';

    // Preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders(origin) });
    }

    // GET /file/* — public media serving
    if (request.method === 'GET' && url.pathname.startsWith('/file/')) {
      const key = url.pathname.slice('/file/'.length);
      return handleFileGet(request, env, key, origin);
    }

    // POST /upload — authenticated upload
    if (request.method === 'POST' && url.pathname === '/upload') {
      return handleUpload(request, env, origin);
    }

    // Health check
    if (request.method === 'GET' && url.pathname === '/') {
      return json({ ok: true, service: 'ccm-social-upload' }, 200, origin);
    }

    return json({ error: 'Not found' }, 404, origin);
  },
};
