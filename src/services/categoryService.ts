import api from '@/lib/api';
import type { ApiResponse, Category } from '@/lib/types';

export const getCategories = async () => {
  const { data } = await api.get<ApiResponse<Category[]>>('/categories');
  return data;
};
