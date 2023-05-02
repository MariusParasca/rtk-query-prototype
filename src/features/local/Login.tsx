import React, { useState } from 'react';
import { useLoginMutation } from '../../app/localApi/auth';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [login] = useLoginMutation();

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          login({ email, password });
        }}
      >
        <div style={{ marginBottom: 10 }}>
          <label style={{ display: 'block' }}>Email: </label>
          <input type='email' value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div style={{ marginBottom: 10 }}>
          <label style={{ display: 'block' }}>Password: </label>
          <input type='password' value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button>Login</button>
      </form>
    </div>
  );
};

export default Login;
