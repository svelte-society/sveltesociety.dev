// Type for standardized return format
export interface ServiceResult<T> {
    success: boolean;
    data?: T;
    error?: unknown;
}

// Helper function to handle errors
export async function handleServiceCall<T>(serviceCall: () => Promise<T>): Promise<ServiceResult<T>> {
    try {
        const data = await serviceCall();

        return { success: true, data: data ?? undefined };
    } catch (error) {
        console.error(error);
        return { success: false, error };
    }
}