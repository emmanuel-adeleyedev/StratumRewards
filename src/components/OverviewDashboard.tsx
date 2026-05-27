import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { fetchAchievements, makePurchase } from '../features/achievements/achievementsSlice'
import './OverviewDashboard.css'

const QUICK_AMOUNTS = [25, 100, 500, 5000]

export default function OverviewDashboard() {
  const dispatch = useAppDispatch()
  const { id, firstName, lastName, username, email } = useAppSelector((state) => state.user)
  const {
    currentBadge, nextBadge, remainingToNextBadge,
    purchases, purchasing, unlocked
  } = useAppSelector((state) => state.achievements)

  const [amount, setAmount] = useState('')

  useEffect(() => {
    if (id) dispatch(fetchAchievements(id))
  }, [id])

  const totalSpent = purchases.reduce((sum, p) => sum + p.amount, 0)
  const cashback = totalSpent * 0.05
  const totalPoints = unlocked.reduce((sum, a) => sum + a.points_awarded, 0)

  const progressPercent = nextBadge
    ? Math.round(((nextBadge.points_required - remainingToNextBadge) / nextBadge.points_required) * 100)
    : 100

  const handlePurchase = async () => {
    const parsed = parseFloat(amount)
    if (!parsed || parsed <= 0) return
    await dispatch(makePurchase(parsed))
    if (id) dispatch(fetchAchievements(id))  // refresh after purchase
    setAmount('')
  }

  return (
    <div className="overview">

      {/* Stat cards */}
      <div className="stat-cards">
        <div className="stat-card">
          <i className="ti ti-user" aria-hidden="true"></i>
          <div>
            <span className="stat-label">Authenticated Profile</span>
            <p className="stat-value">{firstName} {lastName}</p>
          </div>
        </div>

        <div className="stat-card">
          <i className="ti ti-bolt" aria-hidden="true"></i>
          <div>
            <span className="stat-label">Accumulated Loyalty Points</span>
            <p className="stat-value">{totalPoints} <small>PTS</small></p>
            <span className="stat-sub">Unlocks next level badge tier</span>
          </div>
        </div>

        <div className="stat-card">
          <i className="ti ti-trending-up" aria-hidden="true"></i>
          <div>
            <span className="stat-label">Aggregate Spendings & Cashback</span>
            <p className="stat-value">${totalSpent.toLocaleString()}</p>
            <span className="stat-sub green">+${cashback.toFixed(2)} returns</span>
          </div>
        </div>

        <div className="stat-card">
          <i className="ti ti-shield" aria-hidden="true"></i>
          <div>
            <span className="stat-label">Current Badge</span>
            <p className="stat-value">{currentBadge?.name ?? 'None yet'}</p>
            <span className="stat-sub">5% flat cashback active</span>
          </div>
        </div>
      </div>

      {/* Main content grid */}
      <div className="overview-grid">

        {/* Left — Badge status */}
        <div className="overview-card">
          <span className="card-label">Active Tier Status</span>
          <div className="badge-header">
            <h2>{currentBadge?.name ?? 'No Badge Yet'}</h2>
            <span className="points-pill">
              <i className="ti ti-bolt" aria-hidden="true"></i>
              {totalPoints} pts
            </span>
          </div>
          <p className="badge-sub">Lvl 1 • Account Seeding</p>

          <div className="badge-icon-wrap">
            <i className="ti ti-shield-star" aria-hidden="true"></i>
          </div>

          {nextBadge && (
            <div className="badge-progress">
              <div className="progress-labels">
                <span>Next badge: <strong>{nextBadge.name}</strong></span>
                <span>{totalPoints} / {nextBadge.points_required} PTS</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${progressPercent}%` }} />
              </div>
              <p className="progress-hint">
                Earn <strong>{remainingToNextBadge}</strong> more points to attain <strong>{nextBadge.name}</strong> level.
              </p>
            </div>
          )}
        </div>

        {/* Middle — Purchase simulation */}
        <div className="overview-card">
          <h3>Transaction Simulation</h3>
          <p className="card-sub">POST /api/v1/purchases • Live Sanctum Endpoint</p>

          <label className="input-label">PURCHASE AMOUNT ($)</label>
          <div className="amount-input-wrap">
            <span className="currency">USD</span>
            <input
              type="number"
              placeholder="0"
              min="1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          <label className="input-label" style={{ marginTop: '1rem' }}>Quick Select Amount</label>
          <div className="quick-amounts">
            {QUICK_AMOUNTS.map((q) => (
              <button key={q} onClick={() => setAmount(String(q))} className="quick-btn">
                ${q.toLocaleString()}
              </button>
            ))}
          </div>

          <button className="commit-btn" onClick={handlePurchase} disabled={purchasing}>
            {purchasing ? 'Processing...' : 'Commit Checkout Ledger →'}
          </button>

          <p className="jobs-hint">
            <i className="ti ti-database" aria-hidden="true"></i>
            {purchasing ? 'Jobs Engine: Processing awards...' : 'Jobs Engine: Standing by. Waiting to process awards...'}
          </p>
        </div>

        {/* Right — Recent transactions */}
        <div className="overview-card">
          <div className="tx-header">
            <div>
              <h3>Recent Checkout Transactions</h3>
              <p className="card-sub">Raw event ledger representing customer transactions</p>
            </div>
            <span className="tx-count">{purchases.length} items logged</span>
          </div>

          <div className="tx-list">
            {purchases.length === 0 && (
              <p className="tx-empty">No transactions yet. Make a purchase above!</p>
            )}
            {purchases.map((p) => (
              <div key={p.id} className="tx-item">
                <span className="tx-id">TX Card ID: <strong>{p.id}</strong></span>
                <span className="tx-time">{p.time}</span>
                <span className="tx-amount">${p.amount.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}