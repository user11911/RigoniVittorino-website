-- Contact form submissions from /it/contatti/.
-- ip_hash stores a salted hash of the submitter's IP (rate-limiting / abuse
-- detection only), never the raw IP, per the project's data-minimization rule.
CREATE TABLE IF NOT EXISTS contact_submissions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  status TEXT NOT NULL DEFAULT 'received', -- received | notified | failed
  ip_hash TEXT
);

CREATE INDEX IF NOT EXISTS idx_contact_submissions_ip_hash_created_at
  ON contact_submissions (ip_hash, created_at);
