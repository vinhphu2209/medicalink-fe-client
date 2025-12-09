import type { DoctorListParams, DoctorListResponse } from '@/types/doctor';

import { apiClient } from './client';

export const doctorApi = {
  getDoctors: async (params: DoctorListParams): Promise<DoctorListResponse> => {
    const queryParams: Record<string, any> = { ...params };

    if (params.specialtyIds?.length) {
      queryParams.specialtyIds = params.specialtyIds.join(',');
    }

    if (params.workLocationIds?.length) {
      queryParams.workLocationIds = params.workLocationIds.join(',');
    }

    const response = await apiClient.get<DoctorListResponse>(
      '/doctors/profile/public',
      {
        params: queryParams,
      }
    );
    return response.data;
  },
};
