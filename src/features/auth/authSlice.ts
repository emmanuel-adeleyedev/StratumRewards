// authSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL + '/api/v1'

interface AuthState{
  token: string | null
  userId: string |null
  loading: boolean
  error: string | null
}

const initialState:AuthState = {
  token: localStorage.getItem("token") ,
  userId: localStorage.getItem("userId") || null,
  loading: false,
  error: null,
}

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: { username: string; password: string }, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${BASE_URL}/login`, credentials)
      return res.data
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Login failed')
    }
  }
)

export const registerUser = createAsyncThunk(
  'auth/register',
  async (
    payload: {
      first_name: string
      last_name: string
      username: string
      email: string
      password: string
      password_confirmation: string
    },
    { rejectWithValue }
  ) => {
    try {
      const res = await axios.post(`${BASE_URL}/register`, payload)
      return res.data   // { user, access_token, token_type }
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Registration failed')
    }
  }
)

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (token: string | null, { rejectWithValue }) => {
    try {
      if (token) {
        await axios.post(
          `${BASE_URL}/logout`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        )
      }
    } catch (err: any) {
      return rejectWithValue('Logout failed')
    }
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => { state.error = null }
  },
  extraReducers: (builder) => {
    builder
      // LOGIN
      .addCase(loginUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false
        state.token = action.payload.access_token
        // login doesn't return user, we'll fetch it separately
        localStorage.setItem('token', action.payload.access_token)
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // REGISTER
      .addCase(registerUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false
        state.token = action.payload.access_token
        state.userId = action.payload.user.id
        localStorage.setItem('token', action.payload.access_token)
        localStorage.setItem('userId', action.payload.user.id)
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // LOGOUT
      .addCase(logoutUser.pending, (state) => {
        state.token = null
        state.userId = null
        localStorage.removeItem('token')
        localStorage.removeItem('userId')
      })
  },
})

export const { clearError } = authSlice.actions
export default authSlice.reducer
