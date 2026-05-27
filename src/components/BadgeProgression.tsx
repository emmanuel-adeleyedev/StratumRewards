import { useAppSelector } from '../app/hooks'
import './BadgeProgression.css'

const ALL_BADGES = [
  { name: 'Rookie Partner',   points_required: 0,    description: 'Entry-level ranking when starting the journey.' },
  { name: 'Loyal Customer',   points_required: 1000, description: 'Granted upon completing milestone achievements totaling 1,000 PTS.' },
  { name: 'Elite Member',     points_required: 2000, description: 'Granted upon completing milestone achievements totaling 2,000 PTS.' },
  { name: 'VIP Legend',       points_required: 5000, description: 'The ultimate crown tier. Reached at 5,000 total achievement PTS.' },
]

export default function BadgeProgression() {
  const { currentBadge, nextBadge, remainingToNextBadge, unlocked } = useAppSelector(
    (state) => state.achievements
  )

  const totalPoints = unlocked.reduce((sum, a) => sum + a.points_awarded, 0)

  const progressPercent = nextBadge
    ? Math.round(((nextBadge.points_required - remainingToNextBadge) / nextBadge.points_required) * 100)
    : 100

  return (
    <div className="badges">

      <div className="badges-grid">

        {/* Active badge card */}
        <div className="badge-card">
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

        {/*Badge rank structure */}
        <div className="badge-card">
          <h3>
            <i className="ti ti-list-stars" aria-hidden="true"></i>
            Badge Rank Structure
          </h3>

          <div className="badge-tiers">
            {ALL_BADGES.map((badge) => {
              const isActive = currentBadge?.name === badge.name
              const isUnlocked = totalPoints >= badge.points_required
              const ptsToGo = badge.points_required - totalPoints

              return (
                <div key={badge.name} className={`tier-item ${isActive ? 'active' : ''} ${isUnlocked && !isActive ? 'unlocked' : ''}`}>
                  <div className="tier-left">
                    <div className="tier-icon">
                      <i
                        className={`ti ${isUnlocked ? 'ti-circle-check' : 'ti-lock'}`}
                        aria-hidden="true"
                      ></i>
                    </div>
                    <div>
                      <div className="tier-name-row">
                        <span className="tier-name">{badge.name}</span>
                        {isActive && <span className="active-badge">Active Level</span>}
                      </div>
                      <span className="tier-threshold">
                        {badge.points_required === 0 ? 'No requirements' : `${badge.points_required.toLocaleString()} PTS threshold`}
                      </span>
                      <p className="tier-desc">{badge.description}</p>
                    </div>
                  </div>
                  {!isUnlocked && (
                    <span className="tier-pts-to-go">{ptsToGo.toLocaleString()} pts to go</span>
                  )}
                </div>
              )
            })}
          </div>
        </div>

      </div>
    </div>
  )
}