"""Instagram Business poster via Facebook Graph API.

NOTE: Instagram does not support text-only posts. Every post requires an
image or video. Text posts will fail with a meaningful error message.

Setup:
  1. Connect your Instagram Business account to a Facebook Page
  2. Create a Facebook app with instagram_basic, instagram_content_publish permissions
  3. Get the Instagram Business Account ID:
     GET /me/accounts → get page_id
     GET /{page_id}?fields=instagram_business_account → get instagram_business_account.id
  4. Set INSTAGRAM_BUSINESS_ID and FACEBOOK_PAGE_TOKEN in GitHub Secrets

Posting flow (Graph API two-step):
  Step 1: Create a media container (POST /{ig_user_id}/media)
  Step 2: Publish the container  (POST /{ig_user_id}/media_publish)

For images, media_urls[0] must be a publicly accessible HTTPS URL.
"""

import os
import requests
from . import BasePlatform

REQUIRED  = ('INSTAGRAM_BUSINESS_ID', 'FACEBOOK_PAGE_TOKEN')
GRAPH_API = 'https://graph.facebook.com/v19.0'


class InstagramPlatform(BasePlatform):
    def is_configured(self) -> bool:
        return all(os.environ.get(k) for k in REQUIRED)

    def post(self, content: str, media_urls: list | None = None) -> dict:
        if not media_urls:
            raise ValueError(
                'Instagram requires an image URL. Text-only posts are not supported. '
                'Add a publicly accessible image URL to media_urls.'
            )

        ig_id  = os.environ['INSTAGRAM_BUSINESS_ID']
        token  = os.environ['FACEBOOK_PAGE_TOKEN']
        params = {'access_token': token}

        # Step 1: create container
        container_res = requests.post(
            f'{GRAPH_API}/{ig_id}/media',
            params=params,
            json={'image_url': media_urls[0], 'caption': content[:2200]},
            timeout=30,
        )
        container_res.raise_for_status()
        container_id = container_res.json()['id']

        # Step 2: publish
        publish_res = requests.post(
            f'{GRAPH_API}/{ig_id}/media_publish',
            params=params,
            json={'creation_id': container_id},
            timeout=30,
        )
        publish_res.raise_for_status()
        media_id = publish_res.json()['id']

        return {
            'id': media_id,
            'url': f'https://www.instagram.com/p/{media_id}/',
        }
