import { createApi } from '@reduxjs/toolkit/query/react';
import axiosClient from '../api/axiosClient';

const axiosBaseQuery =
  () =>
  async (args) => {
    try {
      const config = typeof args === 'string' ? { url: args, method: 'GET' } : args;
      const result = await axiosClient({
        url: config.url,
        method: config.method || 'GET',
        data: config.data,
        params: config.params,
      });
      return { data: result.data };
    } catch (axiosError) {
      const err = axiosError;
      return {
        error: {
          status: err.response?.status,
          data: err.response?.data || err.message,
        },
      };
    }
  };

export const apiSlice = createApi({
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Provider', 'Delivery', 'Consumer'],
  endpoints: () => ({}),
});
