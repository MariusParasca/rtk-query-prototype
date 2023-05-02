import React, { useState } from 'react';
import { useCreateCustomerMutation } from '../../app/localApi/customers';
import { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query';
import { useNavigate } from 'react-router-dom';

const CreateCustomer = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [balance, setBalance] = useState(0);

  const navigate = useNavigate();

  const [createCustomer, { isLoading, error }] = useCreateCustomerMutation();
  const apiErrorData = error ? ((error as FetchBaseQueryError).data as { status: number; message: string }) : null;

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          createCustomer({
            email,
            name,
            balance,
          })
            .unwrap()
            .then(() => navigate('/protected/customers'));
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
        <button disabled={isLoading} type='submit'>
          Submit
        </button>
      </form>
    </div>
  );
};

export default CreateCustomer;
