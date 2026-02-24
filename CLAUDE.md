# CLAUDE.md

Guidance for Claude Code when working on this repo.

## What this is

CCM Social Poster — a scheduled social media tool for the Center for Cooperative Media. Posts are written in a static web UI, stored as JSON in this repo, and published by a GitHub Actions cron job.

## Architecture

```
Browser (GitHub Pages)
  └── reads/writes data/schedule.json via GitHub Contents API
        └── GitHub Actions (*/5 min)
              └── run-scheduler.py
                    ├── Direct platform APIs (when credentials present)
                    └── Zapier webhooks (fallback when direct creds absent)
```

**Key constraint:** There is no backend server. The GitHub repo itself is the data store. The frontend writes schedule entries via the GitHub Contents API using a PAT stored in the browser's localStorage.

## File map

| Path | Purpose |
|------|---------|
| `docs/` | Static GitHub Pages frontend (Preact + HTM, no build) |
| `docs/index.html` | Single-page app entry point |
| `data/schedule.json` | Queued posts (read/written by frontend and scheduler) |
| `data/history.json` | Completed posts with per-platform results |
| `scripts/run-scheduler.py` | Main scheduler — run by GitHub Actions |
| `scripts/platforms/` | One adapter per platform + shared BasePlatform |
| `scripts/platforms/zapier.py` | Generic Zapier webhook adapter (used as fallback) |
| `.github/workflows/post-scheduler.yml` | Cron job definition |
| `worker/src/index.js` | Cloudflare Worker for R2 media uploads |
| `worker/wrangler.toml` | Worker config (bound to R2 bucket `ccm-media`) |

## Platform adapters

Each platform has a `scripts/platforms/<name>.py` with a class extending `BasePlatform`.

`is_configured()` returns `True` if the required env vars are present. The scheduler instantiates every platform at startup and skips unconfigured ones. Zapier is the fallback — if a platform's direct creds are absent but `ZAPIER_WEBHOOK_<PLATFORM>` is set, Zapier handles it.

## GitHub secrets

### Direct API credentials
| Secret | Used by |
|--------|---------|
| `TWITTER_API_KEY`, `TWITTER_API_SECRET`, `TWITTER_ACCESS_TOKEN`, `TWITTER_ACCESS_SECRET` | TwitterPlatform |
| `BLUESKY_HANDLE`, `BLUESKY_APP_PASSWORD` | BlueskyPlatform |
| `LINKEDIN_ACCESS_TOKEN`, `LINKEDIN_PERSON_ID` | LinkedInPlatform |
| `FACEBOOK_PAGE_ID`, `FACEBOOK_PAGE_TOKEN` | FacebookPlatform |
| `INSTAGRAM_BUSINESS_ID` (+ shared `FACEBOOK_PAGE_TOKEN`) | InstagramPlatform |
| `TIKTOK_ACCESS_TOKEN` | TikTokPlatform |

### Zapier webhook fallbacks
| Secret | Zap |
|--------|-----|
| `ZAPIER_WEBHOOK_BLUESKY` | Catch Hook → post to @centercoopmedia.bsky.social |
| `ZAPIER_WEBHOOK_LINKEDIN` | Catch Hook → post to CCM company page |
| `ZAPIER_WEBHOOK_TWITTER` | Pending |
| `ZAPIER_WEBHOOK_FACEBOOK` | Pending |
| `ZAPIER_WEBHOOK_INSTAGRAM` | Pending |
| `ZAPIER_WEBHOOK_TIKTOK` | Pending |

Zapier Zaps live in the CCM Zapier account. The trigger for all of them is "Webhooks by Zapier → Catch Hook". Each Zap's action maps fields from the JSON payload the scheduler sends.

## Zapier payload fields

The scheduler sends these fields in every Zapier webhook call — map them in your Zap's action step:

```
platform           — "bluesky", "linkedin", etc.
content            — post text
media_urls         — array of all media URLs
media_url          — first media URL (single-image convenience)
media_url_2/3/4    — additional media slots
link               — article/link URL
link_title         — article title
link_description   — article description
title              — post title (LinkedIn articles)
hashtags           — array of tags (no # prefix)
hashtags_string    — space-joined "#tag" string
alt_text           — image alt text
```

## R2 media uploads

Media files are uploaded by the frontend to a Cloudflare Worker at `https://ccm-media.amditis.tech`. The worker writes to an R2 bucket (`ccm-media`) and returns a public URL. The URL is stored in `media_urls` in the post payload.

Worker source: `worker/src/index.js`. Deploy with `npx wrangler deploy` from the `worker/` directory.

## Local development

```bash
# Frontend — serve docs/ directory
python3 -m http.server 8000 --directory docs

# Scheduler — needs env vars for whichever platforms you want to test
ZAPIER_WEBHOOK_BLUESKY=https://hooks.zapier.com/... python scripts/run-scheduler.py
```

## Adding a new platform

1. Create `scripts/platforms/<name>.py` extending `BasePlatform`
2. Add it to `ALL_PLATFORMS` in `scripts/run-scheduler.py`
3. Add its secrets to the `env:` block in `.github/workflows/post-scheduler.yml`
4. Add the platform option to the frontend in `docs/index.html`

If using Zapier instead of a direct API:
1. Create a "Webhooks by Zapier → Catch Hook" Zap in the CCM account
2. Set the `ZAPIER_WEBHOOK_<PLATFORM>` GitHub secret to the hook URL
3. Finish the Zap's action step — all payload fields listed above will be available

## Deployment

The frontend auto-deploys to GitHub Pages on push (source: `docs/` on `main`). Custom domain `social.amditis.tech` is set via `docs/CNAME` and protected by Cloudflare Access.

The scheduler runs automatically via GitHub Actions every 5 minutes.
