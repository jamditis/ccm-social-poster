"""TikTok poster via Content Posting API v2.

NOTE: TikTok's API is video-focused and requires media. Text-only posts are
not supported. Posting requires a video URL or direct upload.

Setup:
  1. Create a TikTok developer app at https://developers.tiktok.com
  2. Request "Content Posting API" scope
  3. Complete OAuth flow to get an access token with video.upload scope
  4. Set TIKTOK_ACCESS_TOKEN in GitHub Secrets

Access tokens expire. You'll need to implement refresh token rotation
or use a service account. See TikTok's OAuth documentation for details.

The Content Posting API supports two flows:
  - PULL_FROM_URL: TikTok fetches video from your public URL
  - FILE_UPLOAD:   You upload the video binary directly

This implementation uses PULL_FROM_URL for simplicity.
"""

import os
import requests
from . import BasePlatform

REQUIRED  = ('TIKTOK_ACCESS_TOKEN',)
API_BASE  = 'https://open.tiktokapis.com/v2'


class TikTokPlatform(BasePlatform):
    def is_configured(self) -> bool:
        return all(os.environ.get(k) for k in REQUIRED)

    def post(self, content: str, media_urls: list | None = None) -> dict:
        if not media_urls:
            raise ValueError(
                'TikTok requires a video URL. Text-only posts are not supported. '
                'Add a publicly accessible video URL to media_urls.'
            )

        token = os.environ['TIKTOK_ACCESS_TOKEN']
        headers = {
            'Authorization': f'Bearer {token}',
            'Content-Type': 'application/json; charset=UTF-8',
        }

        # Initialize upload
        init_res = requests.post(
            f'{API_BASE}/post/publish/video/init/',
            headers=headers,
            json={
                'post_info': {
                    'title': content[:2200],
                    'privacy_level': 'PUBLIC_TO_EVERYONE',
                    'disable_duet': False,
                    'disable_comment': False,
                    'disable_stitch': False,
                },
                'source_info': {
                    'source': 'PULL_FROM_URL',
                    'video_url': media_urls[0],
                },
            },
            timeout=30,
        )
        init_res.raise_for_status()
        data = init_res.json().get('data', {})
        publish_id = data.get('publish_id', '')

        return {
            'publish_id': publish_id,
            'url': 'https://www.tiktok.com/@me',  # exact URL not available until published
        }
