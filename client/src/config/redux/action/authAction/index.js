import { createAsyncThunk } from "@reduxjs/toolkit"
import clientServer from "../../index";

export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }, thunkAPI) => {
    try {
      const res = await clientServer.post('/auth/login', { email, password });
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.error || 'Login failed');
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async ({ name, email, password, role }, thunkAPI) => {
    try {
      const res = await clientServer.post('/auth/register', { name, email, password, role });
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.error || 'Register failed');
    }
  }
);

export const logout = createAsyncThunk('auth/logout', async () => {
  return true;
});