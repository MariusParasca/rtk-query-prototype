import React, { useState } from 'react';
import { useCreatePostMutation } from '../../app/api/posts';
import { useAppSelector } from '../../app/hooks';

export const CreatePosts = () => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  const value = useAppSelector((state) => state.counter.value);

  const [createPost, { isLoading }] = useCreatePostMutation();

  return (
    <div>
      {value}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          createPost({ title, body, userId: 1 }).then((res) => console.log('response create post:', res));
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
