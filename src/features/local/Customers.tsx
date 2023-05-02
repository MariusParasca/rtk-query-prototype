import React from 'react';
import { useDeleteCustomerMutation, useGetCustomersQuery } from '../../app/localApi/customers';
import { Customer } from '../../types/types';
import { useAppSelector } from '../../app/hooks';
import { NavLink } from 'react-router-dom';

const CustomerElement = ({ customer }: { customer: Customer }) => {
  const [deleteCustomer, { isLoading }] = useDeleteCustomerMutation();

  return (
    <div>
      <p>
        Email: <strong>{customer.email}</strong>
      </p>
      <p>Name: {customer.name}</p>
      <p>Balance: {customer.balance}</p>
      <div>{customer.customProp}</div>
      <div style={{ marginTop: '10px' }}>
        <NavLink to={`/protected/customers/${customer.id}`}>View</NavLink>
        <button
          onClick={() => {
            deleteCustomer(customer.id);
          }}
          disabled={isLoading}
          type='button'
        >
          Delete
        </button>
      </div>
      <hr />
    </div>
  );
};

const Customers = () => {
  const { data, isLoading } = useGetCustomersQuery();

  const value = useAppSelector((state) => state.counter.value);

  if (isLoading) return <div>Loading...</div>;
  if (data === undefined || data?.length === 0) return <div>No data</div>;

  return (
    <div>
      <h3>Customers</h3>
      <p>Counter value: {value}</p>
      {data.map((customer) => (
        <CustomerElement customer={customer} key={customer.id} />
      ))}

      <NavLink to={`/protected/customers/create`}>Create Customer</NavLink>
    </div>
  );
};

export default Customers;
