import './styles/LabModeSelector.css'

const MODES = [
  {
    id: 'run-all',
    label: 'Run All',
    desc: 'Trigger all tasks as a single job',
    icon: (
      <svg viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.3"/>
        <path d="M6 5.5l5 2.5-5 2.5V5.5Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    id: 'one-by-one',
    label: 'One by One',
    desc: 'Run individual tasks manually',
    icon: (
      <svg viewBox="0 0 16 16" fill="none">
        <rect x="2" y="3" width="5" height="4" rx="1" stroke="currentColor" strokeWidth="1.3"/>
        <rect x="2" y="9" width="5" height="4" rx="1" stroke="currentColor" strokeWidth="1.3"/>
        <rect x="9" y="3" width="5" height="4" rx="1" stroke="currentColor" strokeWidth="1.3"/>
        <rect x="9" y="9" width="5" height="4" rx="1" stroke="currentColor" strokeWidth="1.3"/>
      </svg>
    ),
  },
  {
    id: 'pipeline',
    label: 'Pipeline',
    desc: 'Build a custom ordered sequence',
    icon: (
      <svg viewBox="0 0 16 16" fill="none">
        <circle cx="3" cy="8" r="1.5" stroke="currentColor" strokeWidth="1.3"/>
        <circle cx="8" cy="8" r="1.5" stroke="currentColor" strokeWidth="1.3"/>
        <circle cx="13" cy="8" r="1.5" stroke="currentColor" strokeWidth="1.3"/>
        <path d="M4.5 8h2M9.5 8h2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
      </svg>
    ),
  },
]

export default function LabModeSelector({ mode, onChange }) {
  return (
    <div className="lab-mode">
      {MODES.map((m) => (
        <button
          key={m.id}
          className={`lab-mode__btn ${mode === m.id ? 'lab-mode__btn--active' : ''}`}
          onClick={() => onChange(m.id)}
        >
          <span className="lab-mode__icon">{m.icon}</span>
          <span className="lab-mode__text">
            <span className="lab-mode__label">{m.label}</span>
            <span className="lab-mode__desc">{m.desc}</span>
          </span>
        </button>
      ))}
    </div>
  )
}