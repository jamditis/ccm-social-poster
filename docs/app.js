import { h, render } from 'https://esm.sh/preact@10.19.3';
import { useState, useEffect, useCallback, useRef } from 'https://esm.sh/preact@10.19.3/hooks';
import htm from 'https://esm.sh/htm@3.1.1';

const html = htm.bind(h);

// ─── SVG icon components (inline, no dangerouslySetInnerHTML) ──────────────

const TwitterIcon = () => html`<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.74l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
</svg>`;

const BlueskyIcon = () => html`<svg viewBox="0 0 600 530" fill="currentColor" width="18" height="18">
  <path d="M135.72 44.03C202.216 93.951 274.14 195.5 300 249.49c25.86-53.99 97.78-155.539 164.28-205.46C512.26 6.251 590-13.881 590 47.953c0 11.566-6.619 97.181-10.49 111.072-13.492 48.261-62.636 60.567-106.35 53.115 76.36 12.998 95.83 56.034 53.88 99.07-79.512 81.558-114.26-20.467-122.01-46.568-1.43-4.62-2.09-6.768-2.09-4.915 0 1.853-.66 4.002-2.09 4.915-7.747 26.101-42.494 128.126-122.01 46.568-41.95-43.036-22.478-86.072 53.88-99.07-43.71 7.452-92.856-4.854-106.35-53.115C16.619 145.134 10 59.519 10 47.953c0-61.834 77.74-41.702 125.72-3.923z"/>
</svg>`;

const LinkedInIcon = () => html`<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
</svg>`;

const FacebookIcon = () => html`<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
</svg>`;

const InstagramIcon = () => html`<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
</svg>`;

const TikTokIcon = () => html`<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.17 8.17 0 004.77 1.52V6.76a4.86 4.86 0 01-1-.07z"/>
</svg>`;

// ─── Platform config ───────────────────────────────────────────────────────

const PLATFORMS = {
  twitter:   { name: 'Twitter/X',  limit: 280,  bg: '#000000', fg: 'white', Icon: TwitterIcon },
  bluesky:   { name: 'Bluesky',    limit: 300,  bg: '#0085FF', fg: 'white', Icon: BlueskyIcon },
  linkedin:  { name: 'LinkedIn',   limit: 3000, bg: '#0A66C2', fg: 'white', Icon: LinkedInIcon },
  facebook:  { name: 'Facebook',   limit: 2000, bg: '#1877F2', fg: 'white', Icon: FacebookIcon },
  instagram: { name: 'Instagram',  limit: 2200, bg: '#E1306C', fg: 'white', Icon: InstagramIcon },
  tiktok:    { name: 'TikTok',     limit: 2200, bg: '#010101', fg: 'white', Icon: TikTokIcon },
};

// Per-platform media constraints
const PLATFORM_MEDIA = {
  twitter:   { images: { maxCount: 4,  maxMB: 5,    types: ['image/jpeg','image/png','image/gif','image/webp'] }, video: { maxCount: 1, maxMB: 512,   types: ['video/mp4','video/quicktime'] } },
  bluesky:   { images: { maxCount: 4,  maxMB: 1,    types: ['image/jpeg','image/png','image/gif','image/webp'] }, video: null },
  linkedin:  { images: { maxCount: 20, maxMB: 10,   types: ['image/jpeg','image/png','image/gif'] },              video: { maxCount: 1, maxMB: 5000,  types: ['video/mp4','video/quicktime'] } },
  facebook:  { images: { maxCount: 10, maxMB: 10,   types: ['image/jpeg','image/png','image/gif','image/webp'] }, video: { maxCount: 1, maxMB: 10000, types: ['video/mp4','video/quicktime'] } },
  instagram: { images: { maxCount: 10, maxMB: 8,    types: ['image/jpeg','image/png'] },                          video: { maxCount: 1, maxMB: 4000,  types: ['video/mp4'] } },
  tiktok:    { images: null,                                                                                       video: { maxCount: 1, maxMB: 4000,  types: ['video/mp4','video/quicktime','video/webm'] } },
};

function getEffectiveLimits(platformIds) {
  if (!platformIds.length) return { imageOk: true, videoOk: true, maxCount: 4, maxMB: 10, types: ['image/jpeg','image/png','image/gif','image/webp','video/mp4'] };
  let imageOk = true, videoOk = true, maxCount = Infinity, maxMB = Infinity;
  const typeSets = [];
  for (const id of platformIds) {
    const m = PLATFORM_MEDIA[id];
    if (!m) continue;
    if (!m.images) imageOk = false;
    else { typeSets.push(new Set(m.images.types)); maxCount = Math.min(maxCount, m.images.maxCount); maxMB = Math.min(maxMB, m.images.maxMB); }
    if (!m.video) videoOk = false;
  }
  const imageTypes = typeSets.length
    ? [...typeSets.reduce((a, b) => new Set([...a].filter(t => b.has(t))))]
    : [];
  return { imageOk, videoOk, maxCount: isFinite(maxCount) ? maxCount : 4, maxMB: isFinite(maxMB) ? maxMB : 10, types: imageTypes };
}

const REPO_OWNER  = 'jamditis';
const REPO_NAME   = 'ccm-social-poster';
const UPLOAD_URL  = 'https://upload.social.amditis.tech';

// ─── GitHub Contents API ───────────────────────────────────────────────────

async function ghFetch(token, path, options = {}) {
  const res = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `GitHub API ${res.status}`);
  }
  return res.json();
}

async function loadFile(token, filePath) {
  try {
    const file = await ghFetch(token, `/contents/${filePath}`);
    const data = JSON.parse(atob(file.content.replace(/\n/g, '')));
    return { data, sha: file.sha };
  } catch (e) {
    if (e.message.includes('404') || e.message.includes('Not Found')) {
      return { data: { version: '1.0', posts: [] }, sha: null };
    }
    throw e;
  }
}

async function saveFile(token, filePath, data, sha) {
  const json = JSON.stringify(data, null, 2);
  const encoded = btoa(unescape(encodeURIComponent(json)));
  const body = { message: `Update ${filePath} via CCM Social [skip ci]`, content: encoded, branch: 'main' };
  if (sha) body.sha = sha;
  return ghFetch(token, `/contents/${filePath}`, { method: 'PUT', body: JSON.stringify(body) });
}

// ─── R2 media upload ───────────────────────────────────────────────────────

