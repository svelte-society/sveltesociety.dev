// sites/www/src/lib/server/db/services/likes.ts

import { db } from '$lib/server/db';
import { likes, content, collections } from '$lib/server/db/schema';
import { eq, and } from 'drizzle-orm';
import { sql } from 'drizzle-orm';
import { handleServiceCall, type ServiceResult } from './utils';

class LikeService {
    private static instance: LikeService;

    private constructor() { }

    public static get_instance(): LikeService {
        if (!LikeService.instance) {
            LikeService.instance = new LikeService();
        }
        return LikeService.instance;
    }

    private like_content_statement = db.insert(likes)
        .values({
            user_id: sql.placeholder('user_id'),
            content_id: sql.placeholder('content_id'),
        })
        .prepare();

    private unlike_content_statement = db.delete(likes)
        .where(and(
            eq(likes.user_id, sql.placeholder('user_id')),
            eq(likes.content_id, sql.placeholder('content_id'))
        ))
        .prepare();

    private like_collection_statement = db.insert(likes)
        .values({
            user_id: sql.placeholder('user_id'),
            collection_id: sql.placeholder('collection_id'),
        })
        .prepare();

    private unlike_collection_statement = db.delete(likes)
        .where(and(
            eq(likes.user_id, sql.placeholder('user_id')),
            eq(likes.collection_id, sql.placeholder('collection_id'))
        ))
        .prepare();

    private has_user_liked_content_statement = db.select()
        .from(likes)
        .where(and(
            eq(likes.user_id, sql.placeholder('user_id')),
            eq(likes.content_id, sql.placeholder('content_id'))
        ))
        .limit(1)
        .prepare();

    private has_user_liked_collection_statement = db.select()
        .from(likes)
        .where(and(
            eq(likes.user_id, sql.placeholder('user_id')),
            eq(likes.collection_id, sql.placeholder('collection_id'))
        ))
        .limit(1)
        .prepare();

    private get_content_likes_statement = db.select({ likes: content.likes })
        .from(content)
        .where(eq(content.id, sql.placeholder('content_id')))
        .limit(1)
        .prepare();

    private get_collection_likes_statement = db.select({ likes: collections.likes })
        .from(collections)
        .where(eq(collections.id, sql.placeholder('collection_id')))
        .limit(1)
        .prepare();

    async like_content(user_id: number, content_id: number): Promise<ServiceResult<void>> {
        return handleServiceCall(async () => {
            await this.like_content_statement.execute({ user_id, content_id });
        });
    }

    async unlike_content(user_id: number, content_id: number): Promise<ServiceResult<void>> {
        return handleServiceCall(async () => {
            await this.unlike_content_statement.execute({ user_id, content_id });
        });
    }

    async like_collection(user_id: number, collection_id: number): Promise<ServiceResult<void>> {
        return handleServiceCall(async () => {
            await this.like_collection_statement.execute({ user_id, collection_id });
        });
    }

    async unlike_collection(user_id: number, collection_id: number): Promise<ServiceResult<void>> {
        return handleServiceCall(async () => {
            await this.unlike_collection_statement.execute({ user_id, collection_id });
        });
    }

    async has_user_liked_content(user_id: number, content_id: number): Promise<ServiceResult<boolean>> {
        return handleServiceCall(async () => {
            const result = await this.has_user_liked_content_statement.execute({ user_id, content_id });
            return result.length > 0;
        });
    }

    async has_user_liked_collection(user_id: number, collection_id: number): Promise<ServiceResult<boolean>> {
        return handleServiceCall(async () => {
            const result = await this.has_user_liked_collection_statement.execute({ user_id, collection_id });
            return result.length > 0;
        });
    }

    async get_content_likes(content_id: number): Promise<ServiceResult<number>> {
        return handleServiceCall(async () => {
            const result = await this.get_content_likes_statement.execute({ content_id });
            return result[0]?.likes ?? 0;
        });
    }

    async get_collection_likes(collection_id: number): Promise<ServiceResult<number>> {
        return handleServiceCall(async () => {
            const result = await this.get_collection_likes_statement.execute({ collection_id });
            return result[0]?.likes ?? 0;
        });
    }
}

export default LikeService.get_instance();
