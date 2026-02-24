#!/usr/bin/env python3
"""
CCM Social Poster scheduler.

Reads data/schedule.json, posts any items due within the past 6 minutes
(to account for GitHub Actions schedule drift), updates status, and moves
completed posts to data/history.json.

Run by GitHub Actions every 5 minutes.
"""

import json
import sys
from datetime import datetime, timedelta, timezone
from pathlib import Path

# Add scripts/ to path so platform imports work
sys.path.insert(0, str(Path(__file__).parent))

from platforms.twitter   import TwitterPlatform
from platforms.bluesky   import BlueskyPlatform
from platforms.linkedin  import LinkedInPlatform
from platforms.facebook  import FacebookPlatform
from platforms.instagram import InstagramPlatform
from platforms.tiktok    import TikTokPlatform

SCHEDULE_FILE = Path(__file__).parent.parent / 'data' / 'schedule.json'
HISTORY_FILE  = Path(__file__).parent.parent / 'data' / 'history.json'

# Look back 6 minutes to catch any posts that GitHub Actions may have delayed
LOOKBACK = timedelta(minutes=6)

ALL_PLATFORMS = {
    'twitter':   TwitterPlatform,
    'bluesky':   BlueskyPlatform,
    'linkedin':  LinkedInPlatform,
    'facebook':  FacebookPlatform,
    'instagram': InstagramPlatform,
    'tiktok':    TikTokPlatform,
}


def load_json(path: Path) -> dict:
    if not path.exists():
        return {'version': '1.0', 'posts': []}
    with open(path) as f:
        return json.load(f)


def save_json(path: Path, data: dict) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with open(path, 'w') as f:
        json.dump(data, f, indent=2)


def main() -> int:
    now = datetime.now(timezone.utc)
    print(f'Scheduler run: {now.isoformat()}')

    schedule = load_json(SCHEDULE_FILE)
    history  = load_json(HISTORY_FILE)

    window_start = now - LOOKBACK
    due = [
        p for p in schedule.get('posts', [])
        if p.get('status') == 'scheduled'
        and window_start <= datetime.fromisoformat(p['scheduled_at'].replace('Z', '+00:00')) <= now
    ]

    if not due:
        print('No posts due.')
        return 0

    print(f'{len(due)} post(s) due.')

    # Initialize platforms that have credentials
    active: dict = {}
    for name, cls in ALL_PLATFORMS.items():
        try:
            instance = cls()
            if instance.is_configured():
                active[name] = instance
                print(f'  Platform ready: {name}')
            else:
                print(f'  Platform skipped (not configured): {name}')
        except Exception as e:
            print(f'  Platform init error ({name}): {e}')

    processed_ids: set = set()

    for post in due:
        pid = post['id']
        snippet = post['content'][:60].replace('\n', ' ')
        print(f'\nPosting [{pid[:8]}]: {snippet}...')

        results: dict = {}
        for platform_name in post.get('platforms', []):
            if platform_name not in active:
                results[platform_name] = {'success': False, 'error': 'not configured'}
                print(f'  {platform_name}: skipped (not configured)')
                continue
            try:
                result = active[platform_name].post(
                    post['content'],
                    post.get('media_urls') or [],
                )
                results[platform_name] = {'success': True, **result}
                print(f'  {platform_name}: ok — {result.get("url", "")}')
            except Exception as e:
                results[platform_name] = {'success': False, 'error': str(e)}
                print(f'  {platform_name}: FAILED — {e}')

        successes = [r for r in results.values() if r['success']]
        failures  = [r for r in results.values() if not r['success']]

        if len(failures) == 0:
            status = 'posted'
        elif len(successes) == 0:
            status = 'failed'
        else:
            status = 'partial'

        post.update(status=status, results=results, posted_at=now.isoformat())
        processed_ids.add(pid)
        print(f'  Status: {status}')

    if not processed_ids:
        return 0

    # Move processed posts out of schedule and into history
    schedule['posts'] = [p for p in schedule['posts'] if p['id'] not in processed_ids]
    processed = [p for p in due if p['id'] in processed_ids]
    history['posts'] = processed + history.get('posts', [])

    save_json(SCHEDULE_FILE, schedule)
    save_json(HISTORY_FILE, history)
    print(f'\nDone. Processed {len(processed_ids)} post(s).')
    return 0


if __name__ == '__main__':
    sys.exit(main())
