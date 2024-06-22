import { db } from "./index";
import { eq, gte, lt, and, sql } from "drizzle-orm";
import { sessions } from "./schema";
import { handleServiceCall } from "./utils";
import crypto from 'crypto';

const ONE_DAY = 60 * 60 * 24;
const SEVEN_DAYS = ONE_DAY * 7;

// Prepared statements
export const findSessionStatement = db.query.sessions.findFirst({
  where: (session, { eq }) => eq(session.session_token, sql.placeholder('session_token')),
}).prepare();

export const createSessionTokenStatement = db.insert(sessions).values({
  user_id: sql.placeholder('user_id'),
  session_token: sql.placeholder('session_token'),
  expires_at: sql.placeholder('expires_at'),
}).returning().prepare();

export const deleteSessionStatement = db.delete(sessions)
  .where(eq(sessions.session_token, sql.placeholder('session_token')))
  .returning()
  .prepare();

export const updateSessionExpirationStatement = db.update(sessions)
  .set({ expires_at: sql.placeholder('new_expires_at') })
  .where(eq(sessions.session_token, sql.placeholder('session_token')))
  .returning()
  .prepare();

export async function create_session(user_id: number) {
  return handleServiceCall(async () => {
    const session_token = generate_session_id();
    const now = new Date();
    const expiration = new Date(now.getTime() + SEVEN_DAYS * 1000);
    await createSessionTokenStatement.get({
      user_id,
      session_token,
      expires_at: formatDateForSQLite(expiration)
    });
    return session_token as string;
  });
}

// Untested
export async function refresh_session(session_token: string) {
  return handleServiceCall(async () => {
    const now = new Date();
    const oneDayFromNow = new Date(now.getTime() + ONE_DAY * 1000);
    const sevenDaysFromNow = new Date(now.getTime() + SEVEN_DAYS * 1000);

    // Format dates for SQLite
    const formattedNow = formatDateForSQLite(now);
    const formattedOneDayFromNow = formatDateForSQLite(oneDayFromNow);
    const formattedSevenDaysFromNow = formatDateForSQLite(sevenDaysFromNow);

    // Check if the session is expiring within 1 day
    const [sessionToRefresh] = await db.select()
      .from(sessions)
      .where(
        and(
          eq(sessions.session_token, session_token),
          gte(sessions.expires_at, formattedNow),
          lt(sessions.expires_at, formattedOneDayFromNow)
        )
      );

    if (sessionToRefresh) {
      // If session found and expiring soon, refresh it
      const updatedSession = await updateSessionExpirationStatement.get({
        session_token,
        new_expires_at: formattedSevenDaysFromNow
      });
      return { refreshed: true, session: updatedSession };
    }

    // If session not found or not expiring soon, return null
    return { refreshed: false, session: null };
  });
}

export async function validate_session_id(session_token: string) {
  return handleServiceCall(async () => await findSessionStatement.get({ session_token }));
}

export async function delete_session(session_token: string) {
  return handleServiceCall(async () => await deleteSessionStatement.get({ session_token }));
}

function generate_session_id() {
  return crypto.randomUUID();
}

function formatDateForSQLite(date: Date): string {
  return date.toISOString().replace('T', ' ').split('.')[0];
}