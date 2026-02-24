import { h, render } from 'https://esm.sh/preact@10.19.3';
import { useState, useEffect, useCallback } from 'https://esm.sh/preact@10.19.3/hooks';
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

const REPO_OWNER = 'jamditis';
const REPO_NAME  = 'ccm-social-poster';

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
  // btoa only handles Latin-1; encode UTF-8 first
  const json = JSON.stringify(data, null, 2);
  const encoded = btoa(unescape(encodeURIComponent(json)));
  const body = {
    message: `Update ${filePath} via CCM Social [skip ci]`,
    content: encoded,
    branch: 'main',
  };
  if (sha) body.sha = sha;
  return ghFetch(token, `/contents/${filePath}`, { method: 'PUT', body: JSON.stringify(body) });
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
  const sign = diff > 0 ? '+' : '-';
  if (abs < 60000)    return diff > 0 ? 'in a moment' : 'just now';
  if (abs < 3600000)  return `${sign}${Math.round(abs / 60000)}m`;
  if (abs < 86400000) return `${sign}${Math.round(abs / 3600000)}h`;
  return `${sign}${Math.round(abs / 86400000)}d`;
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

// ─── Small components ──────────────────────────────────────────────────────

function PlatformToggle({ id, active, onToggle }) {
  const { name, bg, fg, Icon } = PLATFORMS[id];
  return html`
    <button
      title=${name}
      onClick=${() => onToggle(id)}
      style=${{
        background: active ? bg : '#e5e7eb',
        color: active ? fg : '#9ca3af',
        border: 'none', borderRadius: '8px',
        width: '38px', height: '38px', padding: '9px',
        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all 0.15s', flexShrink: 0,
      }}
    >
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
        return html`
          <span key=${id} style=${{
            background: p.bg, color: p.fg,
            fontSize: '10px', fontWeight: '700',
            padding: '2px 7px', borderRadius: '4px',
            textTransform: 'uppercase', letterSpacing: '0.06em',
          }}>${p.name}</span>
        `;
      })}
    </div>
  `;
}

// ─── Settings modal ────────────────────────────────────────────────────────

