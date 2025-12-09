export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Blog {
  id: string;
  title: string;
  slug: string;
  thumbnailUrl: string;
  authorId: string;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  status: 'PUBLISHED' | 'DRAFT' | 'ARCHIVED'; // Add other statuses if known
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  publicIds: string[];
  authorName: string;
  content?: string; // Content is usually in details only
  viewCount?: number;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface BlogListParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  categorySlug?: string;
  search?: string;
}

// Custom response type including meta since the global ApiResponse might not have it or we need to access it
export interface BlogListResponse {
  success: boolean;
  message: string;
  data: Blog[];
  meta: PaginationMeta;
  timestamp: string;
  path: string;
  method: string;
  statusCode: number;
}
