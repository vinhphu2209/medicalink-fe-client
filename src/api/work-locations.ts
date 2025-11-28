import { apiClient } from './client';

export interface WorkLocation {
  id: string;
  name: string;
  address: string;
  phone: string;
  timezone: string;
  googleMapUrl: string | null;
}

interface WorkLocationsResponse {
  success?: boolean;
  message?: string;
  data: WorkLocation[];
}

export const getWorkLocations = async (): Promise<WorkLocation[]> => {
  const response = await apiClient.get<WorkLocationsResponse>(
    '/work-locations/public'
  );
  return response.data.data;
};
