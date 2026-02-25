"""Email service using Resend API via httpx."""

import logging

import httpx

from app.config import settings

logger = logging.getLogger(__name__)


def _build_html(
    candidate_name: str,
    role_title: str,
    interview_link: str,
    duration: int,
) -> str:
    return f"""\
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"/></head>
<body style="margin:0;padding:0;background:#f4f4f7;
             font-family:-apple-system,BlinkMacSystemFont,
             'Segoe UI',Roboto,Helvetica,Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0"
         style="background:#f4f4f7;padding:40px 0">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0"
             style="background:#ffffff;border-radius:12px;
                    overflow:hidden;
                    box-shadow:0 2px 8px rgba(0,0,0,0.06)">
        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#7C6FFF,#5B4FD9);
                     padding:32px 40px;text-align:center">
            <h1 style="margin:0;color:#ffffff;font-size:22px;
                       font-weight:700;letter-spacing:-0.02em">
              RoleSignal
            </h1>
          </td>
        </tr>
        <!-- Body -->
        <tr>
          <td style="padding:36px 40px 28px">
            <h2 style="margin:0 0 18px;color:#1a1a2e;font-size:20px;
                       font-weight:700">
              Hi {candidate_name},
            </h2>
            <p style="margin:0 0 14px;font-size:15px;line-height:1.65;
                      color:#444">
              You&rsquo;ve been invited to an AI&#8209;powered interview
              for the <strong>{role_title}</strong> position.
            </p>
            <p style="margin:0 0 28px;font-size:15px;line-height:1.65;
                      color:#444">
              The session takes about <strong>{duration}&nbsp;minutes</strong>.
              Click the button below when you&rsquo;re ready to begin.
            </p>
            <table cellpadding="0" cellspacing="0"
                   style="margin:0 auto 28px">
              <tr><td align="center"
                      style="background:#7C6FFF;border-radius:8px">
                <a href="{interview_link}"
                   style="display:inline-block;padding:14px 36px;
                          color:#ffffff;text-decoration:none;
                          font-size:15px;font-weight:600">
                  Start Interview
                </a>
              </td></tr>
            </table>
            <p style="margin:0;font-size:13px;color:#999;
                      line-height:1.5">
              If the button doesn&rsquo;t work, copy and paste this
              URL&nbsp;into your&nbsp;browser:<br/>
              <a href="{interview_link}"
                 style="color:#7C6FFF;word-break:break-all">
                {interview_link}
              </a>
            </p>
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="padding:20px 40px 28px;
                     border-top:1px solid #eee">
            <p style="margin:0;font-size:12px;color:#bbb;
                      text-align:center">
              Sent by RoleSignal &middot; AI&#8209;powered interviews
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>"""


async def send_interview_email(
    to: str,
    candidate_name: str,
    role_title: str,
    interview_link: str,
    duration: int = 30,
) -> bool:
    """Send an interview invitation email via Resend.

    Returns True if sent, False if skipped or failed.
    Gracefully degrades when resend_api_key is not configured.
    """
    if not settings.resend_api_key:
        logger.warning(
            "resend_api_key not configured, skipping email to=%s",
            to,
        )
        return False

    html = _build_html(
        candidate_name=candidate_name,
        role_title=role_title,
        interview_link=interview_link,
        duration=duration,
    )

    payload = {
        "from": settings.resend_from_email,
        "to": [to],
        "subject": f"Interview Invitation: {role_title}",
        "html": html,
    }

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.post(
                "https://api.resend.com/emails",
                headers={
                    "Authorization": (
                        f"Bearer {settings.resend_api_key}"
                    ),
                    "Content-Type": "application/json",
                },
                json=payload,
            )
            resp.raise_for_status()

        logger.info("email_sent to=%s role=%s", to, role_title)
        return True

    except httpx.HTTPStatusError:
        logger.exception("email_send_failed_http to=%s", to)
        return False
    except httpx.RequestError:
        logger.exception("email_send_failed_network to=%s", to)
        return False
