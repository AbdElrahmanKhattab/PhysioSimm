import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import API_URL from '../config'

export default function ProfilePage({ auth }) {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${API_URL}/api/profile/stats`, {
      headers: { Authorization: `Bearer ${auth.token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setStats(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [auth])

  if (loading) return <div className="page">Loading...</div>
  if (!stats) return <div className="page">Error loading profile</div>

  const membershipExpired = stats.membershipExpiresAt && new Date(stats.membershipExpiresAt) < new Date()

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-eyebrow">Profile</div>
        <h1 className="page-title">Your Profile</h1>
        <p className="page-subtitle">
          View your membership status, statistics, and progress.
        </p>
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="section-title">Membership</div>
          <div style={{ marginTop: '1rem' }}>
            <div className="stat-row">
              <div className="stat">
                <div className="stat-label">Current Plan</div>
                <div className="stat-value">
                  <span className={`badge ${stats.membershipType === 'premium' ? 'badge-completed' : ''}`}>
                    {stats.membershipType === 'premium' ? 'Premium' : 'Free'}
                  </span>
                </div>
              </div>
              {stats.membershipExpiresAt && (
                <div className="stat">
                  <div className="stat-label">Expires</div>
                  <div className="stat-value" style={{ color: membershipExpired ? '#ef4444' : '#111827' }}>
                    {new Date(stats.membershipExpiresAt).toLocaleDateString()}
                  </div>
                </div>
              )}
            </div>
            {stats.membershipType !== 'premium' && (
              <Link to="/membership" style={{ display: 'inline-block', marginTop: '1rem' }}>
                <button className="btn-primary">Upgrade to Premium</button>
              </Link>
            )}
          </div>
        </div>

        <div className="card">
          <div className="section-title">Statistics</div>
          <div className="stat-row" style={{ marginTop: '1rem' }}>
            <div className="stat">
              <div className="stat-label">Cases Completed</div>
              <div className="stat-value">{stats.casesCompleted}</div>
            </div>
            <div className="stat">
              <div className="stat-label">Total Score</div>
              <div className="stat-value">{stats.totalScore}</div>
            </div>
            <div className="stat">
              <div className="stat-label">Leaderboard Rank</div>
              <div className="stat-value">#{stats.rank}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: '1.5rem' }}>
        <div className="section-title">Quick Actions</div>
        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem', flexWrap: 'wrap' }}>
          <Link to="/cases">
            <button className="btn-primary">View Cases</button>
          </Link>
          <Link to="/leaderboard">
            <button className="btn-secondary">View Leaderboard</button>
          </Link>
          {stats.membershipType !== 'premium' && (
            <Link to="/membership">
              <button className="btn-secondary">Upgrade Membership</button>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}



