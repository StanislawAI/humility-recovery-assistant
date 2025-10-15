-- Rename entry_type column to type for consistency with application code
ALTER TABLE entries RENAME COLUMN entry_type TO type;
