import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from 'recharts'
import './styles/RevenueChart.css'

const DATA = [
  { month: 'Jan', revenue: 52000 },
  { month: 'Feb', revenue: 61000 },
  { month: 'Mar', revenue: 55000 },
  { month: 'Apr', revenue: 70000 },
  { month: 'May', revenue: 67000 },
  { month: 'Jun', revenue: 74000 },
  { month: 'Jul', revenue: 80000 },
  { month: 'Aug', revenue: 78000 },
  { month: 'Sep', revenue: 84200 },
  { month: 'Oct', revenue: 91000 },
  { month: 'Nov', revenue: 87000 },
  { month: 'Dec', revenue: 95000 },
]

export default function RevenueChart() {
  return (
    <div className="revenue-chart">
      <div className="revenue-chart__header">
        <div>
          <div className="revenue-chart__title">Monthly Revenue</div>
          <div className="revenue-chart__subtitle">Full year overview — 2024</div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={DATA} barSize={32}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="month"
            tick={{ fontFamily: 'DM Sans', fontSize: 12, fill: '#6b7280' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontFamily: 'DM Sans', fontSize: 12, fill: '#6b7280' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
          />
          <Tooltip
            formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']}
            contentStyle={{
              fontFamily: 'DM Sans',
              fontSize: 13,
              borderRadius: 8,
              border: 'none',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            }}
          />
          <Bar dataKey="revenue" fill="#FF9900" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}