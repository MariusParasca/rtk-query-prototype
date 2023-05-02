import { Link, useParams } from 'react-router-dom';
import { useGetPostCommentsQuery, useGetPostQuery } from '../../app/api/posts';

export const Post = () => {
  const params = useParams();

  const { data, isLoading } = useGetPostQuery(Number(params.id));
  const { data: dataComments, isLoading: isLoadingComments } = useGetPostCommentsQuery(Number(params.id));

  if (isLoading || isLoadingComments) return <div>Loading...</div>;

  if (!data) return <div>No data</div>;

  return (
    <div>
      <h4>{data.title}</h4>
      <p>{data.body}</p>
      <Link to={`/posts/edit/${data.id}`}>Edit</Link>
      <hr />
      {dataComments && (
        <>
          <h5>Comments</h5>
          {dataComments?.map((comment) => (
            <div key={comment.id}>
              <p>
                <strong>{comment.name}</strong>
              </p>
              <p>{comment.body}</p>
              <hr />
            </div>
          ))}
        </>
      )}
    </div>
  );
};
