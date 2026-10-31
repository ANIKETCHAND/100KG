/**
 * 100KG Performance OS — API Client & Response Types
 */

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}

export interface ApiPagination {
  page: number;
  pageSize: number;
  total: number;
}
