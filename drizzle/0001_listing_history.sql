CREATE TABLE listing_history (
  token TEXT NOT NULL,
  listing_id TEXT NOT NULL,
  room_code TEXT NOT NULL,
  round_number INTEGER NOT NULL,
  seen_at INTEGER,
  PRIMARY KEY (token, listing_id)
);
CREATE INDEX listing_history_room ON listing_history (room_code);
