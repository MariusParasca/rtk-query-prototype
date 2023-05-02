import React from 'react';
import { useLogoutMutation } from '../../app/localApi/auth';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { logout } from '../../app/slices/userSlice';

export const LogoutButton = () => {
  const [logoutApi, { isLoading }] = useLogoutMutation();
  const dispatch = useAppDispatch();
  const refreshToken = useAppSelector((state) => state.user.refreshToken);

  return (
    <button
      type='button'
      onClick={() => {
        dispatch(logout());
        logoutApi({ refreshToken });
      }}
      disabled={isLoading}
    >
      Logout
    </button>
  );
};
