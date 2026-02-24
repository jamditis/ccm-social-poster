"""Twitter/X poster via tweepy v4 (API v2 for posts, v1.1 for media upload)."""

import io
import os
import tempfile
import urllib.request

import tweepy
from . import BasePlatform

REQUIRED = ('TWITTER_API_KEY', 'TWITTER_API_SECRET',
            'TWITTER_ACCESS_TOKEN', 'TWITTER_ACCESS_SECRET')

# Twitter image upload size limit (5 MB)
MAX_IMAGE_BYTES = 5 * 1024 * 1024


class TwitterPlatform(BasePlatform):
    def __init__(self):
        self._client  = None  # v2
        self._api     = None  # v1.1 (media upload)
        if self.is_configured():
            auth = tweepy.OAuth1UserHandler(
                os.environ['TWITTER_API_KEY'],
                os.environ['TWITTER_API_SECRET'],
                os.environ['TWITTER_ACCESS_TOKEN'],
                os.environ['TWITTER_ACCESS_SECRET'],
            )
            self._api    = tweepy.API(auth)
            self._client = tweepy.Client(
                consumer_key=os.environ['TWITTER_API_KEY'],
                consumer_secret=os.environ['TWITTER_API_SECRET'],
                access_token=os.environ['TWITTER_ACCESS_TOKEN'],
                access_token_secret=os.environ['TWITTER_ACCESS_SECRET'],
            )

    def is_configured(self) -> bool:
        return all(os.environ.get(k) for k in REQUIRED)

    def _upload_media(self, url: str) -> str | None:
        """Download a public media URL and upload to Twitter. Returns media_id string."""
        try:
            with urllib.request.urlopen(url, timeout=30) as resp:
                data = resp.read(MAX_IMAGE_BYTES)
            with tempfile.NamedTemporaryFile(delete=False, suffix='.jpg') as tmp:
                tmp.write(data)
                tmp_path = tmp.name
            media = self._api.media_upload(filename=tmp_path)
            return str(media.media_id)
        except Exception as e:
            print(f'  Twitter media upload failed ({url[:60]}): {e}')
            return None

    def post(self, content: str, media_urls: list | None = None) -> dict:
        text = content[:280]
        media_ids = []
        for url in (media_urls or [])[:4]:
            mid = self._upload_media(url)
            if mid:
                media_ids.append(mid)

        kwargs = {'text': text}
        if media_ids:
            kwargs['media_ids'] = media_ids

        response = self._client.create_tweet(**kwargs)
        tweet_id = response.data['id']
        return {
            'id': tweet_id,
            'url': f'https://x.com/i/web/status/{tweet_id}',
        }
