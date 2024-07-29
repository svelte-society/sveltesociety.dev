import { db } from '../';
import { sql, eq, inArray, type InferSelectModel } from 'drizzle-orm';
import { content, contentToTags, tags, likes, saves } from '../schema';
import { handleServiceCall } from './utils';

type CreateContent = Omit<InferSelectModel<typeof content>, 'id' | 'created_at' | 'updated_at'> & { tags: number[] };
type UpdateContent = Partial<CreateContent>;

export type ContentWithTags = InferSelectModel<typeof content> & { tags: InferSelectModel<typeof tags>[] };
export type PaginatedContentResult = {
	items: ContentWithTags[];
	totalCount: number;
	page: number;
	limit: number;
	totalPages: number;
};

export class ContentService {
	private static instance: ContentService;

	private constructor() { }

	public static getInstance(): ContentService {
		if (!ContentService.instance) {
			ContentService.instance = new ContentService();
		}
		return ContentService.instance;
	}

	private findContentWithTagsStatement = db.query.content
		.findFirst({
			where: (content, { eq }) => eq(content.id, sql.placeholder('id')),
			with: {
				tags: {
					columns: {},
					with: {
						tag: true
					}
				}
			}
		})
		.prepare();

	private async get_user_likes_and_saves(user_id: number | undefined, content_ids: number[]) {
		if (!user_id || content_ids.length === 0) {
			return { user_likes: new Set<number>(), user_saves: new Set<number>() };
		}

		const [userLikes, userSaves] = await Promise.all([
			db.query.likes.findMany({
				where: (likes, { and, eq, inArray }) => and(
					eq(likes.user_id, user_id),
					inArray(likes.target_id, content_ids)
				),
				columns: {
					target_id: true
				}
			}),
			db.query.saves.findMany({
				where: (saves, { and, eq, inArray }) => and(
					eq(saves.user_id, user_id),
					inArray(saves.target_id, content_ids)
				),
				columns: {
					target_id: true
				}
			})
		]);

		return {
			user_likes: new Set(userLikes.map(like => like.target_id)),
			user_saves: new Set(userSaves.map(save => save.target_id))
		};
	}

	async get_content_items({ limit = 10, page = 0, user_id }: { limit?: number, page?: number, user_id?: number }) {
		return handleServiceCall(async () => {
			const offset = page * limit;

			const [content_result, [{ count: totalCount }]] = await Promise.all([
				db.query.content.findMany({
					with: {
						tags: {
							columns: {},
							with: {
								tag: true
							}
						}
					},
					columns: {
						id: true,
						title: true,
						type: true,
						slug: true,
						description: true,
						created_at: true,
						updated_at: true,
						likes: true,
						saves: true,
					},
					limit,
					offset,
					orderBy: (content, { desc }) => [desc(content.created_at)]
				}),
				db.select({ count: sql<number>`count(*)` }).from(content)
			]);

			if (content_result.length === 0) {
				return { items: [], totalCount: 0, page, limit, totalPages: 0 };
			}

			const content_ids = content_result.map(item => item.id);
			const { user_likes, user_saves } = await this.get_user_likes_and_saves(user_id, content_ids);

			const items = content_result.map(item => ({
				...item,
				tags: item.tags.map(tagRelation => tagRelation.tag),
				liked: user_likes.has(item.id),
				saved: user_saves.has(item.id),
			}));

			return {
				items,
				totalCount,
				page,
				limit,
				totalPages: Math.ceil(totalCount / limit)
			};
		});
	}

	async get_user_saved_content(user_id: number, limit: number = 10, page: number = 0) {
		return handleServiceCall(async () => {
			const offset = page * limit;

			const savedContentQuery = db.query.saves.findMany({
				where: (saves, { eq }) => eq(saves.user_id, user_id),
				limit,
				offset,
				with: {
					content: {
						with: {
							tags: {
								columns: {},
								with: {
									tag: true
								}
							}
						},
						columns: {
							id: true,
							title: true,
							type: true,
							slug: true,
							description: true,
							created_at: true,
							updated_at: true,
							likes: true,
							saves: true
						},
					}
				},
				orderBy: (saves, { desc }) => [desc(saves.created_at)]
			});

			const countSavedContentQuery = db
				.select({ count: sql<number>`count(*)` })
				.from(saves)
				.where(eq(saves.user_id, user_id));

			const [savedContentItems, [{ count: totalCount }]] = await Promise.all([
				savedContentQuery,
				countSavedContentQuery
			]);

			const content_ids = savedContentItems.map(item => item.content.id);

			// Use the private function to get likes and saves
			const { user_likes } = await this.get_user_likes_and_saves(user_id, content_ids);

			return {
				items: savedContentItems.map(item => ({
					...item.content,
					tags: item.content.tags.map(t => t.tag),
					liked: user_likes.has(item.content.id),
					saved: true // All items are saved as this is a saved content query
				})),
				totalCount,
				page,
				limit,
				totalPages: Math.ceil(totalCount / limit)
			};
		});
	}

