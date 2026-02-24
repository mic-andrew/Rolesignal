"""Google OAuth token verification."""

import logging
from dataclasses import dataclass

from google.auth.transport import requests
from google.oauth2 import id_token

from app.config import settings

logger = logging.getLogger(__name__)


@dataclass
class GoogleUserInfo:
    email: str
    name: str
    google_id: str
    picture: str | None = None


def verify_google_token(token: str) -> GoogleUserInfo:
    """Verify a Google ID token and extract user info.

    Raises ValueError if the token is invalid.
    """
    try:
        idinfo = id_token.verify_oauth2_token(
            token, requests.Request(), settings.google_client_id
        )
        return GoogleUserInfo(
            email=idinfo["email"],
            name=idinfo.get("name", idinfo["email"].split("@")[0]),
            google_id=idinfo["sub"],
            picture=idinfo.get("picture"),
        )
    except ValueError as e:
        logger.warning("google_token_verification_failed error=%s", str(e))
        raise
