import StatsRow from '../components/dashboard/StatsRow'
import RevenueChart from '../components/dashboard/RevenueChart'
import RecentClients from '../components/dashboard/RecentClients'
import ActiveProjects from '../components/dashboard/ActiveProjects'
import QuickActions from '../components/dashboard/QuickActions'

export default function Dashboard() {
  return (
    <div>
      <StatsRow />
      <RevenueChart />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        <RecentClients />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <ActiveProjects />
          <QuickActions />
        </div>
      </div>
    </div>
  )
}