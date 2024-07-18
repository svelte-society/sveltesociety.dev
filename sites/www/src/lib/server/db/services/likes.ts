// sites/www/src/lib/server/db/services/likes.ts

import { db } from '$lib/server/db';
import { likes, content, collections, users } from '$lib/server/db/schema';
import { eq, and, sql } from 'drizzle-orm';
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

    private like_statement = db.insert(likes)
        .values({
            user_id: sql.placeholder('user_id'),
            target_id: sql.placeholder('target_id'),
        })
        .onConflictDoNothing()
        .prepare();

    private unlike_statement = db.delete(likes)
        .where(
            and(
                eq(likes.user_id, sql.placeholder('user_id')),
                eq(likes.target_id, sql.placeholder('target_id')))
        ).prepare()

    private has_user_liked_statement = db.select()
        .from(likes)
        .where(and(
            eq(likes.user_id, sql.placeholder('user_id')),
            eq(likes.target_id, sql.placeholder('target_id'))
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

    async like(user_id: number, target_id: string): Promise<ServiceResult<void>> {
        return handleServiceCall(async () => {
            await this.like_statement.execute({
                user_id,
                target_id
            })
        });
    }

    async unlike(user_id: number, target_id: string): Promise<ServiceResult<void>> {
        return handleServiceCall(async () => {
            await this.unlike_statement.execute({ user_id, target_id });
        });
    }

    async has_user_liked(user_id: number, target_id: string): Promise<ServiceResult<boolean>> {
        return handleServiceCall(async () => {
            const result = await this.has_user_liked_statement.execute({ user_id, target_id });
            return result.length > 0;
        });
    }

    async get_content_likes(content_id: string): Promise<ServiceResult<number>> {
        return handleServiceCall(async () => {
            const result = await this.get_content_likes_statement.execute({ content_id });
            return result[0]?.likes ?? 0;
        });
    }

    async get_collection_likes(collection_id: string): Promise<ServiceResult<number>> {
        return handleServiceCall(async () => {
            const result = await this.get_collection_likes_statement.execute({ collection_id });
            return result[0]?.likes ?? 0;
        });
    }
}

export const likeService = LikeService.get_instance();