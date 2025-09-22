CREATE TABLE IF NOT EXISTS trades (
  id TEXT PRIMARY KEY,
  buyer_id TEXT,
  seller_id TEXT,
  item TEXT,
  status TEXT,
  escrow BOOLEAN DEFAULT 1,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
