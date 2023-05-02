import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import userReducer from './slices/userSlice';
import { jsonPlaceholderApi } from './jsonPlaceholder';
import { localApi } from './local';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    user: userReducer,
    [localApi.reducerPath]: localApi.reducer,
    [jsonPlaceholderApi.reducerPath]: jsonPlaceholderApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(localApi.middleware).concat(jsonPlaceholderApi.middleware),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;
