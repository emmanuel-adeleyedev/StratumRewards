import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from './app/hooks'
import { fetchUser } from './features/user/userSlice'
import LoginForm from './components/loginForm'
import Dashboard from './components/Dashboard'

export default function App() {
  const dispatch = useAppDispatch()
  const { token } = useAppSelector((state) => state.auth)
  const { firstName } = useAppSelector((state) => state.user)

  useEffect(() => {
    if (token && !firstName) {
      dispatch(fetchUser())
    }
  }, [token])

  if (!token) return <LoginForm />
  return <Dashboard />
}