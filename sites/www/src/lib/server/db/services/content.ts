import { db } from '../';
import { sql, eq, type InferSelectModel } from 'drizzle-orm';
import { content, contentToTags } from '../schema';
import { handleServiceCall } from './utils';

type CreateContent = Omit<InferSelectModel<typeof content>, 'id' | 'created_at' | 'updated_at'> & { tags: number[] };
type UpdateContent = Partial<CreateContent>;

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

	private countContentStatement = db
		.select({ count: sql<number>`count(*)` })
		.from(content)
		.prepare();

	private findManyContentStatement = db.query.content.findMany().prepare();

	async get_content_items() {
		return handleServiceCall(async () => (await this.findManyContentStatement.get()) || []);
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
				// Create the content
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

				// If there are tags, create the relationships
				if (content_info.tags && content_info.tags.length > 0) {
					await tx.insert(contentToTags).values(
						content_info.tags.map(tagId => ({
							content_id: newContent.id,
							tag_id: tagId
						}))
					);
				}

				// Fetch the content with its tags
				const contentWithTags = await tx.query.content.findFirst({
					where: eq(content.id, newContent.id),
					with: {
						tags: {
							columns: {
								tag_id: true
							}
						}
					}
				});

				return {
					...contentWithTags,
					tags: contentWithTags?.tags.map(t => t.tag_id) ?? []
				};
			});
		});
	}

	async update_content(id: number, update_info: UpdateContent) {
		return handleServiceCall(async () => {
			return await db.transaction(async (tx) => {
				// Update the content
				const [updatedContent] = await tx
					.update(content)
					.set({
						...update_info,
						updated_at: new Date()
					})
					.where(eq(content.id, id))
					.returning();

				// If tags are provided, update the relationships
				if (update_info.tags !== undefined) {
					// Remove existing tag relationships
					await tx
						.delete(contentToTags)
						.where(eq(contentToTags.content_id, id));

					// Add new tag relationships
					if (update_info.tags.length > 0) {
						await tx.insert(contentToTags).values(
							update_info.tags.map(tagId => ({
								content_id: id,
								tag_id: tagId
							}))
						);
					}
				}

				// Fetch the updated content with its tags
				const contentWithTags = await tx.query.content.findFirst({
					where: eq(content.id, id),
					with: {
						tags: {
							columns: {},
							with: {
								tag: true
							}
						}
					}
				});

				return {
					...contentWithTags,
					tags: contentWithTags?.tags.map(t => t.tag) ?? []
				};
			});
		});
	}


	async delete_content(id: number) {
		return handleServiceCall(async () => {
			return await db.transaction(async (tx) => {
				// First, delete the entries in the content_to_tags table
				await tx
					.delete(contentToTags)
					.where(eq(contentToTags.content_id, id));

				// Then, delete the content itself
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