function getCFJWT() {
  const match = document.cookie.match(/CF_Authorization=([^;]+)/);
  return match ? match[1] : null;
}

async function uploadToR2(file) {
  const jwt = getCFJWT();
  const formData = new FormData();
  formData.append('file', file);
  const headers = {};
  if (jwt) headers['CF-Access-JWT-Assertion'] = jwt;
  const res = await fetch(`${UPLOAD_URL}/upload`, { method: 'POST', body: formData, headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Upload failed: ${res.status}`);
  }
  const { url } = await res.json();
  return url;
}

// ─── Utilities ─────────────────────────────────────────────────────────────

function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
}

function relTime(iso) {
  const diff = new Date(iso) - Date.now();
  const abs  = Math.abs(diff);
  if (abs < 60000)    return diff > 0 ? 'in a moment' : 'just now';
  if (abs < 3600000)  return `${diff > 0 ? '+' : '-'}${Math.round(abs / 60000)}m`;
  if (abs < 86400000) return `${diff > 0 ? '+' : '-'}${Math.round(abs / 3600000)}h`;
  return `${diff > 0 ? '+' : '-'}${Math.round(abs / 86400000)}d`;
}

function fmtDateTime(iso) {
  return new Date(iso).toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: 'numeric', minute: '2-digit', hour12: true,
  });
}

function defaultScheduleTime() {
  const d = new Date(Date.now() + 3600000);
  d.setMinutes(0, 0, 0);
  return d.toISOString().slice(0, 16);
}

function isVideo(url) {
  return /\.(mp4|mov|webm)(\?|$)/i.test(url || '');
}

// ─── Small components ──────────────────────────────────────────────────────

function PlatformToggle({ id, active, onToggle }) {
  const { name, bg, fg, Icon } = PLATFORMS[id];
  return html`
    <button title=${name} onClick=${() => onToggle(id)} style=${{
      background: active ? bg : '#e5e7eb', color: active ? fg : '#9ca3af',
      border: 'none', borderRadius: '8px', width: '38px', height: '38px', padding: '9px',
      cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
      transition: 'all 0.15s', flexShrink: 0,
    }}>
      <${Icon} />
    </button>
  `;
}

function PlatformPills({ platforms }) {
  return html`
    <div style="display:flex;gap:4px;flex-wrap:wrap;">
      ${platforms.map(id => {
        const p = PLATFORMS[id];
        if (!p) return null;
        return html`<span key=${id} style=${{ background: p.bg, color: p.fg, fontSize: '10px', fontWeight: '700', padding: '2px 7px', borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>${p.name}</span>`;
      })}
    </div>
  `;
}

// Shared CCM avatar used in previews
function CcmAvatar({ size = 40 }) {
  return html`
    <div style=${{ width: size, height: size, borderRadius: '50%', background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }}>
      <svg width=${size * 0.75} height=${size * 0.75} viewBox="0 0 32 32" fill="none">
        <rect width="32" height="32" rx="6" fill="#0a0a0a"/>
        <text x="16" y="20.5" font-family="DM Sans,system-ui,sans-serif" font-size="11" font-weight="700" fill="#CA3553" text-anchor="middle" letter-spacing="0.5">CCM</text>
        <rect x="8" y="24" width="16" height="1.5" rx="0.75" fill="#D4AF37"/>
      </svg>
    </div>
  `;
}

// ─── Settings modal ────────────────────────────────────────────────────────

function SettingsModal({ currentToken, onSave, onClose }) {
  const [val, setVal] = useState(currentToken || '');
  const save = () => { const t = val.trim(); localStorage.setItem('ccm_gh_token', t); onSave(t); onClose(); };
  return html`
    <div onClick=${(e) => e.target === e.currentTarget && onClose()} style=${{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: '1rem' }}>
      <div style=${{ background: 'white', borderRadius: '14px', padding: '2rem', width: '100%', maxWidth: '460px', boxShadow: '0 24px 64px rgba(0,0,0,0.25)' }}>
        <h2 style="font-size:1.125rem;font-weight:700;margin-bottom:0.75rem;">GitHub access token</h2>
        <p style="color:#6b7280;font-size:0.875rem;line-height:1.6;margin-bottom:1.5rem;">
          Create a fine-grained PAT at <strong>github.com → Settings → Developer settings → Fine-grained tokens</strong>.
          Grant <strong>Contents: Read and Write</strong> on the <code>ccm-social-poster</code> repo only. Stored in your browser's localStorage.
        </p>
        <label style="font-size:0.8125rem;font-weight:600;color:#374151;display:block;margin-bottom:0.375rem;">Personal access token</label>
        <input type="password" value=${val} onInput=${(e) => setVal(e.target.value)} placeholder="github_pat_..." style=${{ width: '100%', padding: '0.625rem 0.875rem', border: '1.5px solid #d1d5db', borderRadius: '8px', fontSize: '0.875rem', fontFamily: 'monospace', outline: 'none', boxSizing: 'border-box' }}/>
        <div style="display:flex;justify-content:flex-end;gap:0.75rem;margin-top:1.5rem;">
          <button onClick=${onClose} style={{ padding: '0.625rem 1.25rem', border: '1px solid #d1d5db', borderRadius: '8px', background: 'white', cursor: 'pointer', fontSize: '0.875rem' }}>Cancel</button>
          <button onClick=${save} disabled=${!val.trim()} style=${{ padding: '0.625rem 1.25rem', border: 'none', borderRadius: '8px', background: val.trim() ? '#0a0a0a' : '#e5e7eb', color: val.trim() ? 'white' : '#9ca3af', cursor: val.trim() ? 'pointer' : 'not-allowed', fontSize: '0.875rem', fontWeight: '600' }}>Save</button>
        </div>
      </div>
    </div>
  `;
}

// ─── Media uploader ────────────────────────────────────────────────────────

function MediaUploader({ platforms, mediaItems, onAdd, onRemove }) {
  const inputRef  = useRef(null);
  const [dragging, setDragging] = useState(false);
  const limits = getEffectiveLimits(platforms);

  const acceptTypes = [
    ...(limits.imageOk ? limits.types : []),
    ...(limits.videoOk ? ['video/mp4', 'video/quicktime', 'video/webm'] : []),
  ].join(',');

  const validateFile = (file) => {
    const isImg = file.type.startsWith('image/');
    const isVid = file.type.startsWith('video/');
    if (!isImg && !isVid) return 'File type not supported.';
    if (isImg && !limits.imageOk) return `Images not allowed for all selected platforms.`;
    if (isVid && !limits.videoOk) return `Video not allowed for all selected platforms.`;
    if (isImg && !limits.types.includes(file.type)) return `${file.type} not supported by all selected platforms.`;
    if (isImg && file.size > limits.maxMB * 1024 * 1024) return `Image too large. Max ${limits.maxMB}MB for selected platforms.`;
    if (mediaItems.length >= limits.maxCount) return `Max ${limits.maxCount} files for selected platforms.`;
    return null;
  };

  const addFiles = (files) => {
    for (const file of files) {
      const err = validateFile(file);
      if (err) { alert(err); continue; }
      const localUrl = URL.createObjectURL(file);
      const item = { id: uuid(), file, localUrl, r2Url: null, status: 'uploading' };
      onAdd(item);
      uploadToR2(file).then(r2Url => onAdd({ ...item, r2Url, status: 'done' })).catch(() => onAdd({ ...item, status: 'error' }));
    }
  };

  const onDrop = (e) => { e.preventDefault(); setDragging(false); addFiles([...e.dataTransfer.files]); };
  const onPick = (e) => addFiles([...e.target.files]);

  const hintParts = [];
  if (limits.imageOk) hintParts.push(`images up to ${limits.maxMB}MB`);
  if (limits.videoOk) hintParts.push('video');
  const hint = hintParts.length ? `${hintParts.join(' or ')}, max ${limits.maxCount} file${limits.maxCount !== 1 ? 's' : ''}` : 'No media allowed for selected platforms';

  return html`
    <div style="margin-bottom:1rem;">
      <div style="font-size:0.75rem;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:0.07em;margin-bottom:0.5rem;">Media</div>

      ${mediaItems.length > 0 && html`
        <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:0.75rem;">
          ${mediaItems.map(item => html`
            <div key=${item.id} style=${{ position: 'relative', width: '80px', height: '80px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #e5e7eb', background: '#f9fafb' }}>
              ${isVideo(item.localUrl)
                ? html`<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:1.5rem;background:#111;color:white;">▶</div>`
                : html`<img src=${item.localUrl} style="width:100%;height:100%;object-fit:cover;" />`
              }
              ${item.status === 'uploading' && html`
                <div style="position:absolute;inset:0;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;">
                  <div style="width:20px;height:20px;border:2px solid rgba(255,255,255,0.3);border-top-color:white;border-radius:50%;animation:spin 0.7s linear infinite;"></div>
                </div>
              `}
              ${item.status === 'error' && html`
                <div style="position:absolute;inset:0;background:rgba(239,68,68,0.7);display:flex;align-items:center;justify-content:center;color:white;font-size:0.75rem;text-align:center;padding:4px;">Upload failed</div>
              `}
              <button onClick=${() => onRemove(item.id)} style=${{ position: 'absolute', top: '3px', right: '3px', background: 'rgba(0,0,0,0.6)', border: 'none', color: 'white', borderRadius: '50%', width: '18px', height: '18px', cursor: 'pointer', fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1 }}>×</button>
            </div>
          `)}
        </div>
      `}

      <div
        onClick=${() => inputRef.current?.click()}
        onDragOver=${(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave=${() => setDragging(false)}
        onDrop=${onDrop}
        style=${{
          border: `2px dashed ${dragging ? '#0a0a0a' : '#d1d5db'}`,
          borderRadius: '10px', padding: '1.25rem 1rem', textAlign: 'center',
          cursor: 'pointer', transition: 'border-color 0.15s, background 0.15s',
          background: dragging ? '#f5f5f5' : 'transparent',
        }}
      >
        <div style="font-size:0.875rem;color:#374151;font-weight:500;">Drop files or click to browse</div>
        <div style="font-size:0.75rem;color:#9ca3af;margin-top:3px;">${hint}</div>
      </div>

      <input ref=${inputRef} type="file" multiple accept=${acceptTypes} onChange=${onPick} style="display:none;" />

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  `;
}

// ─── Platform preview components ───────────────────────────────────────────

const PREVIEW_CHAR_LIMIT = 280;

function truncate(text, len = PREVIEW_CHAR_LIMIT) {
  return text.length > len ? text.slice(0, len) + '…' : text;
}

function PreviewImage({ src, aspect = '16/9' }) {
  if (!src) return null;
  return html`
    <div style=${{ aspectRatio: aspect, background: '#f3f4f6', borderRadius: '12px', overflow: 'hidden', margin: '0.75rem 0' }}>
      ${isVideo(src)
        ? html`<div style="width:100%;height:100%;background:#111;display:flex;align-items:center;justify-content:center;color:white;font-size:2rem;">▶</div>`
        : html`<img src=${src} style="width:100%;height:100%;object-fit:cover;" />`
      }
    </div>
  `;
}

function TwitterPreview({ content, mediaItems }) {
  const media = mediaItems[0];
  const text = truncate(content || 'Your post will appear here.', 280);
  return html`
    <div style=${{ background: 'white', border: '1px solid #e7e7e7', borderRadius: '16px', padding: '1rem', fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif', maxWidth: '500px' }}>
      <div style="display:flex;gap:12px;align-items:flex-start;">
        <${CcmAvatar} size=${44} />
        <div style="flex:1;min-width:0;">
          <div style="display:flex;align-items:center;gap:4px;flex-wrap:wrap;">
            <span style="font-weight:700;font-size:0.9375rem;color:#0f1419;">CCM Social</span>
            <span style="color:#536471;font-size:0.9375rem;">@ccm_social · now</span>
          </div>
          <p style="margin:0.375rem 0 0;font-size:0.9375rem;color:#0f1419;line-height:1.55;white-space:pre-wrap;word-break:break-word;">${text}</p>
          ${media && html`<${PreviewImage} src=${media.localUrl} aspect="16/9" />`}
          <div style="display:flex;justify-content:space-between;margin-top:0.75rem;color:#536471;font-size:0.8125rem;max-width:300px;">
            ${['💬 0','🔁 0','❤ 0','📊','↑'].map(a => html`<span style="cursor:default;">${a}</span>`)}
          </div>
        </div>
      </div>
    </div>
  `;
}

function BlueskyPreview({ content, mediaItems }) {
  const media = mediaItems[0];
  const text = truncate(content || 'Your post will appear here.', 300);
  return html`
    <div style=${{ background: 'white', border: '1px solid #e3e8ef', borderRadius: '12px', padding: '1rem', fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif', maxWidth: '500px' }}>
      <div style="display:flex;gap:10px;align-items:flex-start;">
        <${CcmAvatar} size=${42} />
        <div style="flex:1;min-width:0;">
          <div style="display:flex;align-items:center;gap:4px;flex-wrap:wrap;">
            <span style="font-weight:700;font-size:0.9375rem;color:#0c1921;">CCM Social</span>
            <span style="color:#8b98a5;font-size:0.875rem;">@ccm.social · now</span>
          </div>
          <p style="margin:0.375rem 0 0;font-size:0.9375rem;color:#0c1921;line-height:1.55;white-space:pre-wrap;word-break:break-word;">${text}</p>
          ${media && html`<${PreviewImage} src=${media.localUrl} aspect="16/9" />`}
          <div style="display:flex;gap:1.5rem;margin-top:0.625rem;color:#8b98a5;font-size:0.8125rem;">
            ${['💬 0','🔁 0','❤ 0','···'].map(a => html`<span style="cursor:default;">${a}</span>`)}
          </div>
        </div>
      </div>
    </div>
  `;
}

function LinkedInPreview({ content, mediaItems }) {
  const media = mediaItems[0];
  const text = truncate(content || 'Your post will appear here.', 700);
  return html`
    <div style=${{ background: 'white', border: '1px solid #e0e0e0', borderRadius: '8px', overflow: 'hidden', fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif', maxWidth: '500px' }}>
      <div style="padding:1rem;">
        <div style="display:flex;gap:10px;align-items:flex-start;margin-bottom:0.875rem;">
          <${CcmAvatar} size=${48} />
          <div style="flex:1;">
            <div style="font-weight:600;font-size:0.9375rem;color:#000;">Center for Cooperative Media</div>
            <div style="color:#666;font-size:0.8125rem;line-height:1.4;">Staff · 1d · 🌐</div>
          </div>
          <span style="color:#666;font-size:1.25rem;cursor:default;">···</span>
        </div>
        <p style="margin:0;font-size:0.9375rem;color:#191919;line-height:1.55;white-space:pre-wrap;word-break:break-word;">${text}</p>
      </div>
      ${media && html`
        <div style=${{ background: '#f3f4f6', overflow: 'hidden' }}>
          ${isVideo(media.localUrl)
            ? html`<div style="width:100%;height:220px;background:#111;display:flex;align-items:center;justify-content:center;color:white;font-size:2.5rem;">▶</div>`
            : html`<img src=${media.localUrl} style="width:100%;max-height:300px;object-fit:cover;display:block;" />`
          }
        </div>
      `}
      <div style=${{ borderTop: '1px solid #e0e0e0', padding: '0.375rem 0.5rem', display: 'flex', gap: '0.25rem' }}>
        ${['👍 Like','💬 Comment','🔁 Repost','↗ Send'].map(a => html`
          <button key=${a} style=${{ flex: 1, background: 'none', border: 'none', cursor: 'pointer', padding: '0.5rem 0.25rem', fontSize: '0.8125rem', color: '#666', fontWeight: '600', borderRadius: '4px' }}>${a}</button>
        `)}
      </div>
    </div>
  `;
}

function FacebookPreview({ content, mediaItems }) {
  const media = mediaItems[0];
  const text = truncate(content || 'Your post will appear here.', 400);
  return html`
    <div style=${{ background: 'white', border: '1px solid #dddfe2', borderRadius: '8px', overflow: 'hidden', fontFamily: 'Helvetica,Arial,sans-serif', maxWidth: '500px' }}>
      <div style="padding:1rem;">
        <div style="display:flex;gap:10px;align-items:center;margin-bottom:0.75rem;">
          <${CcmAvatar} size=${40} />
          <div style="flex:1;">
            <div style="font-weight:600;font-size:0.9375rem;color:#1c1e21;">CCM Social</div>
            <div style="color:#606770;font-size:0.75rem;">Just now · 🌐</div>
          </div>
          <span style="color:#606770;font-size:1.25rem;cursor:default;">···</span>
        </div>
        <p style="margin:0 0 0.75rem;font-size:0.9375rem;color:#1c1e21;line-height:1.55;white-space:pre-wrap;word-break:break-word;">${text}</p>
      </div>
      ${media && html`
        <div style="overflow:hidden;">
          ${isVideo(media.localUrl)
            ? html`<div style="width:100%;height:220px;background:#111;display:flex;align-items:center;justify-content:center;color:white;font-size:2.5rem;">▶</div>`
            : html`<img src=${media.localUrl} style="width:100%;max-height:300px;object-fit:cover;display:block;" />`
          }
        </div>
      `}
      <div style=${{ padding: '0.25rem 1rem', borderTop: '1px solid #dddfe2', display: 'flex', gap: '0.25rem' }}>
        ${['👍 Like','💬 Comment','↗ Share'].map(a => html`
          <button key=${a} style=${{ flex: 1, background: 'none', border: 'none', cursor: 'pointer', padding: '0.5rem 0', fontSize: '0.875rem', color: '#606770', fontWeight: '600', borderRadius: '4px' }}>${a}</button>
        `)}
      </div>
    </div>
  `;
}

function InstagramPreview({ content, mediaItems }) {
  const media = mediaItems[0];
  const caption = truncate(content || '', 125);
  return html`
    <div style=${{ background: 'white', border: '1px solid #dbdbdb', borderRadius: '3px', fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif', maxWidth: '400px' }}>
      <div style="display:flex;align-items:center;gap:10px;padding:0.75rem;">
        <${CcmAvatar} size=${32} />
        <span style="font-weight:600;font-size:0.875rem;color:#262626;flex:1;">ccm.social</span>
        <span style="font-size:1.25rem;cursor:default;color:#262626;">···</span>
      </div>
      <div style=${{ background: '#f3f4f6', aspectRatio: '1', overflow: 'hidden' }}>
        ${media
          ? (isVideo(media.localUrl)
              ? html`<div style="width:100%;height:100%;background:#111;display:flex;align-items:center;justify-content:center;color:white;font-size:3rem;">▶</div>`
              : html`<img src=${media.localUrl} style="width:100%;height:100%;object-fit:cover;display:block;" />`)
          : html`<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;color:#bbb;font-size:0.875rem;">No image selected</div>`
        }
      </div>
      <div style="padding:0.5rem 0.75rem;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.5rem;">
          <div style="display:flex;gap:1rem;font-size:1.375rem;">
            <span style="cursor:default;">♡</span>
            <span style="cursor:default;">💬</span>
            <span style="cursor:default;">✈</span>
          </div>
          <span style="font-size:1.375rem;cursor:default;">🔖</span>
        </div>
        ${caption && html`
          <p style="margin:0;font-size:0.875rem;color:#262626;line-height:1.5;">
            <span style="font-weight:600;">ccm.social</span>${' '}${caption}
          </p>
        `}
      </div>
    </div>
  `;
}

function TikTokPreview({ content, mediaItems }) {
  const media = mediaItems[0];
  const caption = truncate(content || '', 150);
  return html`
    <div style=${{ background: '#1d1d1d', borderRadius: '16px', overflow: 'hidden', fontFamily: 'ProximaNova,-apple-system,sans-serif', maxWidth: '280px', margin: '0 auto' }}>
      <div style=${{ position: 'relative', aspectRatio: '9/16', background: '#111' }}>
        ${media && !isVideo(media.localUrl)
          ? html`<img src=${media.localUrl} style="width:100%;height:100%;object-fit:cover;display:block;opacity:0.7;" />`
          : html`<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;color:#444;font-size:3rem;">▶</div>`
        }
        <div style=${{ position: 'absolute', inset: 0, background: 'linear-gradient(transparent 40%, rgba(0,0,0,0.7) 100%)' }}></div>
        <div style=${{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '1rem' }}>
          <div style="color:white;font-weight:700;font-size:0.875rem;margin-bottom:0.25rem;">@ccm.social</div>
          ${caption && html`<div style="color:rgba(255,255,255,0.9);font-size:0.8125rem;line-height:1.4;">${caption}</div>`}
          <div style="display:flex;align-items:center;gap:6px;margin-top:0.5rem;">
            <div style="width:24px;height:24px;background:#CA3553;border-radius:4px;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;color:white;">♪</div>
            <span style="color:rgba(255,255,255,0.8);font-size:0.75rem;">Original audio · CCM Social</span>
          </div>
        </div>
        <div style=${{ position: 'absolute', right: '12px', bottom: '80px', display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
          ${[['❤','0'],['💬','0'],['↗','0']].map(([icon, count]) => html`
            <div key=${icon} style="display:flex;flex-direction:column;align-items:center;gap:2px;color:white;cursor:default;">
              <div style="font-size:1.5rem;">${icon}</div>
              <div style="font-size:0.6875rem;">${count}</div>
            </div>
          `)}
        </div>
      </div>
    </div>
  `;
}

const PREVIEW_COMPONENTS = {
  twitter:   TwitterPreview,
  bluesky:   BlueskyPreview,
  linkedin:  LinkedInPreview,
  facebook:  FacebookPreview,
  instagram: InstagramPreview,
  tiktok:    TikTokPreview,
};

// ─── Preview modal ─────────────────────────────────────────────────────────

function PreviewModal({ content, mediaItems, platforms, onClose }) {
  const [active, setActive] = useState(platforms[0] || 'twitter');
  const Preview = PREVIEW_COMPONENTS[active];

  return html`
    <div onClick=${(e) => e.target === e.currentTarget && onClose()} style=${{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 300, padding: '1rem' }}>
      <div style=${{ background: '#f5f5f5', borderRadius: '16px', width: '100%', maxWidth: '560px', maxHeight: '90vh', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 32px 80px rgba(0,0,0,0.4)' }}>
        <div style=${{ background: 'white', padding: '1rem 1.25rem', borderBottom: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h3 style="font-size:1rem;font-weight:700;margin:0;">Post preview</h3>
          <button onClick=${onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.25rem', color: '#6b7280', lineHeight: 1 }}>×</button>
        </div>

        <div style="display:flex;gap:6px;padding:0.75rem 1.25rem;background:white;border-bottom:1px solid #e5e7eb;flex-wrap:wrap;">
          ${platforms.map(id => {
            const p = PLATFORMS[id];
            return html`
              <button key=${id} onClick=${() => setActive(id)} style=${{
                padding: '0.375rem 0.875rem', borderRadius: '6px', border: '1px solid transparent',
                background: active === id ? p.bg : '#f3f4f6', color: active === id ? p.fg : '#374151',
                fontWeight: '600', fontSize: '0.8125rem', cursor: 'pointer', transition: 'all 0.1s',
              }}>${p.name}</button>
            `;
          })}
        </div>

        <div style="overflow-y:auto;padding:1.25rem;flex:1;">
          ${Preview && html`<${Preview} content=${content} mediaItems=${mediaItems} />`}
        </div>
      </div>
    </div>
  `;
}

// ─── Post card ─────────────────────────────────────────────────────────────

function PostCard({ post, editable, token, schedule, sha, onUpdate }) {
  const [deleting, setDeleting] = useState(false);

  const del = async () => {
    if (!confirm('Delete this scheduled post?')) return;
    setDeleting(true);
    try {
      const updated = { ...schedule, posts: schedule.posts.filter(p => p.id !== post.id) };
      const res = await saveFile(token, 'data/schedule.json', updated, sha);
      onUpdate(updated, res.content.sha);
    } catch (e) {
      alert(`Delete failed: ${e.message}`);
      setDeleting(false);
    }
  };

  const statusColor = { scheduled: '#3b82f6', posted: '#10b981', failed: '#ef4444', partial: '#f59e0b' };
  const media = post.media_urls || [];

  return html`
    <div style=${{ background: 'white', border: '1px solid #e5e7eb', borderRadius: '10px', padding: '1rem 1.25rem', marginBottom: '0.625rem' }}>
      <div style="display:flex;gap:1rem;align-items:flex-start;">
        <p style="flex:1;margin:0;font-size:0.9375rem;line-height:1.55;color:#111;word-break:break-word;">
          ${post.content.length > 220 ? post.content.slice(0, 220) + '…' : post.content}
        </p>
        ${editable && html`
          <button onClick=${del} disabled=${deleting} title="Delete post" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#d1d5db', fontSize: '1.25rem', lineHeight: 1, flexShrink: 0, padding: 0 }}>×</button>
        `}
      </div>

      ${media.length > 0 && html`
        <div style="display:flex;gap:6px;margin-top:0.625rem;flex-wrap:wrap;">
          ${media.slice(0, 4).map((url, i) => html`
            <div key=${i} style=${{ width: '56px', height: '56px', borderRadius: '6px', overflow: 'hidden', background: '#f3f4f6', border: '1px solid #e5e7eb' }}>
              ${isVideo(url)
                ? html`<div style="width:100%;height:100%;background:#111;display:flex;align-items:center;justify-content:center;color:white;font-size:1rem;">▶</div>`
                : html`<img src=${url} style="width:100%;height:100%;object-fit:cover;" />`
              }
            </div>
          `)}
          ${media.length > 4 && html`<div style="width:56px;height:56px;borderRadius:6px;background:#f3f4f6;display:flex;align-items:center;justify-content:center;font-size:0.75rem;color:#6b7280;">+${media.length - 4}</div>`}
        </div>
      `}

      <div style="display:flex;justify-content:space-between;align-items:center;margin-top:0.75rem;flex-wrap:wrap;gap:0.5rem;">
        <${PlatformPills} platforms=${post.platforms} />
        <div style="display:flex;align-items:center;gap:0.75rem;">
          ${post.scheduled_at && html`
            <span title=${fmtDateTime(post.scheduled_at)} style="font-size:0.8125rem;color:#6b7280;cursor:default;">
              ${relTime(post.scheduled_at)} · ${fmtDateTime(post.scheduled_at)}
            </span>
          `}
          ${post.status !== 'scheduled' && html`
            <span style=${{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.06em', color: statusColor[post.status] || '#6b7280' }}>${post.status}</span>
          `}
        </div>
      </div>

      ${post.status === 'partial' && post.results && html`
        <div style="margin-top:0.625rem;font-size:0.8125rem;color:#92400e;background:#fff7ed;border-radius:6px;padding:0.5rem 0.75rem;">
          ${Object.entries(post.results).filter(([, r]) => !r.success).map(([k, r]) => html`<div key=${k}><strong>${k}:</strong> ${r.error || 'failed'}</div>`)}
        </div>
      `}
    </div>
  `;
}

// ─── Compose view ──────────────────────────────────────────────────────────

function ComposeView({ token, schedule, sha, onUpdate }) {
  const [content,    setContent]    = useState('');
  const [platforms,  setPlatforms]  = useState(['twitter', 'bluesky']);
  const [schedAt,    setSchedAt]    = useState(defaultScheduleTime());
  const [postNow,    setPostNow]    = useState(false);
  const [mediaItems, setMediaItems] = useState([]);
  const [showPreview,setShowPreview]= useState(false);
  const [loading,    setLoading]    = useState(false);
  const [err,        setErr]        = useState('');
  const [ok,         setOk]         = useState('');

  const minLimit = platforms.length ? Math.min(...platforms.map(id => PLATFORMS[id]?.limit ?? 9999)) : 280;
  const toggle   = (id) => setPlatforms(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]);

  const addMedia = (item) => setMediaItems(prev => {
    const existing = prev.find(m => m.id === item.id);
    if (existing) return prev.map(m => m.id === item.id ? item : m);
    return [...prev, item];
  });

  const removeMedia = (id) => {
    setMediaItems(prev => {
      const item = prev.find(m => m.id === id);
      if (item?.localUrl) URL.revokeObjectURL(item.localUrl);
      return prev.filter(m => m.id !== id);
    });
  };

  const submit = async () => {
    setErr(''); setOk('');
    if (!token)            return setErr('Configure your GitHub token in Settings first.');
    if (!content.trim())   return setErr('Write something first.');
    if (!platforms.length) return setErr('Select at least one platform.');
    if (!postNow && !schedAt) return setErr('Choose a time or check "Post now".');
    if (mediaItems.some(m => m.status === 'uploading')) return setErr('Wait for media uploads to finish.');

    setLoading(true);
    try {
      const at = postNow ? new Date(Date.now() + 90000).toISOString() : new Date(schedAt).toISOString();
      const mediaUrls = mediaItems.filter(m => m.r2Url).map(m => m.r2Url);
      const post = { id: uuid(), content: content.trim(), platforms, media_urls: mediaUrls, scheduled_at: at, status: 'scheduled', created_at: new Date().toISOString() };
      const updated = { ...schedule, posts: [...schedule.posts, post] };
      const res = await saveFile(token, 'data/schedule.json', updated, sha);
      onUpdate(updated, res.content.sha);
      setContent(''); setSchedAt(defaultScheduleTime()); setMediaItems([]);
      setOk(postNow ? 'Queued — will post within 5 minutes.' : `Scheduled for ${fmtDateTime(at)}.`);
    } catch (e) {
      setErr(`Save failed: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  const overLimit = content.length > minLimit;
  const canSubmit = !loading && content.trim() && platforms.length > 0 && !overLimit;

  return html`
    <div style="max-width:620px;">
      <h2 style="font-size:1.1875rem;font-weight:700;margin-bottom:1.5rem;">Compose</h2>

      <div style="margin-bottom:1rem;">
        <div style="font-size:0.75rem;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:0.07em;margin-bottom:0.5rem;">Platforms</div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;">
          ${Object.keys(PLATFORMS).map(id => html`<${PlatformToggle} key=${id} id=${id} active=${platforms.includes(id)} onToggle=${toggle} />`)}
        </div>
      </div>

      <textarea
        value=${content}
        onInput=${(e) => setContent(e.target.value)}
        placeholder="What do you want to share?"
        rows="5"
        style=${{ width: '100%', padding: '0.875rem', border: `1.5px solid ${overLimit ? '#ef4444' : '#d1d5db'}`, borderRadius: '10px', fontSize: '1rem', lineHeight: 1.55, resize: 'vertical', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box', color: '#111' }}
      />
      <div style=${{ textAlign: 'right', fontSize: '0.8125rem', color: overLimit ? '#ef4444' : '#9ca3af', margin: '0.25rem 0 1rem' }}>
        ${content.length} / ${minLimit}${platforms.length > 0 ? ` (shortest: ${platforms.map(id => PLATFORMS[id]?.name).join(', ')})` : ''}
      </div>

      <${MediaUploader} platforms=${platforms} mediaItems=${mediaItems} onAdd=${addMedia} onRemove=${removeMedia} />

      <div style="display:flex;align-items:center;gap:1rem;flex-wrap:wrap;margin-bottom:1.5rem;">
        <label style="display:flex;align-items:center;gap:0.5rem;cursor:pointer;font-size:0.875rem;color:#374151;font-weight:500;">
          <input type="checkbox" checked=${postNow} onChange=${(e) => setPostNow(e.target.checked)} />
          Post now (within 5 min)
        </label>
        ${!postNow && html`
          <input type="datetime-local" value=${schedAt} onInput=${(e) => setSchedAt(e.target.value)} style=${{ padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '0.875rem', outline: 'none' }} />
        `}
      </div>

      ${err && html`<p style="color:#ef4444;font-size:0.875rem;margin-bottom:1rem;">${err}</p>`}
      ${ok  && html`<p style="color:#10b981;font-size:0.875rem;margin-bottom:1rem;">${ok}</p>`}

      <div style="display:flex;gap:0.75rem;flex-wrap:wrap;">
        ${platforms.length > 0 && content.trim() && html`
          <button
            onClick=${() => setShowPreview(true)}
            style=${{ padding: '0.75rem 1.25rem', border: '1.5px solid #d1d5db', borderRadius: '8px', background: 'white', color: '#374151', fontSize: '0.9375rem', fontWeight: '600', cursor: 'pointer' }}
          >Preview</button>
        `}
        <button
          onClick=${submit}
          disabled=${!canSubmit}
          style=${{ padding: '0.75rem 1.75rem', border: 'none', borderRadius: '8px', background: canSubmit ? '#0a0a0a' : '#e5e7eb', color: canSubmit ? 'white' : '#9ca3af', fontSize: '0.9375rem', fontWeight: '600', cursor: canSubmit ? 'pointer' : 'not-allowed', transition: 'background 0.15s' }}
        >
          ${loading ? 'Saving…' : postNow ? 'Queue for posting' : 'Schedule post'}
        </button>
      </div>

      ${showPreview && html`
        <${PreviewModal} content=${content} mediaItems=${mediaItems} platforms=${platforms} onClose=${() => setShowPreview(false)} />
      `}
    </div>
  `;
}

// ─── Queue view ────────────────────────────────────────────────────────────

function QueueView({ token, schedule, sha, onUpdate }) {
  const pending = [...(schedule.posts || [])].filter(p => p.status === 'scheduled').sort((a, b) => new Date(a.scheduled_at) - new Date(b.scheduled_at));
  return html`
    <div style="max-width:620px;">
      <h2 style="font-size:1.1875rem;font-weight:700;margin-bottom:1.5rem;">
        Scheduled queue
        <span style="font-size:0.9rem;font-weight:400;color:#6b7280;margin-left:0.5rem;">${pending.length} post${pending.length !== 1 ? 's' : ''}</span>
      </h2>
      ${pending.length === 0
        ? html`<p style="color:#9ca3af;font-size:0.9375rem;">No posts scheduled. Use Compose to add one.</p>`
        : pending.map(post => html`<${PostCard} key=${post.id} post=${post} editable=${true} token=${token} schedule=${schedule} sha=${sha} onUpdate=${onUpdate} />`)
      }
    </div>
  `;
}

// ─── History view ──────────────────────────────────────────────────────────

function HistoryView({ token }) {
  const [history, setHistory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err,     setErr]     = useState('');

  useEffect(() => {
    if (!token) { setLoading(false); return; }
    loadFile(token, 'data/history.json')
      .then(({ data }) => { setHistory(data); setLoading(false); })
      .catch(e => { setErr(e.message); setLoading(false); });
  }, [token]);

  const posts = (history?.posts || []).slice(0, 100);
  return html`
    <div style="max-width:620px;">
      <h2 style="font-size:1.1875rem;font-weight:700;margin-bottom:1.5rem;">Post history</h2>
      ${loading && html`<p style="color:#9ca3af;">Loading…</p>`}
      ${err     && html`<p style="color:#ef4444;">${err}</p>`}
      ${!loading && !err && posts.length === 0 && html`<p style="color:#9ca3af;">No posts published yet.</p>`}
      ${posts.map(post => html`<${PostCard} key=${post.id} post=${post} />`)}
    </div>
  `;
}

// ─── Accounts view ─────────────────────────────────────────────────────────

const ACCOUNT_META = [
  { id: 'twitter',   secrets: 'TWITTER_API_KEY, TWITTER_API_SECRET, TWITTER_ACCESS_TOKEN, TWITTER_ACCESS_SECRET', status: 'ready',   docsUrl: 'https://developer.x.com/en/docs/authentication/oauth-1-0a' },
  { id: 'bluesky',   secrets: 'BLUESKY_HANDLE, BLUESKY_APP_PASSWORD',                                             status: 'ready',   docsUrl: 'https://bsky.app/settings/app-passwords' },
  { id: 'linkedin',  secrets: 'LINKEDIN_ACCESS_TOKEN, LINKEDIN_PERSON_ID',                                        status: 'stub',    docsUrl: 'https://learn.microsoft.com/en-us/linkedin/shared/authentication/authorization-code-flow' },
  { id: 'facebook',  secrets: 'FACEBOOK_PAGE_ID, FACEBOOK_PAGE_TOKEN',                                            status: 'stub',    docsUrl: 'https://developers.facebook.com/docs/pages/getting-started' },
  { id: 'instagram', secrets: 'INSTAGRAM_BUSINESS_ID, FACEBOOK_PAGE_TOKEN',                                       status: 'stub',    docsUrl: 'https://developers.facebook.com/docs/instagram-api/getting-started' },
  { id: 'tiktok',    secrets: 'TIKTOK_ACCESS_TOKEN',                                                              status: 'stub',    docsUrl: 'https://developers.tiktok.com/doc/content-posting-api-get-started' },
];

function AccountsView() {
  return html`
    <div style="max-width:620px;">
      <h2 style="font-size:1.1875rem;font-weight:700;margin-bottom:0.5rem;">Connected accounts</h2>
      <p style="color:#6b7280;font-size:0.875rem;margin-bottom:1.5rem;line-height:1.5;">
        Add credentials as GitHub Actions secrets at${' '}
        <a href="https://github.com/${REPO_OWNER}/${REPO_NAME}/settings/secrets/actions" target="_blank" rel="noreferrer" style="color:#0a0a0a;font-weight:500;">repo Settings → Secrets and variables → Actions</a>.
        The scheduler reads them automatically.
      </p>
      ${ACCOUNT_META.map(({ id, secrets, status, docsUrl }) => {
        const { name, bg, fg, Icon } = PLATFORMS[id];
        return html`
          <div key=${id} style=${{ background: 'white', border: '1px solid #e5e7eb', borderRadius: '10px', padding: '0.875rem 1.25rem', marginBottom: '0.625rem', display: 'flex', alignItems: 'center', gap: '1rem', opacity: status === 'stub' ? 0.65 : 1 }}>
            <div style=${{ background: bg, color: fg, borderRadius: '8px', width: '38px', height: '38px', padding: '9px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <${Icon} />
            </div>
            <div style="flex:1;min-width:0;">
              <div style="display:flex;align-items:center;gap:0.5rem;">
                <span style="font-weight:600;font-size:0.9375rem;">${name}</span>
                <span style=${{ fontSize: '0.6875rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.06em', padding: '2px 6px', borderRadius: '4px', background: status === 'ready' ? '#dcfce7' : '#f3f4f6', color: status === 'ready' ? '#166534' : '#6b7280' }}>${status === 'ready' ? 'supported' : 'coming soon'}</span>
              </div>
              <div style="font-size:0.75rem;color:#9ca3af;font-family:monospace;margin-top:2px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${secrets}</div>
            </div>
            <a href=${docsUrl} target="_blank" rel="noreferrer" style=${{ fontSize: '0.8125rem', color: '#0a0a0a', textDecoration: 'none', border: '1px solid #d1d5db', borderRadius: '6px', padding: '0.375rem 0.75rem', whiteSpace: 'nowrap', flexShrink: 0 }}>Setup →</a>
          </div>
        `;
      })}
    </div>
  `;
}

// ─── Root app ──────────────────────────────────────────────────────────────

function App() {
  const [view,         setView]         = useState('compose');
  const [token,        setToken]        = useState(localStorage.getItem('ccm_gh_token') || '');
  const [showSettings, setShowSettings] = useState(!localStorage.getItem('ccm_gh_token'));
  const [schedule,     setSchedule]     = useState({ version: '1.0', posts: [] });
  const [sha,          setSha]          = useState(null);
  const [loading,      setLoading]      = useState(false);

  const reload = useCallback(async (t) => {
    if (!t) return;
    setLoading(true);
    try {
      const { data, sha: s } = await loadFile(t, 'data/schedule.json');
      setSchedule(data);
      setSha(s);
    } catch (e) {
      console.error('Failed to load schedule:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { reload(token); }, [token]);

  const onUpdate = (newSched, newSha) => { setSchedule(newSched); setSha(newSha); };
  const queueCount = (schedule.posts || []).filter(p => p.status === 'scheduled').length;

  const navItems = [
    { id: 'compose',  label: 'Compose' },
    { id: 'queue',    label: 'Queue',   badge: queueCount },
    { id: 'history',  label: 'History' },
    { id: 'accounts', label: 'Accounts' },
  ];

  return html`
    <div style="font-family:'DM Sans',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;min-height:100vh;background:#f5f5f5;">

      <header style=${{ background: '#0a0a0a', color: 'white', height: '54px', padding: '0 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style="display:flex;align-items:center;gap:0.75rem;">
          <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
            <rect width="32" height="32" rx="6" fill="#0a0a0a"/>
            <text x="16" y="20.5" font-family="'DM Sans',system-ui,sans-serif" font-size="11" font-weight="700" fill="#CA3553" text-anchor="middle" letter-spacing="0.5">CCM</text>
            <rect x="8" y="24" width="16" height="1.5" rx="0.75" fill="#D4AF37"/>
          </svg>
          <span style="font-weight:700;font-size:0.9375rem;letter-spacing:-0.01em;font-family:'DM Sans',sans-serif;">CCM Social</span>
        </div>
        <button onClick=${() => setShowSettings(true)} style=${{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', padding: '0.375rem 0.875rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8125rem', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
          Settings
          ${!token && html`<span style="width:7px;height:7px;background:#ef4444;border-radius:50%;display:inline-block;"></span>`}
        </button>
      </header>

      <div style="display:flex;min-height:calc(100vh - 54px);">
        <nav style=${{ width: '172px', flexShrink: 0, background: 'white', borderRight: '1px solid #e5e7eb', padding: '1rem 0' }}>
          ${navItems.map(item => html`
            <button key=${item.id} onClick=${() => setView(item.id)} style=${{ width: '100%', padding: '0.625rem 1.25rem', border: 'none', borderLeft: view === item.id ? '3px solid #0a0a0a' : '3px solid transparent', background: view === item.id ? '#f5f5f5' : 'transparent', color: view === item.id ? '#0a0a0a' : '#6b7280', fontWeight: view === item.id ? '600' : '400', fontSize: '0.9375rem', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              ${item.label}
              ${item.badge > 0 && html`<span style=${{ background: '#0a0a0a', color: 'white', borderRadius: '10px', fontSize: '0.75rem', fontWeight: '700', padding: '1px 7px' }}>${item.badge}</span>`}
            </button>
          `)}
        </nav>

        <main style="flex:1;padding:2rem;overflow-y:auto;">
          ${!token && html`
            <div style=${{ background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: '8px', padding: '0.75rem 1rem', marginBottom: '1.5rem', fontSize: '0.875rem', color: '#92400e' }}>
              No GitHub token configured. Click Settings to add one before scheduling posts.
            </div>
          `}
          ${loading && view !== 'history' && html`<p style="color:#9ca3af;font-size:0.875rem;margin-bottom:1rem;">Loading…</p>`}

          ${view === 'compose'  && html`<${ComposeView}  token=${token} schedule=${schedule} sha=${sha} onUpdate=${onUpdate} />`}
          ${view === 'queue'    && html`<${QueueView}    token=${token} schedule=${schedule} sha=${sha} onUpdate=${onUpdate} />`}
          ${view === 'history'  && html`<${HistoryView}  token=${token} />`}
          ${view === 'accounts' && html`<${AccountsView} />`}
        </main>
      </div>

      ${showSettings && html`
        <${SettingsModal} currentToken=${token} onSave=${setToken} onClose=${() => setShowSettings(false)} />
      `}
    </div>
  `;
}

render(html`<${App} />`, document.getElementById('app'));
