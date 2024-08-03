import { get_moderation_queue_paginated, update_moderation_status, get_moderation_queue_count_filtered } from '$lib/server/db/moderation';
import type { PageServerLoad, Actions } from './$types';
import { error, redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ url }) => {
    const page = Number(url.searchParams.get('page') || '1');
    const itemsPerPage = 10;

    const totalItems = await get_moderation_queue_count_filtered({ status: 'pending' });
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    // Validate page number
    if (page < 1 || page > totalPages) {
        throw redirect(302, '/admin/');
    }

    const items = await get_moderation_queue_paginated({
        status: 'pending',
        limit: itemsPerPage,
        offset: (page - 1) * itemsPerPage
    });


    return {
        items,
        page,
        totalPages,
        totalItems
    };
};

export const actions: Actions = {
    approve: async ({ request, locals }) => {
        const data = await request.formData();
        const id = Number(data.get('id'));
        await update_moderation_status(id, 'approved', locals.user.id);
        return { success: true };
    },
    reject: async ({ request, locals }) => {
        const data = await request.formData();
        const id = Number(data.get('id'));
        await update_moderation_status(id, 'rejected', locals.user.id);
        return { success: true };
    },
    rejectSelected: async ({ request }) => {
        const data = await request.formData();
        const ids = data.getAll('selectedIds').map(Number);
        for (const id of ids) {
            await update_moderation_status(id, 'rejected', 1); // Replace 1 with actual user ID
        }
        return { success: true };
    }
};