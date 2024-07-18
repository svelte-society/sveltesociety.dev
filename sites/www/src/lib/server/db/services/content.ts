import { db } from '../';
import { sql, eq, inArray, type InferSelectModel } from 'drizzle-orm';
import { content, contentToTags, tags, likes } from '../schema';
import { handleServiceCall } from './utils';
import { nanoid } from 'nanoid';

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

	private getUserLikesStatement = db.query.likes
		.findMany({
			where: (likes, { eq, and, inArray }) => and(
				eq(likes.user_id, sql.placeholder('user_id')),
				inArray(likes.target_id, sql.placeholder('target_ids'))
			),
			columns: {
				target_id: true
			}
		}).prepare()

	private countContentStatement = db
		.select({ count: sql<number>`count(*)` })
		.from(content)
		.prepare();

	private findContentByTagSlugStatement = db.query.content
		.findMany({
			limit: sql.placeholder('limit'),
			offset: sql.placeholder('offset'),
			where: inArray(content.id,
				db.select({ id: contentToTags.content_id })
					.from(contentToTags)
					.innerJoin(tags, eq(contentToTags.tag_id, tags.id))
					.where(eq(tags.slug, sql.placeholder('tagSlug')))
			),
			with: {
				tags: {
					columns: {},
					with: {
						tag: true
					}
				}
			},
			orderBy: (content, { desc }) => [desc(content.created_at)]
		})
		.prepare();

	private countContentByTagSlugStatement = db
		.select({ count: sql<number>`count(distinct ${content.id})` })
		.from(content)
		.innerJoin(contentToTags, eq(content.id, contentToTags.content_id))
		.innerJoin(tags, eq(contentToTags.tag_id, tags.id))
		.where(eq(tags.slug, sql.placeholder('tagSlug')))
		.prepare();

	async get_content_items({ limit = 10, page = 0, user_id }: { limit?: number, page?: number, user_id?: number }) {
		return handleServiceCall(async () => {
			const offset = page * limit;

			const [contentItems, countResult] = await db.batch([
				db.query.content
					.findMany({
						limit,
						offset,
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
							likes: true
						},
						orderBy: (content, { desc }) => [desc(content.created_at)]
					}),
				db
					.select({ count: sql<number>`count(*)` })
					.from(content)
			])

			let user_likes: Set<string> = new Set()

			// Check if user has liked content or not.
			if (user_id) {
				const target_ids = contentItems.map(item => item.id);

				const userLikes = await db.query.likes.findMany({
					where: (likes, { and, eq, inArray }) => and(
						eq(likes.user_id, user_id),
						inArray(likes.target_id, target_ids)
					),
					columns: {
						target_id: true
					}
				});

				user_likes = new Set(userLikes.map(like => like.target_id));
			}



			const totalCount = countResult[0]?.count ?? 0;

			return {
				items: contentItems.map(item => ({
					...item,
					tags: item.tags.map(t => t.tag),
					liked: user_likes.has(item.id)
				})),
				totalCount,
				page,
				limit,
				totalPages: Math.ceil(totalCount / limit)
			};
		});
	}

	async searchContent(query: string) {
		return handleServiceCall(async () => {
			const searchContentStatement = sql`
				SELECT 
				content.id,
				content.title,
				content.type,
				content.description,
				content.body,
				content.slug,
				GROUP_CONCAT(DISTINCT tags.name) AS tag_names,
				GROUP_CONCAT(DISTINCT tags.slug) AS tag_slugs,
				GROUP_CONCAT(DISTINCT users.username) AS authors
				FROM content_fts
				JOIN content ON content.id = content_fts.content_id
				LEFT JOIN content_to_tags ON content.id = content_to_tags.content_id
				LEFT JOIN tags ON content_to_tags.tag_id = tags.id
				LEFT JOIN content_to_users ON content.id = content_to_users.content_id
				LEFT JOIN users ON content_to_users.user_id = users.id
				WHERE content_fts MATCH ${query + '*'}
				GROUP BY content.id
				ORDER BY rank
				LIMIT 10
			`;
			const result = await db.run(searchContentStatement)

			return result.rows.map(result => ({
				id: result.id,
				title: result.title,
				type: result.type,
				description: result.description,
				slug: result.slug,
				body: result.body,
				tags: result.tag_slugs ? result.tag_slugs.split(',').map((slug, index) => ({
					slug,
					name: result?.tag_names?.split(',')[index]
				})) : [],
				authors: result.authors ? result.authors.split(',') : []
			}));
		});
	}

	async get_content_by_tag(tagSlug: string, limit: number = 10, page: number = 0) {
		return handleServiceCall(async () => {
			const offset = page * limit;

			const [contentItems, countResult] = await Promise.all([
				this.findContentByTagSlugStatement.execute({ tagSlug, limit, offset }),
				this.countContentByTagSlugStatement.execute({ tagSlug })
			]);

			const totalCount = countResult[0]?.count ?? 0;

			return {
				items: contentItems.map(item => ({
					...item,
					tags: item.tags.map(t => t.tag)
				})),
				totalCount,
				page,
				limit,
				totalPages: Math.ceil(totalCount / limit)
			};
		});
	}

	async get_content_count() {
		return handleServiceCall(async () => {
			const result = await this.countContentStatement.get();
			if (!result) {
				throw new Error('Failed to get content count');
			}
			return result.count;
		});
	}

	async get_content(id: string) {
		return handleServiceCall(async () => {
			const result = await this.findContentWithTagsStatement.execute({ id });

			console.log(result)

			if (!result) return null;

			return {
				...result,
				tags: result.tags.map(t => t.tag)
			};
		});
	}

	async create_content(content_info: CreateContent) {
		return handleServiceCall(async () => {
			let id = nanoid()

			const insertContentQuery = db
				.insert(content)
				.values({
					id,
					title: content_info.title,
					type: content_info.type,
					body: content_info.body,
					slug: content_info.slug,
					description: content_info.description,
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

	async update_content(id: string, update_info: UpdateContent) {
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

	async delete_content(id: string) {
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


// Export the singleton instance
export const contentService = ContentService.getInstance();

// Re-export the UpdateContent type for use in other files
export type { UpdateContent };
