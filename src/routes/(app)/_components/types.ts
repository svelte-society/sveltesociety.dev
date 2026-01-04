
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

export interface SidebarJob {
    id: string
    slug: string
    title: string
    company_name: string
    company_logo?: string | null
    remote_status: 'remote' | 'hybrid' | 'on-site'
    location?: string | null
    tier_name?: string
}
