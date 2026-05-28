import { useState } from 'react'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { logoutUser } from '../features/auth/authSlice'
import { clearUser } from '../features/user/userSlice'
import { clearAchievements } from '../features/achievements/achievementsSlice'
import OverviewDashboard from './OverviewDashboard'
import AchievementsTracker from './AchievementsTracker'
import BadgeProgression from './BadgeProgression'
import "./Dashboard.css"

type Tab = 'overview' | 'achievements' | 'badges' 

export default function Dashboard() {
    const dispatch = useAppDispatch()
    const { firstName, lastName } = useAppSelector((state) => state.user)
    const { token } = useAppSelector((state) => state.auth)
    const [activeTab, setActiveTab] = useState<Tab>('overview')

    const handleLogout = () => {
        dispatch(logoutUser(token))
        dispatch(clearUser())
        dispatch(clearAchievements())
    }

    return (
        <div className="app-shell">

            {/* Top navbar */}
            <header className="navbar">
                <div className="navbar-brand">
                    <div className="brand-icon">
                        <i className="ti ti-award" aria-hidden="true"></i>
                    </div>
                    <div>
                        <h1>Loyalty API Hub</h1>
                        <span>Interact with achievements, points, badges and cashback flows</span>
                    </div>
                </div>

                <div className="navbar-right">
                    <span className="navbar-user">
                        <i className="ti ti-user-circle" aria-hidden="true"></i>
                        {firstName} {lastName}
                    </span>
                    <button className="logout-btn" onClick={handleLogout}>
                        <i className="ti ti-logout" aria-hidden="true"></i>
                        Logout
                    </button>
                </div>
            </header>

            {/* Tab navigation */}
            <nav className="tab-nav">
                {([
                    { id: 'overview', label: 'Overview Dashboard', icon: 'ti-layout-dashboard' },
                    { id: 'achievements', label: 'Achievements Tracker', icon: 'ti-trophy' },
                    { id: 'badges', label: 'Badge Progression', icon: 'ti-shield-star' },
                ] as { id: Tab; label: string; icon: string }[]).map((tab) => (
                    <button
                        key={tab.id}
                        className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        <i className={`ti ${tab.icon}`} aria-hidden="true"></i>
                        {tab.label}
                    </button>
                ))}
            </nav>

            {/* Tab content */}
            <main className="tab-content">
                {activeTab === 'overview' && <OverviewDashboard />}
                {activeTab === 'achievements' && <AchievementsTracker />}
                {activeTab === 'badges' && <BadgeProgression />}
            </main>

        </div>
    )
}