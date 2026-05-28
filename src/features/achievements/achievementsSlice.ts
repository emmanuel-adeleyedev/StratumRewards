import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const BASE_URL = '/api/v1'

// 1. Shape of the data
interface Achievement {
  id: string
  name: string
  type: 'purchases_count' | 'amount_spent'
  points_awarded: number
  threshold: number
}

interface Badge {
  id: string
  name: string
  points_required: number
}

interface Purchase {
  id: string
  amount: number
  time: string
}

interface AchievementsState {
  unlocked: Achievement[]
  nextAvailable: Achievement[]
  currentBadge: Badge | null
  nextBadge: Badge | null
  remainingToNextBadge: number
  purchases: Purchase[]
  loading: boolean
  purchasing: boolean   // separate loader just for the purchase button
  error: string | null
}

const getInitialPurchases = (): Purchase[] => {
  try {
    const userId = localStorage.getItem('userId')
    if (!userId) return []
    const saved = localStorage.getItem(`purchases_${userId}`)
    return saved ? JSON.parse(saved) : []
  } catch (e) {
    return []
  }
}

// 2. Starting values
const initialState: AchievementsState = {
  unlocked: [],
  nextAvailable: [],
  currentBadge: null,
  nextBadge: null,
  remainingToNextBadge: 0,
  purchases: getInitialPurchases(),
  loading: false,
  purchasing: false,
  error: null,
}

// 3. Async actions
export const fetchAchievements = createAsyncThunk(
  'achievements/fetch',
  async (userId: string, { getState, rejectWithValue }) => {
    const state = getState() as { auth: { token: string | null } }
    try {
      const res = await axios.get(`${BASE_URL}/users/${userId}/achievements`, {
        headers: { Authorization: `Bearer ${state.auth.token}` }
      })
      return res.data.data
    } catch (err: any) {
      return rejectWithValue('Could not load achievements')
    }
  }
)

export const makePurchase = createAsyncThunk(
  'achievements/purchase',
  async (amount: number, { getState, rejectWithValue }) => {
    const state = getState() as { auth: { token: string | null } }
    try {
      await axios.post(
        `${BASE_URL}/purchases`,
        { amount },
        { headers: { Authorization: `Bearer ${state.auth.token}` } }
      )
      return { amount, time: new Date().toLocaleTimeString() }
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Purchase failed')
    }
  }
)

// 4. The slice
const achievementsSlice = createSlice({
  name: 'achievements',
  initialState,
  reducers: {
    clearAchievements: (state) => {
      state.unlocked = []
      state.nextAvailable = []
      state.currentBadge = null
      state.nextBadge = null
      state.remainingToNextBadge = 0
      state.purchases = []
    }
  },
  extraReducers: (builder) => {
    builder
      // FETCH ACHIEVEMENTS
      .addCase(fetchAchievements.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchAchievements.fulfilled, (state, action) => {
        state.loading = false
        const { achievements, badges } = action.payload
        state.unlocked           = achievements.unlocked_achievements
        state.nextAvailable      = achievements.next_available_achievements
        state.currentBadge       = badges.current_badge
        state.nextBadge          = badges.next_badge
        state.remainingToNextBadge = badges.remaining_to_unlock_next_badge
        try {
          const userId = localStorage.getItem('userId')
          if (userId) {
            const saved = localStorage.getItem(`purchases_${userId}`)
            state.purchases = saved ? JSON.parse(saved) : []
          }
        } catch (e) {
          state.purchases = []
        }
      })
      .addCase(fetchAchievements.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // MAKE PURCHASE
      .addCase(makePurchase.pending, (state) => {
        state.purchasing = true
        state.error = null
      })
      .addCase(makePurchase.fulfilled, (state, action) => {
        state.purchasing = false
        // add to local transaction history
        state.purchases.unshift({
          id: `#p-${state.purchases.length + 1}`,
          amount: action.payload.amount,
          time: action.payload.time,
        })
        try {
          const userId = localStorage.getItem('userId')
          if (userId) {
            localStorage.setItem(`purchases_${userId}`, JSON.stringify(state.purchases))
          }
        } catch (e) {
          console.error('Failed to save purchases to localStorage', e)
        }
      })
      .addCase(makePurchase.rejected, (state, action) => {
        state.purchasing = false
        state.error = action.payload as string
      })
  },
})

export const { clearAchievements } = achievementsSlice.actions
export default achievementsSlice.reducer