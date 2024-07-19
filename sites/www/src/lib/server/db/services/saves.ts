// sites/www/src/lib/server/db/services/saves.ts

import { db } from '$lib/server/db';
import { saves } from '$lib/server/db/schema';
import { eq, and, sql } from 'drizzle-orm';
import { handleServiceCall, type ServiceResult } from './utils';

class SaveService {
    private static instance: SaveService;

    private constructor() { }

    public static get_instance(): SaveService {
        if (!SaveService.instance) {
            SaveService.instance = new SaveService();
        }
        return SaveService.instance;
    }

    private save_statement = db.insert(saves)
        .values({
            user_id: sql.placeholder('user_id'),
            target_id: sql.placeholder('target_id'),
        })
        .onConflictDoNothing()
        .prepare();

    private unsave_statement = db.delete(saves)
        .where(
            and(
                eq(saves.user_id, sql.placeholder('user_id')),
                eq(saves.target_id, sql.placeholder('target_id')))
        ).prepare()

    async save(user_id: number, target_id: string): Promise<ServiceResult<void>> {
        return handleServiceCall(async () => {
            await this.save_statement.execute({
                user_id,
                target_id
            })
        });
    }

    async unsave(user_id: number, target_id: string): Promise<ServiceResult<void>> {
        return handleServiceCall(async () => {
            await this.unsave_statement.execute({ user_id, target_id });
        });
    }
}

export const saveService = SaveService.get_instance();
