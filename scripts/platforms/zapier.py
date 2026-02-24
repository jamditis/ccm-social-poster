"""Zapier webhook platform adapter.

Posts via a "Webhooks by Zapier — Catch Hook" trigger. The Zap on the other
end handles the actual social platform posting.

Required env var per platform:
    ZAPIER_WEBHOOK_TWITTER
    ZAPIER_WEBHOOK_LINKEDIN
    ZAPIER_WEBHOOK_FACEBOOK
    ZAPIER_WEBHOOK_INSTAGRAM
    ZAPIER_WEBHOOK_TIKTOK
    ZAPIER_WEBHOOK_BLUESKY

The scheduler uses this as a fallback when direct API credentials are absent.
"""

import json
import os
import urllib.request
from . import BasePlatform


class ZapierPlatform(BasePlatform):
    """Generic Zapier webhook poster. One instance per platform."""

    def __init__(self, platform: str):
        self._platform    = platform.lower()
        self._webhook_url = os.environ.get(f'ZAPIER_WEBHOOK_{platform.upper()}')

    def is_configured(self) -> bool:
        return bool(self._webhook_url)

    def post(self, content: str, media_urls: list | None = None,
             link: str | None = None, link_title: str | None = None,
             link_description: str | None = None, title: str | None = None,
             hashtags: list | None = None, alt_text: str | None = None) -> dict:
        media = media_urls or []
        payload = json.dumps({
            # Core
            'platform':         self._platform,
            'content':          content,
            # Media — first item also exposed individually for platforms
            # that only accept a single image field
            'media_urls':       media,
            'media_url':        media[0] if media else '',
            'media_url_2':      media[1] if len(media) > 1 else '',
            'media_url_3':      media[2] if len(media) > 2 else '',
            'media_url_4':      media[3] if len(media) > 3 else '',
            # Link/article
            'link':             link or '',
            'link_title':       link_title or '',
            'link_description': link_description or '',
            # Optional extras
            'title':            title or '',
            'hashtags':         hashtags or [],
            'hashtags_string':  ' '.join(f'#{t.lstrip("#")}' for t in (hashtags or [])),
            'alt_text':         alt_text or '',
        }).encode()

        req = urllib.request.Request(
            self._webhook_url,
            data=payload,
            headers={'Content-Type': 'application/json'},
            method='POST',
        )
        with urllib.request.urlopen(req, timeout=30) as resp:
            body = resp.read().decode()

        return {'status': resp.status, 'response': body[:200]}
