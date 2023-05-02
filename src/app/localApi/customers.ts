import { incrementByAmount } from '../../features/counter/counterSlice';
import { Customer } from '../../types/types';
import { localApi } from '../local';
import { providesList } from '../utils/rtkQueryHelpers';

export const customerExtendedApi = localApi.injectEndpoints({
  endpoints: (builder) => ({
    getCustomers: builder.query<Customer[], void>({
      query: () => `customers`,
      providesTags: (result) => providesList(result, 'Customers'),
      // 4. Cum poti face anumite modificari /  mapari dupa request (tu returnezi direct payloadul)
      transformResponse: (response: Customer[]) => {
        return response.map((customer) => ({
          ...customer,
          customProp: 'I transformed the output :D',
        }));
      },
    }),
    getCustomer: builder.query<Customer, string>({
      query: (id) => `customers/${id}`,
      providesTags: (result) => (result ? [{ type: 'Customers', id: result.id }] : []),
    }),
    createCustomer: builder.mutation<Customer, Partial<Customer>>({
      query: (body) => ({
        url: `customers`,
        method: 'POST',
        body: body,
      }),
      invalidatesTags: () => [{ type: 'Customers', id: 'LIST' }],
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          // 5. Cum poti face niste modificari de global store dupa un request
          dispatch(incrementByAmount(data.balance));
        } catch (error) {}
      },
    }),
    deleteCustomer: builder.mutation<Customer, string>({
      query: (id) => ({
        url: `customers/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: () => [{ type: 'Customers', id: 'LIST' }],
    }),
    updateCustomer: builder.mutation<Customer, Customer>({
      query: (body) => ({
        url: `customers/${body.id}`,
        method: 'PUT',
        body: {
          name: body.name,
          email: body.email,
          balance: body.balance,
        },
      }),
      invalidatesTags: (result) =>
        result
          ? [
              { type: 'Customers', id: result.id },
              { type: 'Customers', id: 'LIST' },
            ]
          : [{ type: 'Customers', id: 'LIST' }],
    }),
  }),
});

// 6. Poti face hydrate cu metoda asta? Adica sa salvezi state-ul de redux in locat storage si sa hydratezi redux cu el urmand sa faci fetch-uri dupa
// Da, poti folosi redux-persist pentru asta

export const {
  useGetCustomersQuery,
  useCreateCustomerMutation,
  useDeleteCustomerMutation,
  useGetCustomerQuery,
  useUpdateCustomerMutation,
} = customerExtendedApi;
