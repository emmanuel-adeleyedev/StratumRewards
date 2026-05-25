import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const BASE_URL = '/api/v1'

// 1. Shape of the data this slice owns
interface UserState {
  id: string | null
  firstName: string | null
  lastName: string | null
  username: string | null
  email: string | null
  loading: boolean
  error: string | null
}

// 2. Starting values
const initialState: UserState = {
  id: localStorage.getItem('userId'),
  firstName: null,
  lastName: null,
  username: null,
  email: null,
  loading: false,
  error: null,
}

// 3. Fetch the logged-in user's profile
export const fetchUser = createAsyncThunk(
  'user/fetch',
  async (_, { getState, rejectWithValue }) => {
    const state = getState() as { auth: { token: string | null } }
    try {
      const res = await axios.get(`${BASE_URL}/user`, {
        headers: { Authorization: `Bearer ${state.auth.token}` }
      })
      return res.data
    } catch (err: any) {
      return rejectWithValue('Could not load user profile')
    }
  }
)

// 4. The slice
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearUser: (state) => {
      state.id = null
      state.firstName = null
      state.lastName = null
      state.username = null
      state.email = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading = false
        state.id = action.payload.id
        state.firstName = action.payload.first_name
        state.lastName = action.payload.last_name
        state.username = action.payload.username
        state.email = action.payload.email
        // save userId in case we don't have it yet (login flow)
        localStorage.setItem('userId', action.payload.id)
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export const { clearUser } = userSlice.actions
export default userSlice.reducer