# CCM Social Poster

Schedule and auto-post to CCM social media accounts. Posts are scheduled via a web interface and published by a GitHub Actions workflow that runs every 5 minutes.

**Live:** https://social.amditis.tech (Cloudflare Access protected)

## How it works

```
You schedule a post → saved to data/schedule.json via GitHub API
GitHub Actions (*/5 * * * *) → reads schedule.json → posts to platforms → updates history.json
```

The frontend is a static Preact app (no build step) hosted on GitHub Pages. The data store is `data/schedule.json` in this repo, read/written via the GitHub Contents API from the browser.

## Setup

### 1. GitHub Pages

In repo Settings → Pages:
- Source: `Deploy from a branch`
- Branch: `main`, folder: `/docs`

### 2. Custom domain + Cloudflare Access

1. Add a CNAME record in Cloudflare: `social` → `jamditis.github.io`
2. Set the custom domain in repo Settings → Pages → Custom domain: `social.amditis.tech`
3. In Cloudflare Zero Trust, create an Access application:
   - Application type: Self-hosted
   - Domain: `social.amditis.tech`
   - Policy: allow email list or Google Workspace domain

### 3. Frontend access token

Once the site is live, open it and click **Settings**. Create a GitHub fine-grained PAT with **Contents: Read and Write** on this repo only, and paste it in.

### 4. Platform credentials

Add secrets in repo Settings → Secrets and variables → Actions:

| Platform  | Required secrets |
|-----------|-----------------|
| Twitter/X | `TWITTER_API_KEY`, `TWITTER_API_SECRET`, `TWITTER_ACCESS_TOKEN`, `TWITTER_ACCESS_SECRET` |
| Bluesky   | `BLUESKY_HANDLE`, `BLUESKY_APP_PASSWORD` |
| LinkedIn  | `LINKEDIN_ACCESS_TOKEN`, `LINKEDIN_PERSON_ID` |
| Facebook  | `FACEBOOK_PAGE_ID`, `FACEBOOK_PAGE_TOKEN` |
| Instagram | `INSTAGRAM_BUSINESS_ID`, `FACEBOOK_PAGE_TOKEN` |
| TikTok    | `TIKTOK_ACCESS_TOKEN` |

Platforms with missing secrets are skipped silently — add credentials incrementally.

#### Twitter/X
1. Apply for API access at developer.x.com
2. Create a project and app with read/write permissions
3. Generate Access Token and Secret under "Keys and Tokens"

#### Bluesky
1. Go to bsky.app → Settings → App Passwords
2. Create an app password (not your main password)
3. `BLUESKY_HANDLE` is your full handle, e.g. `ccm.bsky.social`

#### LinkedIn
1. Create an app at linkedin.com/developers
2. Request "Share on LinkedIn" product
3. OAuth flow → long-lived token (60-day expiry, needs periodic refresh)

#### Facebook + Instagram
1. Create a Facebook app with Pages permissions
2. Get a permanent page token via the long-lived token exchange
3. For Instagram: link your IG Business account to your Facebook Page first

#### TikTok
1. Apply for Content Posting API access at developers.tiktok.com
2. Complete OAuth flow to get an access token
3. Note: TikTok requires video content — text-only posts are not supported

## Post data format

**data/schedule.json**
```json
{
  "version": "1.0",
  "posts": [
    {
      "id": "uuid",
      "content": "Post text",
      "platforms": ["twitter", "bluesky"],
      "media_urls": [],
      "scheduled_at": "2026-02-25T14:00:00Z",
      "status": "scheduled",
      "created_at": "2026-02-24T10:00:00Z"
    }
  ]
}
```

After posting, the item moves to `data/history.json` with `status: posted|failed|partial` and a `results` object showing per-platform outcomes.

## Local development

```bash
# Frontend — zero build, just serve the docs/ directory
python3 -m http.server 8000 --directory docs

# Scheduler — test locally with .env file
cp .env.example .env  # fill in credentials
python scripts/run-scheduler.py
```
