import { db } from "../";
import { sql, eq, type InferSelectModel } from "drizzle-orm";
import { collections } from "../schema";
import { handleServiceCall } from "./utils";

type UpdateCollection = Omit<InferSelectModel<typeof collections>, 'id' | 'created_at' | 'updated_at'>;

export class CollectionsService {
    private static instance: CollectionsService;

    private constructor() { }

    public static getInstance(): CollectionsService {
        if (!CollectionsService.instance) {
            CollectionsService.instance = new CollectionsService();
        }
        return CollectionsService.instance;
    }

    private findCollectionStatement = db.query.collections.findFirst({
        where: (collection, { eq }) => eq(collection.id, sql.placeholder('id')),
    }).prepare();

    private countCollectionsStatement = db
        .select({ count: sql<number>`count(*)` })
        .from(collections)
        .prepare();

    private findManyCollectionsStatement = db.query.collections.findMany().prepare();

    async get_collections() {
        return handleServiceCall(async () => await this.findManyCollectionsStatement.get() || []);
    }

    async get_collection_count() {
        return handleServiceCall(async () => {
            const result = await this.countCollectionsStatement.get();
            if (!result) {
                throw new Error('Failed to get collection count');
            }
            return result.count;
        });
    }

    async get_collection(collectionId: number) {
        return handleServiceCall(async () => await this.findCollectionStatement.get({ id: collectionId }));
    }

    async create_collection(collection_info: UpdateCollection) {
        return handleServiceCall(async () => {
            const [collection] = await db.insert(collections).values(collection_info).returning();
            return collection;
        });
    }

    async update_collection(id: number, new_collection_info: UpdateCollection) {
        return handleServiceCall(async () => {
            const [collection] = await db.update(collections).set(new_collection_info).where(eq(collections.id, id)).returning();
            return collection;
        });
    }

    async delete_collection(id: number) {
        return handleServiceCall(async () => {
            await db.delete(collections).where(eq(collections.id, id));
        });
    }
}

// Export the singleton instance
export const collectionsService = CollectionsService.getInstance();

// Re-export the UpdateCollection type for use in other files
export type { UpdateCollection };