-- Create the new `Roles` table
-- Create the expanded Roles table with only created_at using DEFAULT CURRENT_TIMESTAMP
CREATE TABLE roles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  value TEXT NOT NULL UNIQUE,
  description TEXT,
  permissions TEXT, -- This could be a JSON string or a comma-separated list
  created_at DEFAULT CURRENT_TIMESTAMP,
  active INTEGER DEFAULT 1 -- 1 for active, 0 for inactive
);

-- Adjust the `users` table to include a role reference without foreign key constraint
ALTER TABLE users ADD COLUMN role_id INTEGER;