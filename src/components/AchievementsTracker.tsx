import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { fetchAchievements } from '../features/achievements/achievementsSlice'
import './AchievementsTracker.css'

type Filter = 'all' | 'unlocked' | 'locked'

export default function AchievementsTracker() {
  const dispatch = useAppDispatch()
  const { id } = useAppSelector((state) => state.user)
  const { unlocked, nextAvailable, loading, purchases } = useAppSelector((state) => state.achievements)
  const [filter, setFilter] = useState<Filter>('all')

  useEffect(() => {
    if (id) dispatch(fetchAchievements(id))
  }, [id])

  const purchasesCount = purchases.length
  const totalSpent = purchases.reduce((sum, p) => sum + p.amount, 0)

  const getAchievementProgress = (a: { type: 'purchases_count' | 'amount_spent'; threshold: number; isUnlocked?: boolean }) => {
    if (a.isUnlocked) return 100
    const current = a.type === 'purchases_count' ? purchasesCount : totalSpent
    const percentage = Math.round((current / a.threshold) * 100)
    return Math.min(100, Math.max(0, percentage))
  }

  const allAchievements = [
    ...unlocked.map((a) => ({ ...a, isUnlocked: true })),
    ...nextAvailable.map((a) => ({ ...a, isUnlocked: false })),
  ]

  const filtered = allAchievements.filter((a) => {
    if (filter === 'unlocked') return a.isUnlocked
    if (filter === 'locked') return !a.isUnlocked
    return true
  })

  // Next milestones
  const nextPurchase = nextAvailable.find((a) => a.type === 'purchases_count')
  const nextSpending = nextAvailable.find((a) => a.type === 'amount_spent')

  const nextPurchaseProgress = nextPurchase ? getAchievementProgress(nextPurchase) : 0
  const nextPurchaseRemaining = nextPurchase ? Math.max(0, nextPurchase.threshold - purchasesCount) : 0

  const nextSpendingProgress = nextSpending ? getAchievementProgress(nextSpending) : 0
  const nextSpendingRemaining = nextSpending ? Math.max(0, nextSpending.threshold - totalSpent) : 0

  return (
    <div className="achievements">

      {/* Next milestone cards */}
      <div className="milestone-cards">
        {nextPurchase && (
          <div className="milestone-card">
            <div className="milestone-top">
              <div>
                <span className="milestone-label">Next Purchases Milestone</span>
                <h3>{nextPurchase.name}</h3>
                <span className="milestone-reward">+{nextPurchase.points_awarded} pts reward</span>
              </div>
              <span className="milestone-threshold">
                {nextPurchase.threshold} purchases
              </span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${nextPurchaseProgress}%` }} />
            </div>
            <div className="milestone-footer">
              <span>{nextPurchaseProgress}% Complete</span>
              <span className="milestone-hint">
                Need {nextPurchaseRemaining} more purchase{nextPurchaseRemaining === 1 ? '' : 's'} till achievement
              </span>
            </div>
          </div>
        )}

        {nextSpending && (
          <div className="milestone-card">
            <div className="milestone-top">
              <div>
                <span className="milestone-label">Next Spending Milestone</span>
                <h3>{nextSpending.name}</h3>
                <span className="milestone-reward">+{nextSpending.points_awarded} pts reward</span>
              </div>
              <span className="milestone-threshold">
                ${nextSpending.threshold.toLocaleString()}
              </span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${nextSpendingProgress}%` }} />
            </div>
            <div className="milestone-footer">
              <span>{nextSpendingProgress}% Complete</span>
              <span className="milestone-hint">
                Need ${nextSpendingRemaining.toLocaleString()} spend remaining
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Achievements catalogue */}
      <div className="catalogue-header">
        <div>
          <h2>
            <i className="ti ti-trophy" aria-hidden="true"></i>
            Achievements Catalogue ({allAchievements.length})
          </h2>
          <p>Track unlocked and prospective milestones defined on your Laravel server.</p>
        </div>
        <div className="filter-btns">
          {(['all', 'unlocked', 'locked'] as Filter[]).map((f) => (
            <button
              key={f}
              className={`filter-btn ${filter === f ? 'active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f === 'all' && 'All'}
              {f === 'unlocked' && `Unlocked (${unlocked.length})`}
              {f === 'locked' && `Locked (${nextAvailable.length})`}
            </button>
          ))}
        </div>
      </div>

      {loading && <p className="loading-text">Loading achievements...</p>}

      <div className="achievements-grid">
        {filtered.map((a) => (
          <div key={a.id} className={`achievement-card ${a.isUnlocked ? 'unlocked' : 'locked'}`}>
            <div className="achievement-top">
              <div className="achievement-icon">
                <i
                  className={`ti ${a.type === 'purchases_count' ? 'ti-shopping-cart' : 'ti-coin'}`}
                  aria-hidden="true"
                ></i>
              </div>
              <span className="achievement-points">+{a.points_awarded} pts</span>
            </div>

            <h4>{a.name}</h4>
            <span className="achievement-type">
              {a.type === 'purchases_count' ? 'Purchases Target' : 'Spending Target'}
            </span>

            <div className="achievement-status">
              {a.isUnlocked ? (
                <>
                  <i className="ti ti-circle-check" aria-hidden="true"></i>
                  <span>Milestone Achieved</span>
                </>
              ) : (
                <>
                  <i className="ti ti-lock" aria-hidden="true"></i>
                  <span>Milestone Locked</span>
                </>
              )}
            </div>

            <div className="progress-bar" style={{ marginTop: '8px' }}>
              <div className="progress-fill" style={{ width: `${getAchievementProgress(a)}%` }} />
            </div>

            <span className="achievement-threshold">
              {a.type === 'purchases_count'
                ? `${a.threshold} purchases`
                : `$${a.threshold.toLocaleString()}`}
            </span>
          </div>
        ))}
      </div>

    </div>
  )
}