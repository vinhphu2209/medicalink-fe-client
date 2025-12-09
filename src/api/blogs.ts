import { ApiResponse } from '@/types/api';
import type {
  Blog,
  BlogCategory,
  BlogListParams,
  BlogListResponse,
} from '@/types/blog';

import { apiClient } from './client';

export const blogApi = {
  getCategories: async (): Promise<BlogCategory[]> => {
    const response =
      await apiClient.get<ApiResponse<BlogCategory[]>>('/blogs/categories');
    return response.data.data;
  },

  getPublicBlogs: async (params: BlogListParams): Promise<BlogListResponse> => {
    const response = await apiClient.get<BlogListResponse>('/blogs/public', {
      params,
    });
    return response.data;
  },

  getBlogBySlug: async (slug: string): Promise<Blog> => {
    const response = await apiClient.get<ApiResponse<Blog>>(
      `/blogs/public/${slug}`
    );
    return response.data.data;
  },
};
