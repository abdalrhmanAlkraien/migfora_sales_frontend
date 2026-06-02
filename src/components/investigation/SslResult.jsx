function SslResult({ result, rawOutput }) {
  const [showRaw, setShowRaw] = useState(false)

  const EXPIRY_STATUS = {
  VALID:          { label: 'Valid',          cls: 'valid' },
  EXPIRING_SOON:  { label: 'Expiring Soon',  cls: 'expiring-soon' },
  EXPIRED:        { label: 'Expired',        cls: 'expired' },
}

  const expiryStatusColor = {
    VALID:    '#059669',
    EXPIRING: '#b45309',
    EXPIRED:  '#dc2626',
  }

  return (
    <div className="trd__ssl">
      <div className="trd__section-title">Certificate Summary</div>
      <div className="trd__kv-list">
        <div className="trd__kv-row">
          <span className="trd__kv-key">Valid</span>
          <span className="trd__kv-val" style={{ color: result.valid ? '#059669' : '#dc2626', fontWeight: 600 }}>
            {result.valid ? 'Yes' : 'No'}
          </span>
        </div>
        <div className="trd__kv-row">
          <span className="trd__kv-key">Issuer</span>
          <span className="trd__kv-val">{result.latestIssuer || '—'}</span>
        </div>
        <div className="trd__kv-row">
          <span className="trd__kv-key">Expiry</span>
          <span className="trd__kv-val">{result.latestExpiry?.slice(0, 10) || '—'}</span>
        </div>
        <div className="trd__kv-row">
          <span className="trd__kv-key">Days until expiry</span>
          <span className="trd__kv-val">{result.daysUntilExpiry !== undefined ? `${result.daysUntilExpiry} days` : '—'}</span>
        </div>
        <div className="trd__kv-row">
        <span className="trd__kv-key">Status</span>
        <span className="trd__kv-val">
            {result.expiryStatus ? (
            <span className={`trd__ssl-badge trd__ssl-badge--${(EXPIRY_STATUS[result.expiryStatus]?.cls || 'valid')}`}>
                {EXPIRY_STATUS[result.expiryStatus]?.label || result.expiryStatus}
            </span>
            ) : '—'}
        </span>
        </div>
        <div className="trd__kv-row">
          <span className="trd__kv-key">Total certs found</span>
          <span className="trd__kv-val">{result.totalCertsFound ?? '—'}</span>
        </div>
      </div>

      {rawOutput && (
        <div className="trd__collapsible">
          <button className="trd__collapsible-trigger" onClick={() => setShowRaw((p) => !p)}>
            <span>Raw output</span>
            <svg viewBox="0 0 12 12" fill="none"
              style={{ transform: showRaw ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }}>
              <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          {showRaw && <pre className="trd__raw-pre">{rawOutput}</pre>}
        </div>
      )}
    </div>
  )
}