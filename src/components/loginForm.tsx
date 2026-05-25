import { useState } from 'react'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { loginUser, registerUser, clearError } from '../features/auth/authSlice'
import { fetchUser } from '../features/user/userSlice'
import './LoginForm.css'

export default function LoginForm() {
  const dispatch = useAppDispatch()
  const { loading, error } = useAppSelector((state) => state.auth)

  const [tab, setTab] = useState<'login' | 'register'>('login')

  // Login form state
  const [loginData, setLoginData] = useState({ username: '', password: '' })

  // Register form state
  const [registerData, setRegisterData] = useState({
    first_name: '', last_name: '', username: '',
    email: '', password: '', password_confirmation: ''
  })

  const handleLogin = async () => {
    const result = await dispatch(loginUser(loginData))
    if (loginUser.fulfilled.match(result)) {
      // fetch profile right after login succeeds
      dispatch(fetchUser())
    }
  }

  const handleRegister = async () => {
    const result = await dispatch(registerUser(registerData))
    if (registerUser.fulfilled.match(result)) {
      dispatch(fetchUser())
    }
  }

  const handleTabSwitch = (newTab: 'login' | 'register') => {
    dispatch(clearError())
    setTab(newTab)
  }

  return (
    <div className="auth-container">
      <div className="auth-card">

        {/* Header */}
        <div className="auth-header">
          <i className="ti ti-award" aria-hidden="true"></i>
          <div>
            <h2>{tab === 'login' ? 'Welcome Back' : 'Create an Account'}</h2>
            <p>{tab === 'login' ? 'Sign in to your loyalty account' : 'Start earning points and badges today'}</p>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="auth-tabs">
          <button
            className={tab === 'login' ? 'active' : ''}
            onClick={() => handleTabSwitch('login')}
          >
            Existing Account Sign In
          </button>
          <button
            className={tab === 'register' ? 'active' : ''}
            onClick={() => handleTabSwitch('register')}
          >
            Create Account
          </button>
        </div>

        {/* Error message */}
        {error && <p className="auth-error">{error}</p>}

        {/* Login form */}
        {tab === 'login' && (
          <div className="auth-form">
            <div className="form-row">
              <div className="form-group">
                <label>USERNAME</label>
                <input
                  type="text"
                  placeholder="username"
                  value={loginData.username}
                  onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>PASSWORD</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                />
              </div>
            </div>
            <button className="auth-submit" onClick={handleLogin} disabled={loading}>
              <i className="ti ti-key" aria-hidden="true"></i>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </div>
        )}

        {/* Register form */}
        {tab === 'register' && (
          <div className="auth-form">
            <div className="form-row">
              <div className="form-group">
                <label>FIRST NAME</label>
                <input
                  type="text"
                  placeholder="Red"
                  value={registerData.first_name}
                  onChange={(e) => setRegisterData({ ...registerData, first_name: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>LAST NAME</label>
                <input
                  type="text"
                  placeholder="Hood"
                  value={registerData.last_name}
                  onChange={(e) => setRegisterData({ ...registerData, last_name: e.target.value })}
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>USERNAME</label>
                <input
                  type="text"
                  placeholder="red"
                  value={registerData.username}
                  onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>EMAIL</label>
                <input
                  type="email"
                  placeholder="red@gmail.com"
                  value={registerData.email}
                  onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>PASSWORD</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={registerData.password}
                  onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>CONFIRM PASSWORD</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={registerData.password_confirmation}
                  onChange={(e) => setRegisterData({ ...registerData, password_confirmation: e.target.value })}
                />
              </div>
            </div>
            <button className="auth-submit" onClick={handleRegister} disabled={loading}>
              <i className="ti ti-user-plus" aria-hidden="true"></i>
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </div>
        )}

      </div>
    </div>
  )
}