	async searchContent(query: string, options: {
		limit?: number,
		offset?: number,
		sortBy?: 'relevance' | 'date' | 'popularity',
		user_id?: number
	}) {
		return handleServiceCall(async () => {
			const { limit = 10, offset = 0, sortBy = 'relevance', user_id } = options;

			const orderByClause = {
				'relevance': 'ORDER BY rank',
				'date': 'ORDER BY content.created_at DESC',
				'popularity': 'ORDER BY (content.likes + content.saves) DESC'
			}[sortBy];

			const searchContentStatement = sql`
				SELECT 
				content.id,
				content.title,
				content.type,
				content.description,
				content.body,
				content.slug,
				content.likes,
				content.saves,
				content.created_at,
				GROUP_CONCAT(DISTINCT tags.name) AS tag_names,
				GROUP_CONCAT(DISTINCT tags.slug) AS tag_slugs,
				GROUP_CONCAT(DISTINCT users.username) AS authors
				FROM content_fts
				JOIN content ON content.id = content_fts.content_id
				LEFT JOIN content_to_tags ON content.id = content_to_tags.content_id
				LEFT JOIN tags ON content_to_tags.tag_id = tags.id
				LEFT JOIN content_to_users ON content.id = content_to_users.content_id
				LEFT JOIN users ON content_to_users.user_id = users.id
				WHERE content_fts MATCH ${sanitizeQuery(query) + '*'}
				GROUP BY content.id
				${sql.raw(orderByClause)}
				LIMIT ${limit}
				OFFSET ${offset}
			`;
			const result = await db.run(searchContentStatement);

			let user_likes: Set<number> = new Set();
			let user_saves: Set<number> = new Set();

			// Check if user has liked or saved content or not.
			if (user_id) {
				const target_ids = result.rows.map(item => item.id) as number[];

				const [userLikes, userSaves] = await db.batch([
					db.query.likes.findMany({
						where: (likes, { and, eq, inArray }) => and(
							eq(likes.user_id, user_id),
							inArray(likes.target_id, target_ids)
						),
						columns: {
							target_id: true
						}
					}),
					db.query.saves.findMany({
						where: (saves, { and, eq, inArray }) => and(
							eq(saves.user_id, user_id),
							inArray(saves.target_id, target_ids)
						),
						columns: {
							target_id: true
						}
					})
				]);

				user_likes = new Set(userLikes.map(like => like.target_id));
				user_saves = new Set(userSaves.map(save => save.target_id));
			}

			return result.rows.map(result => ({
				id: result.id,
				title: result.title,
				type: result.type,
				description: result.description,
				slug: result.slug,
				likes: result.likes,
				saves: result.saves,
				tags: result.tag_slugs ? result.tag_slugs.split(',').map((slug, index) => ({
					slug,
					name: result?.tag_names?.split(',')[index]
				})) : [],
				liked: user_likes.has(result.id),
				saved: user_saves.has(result.id),
				authors: result.authors ? result.authors.split(',') : []
			}));
		});
	}

	async get_content_by_slug(slug: string, user_id?: number) {
		return handleServiceCall(async () => {
			const result = await db.query.content.findFirst({
				where: (content, { eq }) => eq(content.slug, slug),
				with: {
					tags: {
						columns: {},
						with: { tag: true }
					}
				}
			});

			if (!result) return null;

			const { user_likes, user_saves } = await this.get_user_likes_and_saves(user_id, [result.id]);

			return {
				...result,
				tags: result.tags.map(t => t.tag),
				liked: user_likes.has(result.id),
				saved: user_saves.has(result.id)
			};
		});
	}

