import { db } from "./index";
import { sql, eq } from "drizzle-orm";
import { users, sessions } from "./schema";

// Prepared statements
export const findUserByGitHubIdStatement = db.query.users.findFirst({
  where: (user, { eq }) => eq(user.github_id, sql.placeholder('id')),
}).prepare();

export const findUserStatement = db.query.users.findFirst({
  where: (user, { eq }) => eq(user.id, sql.placeholder('id')),
}).prepare();

export const findUserBySessionId = db.select().from(sessions).innerJoin(users, eq(sessions.user_id, users.id)).where(eq(sessions.session_token, sql.placeholder('session_token'))).prepare();

type GitHubUserInfo = {
  id: number;
  login: string;
  email: string;
  name: string;
  bio: string;
  location: string;
  avatar_url: string;
  twitter_username: string;
}

export async function get_users() {
  return await db.query.users.findMany()
}

export async function get_user_by_github_id(github_id: number) {
  const user = await findUserByGitHubIdStatement.get({ id: github_id });
  return user;
}

export async function get_user(userId: number) {
  const user = await findUserStatement.get({ id: userId });

  console.log('User: ', user)

  return user;
}

export async function create_user(github_user_info: GitHubUserInfo) {
  const user_info = extract_github_user_info(github_user_info);

  try {
    const [user] = await db.insert(users).values(user_info).returning();

    return { success: true, user }
  } catch (error) {
    console.error(error)
    return { success: false, error }
  }
}

export async function update_user(id: number, new_user_info: GitHubUserInfo) {
  const user_info = extract_github_user_info(new_user_info);
  try {
    const [user] = await db.update(users).set({ ...user_info }).where(eq(users.id, id)).returning()

    return { success: true, user }
  } catch (error) {
    console.error(error)
    return { success: false, error }
  }
}

export async function get_user_by_session_id(session_token: string) {
  try {
    const result = await findUserBySessionId.get({ session_token });

    if (!result?.users) {
      return { success: false, error: 'User not found' }
    }

    return { success: true, user: result.users }
  } catch (error) {
    console.log(error)
    return { success: false, error }
  }

  return {};
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