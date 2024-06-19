import { db } from "./index";

const SEVEN_DAYS = 60 * 60 * 24 * 7;

export async function create_session(user_id: number) {
  const session_token = generate_session_id()
  const now = new Date();
  const expiration = new Date(now.getTime() + SEVEN_DAYS * 1000);
  await db.execute({
      sql: `INSERT INTO sessions (user_id, session_token, expires_at) VALUES (?, ?, ?)`,
      args: [user_id, session_token, expiration.toISOString()]
    });
  return session_token;
}

function generate_session_id() {
  return crypto.randomUUID();
}

export async function validate_session_id(session_id: string) {
  const session = await db.execute({
    sql: `SELECT * FROM sessions WHERE session_token = ?`,
    args: [session_id],
  });

  return session.rows.length > 0;
}

export async function refresh_session(session_id: string) {
  const session = await db.execute({
    sql: `UPDATE sessions SET expires_at = ? WHERE session_token = ?`,
    args: [Date.now() + SEVEN_DAYS * 1000, session_id],
  });
  return session.rows.length > 0;
}

export function delete_session(session_id: string) {
  db.execute({
    sql: `DELETE FROM sessions WHERE session_token = ?`,
    args: [session_id],
  });
}