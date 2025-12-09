import { ApiResponse } from '@/types/api';
import type { Specialty } from '@/types/doctor';

import { apiClient } from './client';

export const specialtyApi = {
  getSpecialties: async (): Promise<Specialty[]> => {
    const response = await apiClient.get<ApiResponse<Specialty[]>>(
      '/specialties/public'
    );
    return response.data.data;
  },
};
