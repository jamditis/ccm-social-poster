"""Facebook page poster via Graph API v19.

Setup:
  1. Create a Facebook app at https://developers.facebook.com/apps
  2. Add "Pages" permissions: pages_manage_posts, pages_read_engagement
  3. Generate a long-lived Page Access Token (never expires if generated correctly)
  4. Set FACEBOOK_PAGE_ID and FACEBOOK_PAGE_TOKEN in GitHub Secrets

To get a long-lived page token:
  a. Get a user token with pages_manage_posts scope
  b. Exchange for long-lived user token:
     GET /oauth/access_token?grant_type=fb_exchange_token&client_id=APP_ID
       &client_secret=APP_SECRET&fb_exchange_token=SHORT_TOKEN
  c. Get permanent page token:
     GET /ME/accounts with the long-lived user token
"""

import os
import requests
from . import BasePlatform

REQUIRED  = ('FACEBOOK_PAGE_ID', 'FACEBOOK_PAGE_TOKEN')
GRAPH_API = 'https://graph.facebook.com/v19.0'


class FacebookPlatform(BasePlatform):
    def is_configured(self) -> bool:
        return all(os.environ.get(k) for k in REQUIRED)

    def post(self, content: str, media_urls: list | None = None) -> dict:
        page_id = os.environ['FACEBOOK_PAGE_ID']
        token   = os.environ['FACEBOOK_PAGE_TOKEN']

        payload = {
            'message': content[:2000],
            'access_token': token,
        }
        # If a link URL is included, attach it for rich preview
        if media_urls:
            payload['link'] = media_urls[0]

        res = requests.post(
            f'{GRAPH_API}/{page_id}/feed',
            json=payload,
            timeout=30,
        )
        res.raise_for_status()
        post_id = res.json()['id']
        return {
            'id': post_id,
            'url': f'https://www.facebook.com/{post_id.replace("_", "/posts/")}',
        }
