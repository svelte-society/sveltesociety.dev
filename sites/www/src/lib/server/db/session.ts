import { db } from "./index";
import { eq, sql } from "drizzle-orm";
import { sessions } from "./schema";

const SEVEN_DAYS = 60 * 60 * 24 * 7;

// Prepared statements
export const findSessionStatement = db.query.sessions.findFirst({
  where: (session, { eq }) => eq(session.session_token, sql.placeholder('session_token')),
}).prepare();

export const createSessionTokenStatement = db.insert(sessions).values({
  user_id: sql.placeholder('user_id'),
  session_token: sql.placeholder('session_token'),
  expires_at: sql.placeholder('expires_at'),
}).returning().prepare()

export const deleteSessionStatement = db.delete(sessions).where(eq(sessions.id, sql.placeholder('id'))).returning().prepare()

export async function create_session(user_id: number) {
  try {
    const session_token = generate_session_id() as string

    const now = new Date();
    const expiration = new Date(now.getTime() + SEVEN_DAYS * 1000);

    await createSessionTokenStatement.get({ user_id, session_token, expires_at: expiration.toISOString() })

    return { success: true, session_token }
  } catch (error) {
    console.error(error)
    return { success: false, error }
  }
}

function generate_session_id() {
  return crypto.randomUUID();
}

export async function validate_session_id(session_token: string) {
  return await findSessionStatement.get({ session_token });
}

// export async function refresh_session(session_id: string) {
//   const session = await db.execute({
//     sql: `UPDATE sessions SET expires_at = ? WHERE session_token = ?`,
//     args: [Date.now() + SEVEN_DAYS * 1000, session_id],
//   });
//   return session.rows.length > 0;
// }

export async function delete_session(session_token: string) {
  try {
    await db.delete(sessions).where(eq(sessions.session_token, session_token)).returning()

    return { success: true }
  } catch (error) {
    return { success: false, error }
  }
}