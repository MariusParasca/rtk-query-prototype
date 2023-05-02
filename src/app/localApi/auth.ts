import { localApi } from '../local';
import { setTokens } from '../slices/userSlice';

type Login = { email: string; password: string };
type LoginResponse = { error: boolean; accessToken: string; refreshToken: string; message: string };

export const authExtendedApi = localApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, Login>({
      query: (body) => ({
        url: `login`,
        method: 'POST',
        body,
      }),
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;

          dispatch(
            setTokens({
              accessToken: data.accessToken,
              refreshToken: data.refreshToken,
            }),
          );
        } catch (error) {
          // TODO
        }
      },
    }),
    logout: builder.mutation<void, { refreshToken: string }>({
      query: ({ refreshToken }) => ({
        url: 'refreshToken',
        method: 'DELETE',
        body: { refreshToken },
      }),
    }),
  }),
});

export const { useLoginMutation, useLogoutMutation } = authExtendedApi;
