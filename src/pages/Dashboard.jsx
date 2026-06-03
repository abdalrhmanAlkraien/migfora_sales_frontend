import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'
import { getDashboardStatsApi, getFollowUpsTodayApi, getRecentInvestigationsApi, getContactStatsApi } from '../api/dashboard'
import { getCompaniesApi } from '../api/companies'
import DashboardStats       from '../components/dashboard/DashboardStats'
import FollowUpsToday       from '../components/dashboard/FollowUpsToday'
import RecentCompanies      from '../components/dashboard/RecentCompanies'
import RecentInvestigations from '../components/dashboard/RecentInvestigations'
import PipelineOverview     from '../components/dashboard/PipelineOverview'
import './styles/Dashboard.css'

export default function Dashboard() {
  const navigate  = useNavigate()
  const user      = useAuthStore((s) => s.user)
  const groups    = user?.['cognito:groups'] || user?.groups || []
  const isAdmin   = groups.includes('admin_group')
  const firstName = user?.name || 'there'

  const [stats,          setStats]          = useState(null)
  const [followUps,      setFollowUps]      = useState([])
  const [companies,      setCompanies]      = useState([])
  const [investigations, setInvestigations] = useState([])
  const [pipeline,       setPipeline]       = useState(null)
  const [loading,        setLoading]        = useState(true)

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true)
      try {
        const calls = [
          getDashboardStatsApi(),
          getFollowUpsTodayApi({ page: 0, size: 10 }),
          getCompaniesApi({ page: 0, size: 5, sort: 'createdAt,desc' }),
        ]
        if (isAdmin) {
          calls.push(getRecentInvestigationsApi({ page: 0, size: 5, sort: 'createdAt,desc' }))
          calls.push(getContactStatsApi())
        }

        const results = await Promise.allSettled(calls)

        if (results[0].status === 'fulfilled') setStats(results[0].value.data)
        if (results[1].status === 'fulfilled') setFollowUps(results[1].value.data.content)
        if (results[2].status === 'fulfilled') setCompanies(results[2].value.data.content)
        if (isAdmin) {
          if (results[3].status === 'fulfilled') setInvestigations(results[3].value.data.content)
          if (results[4].status === 'fulfilled') setPipeline(results[4].value.data.byStatus)
        }
      } catch {
        // individual failures handled via allSettled
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [isAdmin])

  return (
    <div className="dashboard">

      {/* Greeting */}
      <div className="dashboard__greeting">
        <div>
          <h1 className="dashboard__greeting-title">
            Good {getTimeOfDay()}, {firstName}
          </h1>
          <p className="dashboard__greeting-sub">
            {isAdmin ? 'Team overview for today.' : 'What needs your attention today.'}
          </p>
        </div>
        <span className="dashboard__date">{formatDate()}</span>
      </div>

      {/* Stats */}
      {loading ? (
        <div className="dashboard__stats-skeleton">
          {[...Array(isAdmin ? 7 : 4)].map((_, i) => (
            <div key={i} className="dashboard__stats-skeleton-card" />
          ))}
        </div>
      ) : (
        <DashboardStats stats={stats || {}} isAdmin={isAdmin} />
      )}

      {/* Main grid */}
      <div className="dashboard__grid">

        <div className="dashboard__col dashboard__col--main">
          <FollowUpsToday
            followUps={followUps}
            loading={loading}
            onContactClick={(fu) => navigate(`/contacts/${fu.contactId}`)}
          />
          {isAdmin && (
            <RecentInvestigations
              investigations={investigations}
              loading={loading}
              onItemClick={(inv) => navigate(`/investigations/${inv.id}`)}
            />
          )}
        </div>

        <div className="dashboard__col dashboard__col--side">
          <RecentCompanies
            companies={companies}
            loading={loading}
            onItemClick={(c) => navigate(`/companies/${c.id}`)}
          />
          {isAdmin && pipeline && (
            <PipelineOverview pipeline={pipeline} />
          )}
        </div>

      </div>
    </div>
  )
}

function getTimeOfDay() {
  const h = new Date().getHours()
  if (h < 12) return 'morning'
  if (h < 17) return 'afternoon'
  return 'evening'
}

function formatDate() {
  return new Date().toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  })
}