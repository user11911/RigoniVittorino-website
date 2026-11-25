-- Outcome of each automated email per submission, so a failed or missing email is
-- visible after the fact instead of only in short-lived logs.
-- *_status: 'sent' (Resend accepted it) | 'failed' | 'dry-run' (no RESEND_API_KEY).
-- *_detail: Resend's email id when sent (searchable in the Resend dashboard), or the
-- error message when it failed.
ALTER TABLE contact_submissions ADD COLUMN notification_status TEXT;
ALTER TABLE contact_submissions ADD COLUMN notification_detail TEXT;
ALTER TABLE contact_submissions ADD COLUMN confirmation_status TEXT;
ALTER TABLE contact_submissions ADD COLUMN confirmation_detail TEXT;
