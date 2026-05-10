import { apiSlice } from '../apiSlice';

export const providerApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProviderDashboardStats: builder.query({
      query: () => '/provider/dashboard',
      providesTags: ['Provider'],
    }),
    getTodayDeliveries: builder.query({
      query: () => '/provider/deliveries/today',
      providesTags: ['Provider'],
    }),
    getProviderMenu: builder.query({
      query: (date) => `/provider/menu/${date}`,
      providesTags: (result, error, date) => [{ type: 'Provider', id: date }],
    }),
    upsertProviderMenu: builder.mutation({
      query: ({ date, ...body }) => ({
        url: `/provider/menu/${date}`,
        method: 'PUT',
        data: body,
      }),
      invalidatesTags: (result, error, { date }) => [{ type: 'Provider', id: date }],
    }),
    getAiMenuSuggestion: builder.mutation({
      query: () => ({
        url: '/provider/ai-suggest',
        method: 'POST',
      }),
    }),
  }),
});

export const {
  useGetProviderDashboardStatsQuery,
  useGetTodayDeliveriesQuery,
  useGetProviderMenuQuery,
  useUpsertProviderMenuMutation,
  useGetAiMenuSuggestionMutation,
} = providerApiSlice;
