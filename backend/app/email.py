"""Outgoing email. Only password-reset messages are sent."""

from __future__ import annotations

import logging
import smtplib
import ssl
from dataclasses import dataclass
from email.message import EmailMessage
from typing import Protocol

from .config import Settings

log = logging.getLogger("evalsuite.email")


@dataclass(frozen=True)
class Message:
    to: str
    subject: str
    body: str


class EmailSender(Protocol):
    def send(self, message: Message) -> None: ...


class ConsoleEmailSender:
    """Development only: writes the message to the log so the reset link can be copied."""

    def send(self, message: Message) -> None:
        log.warning("Development email to %s: %s\n%s", message.to, message.subject, message.body)


class MemoryEmailSender:
    """Tests: keeps messages in a list."""

    def __init__(self) -> None:
        self.outbox: list[Message] = []

    def send(self, message: Message) -> None:
        self.outbox.append(message)


class SmtpEmailSender:
    def __init__(self, settings: Settings) -> None:
        if not settings.smtp_host:
            raise ValueError("EVALSUITE_SMTP_HOST is required for the SMTP email backend.")
        self.settings = settings

    def send(self, message: Message) -> None:
        s = self.settings
        msg = EmailMessage()
        msg["From"] = s.email_from
        msg["To"] = message.to
        msg["Subject"] = message.subject
        msg.set_content(message.body)
        with smtplib.SMTP(s.smtp_host or "", s.smtp_port, timeout=10) as smtp:
            if s.smtp_starttls:
                smtp.starttls(context=ssl.create_default_context())
            if s.smtp_username and s.smtp_password:
                smtp.login(s.smtp_username, s.smtp_password)
            smtp.send_message(msg)


def make_sender(settings: Settings) -> EmailSender:
    if settings.email_backend == "smtp":
        return SmtpEmailSender(settings)
    if settings.email_backend == "memory":
        return MemoryEmailSender()
    return ConsoleEmailSender()
