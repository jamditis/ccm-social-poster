"""Base class for social media platform posters."""


class BasePlatform:
    """All platform implementations extend this."""

    def is_configured(self) -> bool:
        """Return True if required environment credentials are present."""
        raise NotImplementedError

    def post(self, content: str, media_urls: list | None = None) -> dict:
        """
        Post content to the platform.

        Returns a dict with at minimum a 'url' key pointing to the live post.
        Raises an exception on failure.
        """
        raise NotImplementedError
