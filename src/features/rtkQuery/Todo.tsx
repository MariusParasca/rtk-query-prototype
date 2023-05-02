import React, { useState } from 'react';
import { useGetToDosQuery } from '../../app/api/todos';
import { useDebounceValue } from '../../hooks/useDebounceValue';

export const ToDo = () => {
  const [search, setSearch] = useState('');
  const searchDebounced = useDebounceValue(search, 500);

  const { data, isLoading, isFetching } = useGetToDosQuery(searchDebounced);

  return (
    <div>
      <input
        autoFocus
        placeholder='Search'
        style={{ marginBottom: 15 }}
        type='text'
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {isLoading || isFetching ? (
        <div>Loading...</div>
      ) : (
        <>{!data || data?.length === 0 ? <div>No data</div> : data?.map((item) => <p>{item.title}</p>)}</>
      )}
    </div>
  );
};
