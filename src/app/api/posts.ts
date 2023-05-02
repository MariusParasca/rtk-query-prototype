import { Post, PostComment } from '../../types/types';
import { jsonPlaceholderApi } from '../jsonPlaceholder';
import { providesList } from '../utils/rtkQueryHelpers';

export const extendedPostApi = jsonPlaceholderApi.injectEndpoints({
  endpoints: (builder) => ({
    getPost: builder.query<Post, number>({
      query: (id) => `posts/${id}`,
      providesTags: (result) => [{ type: 'Posts', id: result?.id }],
      // 2. Sa poti face face un request cu datele venite de la alt request
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          // dispatch(extendedPostApi.endpoints.getPostComments.initiate(data.id));
          extendedPostApi.util.prefetch('getPostComments', data.id, {});
        } catch (error) {}
      },
    }),
    getPostComments: builder.query<PostComment[], number>({
      query: (id) => `posts/${id}/comments`,
    }),
    getPosts: builder.query<Post[], { page: number } | undefined>({
      query: (params) => `posts?_page=${params?.page ?? 1}`,
      providesTags: (result) => providesList(result, 'Posts'),
      // used to load more post as an infinite scroll
      serializeQueryArgs: ({ endpointName }) => {
        return endpointName;
      },
      merge: (currentCache, newItems, { arg }) => {
        if (arg?.page === 1) {
          return newItems;
        } else {
          return [...currentCache, ...newItems];
        }
      },
      forceRefetch({ currentArg, previousArg }) {
        return currentArg !== previousArg;
      },
    }),
    createPost: builder.mutation<Post, Partial<Post>>({
      query: (body) => ({
        url: `posts`,
        method: 'POST',
        body: body,
      }),
      invalidatesTags: () => [{ type: 'Posts', id: 'LIST' }],
      // onQueryStarted: async ({ id }, { dispatch, queryFulfilled }) => {
      //   try {
      //     const { data } = await queryFulfilled;
      //     dispatch(
      //       extendedPostApi.util.updateQueryData('getPosts', { page: 1 }, (oldData) => {
      //         return [data, ...oldData];
      //       }),
      //     );
      //   } catch (error) {}
      // },
    }),
    updatePost: builder.mutation<Post, Partial<Post>>({
      query: (body) => ({
        url: `posts/${body.id}`,
        method: 'PUT',
        body: body,
      }),
      // update state locally (pessimistic update or optimistic update): pessimistic in this case
      onQueryStarted: async ({ id }, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;

          if (id)
            dispatch(extendedPostApi.util.updateQueryData('getPost', id, (oldData) => Object.assign(oldData, data)));
        } catch (error) {}
      },
      invalidatesTags: (_, _2, args) => [{ type: 'Posts', id: args.id }],
    }),
    deletePost: builder.mutation<Post, number>({
      query: (id) => ({
        url: `posts/${id}`,
        method: 'DELETE',
      }),
      // invalidatesTags: (_, _2, id) => [{ type: 'Posts', id: id }],
      onQueryStarted: async (id, { dispatch, queryFulfilled }) => {
        try {
          await queryFulfilled;
          if (id)
            dispatch(
              extendedPostApi.util.updateQueryData('getPosts', undefined, (oldData) =>
                oldData.filter((item) => item.id !== id),
              ),
            );
        } catch (error) {}
      },
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetPostQuery,
  useGetPostCommentsQuery,
  useGetPostsQuery,
  useCreatePostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
} = extendedPostApi;
