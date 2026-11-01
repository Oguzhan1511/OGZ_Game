ALTER TABLE listing_history ADD COLUMN seen_count INTEGER NOT NULL DEFAULT 1;
CREATE TABLE listing_reservations (
 token TEXT NOT NULL,
 listing_id TEXT NOT NULL,
 room_code TEXT NOT NULL,
 expires_at INTEGER NOT NULL,
 PRIMARY KEY (token, listing_id)
);
CREATE INDEX listing_reservations_room ON listing_reservations(room_code);
CREATE INDEX listing_reservations_expiry ON listing_reservations(expires_at);
INSERT OR IGNORE INTO listing_reservations(token,listing_id,room_code,expires_at)
SELECT h.token,h.listing_id,h.room_code,json_extract(r.data,'$.expiresAt')
FROM listing_history h JOIN rooms r ON r.code=h.room_code
WHERE json_extract(r.data,'$.state') IN ('playing','reveal') AND json_extract(r.data,'$.expiresAt') IS NOT NULL;
DELETE FROM listing_history WHERE seen_at IS NULL;
