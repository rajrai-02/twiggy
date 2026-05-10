import { apiSlice } from '../apiSlice';

export const deliveryApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDeliveryDashboardStats: builder.query({
      query: () => '/delivery/dashboard',
      providesTags: ['Delivery'],
    }),
    getTodayRuns: builder.query({
      query: () => '/delivery/runs/today',
      providesTags: ['Delivery'],
    }),
  }),
});

export const {
  useGetDeliveryDashboardStatsQuery,
  useGetTodayRunsQuery,
} = deliveryApiSlice;
