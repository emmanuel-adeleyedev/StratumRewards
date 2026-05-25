import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import userReducer from '../features/user/userSlice'
import achievementsReducer from '../features/achievements/achievementsSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,          // auth slice lives here
    user: userReducer,          // user slice lives here
    achievements: achievementsReducer,
  },
})

// These two types you'll use everywhere — just export and forget
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch