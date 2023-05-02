import { BaseQueryFn, FetchArgs, FetchBaseQueryError, createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { Mutex } from 'async-mutex';
import { RootState } from './store';
import { logout, setTokens } from './slices/userSlice';

const baseQuery = fetchBaseQuery({
  baseUrl: 'https://floating-depths-22172.herokuapp.com/api/',
  prepareHeaders: (headers, { getState }) => {
    const accessToken = (getState() as RootState).user.accessToken;

    // If we have a token set in state, let's assume that we should be passing it.
    if (accessToken) {
      headers.set('x-access-token', `${accessToken}`);
    }
    return headers;
  },
});

// Create a new mutex
const mutex = new Mutex();

// 3. Cum faci autentificare pe acele requesturi (user logat)
const customFetchBase: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions,
) => {
  // wait until the mutex is available without locking it
  await mutex.waitForUnlock();
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();

      try {
        const refreshToken = (api.getState() as RootState).user.refreshToken;
        const refreshResult = await baseQuery(
          {
            url: 'refreshToken',
            method: 'POST',
            body: {
              refreshToken: refreshToken,
            },
          },
          api,
          extraOptions,
        );

        const data = refreshResult.data as { accessToken: string };

        if (data) {
          // Update the token
          api.dispatch(
            setTokens({
              accessToken: data.accessToken,
              refreshToken: refreshToken,
            }),
          );

          // Retry the initial query
          result = await baseQuery(args, api, extraOptions);
        } else {
          api.dispatch(logout());
        }
      } finally {
        // release must be called once the mutex should be released again.
        release();
      }
    } else {
      // wait until the mutex is available without locking it
      await mutex.waitForUnlock();
      result = await baseQuery(args, api, extraOptions);
    }
  }

  return result;
};

export const localApi = createApi({
  reducerPath: 'localApi',
  baseQuery: customFetchBase,
  tagTypes: ['Customers'],
  endpoints: () => ({}),
});