	async get_content_by_tag({ slug, limit = 10, page = 0, user_id }: { slug: string, limit: number, page: number, user_id?: number }) {
		return handleServiceCall(async () => {
			const offset = page * limit;

			const [contentItems, [{ count: totalCount }]] = await db.batch([
				db.query.content.findMany({
					limit,
					offset,
					where: inArray(content.id,
						db.select({ id: contentToTags.content_id })
							.from(contentToTags)
							.innerJoin(tags, eq(contentToTags.tag_id, tags.id))
							.where(eq(tags.slug, slug))
					),
					columns: {
						id: true,
						title: true,
						type: true,
						slug: true,
						description: true,
						created_at: true,
						updated_at: true,
						likes: true,
						saves: true
					},
					with: {
						tags: {
							columns: {},
							with: { tag: true }
						}
					},
					orderBy: (content, { desc }) => [desc(content.created_at)]
				}),
				db.select({ count: sql<number>`count(distinct ${content.id})` })
					.from(content)
					.innerJoin(contentToTags, eq(content.id, contentToTags.content_id))
					.innerJoin(tags, eq(contentToTags.tag_id, tags.id))
					.where(eq(tags.slug, slug))
			]);

			const content_ids = contentItems.map(item => item.id);
			const { user_likes, user_saves } = await this.get_user_likes_and_saves(user_id, content_ids);

			return {
				items: contentItems.map(item => ({
					...item,
					tags: item.tags.map(t => t.tag),
					liked: user_likes.has(item.id),
					saved: user_saves.has(item.id)
				})),
				totalCount,
				page,
				limit,
				totalPages: Math.ceil(totalCount / limit)
			};
		});
	}

	async get_content(id: number) {
		return handleServiceCall(async () => {
			const result = await this.findContentWithTagsStatement.execute({ id });

			if (!result) return null;

			return {
				...result,
				tags: result.tags.map(t => t.tag)
			};
		});
	}

	async create_content(content_info: CreateContent) {
		return handleServiceCall(async () => {

			const insertContentQuery = db
				.insert(content)
				.values({
					title: content_info.title,
					type: content_info.type,
					status: content_info.status,
					body: content_info.body,
					rendered_body: content_info.rendered_body,
					slug: content_info.slug,
					description: content_info.description,
					metadata: content_info.metadata,
					children: content_info.children,
					published_at: content_info.published_at,
					created_at: new Date(),
					updated_at: new Date()
				})
				.returning();

			const batchQueries = [insertContentQuery];

			if (content_info.tags && content_info.tags.length > 0) {
				const insertTagsQuery = db.insert(contentToTags).values(
					content_info.tags.map(tagId => ({
						content_id: id,
						tag_id: tagId
					}))
				);
				batchQueries.push(insertTagsQuery);
			}

			const [newContentResult] = await db.batch(batchQueries);
			return newContentResult[0];
		});
	}

	async update_content(id: number, update_info: UpdateContent) {
		return handleServiceCall(async () => {
			const updateContentQuery = db
				.update(content)
				.set({
					...update_info,
					updated_at: new Date()
				})
				.where(eq(content.id, id))
				.returning();

			const batchQueries = [updateContentQuery];

			if (update_info.tags !== undefined) {
				const deleteTagsQuery = db
					.delete(contentToTags)
					.where(eq(contentToTags.content_id, id));
				batchQueries.push(deleteTagsQuery);

				if (update_info.tags.length > 0) {
					const insertTagsQuery = db.insert(contentToTags).values(
						update_info.tags.map(tagId => ({
							content_id: id,
							tag_id: tagId
						}))
					);
					batchQueries.push(insertTagsQuery);
				}
			}

			const [updatedContentResult] = await db.batch(batchQueries);
			return updatedContentResult[0];
		});
	}

	async delete_content(id: number) {
		return handleServiceCall(async () => {
			// Start a transaction to ensure all operations succeed or fail together
			return await db.transaction(async (tx) => {
				// 1. Delete likes associated with this content
				await tx
					.delete(likes)
					.where(eq(likes.target_id, id));

				// 2. Delete tags associated with this content
				await tx
					.delete(contentToTags)
					.where(eq(contentToTags.content_id, id));

				// 3. Delete the content itself
				const deletedContent = await tx
					.delete(content)
					.where(eq(content.id, id))
					.returning();

				return deletedContent[0];
			});
		});
	}
}


function sanitizeQuery(query: string): string {
	let sanitized = query.replace(/[^a-zA-Z0-9 ]/g, '');

	sanitized = sanitized.replace(/"/g, '""');

	sanitized = sanitized.split(' ').map(word => `"${word}"`).join(' ');

	return sanitized;
}


// Export the singleton instance
export const contentService = ContentService.getInstance();

// Re-export the UpdateContent type for use in other files
export type { UpdateContent };
