import { collectionsService } from '$lib/server/db/services/collections';
import { fail } from '@sveltejs/kit';

export const load = (async () => {
    const result = await collectionsService.get_collections();
    if (!result.success) {
        return fail(400, { message: 'Error getting collections' });
    }
    return {
        collections: result.data
    }
});

export const actions = {
    default: async ({ request }) => {
        const data = await request.formData();
        const id = data.get('id');
        if (!id) {
            return fail(400, { message: 'No collection id provided.' });
        }
        const collectionId = parseInt(id as string, 10);
        if (isNaN(collectionId)) {
            return fail(400, { message: 'Invalid collection id provided.' });
        }
        const { success } = await collectionsService.delete_collection(collectionId);
        if (!success) {
            return fail(500, { message: 'Something went wrong while deleting the collection.' });
        }
        return { message: `Collection deleted.` };
    }
};