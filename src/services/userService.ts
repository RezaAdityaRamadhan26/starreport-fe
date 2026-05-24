import api from '@/lib/api';
import type { ApiResponse, User } from '@/lib/types';

export const getUsers = async () => {
  const { data } = await api.get<ApiResponse<User[]>>('/users');
  return data;
};

export const getUserDetail = async (id: number | string) => {
  const { data } = await api.get<ApiResponse<User>>(`/users/${id}`);
  return data;
};

export const changeUserRole = async (id: number | string, role: string) => {
  const { data } = await api.put<ApiResponse>(`/users/${id}/role`, { role });
  return data;
};

export const deleteUser = async (id: number | string) => {
  const { data } = await api.delete<ApiResponse>(`/users/${id}`);
  return data;
};
