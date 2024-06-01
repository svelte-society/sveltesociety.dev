-- Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email TEXT NOT NULL,
    username TEXT NOT NULL,
    name TEXT NOT NULL
);

-- Sessions table
CREATE TABLE IF NOT EXISTS sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    token TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);