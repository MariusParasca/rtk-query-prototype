import React from 'react';
import Login from './Login';
import { useAppSelector } from '../../app/hooks';
import { Outlet } from 'react-router-dom';

const Root = () => {
  const accessToken = useAppSelector((state) => state.user.accessToken);
  const refreshToken = useAppSelector((state) => state.user.refreshToken);

  return <div>{accessToken || refreshToken ? <Outlet /> : <Login />}</div>;
};

export default Root;

/*
  1. Sa poti tine state care sa fie global pe aplicatie (inafara datelor de la request)
  2. Sa poti face face un request cu datele venite de la alt request
  3. Cum faci autentificare pe acele requesturi (user logat)
  4. Cum poti face anumite modificari /  mapari dupa request (tu returnezi direct payloadul)
  5. Cum poti face niste modificari de global store dupa un request
  6. Poti face hydrate cu metoda asta? Adica sa salvezi state-ul de redux in locat storage si sa hydratezi redux cu el urmand sa faci fetch-uri dupa
*/
