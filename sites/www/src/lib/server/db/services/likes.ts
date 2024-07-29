// sites/www/src/lib/server/db/services/likes.ts

import { db } from '$lib/server/db';
import { likes } from '$lib/server/db/schema';
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

    async like(user_id: number, target_id: number): Promise<ServiceResult<void>> {
        return handleServiceCall(async () => {
            await this.like_statement.execute({
                user_id,
                target_id
            })
        });
    }

    async unlike(user_id: number, target_id: number): Promise<ServiceResult<void>> {
        return handleServiceCall(async () => {
            await this.unlike_statement.execute({ user_id, target_id });
        });
    }
}

export const likeService = LikeService.get_instance();