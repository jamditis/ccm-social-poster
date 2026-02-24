"""Twitter/X poster via tweepy v4 (API v2)."""

import os
import tweepy
from . import BasePlatform

REQUIRED = ('TWITTER_API_KEY', 'TWITTER_API_SECRET',
            'TWITTER_ACCESS_TOKEN', 'TWITTER_ACCESS_SECRET')


class TwitterPlatform(BasePlatform):
    def __init__(self):
        self._client = None
        if self.is_configured():
            self._client = tweepy.Client(
                consumer_key=os.environ['TWITTER_API_KEY'],
                consumer_secret=os.environ['TWITTER_API_SECRET'],
                access_token=os.environ['TWITTER_ACCESS_TOKEN'],
                access_token_secret=os.environ['TWITTER_ACCESS_SECRET'],
            )

    def is_configured(self) -> bool:
        return all(os.environ.get(k) for k in REQUIRED)

    def post(self, content: str, media_urls: list | None = None) -> dict:
        text = content[:280]
        response = self._client.create_tweet(text=text)
        tweet_id = response.data['id']
        return {
            'id': tweet_id,
            'url': f'https://x.com/i/web/status/{tweet_id}',
        }
