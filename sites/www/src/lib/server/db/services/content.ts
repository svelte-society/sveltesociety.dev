import { db } from '../';
import { sql, eq, inArray, type InferSelectModel } from 'drizzle-orm';
import { content, contentToTags, tags } from '../schema';
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

	private findManyContentWithTagsStatement = db.query.content
		.findMany({
			limit: sql.placeholder('limit'),
			offset: sql.placeholder('offset'),
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
				updated_at: true
			},
			orderBy: (content, { desc }) => [desc(content.created_at)]
		})
		.prepare();

	private countContentStatement = db
		.select({ count: sql<number>`count(*)` })
		.from(content)
		.prepare();

	async get_content_items(limit: number = 10, page: number = 0) {
		return handleServiceCall(async () => {
			const offset = page * limit;

			const [contentItems, countResult] = await Promise.all([
				this.findManyContentWithTagsStatement.execute({ limit, offset }),
				this.countContentStatement.execute()
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
				JOIN content ON content.id = content_fts.id
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

	async get_content(contentId: number) {
		return handleServiceCall(async () => {
			const result = await this.findContentWithTagsStatement.execute({ id: contentId });

			if (!result) return null;

			return {
				...result,
				tags: result.tags.map(t => t.tag)
			};
		});
	}

	async create_content(content_info: CreateContent) {
		return handleServiceCall(async () => {
			return await db.transaction(async (tx) => {
				const [newContent] = await tx
					.insert(content)
					.values({
						title: content_info.title,
						type: content_info.type,
						body: content_info.body,
						slug: content_info.slug,
						description: content_info.description,
						created_at: new Date(),
						updated_at: new Date()
					})
					.returning();

				if (content_info.tags && content_info.tags.length > 0) {
					await tx.insert(contentToTags).values(
						content_info.tags.map(tagId => ({
							content_id: newContent.id,
							tag_id: tagId
						}))
					);
				}

				return newContent;
			});
		});
	}

	async update_content(id: number, update_info: UpdateContent) {
		return handleServiceCall(async () => {
			return await db.transaction(async (tx) => {
				const [updatedContent] = await tx
					.update(content)
					.set({
						...update_info,
						updated_at: new Date()
					})
					.where(eq(content.id, id))
					.returning();

				if (update_info.tags !== undefined) {
					await tx
						.delete(contentToTags)
						.where(eq(contentToTags.content_id, id));

					if (update_info.tags.length > 0) {
						await tx.insert(contentToTags).values(
							update_info.tags.map(tagId => ({
								content_id: id,
								tag_id: tagId
							}))
						);
					}
				}

				return updatedContent;
			});
		});
	}

	async delete_content(id: number) {
		return handleServiceCall(async () => {
			return await db.transaction(async (tx) => {
				await tx
					.delete(contentToTags)
					.where(eq(contentToTags.content_id, id));

				const [deletedContent] = await tx
					.delete(content)
					.where(eq(content.id, id))
					.returning();

				return deletedContent;
			});
		});
	}
}

// Export the singleton instance
export const contentService = ContentService.getInstance();

// Re-export the UpdateContent type for use in other files
export type { UpdateContent };
