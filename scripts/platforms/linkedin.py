"""LinkedIn poster via API v2 (UGC Posts endpoint).

Setup:
  1. Create a LinkedIn app at https://www.linkedin.com/developers/apps
  2. Request the "Share on LinkedIn" and "Sign In with LinkedIn" products
  3. Exchange OAuth code for an access token (or use a long-lived token via
     the LinkedIn token generator tool)
  4. Set LINKEDIN_ACCESS_TOKEN and LINKEDIN_PERSON_ID in GitHub Secrets

LINKEDIN_PERSON_ID is your numeric member ID, found by calling:
  GET https://api.linkedin.com/v2/userinfo
  (with Authorization: Bearer <token>)
"""

import os
import requests
from . import BasePlatform

REQUIRED = ('LINKEDIN_ACCESS_TOKEN', 'LINKEDIN_PERSON_ID')
API_BASE  = 'https://api.linkedin.com/v2'


class LinkedInPlatform(BasePlatform):
    def is_configured(self) -> bool:
        return all(os.environ.get(k) for k in REQUIRED)

    def post(self, content: str, media_urls: list | None = None) -> dict:
        token     = os.environ['LINKEDIN_ACCESS_TOKEN']
        person_id = os.environ['LINKEDIN_PERSON_ID']

        payload = {
            'author': f'urn:li:person:{person_id}',
            'lifecycleState': 'PUBLISHED',
            'specificContent': {
                'com.linkedin.ugc.ShareContent': {
                    'shareCommentary': {'text': content[:3000]},
                    'shareMediaCategory': 'NONE',
                },
            },
            'visibility': {
                'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC',
            },
        }

        res = requests.post(
            f'{API_BASE}/ugcPosts',
            json=payload,
            headers={'Authorization': f'Bearer {token}', 'X-Restli-Protocol-Version': '2.0.0'},
            timeout=30,
        )
        res.raise_for_status()
        post_id = res.headers.get('x-restli-id', res.json().get('id', ''))
        return {
            'id': post_id,
            'url': f'https://www.linkedin.com/feed/update/{post_id}',
        }
