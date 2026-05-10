import { createApi } from '@reduxjs/toolkit/query/react';
import axiosClient from '../api/axiosClient';

const axiosBaseQuery =
  () =>
  async ({ url, method, data, params }) => {
    try {
      const result = await axiosClient({ url, method, data, params });
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
