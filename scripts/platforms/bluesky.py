"""Bluesky poster via atproto SDK."""

import os
import urllib.request
from atproto import Client, client_utils
from . import BasePlatform

REQUIRED = ('BLUESKY_HANDLE', 'BLUESKY_APP_PASSWORD')

# Bluesky image size limit (1 MB per image)
MAX_IMAGE_BYTES = 1 * 1024 * 1024


class BlueskyPlatform(BasePlatform):
    def __init__(self):
        self._client = None
        if self.is_configured():
            self._client = Client()
            self._client.login(
                os.environ['BLUESKY_HANDLE'],
                os.environ['BLUESKY_APP_PASSWORD'],
            )

    def is_configured(self) -> bool:
        return all(os.environ.get(k) for k in REQUIRED)

    def _upload_image(self, url: str):
        """Download a public image URL and upload as a Bluesky blob. Returns blob ref or None."""
        try:
            with urllib.request.urlopen(url, timeout=30) as resp:
                content_type = resp.headers.get('Content-Type', 'image/jpeg').split(';')[0].strip()
                data = resp.read(MAX_IMAGE_BYTES)
            return self._client.upload_blob(data).blob
        except Exception as e:
            print(f'  Bluesky image upload failed ({url[:60]}): {e}')
            return None

    def post(self, content: str, media_urls: list | None = None) -> dict:
        text = content[:300]

        # Upload up to 4 images (Bluesky max)
        images = []
        for url in (media_urls or [])[:4]:
            # Skip video URLs — Bluesky doesn't support video yet
            if any(url.lower().endswith(ext) for ext in ('.mp4', '.mov', '.webm')):
                continue
            blob = self._upload_image(url)
            if blob:
                images.append({'alt': '', 'image': blob})

        if images:
            embed = {'$type': 'app.bsky.embed.images', 'images': images}
            response = self._client.send_post(text=text, embed=embed)
        else:
            response = self._client.send_post(text=text)

        handle = os.environ['BLUESKY_HANDLE']
        post_rkey = response.uri.split('/')[-1]
        return {
            'uri': response.uri,
            'cid': response.cid,
            'url': f'https://bsky.app/profile/{handle}/post/{post_rkey}',
        }
