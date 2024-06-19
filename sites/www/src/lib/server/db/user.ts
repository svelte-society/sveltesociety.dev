import { db } from "./index";

type GitHubUserInfo = {
  id: number;
  login: string;
  email: string;
  bio: string;
  location: string;
  avatar_url: string;
  twitter_username: string;
}

export async function get_users() {
  const users = await db.execute(`SELECT * FROM users`)
  return users.rows;
}

export async function get_user_by_github_id(githubId: number) {
  const user = await db.execute({
    sql: `SELECT * FROM users WHERE github_id = ?`,
    args: [githubId],
  });
  return user.rows[0] as unknown as User | undefined;
}

export async function get_user(userId: number) {
  const role = await db.execute({
    sql: `SELECT * FROM users WHERE id = ?`,
    args: [userId],
  });
  return role.rows[0] as unknown as User | undefined;
}

export async function create_user(github_user_info: GitHubUserInfo) {
  const user_info = {
    id: github_user_info.id,
    login: github_user_info.login,
    email: github_user_info.email,
    bio: github_user_info.bio,
    location: github_user_info.location,
    avatar_url: github_user_info.avatar_url,
    twitter_username: github_user_info.twitter_username,
  }

  try {
    // Create user and fetch the same user
    const [_, user] = await db.batch([
      {
        sql: `INSERT INTO users (github_id, username, email, bio, location, avatar_url, twitter) VALUES ($id, $login, $email, $bio, $location, $avatar_url, $twitter_username)`,
        args: user_info,
      },
      {
        sql: `SELECT * FROM users WHERE id = last_insert_rowid()`,
        args: [],
      },
    ]);

    return { success: true, user: user.rows[0] as unknown as User }
  } catch (error) {
    console.error(error)
    return { success: false, error }
  }
}

export async function update_user(new_user_info: any) {
  try {
    await db.execute({
      sql: `UPDATE users SET username = $login, email = $email, bio = $bio, location = $location, avatar_url = $avatar_url, twitter = $twitter_username, role_id = $role_id WHERE id = $id`,
      args: {
        id: new_user_info.id,
        login: new_user_info.login,
        email: new_user_info.email,
        bio: new_user_info.bio,
        location: new_user_info.location,
        avatar_url: new_user_info.avatar_url,
        twitter_username: new_user_info.twitter_username,
        role_id: new_user_info.role_id
      },
    });

    return { success: true }
  } catch (error) {
    console.error(error)
    return { success: false, error }
  }
}

export async function get_user_by_session_id(sessionId: string) {
  const user = await db.execute({
    sql: `SELECT * FROM users WHERE id = (SELECT user_id FROM sessions WHERE session_token = ?)`,
    args: [sessionId],
  });
  return user.rows[0];
}