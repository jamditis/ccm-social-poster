"""Bluesky poster via atproto SDK."""

import os
from atproto import Client
from . import BasePlatform

REQUIRED = ('BLUESKY_HANDLE', 'BLUESKY_APP_PASSWORD')


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

    def post(self, content: str, media_urls: list | None = None) -> dict:
        text = content[:300]
        response = self._client.send_post(text=text)
        return {
            'uri': response.uri,
            'cid': response.cid,
            'url': f'https://bsky.app/profile/{os.environ["BLUESKY_HANDLE"]}/post/{response.uri.split("/")[-1]}',
        }
