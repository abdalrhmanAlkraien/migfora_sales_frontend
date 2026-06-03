import './styles/PipelineOverview.css'

const STAGES = [
  { key: 'NEW',           label: 'New',        color: '#64748b' },
  { key: 'CONTACTED',     label: 'Contacted',  color: '#2563eb' },
  { key: 'INTERESTED',    label: 'Interested', color: '#7c3aed' },
  { key: 'MEETING_SET',   label: 'Meeting',    color: '#b96d00' },
  { key: 'PROPOSAL_SENT', label: 'Proposal',   color: '#b45309' },
  { key: 'NEGOTIATING',   label: 'Negotiating',color: '#c2410c' },
  { key: 'WON',           label: 'Won',        color: '#059669' },
  { key: 'LOST',          label: 'Lost',       color: '#dc2626' },
  { key: 'ON_HOLD',       label: 'On Hold',    color: '#9ca3af' },
]

export default function PipelineOverview({ pipeline }) {
  const total = Object.values(pipeline).reduce((a, b) => a + b, 0)

  return (
    <div className="dash-pipeline">
      <div className="dash-pipeline__header">
        <h2 className="dash-pipeline__title">Contact Pipeline</h2>
        <span className="dash-pipeline__total">{total} total</span>
      </div>

      <div className="dash-pipeline__list">
        {STAGES.map((stage) => {
          const count = pipeline[stage.key] || 0
          const pct   = total > 0 ? Math.round((count / total) * 100) : 0
          return (
            <div key={stage.key} className="dash-pipeline__row">
              <div className="dash-pipeline__row-top">
                <span className="dash-pipeline__stage">{stage.label}</span>
                <span className="dash-pipeline__count" style={{ color: stage.color }}>
                  {count}
                </span>
              </div>
              <div className="dash-pipeline__bar-track">
                <div
                  className="dash-pipeline__bar-fill"
                  style={{
                    width:      `${pct}%`,
                    background: stage.color,
                    minWidth:   count > 0 ? 4 : 0,
                  }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}