#!/usr/bin/env python3
"""
Zapier webhook setup automation for CCM Social Poster.

Logs into Zapier, finds or creates webhook → social platform Zaps,
then adds the webhook URLs as GitHub Actions secrets.

Usage:
    python3 setup-zapier.py <email> <password>
"""

import json
import re
import sys
import time
import subprocess
from pathlib import Path

from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException, NoSuchElementException

CHROME_BIN    = '/snap/chromium/current/usr/lib/chromium-browser/chrome'
CHROMEDRIVER  = '/snap/chromium/current/usr/lib/chromium-browser/chromedriver'
COOKIE_PATH   = Path('/tmp/zapier_cookies.json')
REPO          = 'jamditis/ccm-social-poster'

PLATFORMS = ['twitter', 'linkedin', 'facebook', 'instagram', 'tiktok', 'bluesky']

SECRET_NAMES = {
    'twitter':   'ZAPIER_WEBHOOK_TWITTER',
    'linkedin':  'ZAPIER_WEBHOOK_LINKEDIN',
    'facebook':  'ZAPIER_WEBHOOK_FACEBOOK',
    'instagram': 'ZAPIER_WEBHOOK_INSTAGRAM',
    'tiktok':    'ZAPIER_WEBHOOK_TIKTOK',
    'bluesky':   'ZAPIER_WEBHOOK_BLUESKY',
}


def make_driver():
    opts = Options()
    opts.binary_location = CHROME_BIN
    opts.add_argument('--no-sandbox')
    opts.add_argument('--disable-dev-shm-usage')
    opts.add_argument('--window-size=1280,900')
    opts.add_argument('--disable-blink-features=AutomationControlled')
    opts.add_experimental_option('excludeSwitches', ['enable-automation'])
    opts.add_experimental_option('useAutomationExtension', False)
    svc = Service(CHROMEDRIVER)
    driver = webdriver.Chrome(service=svc, options=opts)
    driver.execute_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")
    return driver


def wait_for(driver, by, selector, timeout=20):
    return WebDriverWait(driver, timeout).until(EC.presence_of_element_located((by, selector)))


def wait_clickable(driver, by, selector, timeout=20):
    return WebDriverWait(driver, timeout).until(EC.element_to_be_clickable((by, selector)))


def login(driver, email, password):
    print('Navigating to Zapier login...')
    driver.get('https://zapier.com/app/login')
    time.sleep(2)

    # Enter email
    try:
        email_field = wait_for(driver, By.CSS_SELECTOR, 'input[type="email"], input[name="email"]', 15)
        email_field.clear()
        email_field.send_keys(email)
        time.sleep(0.5)

        # Click Continue or submit
        try:
            btn = driver.find_element(By.XPATH, "//button[contains(text(),'Continue') or contains(text(),'Next') or @type='submit']")
            btn.click()
        except NoSuchElementException:
            email_field.submit()
        time.sleep(2)
    except TimeoutException:
        print('Could not find email field. Page source snippet:')
        print(driver.page_source[:500])
        return False

    # Enter password — wait for it to be fully visible and interactable
    try:
        pw_field = WebDriverWait(driver, 20).until(
            EC.element_to_be_clickable((By.CSS_SELECTOR, 'input[type="password"]'))
        )
        time.sleep(1)  # let animation settle
        driver.execute_script("arguments[0].scrollIntoView(true);", pw_field)
        driver.execute_script("arguments[0].click();", pw_field)
        time.sleep(0.5)
        # React-compatible value setter — triggers onChange
        driver.execute_script("""
            var el = arguments[0], val = arguments[1];
            var setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
            setter.call(el, val);
            el.dispatchEvent(new Event('input', { bubbles: true }));
            el.dispatchEvent(new Event('change', { bubbles: true }));
        """, pw_field, password)
        time.sleep(0.3)
        try:
            btn = driver.find_element(By.XPATH, "//button[contains(text(),'Log in') or contains(text(),'Sign in') or contains(text(),'Continue') or @type='submit']")
            btn.click()
        except NoSuchElementException:
            pw_field.submit()
        time.sleep(3)
    except TimeoutException:
        print('Could not find password field.')
        return False

    # Handle 2FA if present
    if '2fa' in driver.current_url.lower() or 'verify' in driver.current_url.lower() or 'mfa' in driver.current_url.lower():
        print('\n2FA required. Enter the code:')
        code = input('> ').strip()
        try:
            code_field = wait_for(driver, By.CSS_SELECTOR, 'input[type="text"], input[name="code"], input[autocomplete="one-time-code"]', 10)
            code_field.send_keys(code)
            code_field.submit()
            time.sleep(3)
        except TimeoutException:
            print('Could not find 2FA code field.')
            return False

    # Check we're logged in
    if 'login' in driver.current_url or 'signin' in driver.current_url:
        print('Login may have failed. Current URL:', driver.current_url)
        return False

    print('Logged in. Current URL:', driver.current_url)
    return True


