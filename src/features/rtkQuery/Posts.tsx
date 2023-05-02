import { Link } from 'react-router-dom';
import { useDeletePostMutation, useGetPostsQuery } from '../../app/api/posts';
import { useRef, useState } from 'react';

export const Posts = () => {
  const [page, setPage] = useState(1);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const timeoutRef = useRef<NodeJS.Timeout>();

  const { data, isLoading, error, isFetching } = useGetPostsQuery({ page });
  const [deleteMutation, { isLoading: isDeleting }] = useDeletePostMutation();

  if (error) return <div>Error</div>;

  if (isLoading) return <div>Loading...</div>;

  if (!data || data.length === 0) return <div>No data</div>;

  return (
    <div>
      {snackbarMessage && (
        <h1>
          Snackbar {'=>'} {snackbarMessage}
        </h1>
      )}
      {data.map((post) => (
        <div key={post.id}>
          <h4>{post.title}</h4>
          <Link to={`/posts/${post.id}`}>View</Link>
          <button
            style={{ marginLeft: 20 }}
            type='button'
            onClick={() =>
              deleteMutation(post.id)
                .unwrap()
                .then(() => {
                  clearTimeout(timeoutRef.current);
                  setSnackbarMessage(`Post "${post.title}" deleted`);
                  timeoutRef.current = setTimeout(() => setSnackbarMessage(''), 3000);
                })
            }
            disabled={isDeleting}
          >
            Delete
          </button>
          <hr />
        </div>
      ))}
      {isFetching ? <div>Loading more...</div> : <button onClick={() => setPage((prev) => prev + 1)}>Load more</button>}
    </div>
  );
};
