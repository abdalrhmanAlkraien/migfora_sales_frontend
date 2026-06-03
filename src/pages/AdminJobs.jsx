import { useState } from 'react'
import { triggerRemindersApi } from '../api/adminJobs'
import './styles/AdminJobs.css'

const JOBS = [
  {
    id:    'reminders',
    title: 'Follow-up Reminders',
    desc:  'Sends reminder emails to all users for follow-ups scheduled today. Useful if the scheduled trigger failed or you need to send reminders manually.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
        <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="12" cy="8" r="6" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    ),
    tag:     'Email',
    tagCls:  'blue',
    danger:  false,
  },
]

function JobCard({ job, onRun }) {
  const [status,  setStatus]  = useState('idle') // idle | running | success | failed
  const [message, setMessage] = useState('')

  const handleRun = async () => {
    setStatus('running')
    setMessage('')
    try {
      const result = await onRun(job.id)
      setMessage(typeof result === 'string' ? result : 'Job triggered successfully.')
      setStatus('success')
      setTimeout(() => setStatus('idle'), 8000)
    } catch (err) {
      setMessage(err?.response?.data?.message || 'Failed to trigger job.')
      setStatus('failed')
      setTimeout(() => setStatus('idle'), 8000)
    }
  }

  return (
    <div className={`job-card ${status === 'running' ? 'job-card--running' : ''}`}>
      <div className="job-card__left">
        <div className="job-card__icon">{job.icon}</div>
        <div className="job-card__info">
          <div className="job-card__title-row">
            <span className="job-card__title">{job.title}</span>
            <span className={`job-card__tag job-card__tag--${job.tagCls}`}>{job.tag}</span>
          </div>
          <p className="job-card__desc">{job.desc}</p>
          {status === 'success' && (
            <div className="job-card__feedback job-card__feedback--success">
              <svg viewBox="0 0 14 14" fill="none">
                <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.2"/>
                <path d="M4.5 7l2 2 3-3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {message}
            </div>
          )}
          {status === 'failed' && (
            <div className="job-card__feedback job-card__feedback--failed">
              <svg viewBox="0 0 14 14" fill="none">
                <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.2"/>
                <path d="M5 5l4 4M9 5l-4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
              </svg>
              {message}
            </div>
          )}
        </div>
      </div>

      <button
        className={`job-card__run-btn ${status === 'running' ? 'job-card__run-btn--running' : ''}`}
        onClick={handleRun}
        disabled={status === 'running'}
      >
        {status === 'running' ? (
          <>
            <span className="job-card__spinner" />
            Running…
          </>
        ) : (
          <>
            <svg viewBox="0 0 14 14" fill="none">
              <path d="M4.5 3l7 4-7 4V3Z" stroke="currentColor" strokeWidth="1.2"
                strokeLinejoin="round" fill="currentColor"/>
            </svg>
            Run Now
          </>
        )}
      </button>
    </div>
  )
}

export default function AdminJobs() {
  const handleRun = async (jobId) => {
    if (jobId === 'reminders') {
      const { data } = await triggerRemindersApi()
      return data
    }
  }

  return (
    <div className="admin-jobs">
      <div className="admin-jobs__header">
        <div>
          <h1 className="admin-jobs__title">Admin Jobs</h1>
          <p className="admin-jobs__subtitle">
            Manually trigger background jobs. Use with caution — some jobs send emails to all users.
          </p>
        </div>
        <div className="admin-jobs__badge">
          <svg viewBox="0 0 14 14" fill="none">
            <path d="M7 1.5L1.5 11.5h11L7 1.5Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
            <path d="M7 6v2.5M7 10h.01" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
          </svg>
          Admin Only
        </div>
      </div>

      <div className="admin-jobs__list">
        {JOBS.map((job) => (
          <JobCard key={job.id} job={job} onRun={handleRun} />
        ))}
      </div>
    </div>
  )
}