function SettingsModal({ currentToken, onSave, onClose }) {
  const [val, setVal] = useState(currentToken || '');

  const save = () => {
    const t = val.trim();
    localStorage.setItem('ccm_gh_token', t);
    onSave(t);
    onClose();
  };

  return html`
    <div
      onClick=${(e) => e.target === e.currentTarget && onClose()}
      style=${{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 200, padding: '1rem',
      }}
    >
      <div style=${{
        background: 'white', borderRadius: '14px', padding: '2rem',
        width: '100%', maxWidth: '460px',
        boxShadow: '0 24px 64px rgba(0,0,0,0.25)',
      }}>
        <h2 style="font-size:1.125rem;font-weight:700;margin-bottom:0.75rem;">GitHub access token</h2>
        <p style="color:#6b7280;font-size:0.875rem;line-height:1.6;margin-bottom:1.5rem;">
          Create a fine-grained PAT at <strong>github.com → Settings → Developer settings → Fine-grained tokens</strong>.
          Grant <strong>Contents: Read and Write</strong> on the <code>ccm-social-poster</code> repo only.
          Stored in your browser's localStorage.
        </p>
        <label style="font-size:0.8125rem;font-weight:600;color:#374151;display:block;margin-bottom:0.375rem;">
          Personal access token
        </label>
        <input
          type="password"
          value=${val}
          onInput=${(e) => setVal(e.target.value)}
          placeholder="github_pat_..."
          style=${{
            width: '100%', padding: '0.625rem 0.875rem',
            border: '1.5px solid #d1d5db', borderRadius: '8px',
            fontSize: '0.875rem', fontFamily: 'monospace',
            outline: 'none', boxSizing: 'border-box',
          }}
        />
        <div style="display:flex;justify-content:flex-end;gap:0.75rem;margin-top:1.5rem;">
          <button
            onClick=${onClose}
            style=${{ padding: '0.625rem 1.25rem', border: '1px solid #d1d5db', borderRadius: '8px', background: 'white', cursor: 'pointer', fontSize: '0.875rem' }}
          >Cancel</button>
          <button
            onClick=${save}
            disabled=${!val.trim()}
            style=${{
              padding: '0.625rem 1.25rem', border: 'none', borderRadius: '8px',
              background: val.trim() ? '#1e2d3d' : '#e5e7eb',
              color: val.trim() ? 'white' : '#9ca3af',
              cursor: val.trim() ? 'pointer' : 'not-allowed',
              fontSize: '0.875rem', fontWeight: '600',
            }}
          >Save</button>
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

  return html`
    <div style=${{
      background: 'white', border: '1px solid #e5e7eb',
      borderRadius: '10px', padding: '1rem 1.25rem', marginBottom: '0.625rem',
    }}>
      <div style="display:flex;gap:1rem;align-items:flex-start;">
        <p style="flex:1;margin:0;font-size:0.9375rem;line-height:1.55;color:#111;word-break:break-word;">
          ${post.content.length > 220 ? post.content.slice(0, 220) + '…' : post.content}
        </p>
        ${editable && html`
          <button
            onClick=${del}
            disabled=${deleting}
            title="Delete post"
            style=${{ background: 'none', border: 'none', cursor: 'pointer', color: '#d1d5db', fontSize: '1.25rem', lineHeight: 1, flexShrink: 0, padding: 0 }}
          >×</button>
        `}
      </div>
      <div style="display:flex;justify-content:space-between;align-items:center;margin-top:0.75rem;flex-wrap:wrap;gap:0.5rem;">
        <${PlatformPills} platforms=${post.platforms} />
        <div style="display:flex;align-items:center;gap:0.75rem;">
          ${post.scheduled_at && html`
            <span title=${fmtDateTime(post.scheduled_at)} style="font-size:0.8125rem;color:#6b7280;cursor:default;">
              ${relTime(post.scheduled_at)} · ${fmtDateTime(post.scheduled_at)}
            </span>
          `}
          ${post.status !== 'scheduled' && html`
            <span style=${{
              fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase',
              letterSpacing: '0.06em', color: statusColor[post.status] || '#6b7280',
            }}>${post.status}</span>
          `}
        </div>
      </div>
      ${post.status === 'partial' && post.results && html`
        <div style="margin-top:0.625rem;font-size:0.8125rem;color:#92400e;background:#fff7ed;border-radius:6px;padding:0.5rem 0.75rem;">
          ${Object.entries(post.results)
            .filter(([, r]) => !r.success)
            .map(([k, r]) => html`<div key=${k}><strong>${k}:</strong> ${r.error || 'failed'}</div>`)}
        </div>
      `}
    </div>
  `;
}

// ─── Compose view ──────────────────────────────────────────────────────────

function ComposeView({ token, schedule, sha, onUpdate }) {
  const [content,   setContent]   = useState('');
  const [platforms, setPlatforms] = useState(['twitter', 'bluesky']);
  const [schedAt,   setSchedAt]   = useState(defaultScheduleTime());
  const [postNow,   setPostNow]   = useState(false);
  const [loading,   setLoading]   = useState(false);
  const [err,       setErr]       = useState('');
  const [ok,        setOk]        = useState('');

  const minLimit = platforms.length
    ? Math.min(...platforms.map(id => PLATFORMS[id]?.limit ?? 9999))
    : 280;

  const toggle = (id) =>
    setPlatforms(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]);

  const submit = async () => {
    setErr(''); setOk('');
    if (!token)            return setErr('Configure your GitHub token in Settings first.');
    if (!content.trim())   return setErr('Write something first.');
    if (!platforms.length) return setErr('Select at least one platform.');
    if (!postNow && !schedAt) return setErr('Choose a time or check "Post now".');

    setLoading(true);
    try {
      const at = postNow
        ? new Date(Date.now() + 90000).toISOString()
        : new Date(schedAt).toISOString();

      const post = {
        id: uuid(),
        content: content.trim(),
        platforms,
        media_urls: [],
        scheduled_at: at,
        status: 'scheduled',
        created_at: new Date().toISOString(),
      };

      const updated = { ...schedule, posts: [...schedule.posts, post] };
      const res = await saveFile(token, 'data/schedule.json', updated, sha);
      onUpdate(updated, res.content.sha);

      setContent('');
      setSchedAt(defaultScheduleTime());
      setOk(postNow ? 'Queued — will post within 5 minutes.' : `Scheduled for ${fmtDateTime(at)}.`);
    } catch (e) {
      setErr(`Save failed: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  const overLimit  = content.length > minLimit;
  const canSubmit  = !loading && content.trim() && platforms.length > 0 && !overLimit;

  return html`
    <div style="max-width:620px;">
      <h2 style="font-size:1.1875rem;font-weight:700;margin-bottom:1.5rem;">Compose</h2>

      <div style="margin-bottom:1rem;">
        <div style="font-size:0.75rem;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:0.07em;margin-bottom:0.5rem;">Platforms</div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;">
          ${Object.keys(PLATFORMS).map(id => html`
            <${PlatformToggle} key=${id} id=${id} active=${platforms.includes(id)} onToggle=${toggle} />
          `)}
        </div>
      </div>

      <textarea
        value=${content}
        onInput=${(e) => setContent(e.target.value)}
        placeholder="What do you want to share?"
        rows="5"
        style=${{
          width: '100%', padding: '0.875rem',
          border: `1.5px solid ${overLimit ? '#ef4444' : '#d1d5db'}`,
          borderRadius: '10px', fontSize: '1rem', lineHeight: 1.55,
          resize: 'vertical', outline: 'none', fontFamily: 'inherit',
          boxSizing: 'border-box', color: '#111',
        }}
      />
      <div style=${{ textAlign: 'right', fontSize: '0.8125rem', color: overLimit ? '#ef4444' : '#9ca3af', margin: '0.25rem 0 1rem' }}>
        ${content.length} / ${minLimit}
        ${platforms.length > 0 && ` (shortest: ${platforms.map(id => PLATFORMS[id]?.name).join(', ')})`}
      </div>

      <div style="display:flex;align-items:center;gap:1rem;flex-wrap:wrap;margin-bottom:1.5rem;">
        <label style="display:flex;align-items:center;gap:0.5rem;cursor:pointer;font-size:0.875rem;color:#374151;font-weight:500;">
          <input type="checkbox" checked=${postNow} onChange=${(e) => setPostNow(e.target.checked)} />
          Post now (within 5 min)
        </label>
        ${!postNow && html`
          <input
            type="datetime-local"
            value=${schedAt}
            onInput=${(e) => setSchedAt(e.target.value)}
            style=${{ padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '0.875rem', outline: 'none' }}
          />
        `}
      </div>

      ${err && html`<p style="color:#ef4444;font-size:0.875rem;margin-bottom:1rem;">${err}</p>`}
      ${ok  && html`<p style="color:#10b981;font-size:0.875rem;margin-bottom:1rem;">${ok}</p>`}

      <button
        onClick=${submit}
        disabled=${!canSubmit}
        style=${{
          padding: '0.75rem 1.75rem', border: 'none', borderRadius: '8px',
          background: canSubmit ? '#1e2d3d' : '#e5e7eb',
          color: canSubmit ? 'white' : '#9ca3af',
          fontSize: '0.9375rem', fontWeight: '600',
          cursor: canSubmit ? 'pointer' : 'not-allowed',
          transition: 'background 0.15s',
        }}
      >
        ${loading ? 'Saving…' : postNow ? 'Queue for posting' : 'Schedule post'}
      </button>
    </div>
  `;
}

