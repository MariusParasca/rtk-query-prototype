import { ToDo } from '../../types/types';
import { jsonPlaceholderApi } from '../jsonPlaceholder';

export const { useGetToDosQuery } = jsonPlaceholderApi.injectEndpoints({
  endpoints: (builder) => ({
    getToDos: builder.query<ToDo[], string>({
      query: (q) => `todos?q=${q}`,
    }),
  }),
});
