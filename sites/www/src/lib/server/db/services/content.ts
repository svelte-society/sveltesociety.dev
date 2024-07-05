import { db } from "../";
import { sql, eq, type InferSelectModel } from "drizzle-orm";
import { content } from "../schema";
import { handleServiceCall } from "./utils";

type UpdateContent = Omit<InferSelectModel<typeof content>, 'id' | 'created_at' | 'updated_at'>;

export class ContentService {
    private static instance: ContentService;

    private constructor() { }

    public static getInstance(): ContentService {
        if (!ContentService.instance) {
            ContentService.instance = new ContentService();
        }
        return ContentService.instance;
    }

    private findContentStatement = db.query.content.findFirst({
        where: (content, { eq }) => eq(content.id, sql.placeholder('id')),
    }).prepare();

    private countContentStatement = db
        .select({ count: sql<number>`count(*)` })
        .from(content)
        .prepare();

    private findManyContentStatement = db.query.content.findMany().prepare();

    async get_content_items() {
        return handleServiceCall(async () => await this.findManyContentStatement.get() || []);
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
        return handleServiceCall(async () => await this.findContentStatement.get({ id: contentId }));
    }

    async create_content(content_info: UpdateContent) {
        return handleServiceCall(async () => {
            const [contentItem] = await db.insert(content).values(content_info).returning();
            return contentItem;
        });
    }

    async update_content(id: number, new_content_info: UpdateContent) {
        return handleServiceCall(async () => {
            const [contentItem] = await db.update(content).set(new_content_info).where(eq(content.id, id)).returning();
            return contentItem;
        });
    }

    async delete_content(id: number) {
        return handleServiceCall(async () => {
            await db.delete(content).where(eq(content.id, id));
        });
    }
}

// Export the singleton instance
export const contentService = ContentService.getInstance();

// Re-export the UpdateContent type for use in other files
export type { UpdateContent };