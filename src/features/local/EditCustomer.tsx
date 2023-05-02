import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetCustomerQuery, useUpdateCustomerMutation } from '../../app/localApi/customers';
import { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query';

export const EditCustomer = () => {
  const params = useParams();
  const { data, isLoading } = useGetCustomerQuery(params.id || '');

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    if (data) {
      setEmail(data.email);
      setName(data.name);
      setBalance(data.balance);
    }
  }, [data]);

  const navigate = useNavigate();

  const [updateCustomer, { isLoading: isUpdating, error }] = useUpdateCustomerMutation();
  const apiErrorData = error ? ((error as FetchBaseQueryError).data as { status: number; message: string }) : null;

  if (isLoading) return <div>Loading...</div>;

  if (!data) return <div>No data</div>;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        updateCustomer({ email, name, balance, id: data.id })
          .unwrap()
          .then(() => navigate(`/protected/customers/${data.id}`));
      }}
    >
      <div style={{ marginBottom: 10 }}>
        <label style={{ display: 'block' }}>Email: </label>
        <input type='email' value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div style={{ marginBottom: 10 }}>
        <label style={{ display: 'block' }}>Name: </label>
        <input value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div style={{ marginBottom: 10 }}>
        <label style={{ display: 'block' }}>Balance: </label>
        <input type='number' value={balance} onChange={(e) => setBalance(e.target.valueAsNumber)} />
      </div>
      {apiErrorData && <p style={{ color: 'red' }}>{apiErrorData?.message}</p>}
      <button disabled={isUpdating} type='submit'>
        Submit
      </button>
    </form>
  );
};
