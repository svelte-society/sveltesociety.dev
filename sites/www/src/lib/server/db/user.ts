import { db } from './index'

interface GitHubUserInfo {
    id: number;
    email?: string;
    name?: string;
    login: string;
    avatar_url?: string;
    bio?: string;
    location?: string;
    twitter_username?: string;
}

export interface User {
    id: number;
    github_id: number;
    email: string | null;
    username: string;
    name: string | null;
    avatar_url: string | null;
    bio: string | null;
    location: string | null;
    twitter: string | null;
    role: number;
}

export const get_user = (id: number): User | undefined => {
    const stmt = db.prepare(`
      SELECT * FROM users
      WHERE id = @id
    `);

    try {
        return stmt.get({ id }) as User;
    } catch (error) {
        console.error('Error getting user:', error);
        return undefined;
    }
}

export const get_users = (): User[] => {
    console.warn('get_users: No limit provided, risk of memory exhaustion')
    const stmt = db.prepare(`
      SELECT * FROM users
    `);

    try {
        return stmt.all() as User[];
    } catch (error) {
        console.error('Error getting users:', error);
        return []
    }
}

export const get_user_count = (): Number => {
    const stmt = db.prepare(`
      SELECT COUNT(*) as count
      FROM users
    `);

    try {
        const result = stmt.get() as { count: number };
        return result.count;
    } catch (error) {
        console.error('Error getting user:', error);
        return 0;
    }
}

export const create_or_update_user = (githubInfo: GitHubUserInfo): User => {
    const userInfo = extractGithubUserInfo(githubInfo);

    const stmt = db.prepare(`
      INSERT INTO users (github_id, email, username, name, avatar_url, bio, location, twitter)
      VALUES (@github_id, @email, @username, @name, @avatar_url, @bio, @location, @twitter)
      ON CONFLICT (github_id) DO UPDATE SET
        email = @email,
        name = @name,
        username = @username,
        avatar_url = @avatar_url,
        bio = @bio,
        location = @location,
        twitter = @twitter
      RETURNING *
    `);

    try {
        return stmt.get(userInfo) as User;
    } catch (error) {
        console.error('Error upserting user:', error);
        throw error;
    }
}


function extractGithubUserInfo(info: GitHubUserInfo): Omit<User, 'id' | 'role'> {
    return {
        github_id: info.id,
        email: info.email || null,
        username: info.login,
        name: info.name || null,
        avatar_url: info.avatar_url || null,
        bio: info.bio || null,
        location: info.location || null,
        twitter: info.twitter_username || null,
    };
}
