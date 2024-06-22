import { db } from "./index";
import { sql, eq, type InferSelectModel } from "drizzle-orm";
import { users, sessions } from "./schema";
import { handleServiceCall } from "./utils";

type GitHubUserInfo = {
  id: number;
  login: string;
  email: string | null;
  name: string | null;
  bio: string | null;
  location: string | null;
  avatar_url: string | null;
  twitter_username: string | null;
}

type UpdateUser = Omit<InferSelectModel<typeof users>, 'id' | 'created_at' | 'updated_at'>;

// Prepared statements
export const findUserByGitHubIdStatement = db.query.users.findFirst({
  where: (user, { eq }) => eq(user.github_id, sql.placeholder('id')),
}).prepare();

export const findUserStatement = db.query.users.findFirst({
  where: (user, { eq }) => eq(user.id, sql.placeholder('id')),
}).prepare();

export const findUserBySessionId = db.select()
  .from(sessions)
  .innerJoin(users, eq(sessions.user_id, users.id))
  .where(eq(sessions.session_token, sql.placeholder('session_token')))
  .prepare();

export const countUsersStatement = db
  .select({ count: sql<number>`count(*)` })
  .from(users)
  .prepare();

export const findManyUsersStatement = db.query.users.findMany().prepare();

export async function get_users() {
  return handleServiceCall(async () => await findManyUsersStatement.get() || []);
}

export async function get_user_count() {
  return handleServiceCall(async () => {
    const result = await countUsersStatement.get();

    if (!result) {
      throw new Error('Failed to get user count');
    }

    return result.count;
  });
}

export async function get_user_by_github_id(github_id: number) {
  return handleServiceCall(async () => await findUserByGitHubIdStatement.get({ id: github_id }));
}

export async function get_user(userId: number) {
  return handleServiceCall(async () => await findUserStatement.get({ id: userId }));
}

export async function create_user(github_user_info: GitHubUserInfo) {
  return handleServiceCall(async () => {
    const user_info = extract_github_user_info(github_user_info);
    const [user] = await db.insert(users).values(user_info).returning();
    return user;
  });
}

export async function update_user_from_github_info(id: number, new_user_info: GitHubUserInfo) {
  return handleServiceCall(async () => {
    const user_info = extract_github_user_info(new_user_info);

    const [user] = await db.update(users).set(user_info).where(eq(users.id, id)).returning();

    return user;
  });
}

export async function update_user(id: number, new_user_info: UpdateUser) {
  return handleServiceCall(async () => {
    const [user] = await db.update(users).set(new_user_info).where(eq(users.id, id)).returning();

    return user;
  });
}

export async function get_user_by_session_id(session_token: string) {
  return handleServiceCall(async () => {
    const result = await findUserBySessionId.get({ session_token });
    if (!result?.users) {
      throw new Error('User not found');
    }
    return result.users;
  });
}

const extract_github_user_info = (github_user_info: GitHubUserInfo) => {
  return {
    github_id: github_user_info.id,
    username: github_user_info.login,
    email: github_user_info.email,
    name: github_user_info.name,
    bio: github_user_info.bio,
    location: github_user_info.location,
    avatar_url: github_user_info.avatar_url,
    twitter: github_user_info.twitter_username,
  }
}