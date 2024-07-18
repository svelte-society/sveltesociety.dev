import { contentService } from '$lib/server/db/services/content';
import { json } from '@sveltejs/kit';

// Rate limit configuration
const RATE_LIMIT = 3; // Number of requests allowed
const TIME_WINDOW = 10 * 1000; // Time window in milliseconds (1 minute)

// In-memory store for rate limiting
const rateLimitStore = new Map<string, { count: number; timestamp: number }>();

export const GET = async ({ params, getClientAddress }) => {
    if (!rateLimit(getClientAddress())) {
        return json({ error: 'Rate limit exceeded' }, { status: 429 });
    }
    const { data } = await contentService.searchContent(params.query)

    return json(data)
};

function rateLimit(ip: string): boolean {
    const now = Date.now();
    const userRateLimit = rateLimitStore.get(ip);

    if (!userRateLimit) {
        rateLimitStore.set(ip, { count: 1, timestamp: now });
        return true;
    }

    if (now - userRateLimit.timestamp > TIME_WINDOW) {
        rateLimitStore.set(ip, { count: 1, timestamp: now });
        return true;
    }

    if (userRateLimit.count < RATE_LIMIT) {
        rateLimitStore.set(ip, { count: userRateLimit.count + 1, timestamp: userRateLimit.timestamp });
        return true;
    }

    return false;
}