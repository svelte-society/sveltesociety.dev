import { db } from "../";
import { sql, eq, and, type InferSelectModel } from "drizzle-orm";
import { tags, contentToTags, content } from "../schema";
import { handleServiceCall } from "./utils";

type UpdateTag = Omit<InferSelectModel<typeof tags>, 'id' | 'created_at' | 'updated_at'>;

export class TagService {
    private static instance: TagService;

    private constructor() { }

    public static getInstance(): TagService {
        if (!TagService.instance) {
            TagService.instance = new TagService();
        }
        return TagService.instance;
    }

    private findTagStatement = db.query.tags.findFirst({
        where: (tags, { eq }) => eq(tags.id, sql.placeholder('id')),
    }).prepare();

    private countTagsStatement = db
        .select({ count: sql<number>`count(*)` })
        .from(tags)
        .prepare();

    private findManyTagsStatement = db.query.tags.findMany().prepare();

    async get_tags() {
        return handleServiceCall(async () => await this.findManyTagsStatement.get() || []);
    }

    async get_tags_count() {
        return handleServiceCall(async () => {
            const result = await this.countTagsStatement.get();
            if (!result) {
                throw new Error('Failed to get tags count');
            }
            return result.count;
        });
    }

    async get_tag(tagId: number) {
        return handleServiceCall(async () => await this.findTagStatement.get({ id: tagId }));
    }

    async create_tag(tag_info: UpdateTag) {
        return handleServiceCall(async () => {
            const [tagItem] = await db.insert(tags).values(tag_info).returning();
            return tagItem;
        });
    }

    async update_tag(id: number, new_tag_info: UpdateTag) {
        return handleServiceCall(async () => {
            const [tagItem] = await db.update(tags).set(new_tag_info).where(eq(tags.id, id)).returning();
            return tagItem;
        });
    }

    async get_content_by_tag_slug(slug: string) {
        return handleServiceCall(async () => {
            const result = await db
                .select({
                    tag: {
                        id: tags.id,
                        name: tags.name,
                        slug: tags.slug,
                        color: tags.color,
                    },
                    content: {
                        id: content.id,
                        title: content.title,
                        slug: content.slug,
                        description: content.description,
                        body: content.body,
                        created_at: content.created_at,
                        updated_at: content.updated_at,
                    }
                })
                .from(tags)
                .leftJoin(contentToTags, eq(contentToTags.tag_id, tags.id))
                .leftJoin(content, eq(content.id, contentToTags.content_id))
                .where(eq(tags.slug, slug));

            if (result.length === 0) {
                throw new Error(`Tag with slug "${slug}" not found`);
            }

            const tag = result[0].tag;
            const contentItems = result
                .filter(item => item?.content?.id !== null)
                .map(item => item.content);

            return { tag, content: contentItems };
        });
    }

    async delete_tag(id: number) {
        return handleServiceCall(async () => {
            await db.delete(tags).where(eq(tags.id, id));
        });
    }

    async get_tags_for_content(contentId: number) {
        return handleServiceCall(async () => {
            const result = await db
                .select({
                    id: tags.id,
                    name: tags.name,
                    slug: tags.slug,
                    color: tags.color,
                })
                .from(tags)
                .innerJoin(contentToTags, eq(contentToTags.tag_id, tags.id))
                .where(eq(contentToTags.content_id, contentId));
            return result;
        });
    }

    async add_tag_to_content(contentId: number, tagId: number) {
        return handleServiceCall(async () => {
            await db.insert(contentToTags).values({ content_id: contentId, tag_id: tagId });
        });
    }

    async remove_tag_from_content(contentId: number, tagId: number) {
        return handleServiceCall(async () => {
            await db.delete(contentToTags)
                .where(and(eq(contentToTags.content_id, contentId), eq(contentToTags.tag_id, tagId)));
        });
    }

    async get_content_by_tag(tagId: number) {
        return handleServiceCall(async () => {
            const result = await db
                .select({
                    id: content.id,
                    title: content.title,
                    slug: content.slug,
                    description: content.description,
                    body: content.body,
                    created_at: content.created_at,
                    updated_at: content.updated_at,
                })
                .from(content)
                .innerJoin(contentToTags, eq(contentToTags.content_id, content.id))
                .where(eq(contentToTags.tag_id, tagId));
            return result;
        });
    }
}

// Export the singleton instance
export const tagService = TagService.getInstance();

// Re-export the UpdateTag type for use in other files
export type { UpdateTag };