def find_existing_zap_webhooks(driver):
    """Scan existing Zaps for webhook triggers and return {platform: url} map."""
    print('\nScanning existing Zaps for webhook triggers...')
    driver.get('https://zapier.com/app/zaps')
    time.sleep(3)

    webhooks = {}

    # Look for Zaps with "Webhooks" in the trigger
    try:
        # Zapier's Zap list — search for webhook zaps
        zap_rows = driver.find_elements(By.CSS_SELECTOR, '[data-testid="zap-row"], .zap-row, [class*="ZapRow"]')
        print(f'Found {len(zap_rows)} Zap rows')

        for row in zap_rows:
            text = row.text.lower()
            has_webhook = 'webhook' in text or 'catch hook' in text
            if not has_webhook:
                continue
            # Check which platform this Zap targets
            for platform in PLATFORMS:
                if platform in text or PLATFORM_LABELS.get(platform, '').lower() in text:
                    # Try to click through to get webhook URL
                    try:
                        link = row.find_element(By.CSS_SELECTOR, 'a')
                        zap_url = link.get_attribute('href')
                        print(f'  Found potential {platform} Zap: {zap_url}')
                        webhooks[platform] = {'zap_url': zap_url, 'webhook_url': None}
                    except NoSuchElementException:
                        pass
    except Exception as e:
        print(f'Error scanning Zaps: {e}')

    return webhooks


PLATFORM_LABELS = {
    'twitter':   'Twitter',
    'linkedin':  'LinkedIn',
    'facebook':  'Facebook',
    'instagram': 'Instagram',
    'tiktok':    'TikTok',
    'bluesky':   'Bluesky',
}


def get_webhook_url_from_zap(driver, zap_url):
    """Open a Zap editor and extract the webhook URL from the trigger step."""
    driver.get(zap_url)
    time.sleep(4)

    try:
        # Look for the webhook URL in the trigger step
        url_pattern = r'https://hooks\.zapier\.com/hooks/catch/[^"\s\']+'
        source = driver.page_source
        match = re.search(url_pattern, source)
        if match:
            return match.group(0)

        # Try to find it in visible text
        elements = driver.find_elements(By.XPATH, "//*[contains(text(), 'hooks.zapier.com')]")
        for el in elements:
            m = re.search(url_pattern, el.text)
            if m:
                return m.group(0)
    except Exception as e:
        print(f'  Error extracting webhook URL: {e}')

    return None


def create_webhook_zap(driver, platform):
    """Create a new Zap: Catch Hook trigger → post to platform."""
    print(f'\nCreating new Zap for {platform}...')
    driver.get('https://zapier.com/app/editor')
    time.sleep(3)

    # This is complex to automate fully — guide the user instead
    # For now, open the template search
    search_url = f'https://zapier.com/apps/webhook/integrations/{PLATFORM_LABELS.get(platform, platform).lower()}'
    driver.get(search_url)
    time.sleep(2)
    print(f'  Opened integration page for {platform}')
    return None


def set_github_secret(name, value):
    """Set a GitHub Actions secret using the gh CLI."""
    try:
        result = subprocess.run(
            ['gh', 'secret', 'set', name, '--repo', REPO, '--body', value],
            capture_output=True, text=True
        )
        if result.returncode == 0:
            print(f'  Set GitHub secret: {name}')
            return True
        else:
            print(f'  Failed to set {name}: {result.stderr}')
            return False
    except Exception as e:
        print(f'  Error setting secret {name}: {e}')
        return False


def main():
    if len(sys.argv) < 3:
        print('Usage: python3 setup-zapier.py <email> <password>')
        sys.exit(1)

    email    = sys.argv[1]
    password = sys.argv[2]

    driver = make_driver()
    found_webhooks = {}

    try:
        if not login(driver, email, password):
            print('Login failed.')
            sys.exit(1)

        # Scan for existing webhook Zaps
        zap_map = find_existing_zap_webhooks(driver)

        # Try to get webhook URLs from found Zaps
        for platform, info in zap_map.items():
            url = get_webhook_url_from_zap(driver, info['zap_url'])
            if url:
                found_webhooks[platform] = url
                print(f'  Got webhook for {platform}: {url}')

        # Show what we found
        print('\n--- Results ---')
        for platform in PLATFORMS:
            if platform in found_webhooks:
                print(f'  {platform}: {found_webhooks[platform]}')
            else:
                print(f'  {platform}: not found')

        # Set GitHub secrets for found webhooks
        if found_webhooks:
            print('\nSetting GitHub Actions secrets...')
            for platform, url in found_webhooks.items():
                secret_name = SECRET_NAMES[platform]
                set_github_secret(secret_name, url)

        # Pause so user can interact with browser if needed
        print('\nBrowser staying open for 60 seconds. Close manually when done.')
        time.sleep(60)

    finally:
        driver.quit()

    print('\nDone.')
    if found_webhooks:
        print(f'Configured {len(found_webhooks)} platform(s): {", ".join(found_webhooks.keys())}')
    else:
        print('No webhook URLs found automatically. You may need to create Zaps manually.')


if __name__ == '__main__':
    main()
