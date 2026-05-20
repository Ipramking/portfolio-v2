import {
  LS,
  DEFAULT_PROFILE, DEFAULT_SKILLS, DEFAULT_EXPERIENCE,
  DEFAULT_PROJECTS, DEFAULT_BUILDING, DEFAULT_BLOG,
  DEFAULT_TESTIMONIALS, DEFAULT_SOCIALS, DEFAULT_EMAILJS,
} from '../data/defaults';

export const GH_TOKEN_KEY = 'pf_gh_token';
export const GH_OWNER_KEY = 'pf_gh_owner';
export const GH_REPO_KEY  = 'pf_gh_repo';
export const PUBLISHED_TS_KEY = 'pf_published_ts';

function lsGet<T>(key: string, fallback: T): T {
  try { return JSON.parse(localStorage.getItem(key) ?? 'null') ?? fallback; }
  catch { return fallback; }
}

export function buildContentPayload(): Record<string, unknown> {
  return {
    _timestamp:    Date.now(),
    [LS.profile]:  lsGet(LS.profile,  DEFAULT_PROFILE),
    [LS.skills]:   lsGet(LS.skills,   DEFAULT_SKILLS),
    [LS.experience]: lsGet(LS.experience, DEFAULT_EXPERIENCE),
    [LS.projects]: lsGet(LS.projects, DEFAULT_PROJECTS),
    [LS.building]: lsGet(LS.building, DEFAULT_BUILDING),
    [LS.blog]:     lsGet(LS.blog,     DEFAULT_BLOG),
    [LS.testimonials]: lsGet(LS.testimonials, DEFAULT_TESTIMONIALS),
    [LS.socials]:  lsGet(LS.socials,  DEFAULT_SOCIALS),
    [LS.emailjs]:  lsGet(LS.emailjs,  DEFAULT_EMAILJS),
  };
}

export type PublishResult =
  | { ok: true }
  | { ok: false; error: string };

export async function publishToGitHub(): Promise<PublishResult> {
  const token = localStorage.getItem(GH_TOKEN_KEY)?.trim();
  const owner = localStorage.getItem(GH_OWNER_KEY)?.trim() || 'Ipramking';
  const repo  = localStorage.getItem(GH_REPO_KEY)?.trim()  || 'portfolio-v2';

  if (!token) {
    return { ok: false, error: 'No GitHub token — add it in the Security tab.' };
  }

  const filePath = 'public/content.json';
  const apiBase  = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`;
  const headers  = {
    Authorization: `token ${token}`,
    'Content-Type': 'application/json',
    Accept: 'application/vnd.github.v3+json',
  };

  // 1. Get current file SHA
  let sha: string | undefined;
  try {
    const r = await fetch(apiBase, { headers });
    if (r.ok) {
      const d = await r.json();
      sha = d.sha as string;
    } else if (r.status !== 404) {
      return { ok: false, error: `GitHub API error ${r.status}: ${r.statusText}` };
    }
  } catch {
    return { ok: false, error: 'Network error reaching GitHub API.' };
  }

  // 2. Build payload and base64-encode it
  const payload   = buildContentPayload();
  const jsonStr   = JSON.stringify(payload, null, 2);
  // TextEncoder → Uint8Array → binary string → btoa (handles Unicode safely)
  const bytes     = new TextEncoder().encode(jsonStr);
  const binStr    = Array.from(bytes).map(b => String.fromCharCode(b)).join('');
  const b64       = btoa(binStr);

  // 3. Commit the updated file
  try {
    const body: Record<string, unknown> = {
      message: `chore: publish portfolio content (${new Date().toISOString()})`,
      content: b64,
    };
    if (sha) body.sha = sha;

    const r = await fetch(apiBase, {
      method: 'PUT',
      headers,
      body: JSON.stringify(body),
    });

    if (!r.ok) {
      const errData = await r.json().catch(() => ({}));
      return { ok: false, error: (errData as any).message || `GitHub error ${r.status}` };
    }
  } catch {
    return { ok: false, error: 'Network error writing to GitHub.' };
  }

  // 4. Mark local timestamp as published
  localStorage.setItem(PUBLISHED_TS_KEY, String(payload._timestamp));
  return { ok: true };
}
