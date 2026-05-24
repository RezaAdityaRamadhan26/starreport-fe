import api from '@/lib/api';
import type { ApiResponse, Report, ReportFilters, DashboardStat } from '@/lib/types';

export const getReports = async (filters?: ReportFilters) => {
  const params = new URLSearchParams();
  if (filters?.status) params.append('status', filters.status);
  if (filters?.category_id) params.append('category_id', filters.category_id);
  if (filters?.search) params.append('search', filters.search);
  if (filters?.page) params.append('page', String(filters.page));
  if (filters?.limit) params.append('limit', String(filters.limit));

  const { data } = await api.get<ApiResponse<Report[]>>(`/reports?${params.toString()}`);
  return data;
};

export const getMyReports = async () => {
  const { data } = await api.get<ApiResponse<Report[]>>('/reports/me');
  return data;
};

export const getReportDetail = async (id: number | string) => {
  const { data } = await api.get<ApiResponse<Report>>(`/reports/${id}`);
  return data;
};

export const createReport = async (payload: { header: string; body: string; category_id: number; image?: File; latitude?: number; longitude?: number }) => {
  const formData = new FormData();
  formData.append('header', payload.header);
  formData.append('body', payload.body);
  formData.append('category_id', String(payload.category_id));
  if (payload.image) {
    formData.append('image', payload.image);
  }
  if (payload.latitude !== undefined) {
    formData.append('latitude', String(payload.latitude));
  }
  if (payload.longitude !== undefined) {
    formData.append('longitude', String(payload.longitude));
  }

  const { data } = await api.post<ApiResponse>('/reports', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};

export const changeReportStatus = async (id: number | string, status: string) => {
  const { data } = await api.put<ApiResponse>(`/reports/${id}/status`, { status });
  return data;
};

export const deleteReport = async (id: number | string) => {
  const { data } = await api.delete<ApiResponse>(`/reports/${id}`);
  return data;
};

export const getDashboardStats = async () => {
  const { data } = await api.get<ApiResponse<DashboardStat[]>>('/reports/stats');
  return data;
};
