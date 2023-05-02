import React, { useEffect, useState } from 'react';
import { useGetPostQuery, useUpdatePostMutation } from '../../app/api/posts';
import { useParams } from 'react-router-dom';

export const EditPost = () => {
  const params = useParams();
  const { data, isLoading: isLoadingPost, isSuccess } = useGetPostQuery(Number(params.id));

  const [title, setTitle] = useState(data?.title ?? '');
  const [body, setBody] = useState(data?.body ?? '');

  useEffect(() => {
    if (data && isSuccess) {
      setTitle(data.title);
      setBody(data.body);
    }
  }, [data, isSuccess]);

  const [updatePost, { isLoading }] = useUpdatePostMutation();

  if (isLoadingPost) return <div>Loading...</div>;

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          updatePost({ title, body, userId: 1, id: data?.id }).then((res) => console.log('response create post:', res));
        }}
      >
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', marginBottom: 5 }}>Title</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: 5 }}>Body</label>
          <textarea value={body} onChange={(e) => setBody(e.target.value)} />
        </div>
        <button disabled={isLoading} style={{ marginTop: 20 }}>
          Submit
        </button>
      </form>
    </div>
  );
};
