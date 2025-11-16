
export interface UpcomingEvent {
    type: string
    slug: string
    title: string
    metadata: {
        startTime: string
        endTime?: string
        location?: string
        url?: string
        presentations: Array<{
            title: string
            presenter: string
            description: string
            videoUrl?: string
        }>
        socialCardUrl?: string
    }
}