// ─── Queue view ────────────────────────────────────────────────────────────

function QueueView({ token, schedule, sha, onUpdate }) {
  const pending = [...(schedule.posts || [])]
    .filter(p => p.status === 'scheduled')
    .sort((a, b) => new Date(a.scheduled_at) - new Date(b.scheduled_at));

  return html`
    <div style="max-width:620px;">
      <h2 style="font-size:1.1875rem;font-weight:700;margin-bottom:1.5rem;">
        Scheduled queue
        <span style="font-size:0.9rem;font-weight:400;color:#6b7280;margin-left:0.5rem;">
          ${pending.length} post${pending.length !== 1 ? 's' : ''}
        </span>
      </h2>
      ${pending.length === 0
        ? html`<p style="color:#9ca3af;font-size:0.9375rem;">No posts scheduled. Use Compose to add one.</p>`
        : pending.map(post => html`
            <${PostCard}
              key=${post.id} post=${post} editable=${true}
              token=${token} schedule=${schedule} sha=${sha} onUpdate=${onUpdate}
            />
          `)
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
        <a href="https://github.com/${REPO_OWNER}/${REPO_NAME}/settings/secrets/actions"
           target="_blank" rel="noreferrer"
           style="color:#1e2d3d;font-weight:500;">repo Settings → Secrets and variables → Actions</a>.
        The scheduler reads them automatically.
      </p>
      ${ACCOUNT_META.map(({ id, secrets, status, docsUrl }) => {
        const { name, bg, fg, Icon } = PLATFORMS[id];
        return html`
          <div key=${id} style=${{
            background: 'white', border: '1px solid #e5e7eb', borderRadius: '10px',
            padding: '0.875rem 1.25rem', marginBottom: '0.625rem',
            display: 'flex', alignItems: 'center', gap: '1rem',
            opacity: status === 'stub' ? 0.65 : 1,
          }}>
            <div style=${{
              background: bg, color: fg, borderRadius: '8px',
              width: '38px', height: '38px', padding: '9px', flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <${Icon} />
            </div>
            <div style="flex:1;min-width:0;">
              <div style="display:flex;align-items:center;gap:0.5rem;">
                <span style="font-weight:600;font-size:0.9375rem;">${name}</span>
                <span style=${{
                  fontSize: '0.6875rem', fontWeight: '700', textTransform: 'uppercase',
                  letterSpacing: '0.06em', padding: '2px 6px', borderRadius: '4px',
                  background: status === 'ready' ? '#dcfce7' : '#f3f4f6',
                  color: status === 'ready' ? '#166534' : '#6b7280',
                }}>${status === 'ready' ? 'supported' : 'coming soon'}</span>
              </div>
              <div style="font-size:0.75rem;color:#9ca3af;font-family:monospace;margin-top:2px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">
                ${secrets}
              </div>
            </div>
            <a href=${docsUrl} target="_blank" rel="noreferrer" style=${{
              fontSize: '0.8125rem', color: '#1e2d3d', textDecoration: 'none',
              border: '1px solid #d1d5db', borderRadius: '6px',
              padding: '0.375rem 0.75rem', whiteSpace: 'nowrap', flexShrink: 0,
            }}>Setup →</a>
          </div>
        `;
      })}
    </div>
  `;
}

// ─── Root app ──────────────────────────────────────────────────────────────

function App() {
  const [view,        setView]        = useState('compose');
  const [token,       setToken]       = useState(localStorage.getItem('ccm_gh_token') || '');
  const [showSettings,setShowSettings]= useState(!localStorage.getItem('ccm_gh_token'));
  const [schedule,    setSchedule]    = useState({ version: '1.0', posts: [] });
  const [sha,         setSha]         = useState(null);
  const [loading,     setLoading]     = useState(false);

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

  const onUpdate = (newSched, newSha) => {
    setSchedule(newSched);
    setSha(newSha);
  };

  const queueCount = (schedule.posts || []).filter(p => p.status === 'scheduled').length;

  const navItems = [
    { id: 'compose',  label: 'Compose' },
    { id: 'queue',    label: 'Queue',   badge: queueCount },
    { id: 'history',  label: 'History' },
    { id: 'accounts', label: 'Accounts' },
  ];

  return html`
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;min-height:100vh;background:#f0f4f8;">

      <header style=${{
        background: '#1e2d3d', color: 'white', height: '54px',
        padding: '0 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'sticky', top: 0, zIndex: 50,
      }}>
        <div style="display:flex;align-items:center;gap:0.625rem;">
          <svg width="26" height="26" viewBox="0 0 32 32" fill="none">
            <rect width="32" height="32" rx="7" fill="#e67e22"/>
            <rect x="7" y="10"   width="18" height="2.5" rx="1.25" fill="white"/>
            <rect x="7" y="14.75" width="12" height="2.5" rx="1.25" fill="white"/>
            <rect x="7" y="19.5" width="15" height="2.5" rx="1.25" fill="white" opacity="0.6"/>
          </svg>
          <span style="font-weight:700;font-size:0.9375rem;letter-spacing:-0.01em;">CCM Social</span>
        </div>
        <button
          onClick=${() => setShowSettings(true)}
          style=${{
            background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white',
            padding: '0.375rem 0.875rem', borderRadius: '6px', cursor: 'pointer',
            fontSize: '0.8125rem', display: 'flex', alignItems: 'center', gap: '0.375rem',
          }}
        >
          Settings
          ${!token && html`<span style="width:7px;height:7px;background:#ef4444;border-radius:50%;display:inline-block;"></span>`}
        </button>
      </header>

      <div style="display:flex;min-height:calc(100vh - 54px);">

        <nav style=${{
          width: '172px', flexShrink: 0, background: 'white',
          borderRight: '1px solid #e5e7eb', padding: '1rem 0',
        }}>
          ${navItems.map(item => html`
            <button
              key=${item.id}
              onClick=${() => setView(item.id)}
              style=${{
                width: '100%', padding: '0.625rem 1.25rem', border: 'none',
                borderLeft: view === item.id ? '3px solid #1e2d3d' : '3px solid transparent',
                background: view === item.id ? '#f0f4f8' : 'transparent',
                color: view === item.id ? '#1e2d3d' : '#6b7280',
                fontWeight: view === item.id ? '600' : '400',
                fontSize: '0.9375rem', cursor: 'pointer', textAlign: 'left',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}
            >
              ${item.label}
              ${item.badge > 0 && html`
                <span style=${{
                  background: '#1e2d3d', color: 'white', borderRadius: '10px',
                  fontSize: '0.75rem', fontWeight: '700', padding: '1px 7px',
                }}>${item.badge}</span>
              `}
            </button>
          `)}
        </nav>

        <main style="flex:1;padding:2rem;overflow-y:auto;">
          ${!token && html`
            <div style=${{
              background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: '8px',
              padding: '0.75rem 1rem', marginBottom: '1.5rem',
              fontSize: '0.875rem', color: '#92400e',
            }}>
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
        <${SettingsModal}
          currentToken=${token}
          onSave=${setToken}
          onClose=${() => setShowSettings(false)}
        />
      `}
    </div>
  `;
}

render(html`<${App} />`, document.getElementById('app'));
