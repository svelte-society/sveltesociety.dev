export type Content = {
    id: number;
    title: string;
    type: string;
    body: string;
    rendered_body: string;
    slug: string;
    description: string;
    children: string;
    created_at: string;
    updated_at: string;
    published_at: string | null;
    likes: number;
    saves: number;
};

export type Tag = {
    id: number;
    name: string;
    slug: string;
    color: string | null;
};

export type ContentWithTags = Content & { tags: Tag[] };

export type PaginatedContentResult = {
    items: ContentWithTags[];
    totalCount: number;
    page: number;
    limit: number;
    totalPages: number;
};