import { Counter } from './features/counter/Counter';
import './App.css';
import { ToDo } from './features/rtkQuery/Todo';

import { createBrowserRouter, NavLink, RouterProvider } from 'react-router-dom';
import { Posts } from './features/rtkQuery/Posts';
import { CreatePosts } from './features/rtkQuery/CreatePosts';
import { Post } from './features/rtkQuery/Post';
import { extendedPostApi } from './app/api/posts';
import { EditPost } from './features/rtkQuery/EditPost';
import Root from './features/local/Root';
import Customers from './features/local/Customers';
import CreateCustomer from './features/local/CreateCustomer';
import { LogoutButton } from './features/local/LogoutButton';
import { Customer } from './features/local/Customer';
import { EditCustomer } from './features/local/EditCustomer';

const router = createBrowserRouter([
  {
    path: '/todo',
    element: <ToDo />,
  },
  {
    path: '/posts',
    element: <Posts />,
    loader: () => {
      console.log('%c POSTS: Loader', 'color: red');
      extendedPostApi.util.prefetch('getPosts', { page: 1 }, {});
      // store.dispatch(extendedPostApi.endpoints.getPosts.initiate());
      return null;
    },
  },
  {
    path: '/posts/:id',
    element: <Post />,
    loader: ({ params }) => {
      extendedPostApi.util.prefetch('getPost', Number(params.id), {});
      // store.dispatch(extendedPostApi.endpoints.getPost.initiate(Number(params.id)));
      return null;
    },
  },
  {
    path: '/posts/edit/:id',
    element: <EditPost />,
    loader: ({ params }) => {
      extendedPostApi.util.prefetch('getPost', Number(params.id), {});
      // store.dispatch(extendedPostApi.endpoints.getPost.initiate(Number(params.id)));
      return null;
    },
  },
  {
    path: '/posts/create',
    element: <CreatePosts />,
  },
  {
    path: '/counter',
    element: <Counter />,
  },
  {
    path: '/',
    element: (
      <div style={{ display: 'flex', gap: 20 }}>
        <NavLink to='/counter'>Counter</NavLink>
        <NavLink to='/todo'>Search to dos</NavLink>
        <NavLink to='/posts'>Posts</NavLink>
        <NavLink to='/posts/create'>Create Post</NavLink>

        <NavLink to='/protected'>Protected</NavLink>
      </div>
    ),
  },
  {
    path: '/protected',
    element: <Root />,
    children: [
      {
        index: true,
        element: (
          <div style={{ display: 'flex', gap: 20 }}>
            <NavLink to='/protected/customers'>Customers</NavLink>
            <NavLink to='/protected/customers/create'>Create Customer</NavLink>
            <LogoutButton />
          </div>
        ),
      },
      {
        path: 'customers',
        element: <Customers />,
      },
      {
        path: 'customers/:id',
        element: <Customer />,
      },
      {
        path: 'customers/edit/:id',
        element: <EditCustomer />,
      },
      {
        path: 'customers/create',
        element: <CreateCustomer />,
      },
    ],
  },
]);

function App() {
  return (
    <div style={{ padding: 100, display: 'flex', gap: 20 }}>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
