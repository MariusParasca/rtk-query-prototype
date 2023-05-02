import { useDeleteCustomerMutation, useGetCustomerQuery } from '../../app/localApi/customers';
import { NavLink, useNavigate, useParams } from 'react-router-dom';

export const Customer = () => {
  const params = useParams();
  const navigate = useNavigate();

  const { data, isLoading } = useGetCustomerQuery(params.id || '');
  const [deleteCustomer, { isLoading: isDeleting }] = useDeleteCustomerMutation();

  if (isLoading) return <div>Loading...</div>;

  if (!data) return <div>No data</div>;

  return (
    <div>
      <p>
        Email: <strong>{data.email}</strong>
      </p>
      <p>Name: {data.name}</p>
      <p>Balance: {data.balance}</p>
      <div>{data.customProp}</div>
      <NavLink to={`/protected/customers/edit/${data.id}`}>Edit</NavLink>
      <button
        onClick={() => {
          deleteCustomer(data.id)
            .unwrap()
            .then((result) => navigate(`/protected/customers`));
        }}
        disabled={isDeleting}
        type='button'
      >
        Delete
      </button>
      <div>
        <NavLink to={`/protected/customers`}>Back to customers</NavLink>
      </div>
    </div>
  );
};
