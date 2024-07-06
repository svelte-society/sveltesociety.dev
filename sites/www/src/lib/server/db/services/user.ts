import { db } from '../';
import { sql, eq, type InferSelectModel } from 'drizzle-orm';
import { users, sessions } from '../schema';
import { handleServiceCall } from './utils';

type GitHubUserInfo = {
	id: number;
	login: string;
	email: string | null;
	name: string | null;
	bio: string | null;
	location: string | null;
	avatar_url: string | null;
	twitter_username: string | null;
};

type UpdateUser = Omit<InferSelectModel<typeof users>, 'id' | 'created_at' | 'updated_at'>;

export class UserService {
	private static instance: UserService;

	private constructor() { }

	public static getInstance(): UserService {
		if (!UserService.instance) {
			UserService.instance = new UserService();
		}
		return UserService.instance;
	}
	private findUserByGitHubIdStatement = db.query.users
		.findFirst({
			where: (user, { eq }) => eq(user.github_id, sql.placeholder('id'))
		})
		.prepare();

	private findUserStatement = db.query.users
		.findFirst({
			where: (user, { eq }) => eq(user.id, sql.placeholder('id'))
		})
		.prepare();
	private findUserByNameStatement = db.query.users
		.findMany({
			where: (user, { eq }) => eq(user.id, sql.placeholder('name')),
			limit: 5
		})
		.prepare();

	private findUserBySessionId = db
		.select()
		.from(sessions)
		.innerJoin(users, eq(sessions.user_id, users.id))
		.where(eq(sessions.session_token, sql.placeholder('session_token')))
		.prepare();

	private countUsersStatement = db
		.select({ count: sql<number>`count(*)` })
		.from(users)
		.prepare();

	private findManyUsersStatement = db.query.users.findMany().prepare();

	async get_users() {
		return handleServiceCall(async () => (await this.findManyUsersStatement.get()) || []);
	}

	async get_user_count() {
		return handleServiceCall(async () => {
			const result = await this.countUsersStatement.get();
			if (!result) {
				throw new Error('Failed to get user count');
			}
			return result.count;
		});
	}

	async get_user_by_github_id(github_id: number) {
		return handleServiceCall(
			async () => await this.findUserByGitHubIdStatement.get({ id: github_id })
		);
	}

	async get_user(userId: number) {
		return handleServiceCall(async () => await this.findUserStatement.get({ id: userId }));
	}
	async get_user_by_name(name: string) {
		return handleServiceCall(async () => await this.findUserByNameStatement.get({ name: name }));
	}

	async create_user(github_user_info: GitHubUserInfo) {
		return handleServiceCall(async () => {
			const user_info = this.extract_github_user_info(github_user_info);
			const [user] = await db.insert(users).values({ ...user_info, role_id: 2 }).returning();
			return user;
		});
	}

	async update_user_from_github_info(id: number, new_user_info: GitHubUserInfo) {
		return handleServiceCall(async () => {
			const user_info = this.extract_github_user_info(new_user_info);
			const [user] = await db.update(users).set(user_info).where(eq(users.id, id)).returning();
			return user;
		});
	}

	async update_user(id: number, new_user_info: UpdateUser) {
		return handleServiceCall(async () => {
			const [user] = await db.update(users).set(new_user_info).where(eq(users.id, id)).returning();
			return user;
		});
	}

	async get_user_by_session_id(session_token: string) {
		return handleServiceCall(async () => {
			const result = await this.findUserBySessionId.get({ session_token });
			if (!result?.users) {
				throw new Error('User not found');
			}
			return result.users;
		});
	}

	private extract_github_user_info(github_user_info: GitHubUserInfo) {
		return {
			github_id: github_user_info.id,
			username: github_user_info.login,
			email: github_user_info.email,
			name: github_user_info.name,
			bio: github_user_info.bio,
			location: github_user_info.location,
			avatar_url: github_user_info.avatar_url,
			twitter: github_user_info.twitter_username
		};
	}
}

// Export the singleton instance
export const userService = UserService.getInstance();
