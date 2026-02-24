# Changelog

## Unreleased

- Zapier webhook Zaps pending setup: Twitter/X, Facebook, Instagram, TikTok

## 2026-02-24

### Added
- Zapier webhook payload now includes all mappable fields: `media_url`, `media_url_2/3/4`, `link`, `link_title`, `link_description`, `title`, `hashtags`, `hashtags_string`, `alt_text`
- Zapier webhook secrets added to GitHub Actions workflow env block (`ZAPIER_WEBHOOK_*`)
- Bluesky Zap live and tested — posts confirmed on @centercoopmedia.bsky.social
- LinkedIn Zap live — posts to CCM company page

### Changed
- Workflow now passes `ZAPIER_WEBHOOK_*` env vars to the scheduler step (they were set as secrets but not exposed to the process)

## 2026-02-23

### Added
- R2 media upload via Cloudflare Worker (`ccm-media.amditis.tech`)
  - Worker at `worker/src/index.js` — validates file type/size, writes to R2, returns public URL
  - Deployed to Cloudflare Workers with `ccm-media` R2 bucket binding
- Media upload UI in the frontend — drag-and-drop or file picker, shows thumbnail previews
- Platform-specific post previews in the scheduler UI
- Image support in post payloads (`media_urls` array)

## 2026-02-22

### Added
- CCM branding: black/red/gold palette, DM Sans font, CCM logo
- OG image (`og-image.png`) for GitHub social preview
- Cloudflare Access error pages (`access-pages/`) with CCM branding
- Custom domain via `docs/CNAME` — `social.amditis.tech`

## 2026-02-21

### Added
- Initial build
  - Static Preact + HTM frontend (no build step) in `docs/`
  - `data/schedule.json` as the data store, read/written via GitHub Contents API
  - GitHub Actions cron (`*/5 * * * *`) runs `scripts/run-scheduler.py`
  - Platform adapters: Twitter, Bluesky, LinkedIn, Facebook, Instagram, TikTok
  - Zapier webhook adapter as fallback for platforms without direct API credentials
  - `data/history.json` for completed post records with per-platform results
