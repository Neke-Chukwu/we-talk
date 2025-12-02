import { createSlice,type PayloadAction } from '@reduxjs/toolkit';
import type { User } from '../../types';

interface AuthState {
  user: User | null;
  status: 'idle' | 'loading' | 'authenticated' | 'error';
  hydrated: boolean;
}

const initialState: AuthState = {
  user: null,
  status: 'idle',
  hydrated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.status = 'authenticated';
      state.hydrated = true;
    },
    clearUser: (state) => {
      state.user = null;
      state.status = 'idle';
      state.hydrated = true;
    },
    setAuthLoading: (state) => {
      state.status = 'loading';
    },
    markHydrated: (state) => {
      state.hydrated = true;
    },
  },
});

export const { setUser, clearUser, setAuthLoading, markHydrated } = authSlice.actions;

export default authSlice.reducer;

