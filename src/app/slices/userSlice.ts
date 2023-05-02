import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    accessToken: localStorage.getItem('accessToken') || '',
    refreshToken: localStorage.getItem('refreshToken') || '',
  },
  reducers: {
    setTokens: (
      state,
      action: PayloadAction<{
        accessToken: string;
        refreshToken: string;
      }>,
    ) => {
      localStorage.setItem('accessToken', action.payload.accessToken);
      state.accessToken = action.payload.accessToken;

      localStorage.setItem('refreshToken', action.payload.refreshToken);
      state.refreshToken = action.payload.refreshToken;
    },
    logout: (state) => {
      state.accessToken = '';
      state.refreshToken = '';
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    },
  },
});

export const { setTokens, logout } = userSlice.actions;

export default userSlice.reducer;
