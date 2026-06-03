import { createPortal } from 'react-dom'
import { useEffect, useState } from 'react'
import './styles/TaskResultDrawer.css'

const STATUS_MAP = {
  COMPLETED: { label: 'Completed', cls: 'completed' },
  FAILED:    { label: 'Failed',    cls: 'failed' },
  PENDING:   { label: 'Pending',   cls: 'pending' },
  RUNNING:   { label: 'Running',   cls: 'running' },
}

// ── WHOIS specific renderer ───────────────────────────────────────────────────
function WhoisResult({ result, rawOutput }) {
  const [showDomainWhois, setShowDomainWhois] = useState(false)
  const [showIpWhois,     setShowIpWhois]     = useState(false)
  const [showRaw,         setShowRaw]         = useState(false)

  const summaryFields = [
    { label: 'Domain',      value: result.domain },
    { label: 'IP',          value: result.ip },
    { label: 'Registrant',  value: result.registrantName },
    { label: 'Registrar',   value: result.registrar },
    { label: 'Status',      value: result.status },
    { label: 'Created',     value: result.createdDate },
    { label: 'Updated',     value: result.updatedDate },
    { label: 'Nameservers', value: Array.isArray(result.nameservers) ? result.nameservers.join(', ') : result.nameservers },
    { label: 'DNSSEC',      value: result.dnssec },
    { label: 'IP Org',      value: result.ipOrg },
    { label: 'IP Country',  value: result.ipCountry },
    { label: 'IP City',     value: result.ipCity },
  ].filter((f) => f.value)

  return (
    <div className="trd__whois">

      {/* Summary */}
      <div className="trd__section-title">Summary</div>
      <div className="trd__kv-list">
        {summaryFields.map((f) => (
          <div key={f.label} className="trd__kv-row">
            <span className="trd__kv-key">{f.label}</span>
            <span className="trd__kv-val">{f.value}</span>
          </div>
        ))}
      </div>

      {/* Domain WHOIS collapsible */}
      {result.domainWhois && (
        <div className="trd__collapsible">
          <button
            className="trd__collapsible-trigger"
            onClick={() => setShowDomainWhois((p) => !p)}
          >
            <span>Domain WHOIS details</span>
            <svg viewBox="0 0 12 12" fill="none"
              style={{ transform: showDomainWhois ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }}>
              <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          {showDomainWhois && (
            <div className="trd__kv-list trd__kv-list--nested">
              {Object.entries(result.domainWhois).map(([k, v]) => (
                <div key={k} className="trd__kv-row">
                  <span className="trd__kv-key">{k}</span>
                  <span className="trd__kv-val">{typeof v === 'object' ? JSON.stringify(v) : String(v)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* IP WHOIS collapsible */}
      {result.ipWhois && (
        <div className="trd__collapsible">
          <button
            className="trd__collapsible-trigger"
            onClick={() => setShowIpWhois((p) => !p)}
          >
            <span>IP WHOIS details</span>
            <svg viewBox="0 0 12 12" fill="none"
              style={{ transform: showIpWhois ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }}>
              <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          {showIpWhois && (
            <div className="trd__kv-list trd__kv-list--nested">
              {Object.entries(result.ipWhois).map(([k, v]) => (
                <div key={k} className="trd__kv-row">
                  <span className="trd__kv-key">{k}</span>
                  <span className="trd__kv-val">{typeof v === 'object' ? JSON.stringify(v) : String(v)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Raw output collapsible */}
      {rawOutput && (
        <div className="trd__collapsible">
          <button
            className="trd__collapsible-trigger"
            onClick={() => setShowRaw((p) => !p)}
          >
            <span>Raw output</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {showRaw && (
                <button
                  className="trd__copy-btn"
                  onClick={(e) => { e.stopPropagation(); navigator.clipboard.writeText(rawOutput) }}
                >
                  <svg viewBox="0 0 14 14" fill="none">
                    <rect x="4" y="4" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1.2"/>
                    <path d="M2 10V2h8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                  </svg>
                  Copy
                </button>
              )}
              <svg viewBox="0 0 12 12" fill="none"
                style={{ transform: showRaw ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }}>
                <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </button>
          {showRaw && (
            <pre className="trd__raw-pre">{rawOutput}</pre>
          )}
        </div>
      )}

    </div>
  )
}

// ── Header specific renderer ───────────────────────────────────────────────────
function HeadersSection({ headers }) {
  return (
    <ContextSection title="Headers" icon={
      <svg viewBox="0 0 14 14" fill="none">
        <path d="M2 4h10M2 7h10M2 10h6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      </svg>
    }>
      <div className="ctx-kv-list">
        <KVRow label="HTTPS"       value={headers.httpsAvailable ? 'Yes' : 'No'} />
        <KVRow label="Status"      value={headers.httpStatusCode} />
        <KVRow label="Server"      value={headers.server} />
        <KVRow label="X-Powered-By" value={headers.xPoweredBy} />
        <KVRow label="X-Frame"     value={headers.xFrameOptions} />
        <KVRow label="CSP"         value={headers.contentSecurityPolicy} />
        <KVRow label="HSTS"        value={headers.strictTransportSecurity} />
        <KVRow label="CF-Ray"      value={headers.cfRay} />
      </div>

      {headers.allHeaders && Object.keys(headers.allHeaders).length > 0 && (
        <NestedSection label="All Headers" data={headers.allHeaders} />
      )}
    </ContextSection>
  )
}


function DnsHistoryResult({ result }) {
  const [showFull, setShowFull] = useState(false)
  return (
    <div>
      <div className="trd__section-title">Summary</div>
      <div className="trd__kv-list">
        <div className="trd__kv-row">
          <span className="trd__kv-key">Total Records</span>
          <span className="trd__kv-val">{result.totalRecords}</span>
        </div>
        <div className="trd__kv-row">
          <span className="trd__kv-key">Real IP Found</span>
          <span className="trd__kv-val" style={{ color: result.realIpFound ? '#059669' : '#dc2626', fontWeight: 600 }}>
            {result.realIpFound ? 'Yes' : 'No'}
          </span>
        </div>
        {result.realIp && (
          <div className="trd__kv-row">
            <span className="trd__kv-key">Real IP</span>
            <span className="trd__kv-val" style={{ color: '#059669', fontWeight: 600 }}>{result.realIp}</span>
          </div>
        )}
      </div>

      {result.nonCdnIps?.length > 0 && (
        <>
          <div className="trd__section-title" style={{ marginTop: 14 }}>Non-CDN IPs</div>
          <div className="trd__kv-list">
            {result.nonCdnIps.map((r, i) => (
              <div key={i} className="trd__kv-row">
                <span className="trd__kv-key">{r.ip}</span>
                <span className="trd__kv-val">{r.host} · {r.source}</span>
              </div>
            ))}
          </div>
        </>
      )}

      {result.fullHistory?.length > 0 && (
        <div className="trd__collapsible" style={{ marginTop: 10 }}>
          <button className="trd__collapsible-trigger" onClick={() => setShowFull((p) => !p)}>
            <span>Full History ({result.fullHistory.length} records)</span>
            <svg viewBox="0 0 12 12" fill="none"
              style={{ transform: showFull ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }}>
              <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          {showFull && (
            <div className="trd__kv-list trd__kv-list--nested">
              {result.fullHistory.map((r, i) => (
                <div key={i} className="trd__kv-row">
                  <span className="trd__kv-key" style={{ color: r.isCdn === 'false' ? '#059669' : undefined }}>
                    {r.ip}
                  </span>
                  <span className="trd__kv-val">
                    {r.host || r.type || ''} · {r.source}
                    {r.note ? ` · ${r.note}` : ''}
                    {r.isCdn === 'false' ? ' ✓ Real IP' : ''}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function DirectIpScanResult({ result }) {
  const f = result.findings || {}
  return (
    <div>
      <div className="trd__section-title">Scan Target</div>
      <div className="trd__kv-list">
        <div className="trd__kv-row">
          <span className="trd__kv-key">Scanned IP</span>
          <span className="trd__kv-val">{result.scannedIp}</span>
        </div>
        <div className="trd__kv-row">
          <span className="trd__kv-key">Domain</span>
          <span className="trd__kv-val">{result.domain}</span>
        </div>
      </div>

      <div className="trd__section-title" style={{ marginTop: 14 }}>Findings</div>
      <div className="trd__kv-list">
        <div className="trd__kv-row">
          <span className="trd__kv-key">Real Server</span>
          <span className="trd__kv-val">{f.realServer}</span>
        </div>
        <div className="trd__kv-row">
          <span className="trd__kv-key">HTTP</span>
          <span className="trd__kv-val" style={{ color: f.httpReachable ? '#059669' : '#dc2626' }}>
            {f.httpReachable ? `Reachable (${f.httpStatusCode})` : 'Not reachable'}
          </span>
        </div>
        <div className="trd__kv-row">
          <span className="trd__kv-key">HTTPS</span>
          <span className="trd__kv-val" style={{ color: f.httpsReachable ? '#059669' : '#dc2626' }}>
            {f.httpsReachable ? 'Reachable' : 'Not reachable'}
          </span>
        </div>
        <div className="trd__kv-row">
          <span className="trd__kv-key">SSL Termination</span>
          <span className="trd__kv-val">{f.sslTermination}</span>
        </div>
        <div className="trd__kv-row">
          <span className="trd__kv-key">Load Balanced</span>
          <span className="trd__kv-val">{f.loadBalanced ? 'Yes' : 'No'}</span>
        </div>
        <div className="trd__kv-row">
          <span className="trd__kv-key">Orchestration</span>
          <span className="trd__kv-val">{f.orchestration}</span>
        </div>
        {f.openPorts?.length > 0 && (
          <div className="trd__kv-row">
            <span className="trd__kv-key">Open Ports</span>
            <span className="trd__kv-val" style={{ color: '#b45309' }}>{f.openPorts.join(', ')}</span>
          </div>
        )}
        {f.closedPorts?.length > 0 && (
          <div className="trd__kv-row">
            <span className="trd__kv-key">Closed Ports</span>
            <span className="trd__kv-val">{f.closedPorts.join(', ')}</span>
          </div>
        )}
        {f.realTechStack?.length > 0 && (
          <div className="trd__kv-row">
            <span className="trd__kv-key">Tech Stack</span>
            <span className="trd__kv-val">{f.realTechStack.join(', ')}</span>
          </div>
        )}
      </div>

      {f.notes && (
        <div style={{ marginTop: 10, padding: '10px 12px', background: 'rgba(13,27,42,.04)', borderRadius: 8, fontFamily: 'var(--font-body)', fontSize: '.82rem', color: 'rgba(13,27,42,.6)', lineHeight: 1.5 }}>
          {f.notes}
        </div>
      )}
    </div>
  )
}

function SubdomainScanResult({ result }) {
  const [showAll, setShowAll] = useState(false)

  const FLAG_COLORS = {
    API_ENDPOINT:     '#7c3aed',
    ACCESSIBLE:       '#059669',
    DEV_ENVIRONMENT:  '#b45309',
    FORBIDDEN_EXISTS: '#b45309',
    REAL_IP_EXPOSED:  '#dc2626',
  }

  const SECURITY_COLORS = {
    STRONG:   '#059669',
    MODERATE: '#b45309',
    WEAK:     '#dc2626',
  }

  return (
    <div>
      <div className="trd__section-title">Summary</div>
      <div className="trd__kv-list">
        <div className="trd__kv-row">
          <span className="trd__kv-key">Total Scanned</span>
          <span className="trd__kv-val">{result.totalScanned}</span>
        </div>
        <div className="trd__kv-row">
          <span className="trd__kv-key">Flagged</span>
          <span className="trd__kv-val" style={{ color: result.flaggedCount > 0 ? '#b45309' : '#059669', fontWeight: 600 }}>
            {result.flaggedCount}
          </span>
        </div>
      </div>

      {result.flagged?.length > 0 && (
        <>
          <div className="trd__section-title" style={{ marginTop: 14 }}>Flagged Subdomains</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {result.flagged.map((s, i) => (
              <SubdomainRow key={i} sub={s} FLAG_COLORS={FLAG_COLORS} SECURITY_COLORS={SECURITY_COLORS} />
            ))}
          </div>
        </>
      )}

      {result.subdomains?.length > 0 && (
        <div className="trd__collapsible" style={{ marginTop: 12 }}>
          <button className="trd__collapsible-trigger" onClick={() => setShowAll((p) => !p)}>
            <span>All Subdomains ({result.subdomains.length})</span>
            <svg viewBox="0 0 12 12" fill="none"
              style={{ transform: showAll ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }}>
              <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          {showAll && (
            <div style={{ padding: '8px 0' }}>
              {result.subdomains.map((s, i) => (
                <SubdomainRow key={i} sub={s} FLAG_COLORS={FLAG_COLORS} SECURITY_COLORS={SECURITY_COLORS} compact />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function SubdomainRow({ sub, FLAG_COLORS, SECURITY_COLORS, compact }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ border: '1px solid rgba(13,27,42,.08)', borderRadius: 8, overflow: 'hidden' }}>
      <button
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '10px 14px', background: 'none', border: 'none', cursor: 'pointer', gap: 8 }}
        onClick={() => !compact && setOpen((p) => !p)}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 0 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', flexShrink: 0, background: sub.reachable ? '#10b981' : 'rgba(13,27,42,.2)' }} />
          <span style={{ fontFamily: 'monospace', fontSize: '.82rem', color: 'var(--color-navy)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {sub.subdomain}
          </span>
          {sub.statusCode && (
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '.7rem', color: 'rgba(13,27,42,.4)' }}>
              {sub.statusCode}
            </span>
          )}
        </div>
        <div style={{ display: 'flex', gap: 4, flexShrink: 0, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          {sub.flags?.map((f) => (
            <span key={f} style={{ fontFamily: 'var(--font-body)', fontSize: '.62rem', fontWeight: 600, padding: '1px 6px', borderRadius: 20, background: `${FLAG_COLORS[f] || '#6b7280'}18`, color: FLAG_COLORS[f] || '#6b7280' }}>
              {f.replace(/_/g, ' ')}
            </span>
          ))}
        </div>
      </button>
      {open && !compact && sub.analysis && (
        <div style={{ padding: '0 14px 12px', borderTop: '1px solid rgba(13,27,42,.06)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {sub.ip && <AnalysisRow label="IP" value={sub.ip} />}
            {sub.server && <AnalysisRow label="Server" value={sub.server} />}
            {sub.analysis.purpose && <AnalysisRow label="Purpose" value={sub.analysis.purpose} />}
            {sub.analysis.responseType && <AnalysisRow label="Response Type" value={sub.analysis.responseType} />}
            {sub.analysis.securityScore && (
              <AnalysisRow
                label="Security"
                value={`${sub.analysis.securityScore} — ${sub.analysis.securityRating}`}
                color={SECURITY_COLORS[sub.analysis.securityRating]}
              />
            )}
            {sub.cors && <AnalysisRow label="CORS" value={sub.cors} color="#dc2626" />}
            {sub.analysis.corsPolicy && <AnalysisRow label="CORS Policy" value={sub.analysis.corsPolicy} color="#dc2626" />}
            {sub.analysis.detectedTech?.length > 0 && (
              <AnalysisRow label="Tech" value={sub.analysis.detectedTech.join(', ')} />
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function AnalysisRow({ label, value, color }) {
  return (
    <div style={{ display: 'flex', gap: 12, padding: '6px 0', borderBottom: '1px solid rgba(13,27,42,.04)' }}>
      <span style={{ fontFamily: 'var(--font-body)', fontSize: '.7rem', fontWeight: 600, letterSpacing: '.05em', textTransform: 'uppercase', color: 'rgba(13,27,42,.35)', minWidth: 90, flexShrink: 0 }}>{label}</span>
      <span style={{ fontFamily: 'var(--font-body)', fontSize: '.82rem', color: color || 'var(--color-navy)', wordBreak: 'break-word' }}>{value}</span>
    </div>
  )
}

// ── Generic key-value renderer ────────────────────────────────────────────────
function GenericResult({ result, rawOutput }) {
  const [showRaw, setShowRaw] = useState(false)

  const topLevel = Object.entries(result).filter(([_, v]) =>
    v === null || typeof v !== 'object' || Array.isArray(v)
  )
  const nested = Object.entries(result).filter(([_, v]) =>
    v !== null && typeof v === 'object' && !Array.isArray(v)
  )

  return (
    <div className="trd__generic">
      <div className="trd__kv-list">
        {topLevel.map(([k, v]) => (
          <div key={k} className="trd__kv-row">
            <span className="trd__kv-key">{k}</span>
            <span className="trd__kv-val">
              {v === null ? '—' : Array.isArray(v) ? v.join(', ') : String(v)}
            </span>
          </div>
        ))}
      </div>

      {nested.map(([k, v]) => (
        <NestedSection key={k} label={k} data={v} />
      ))}

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

function NestedSection({ label, data }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="trd__collapsible">
      <button className="trd__collapsible-trigger" onClick={() => setOpen((p) => !p)}>
        <span>{label}</span>
        <svg viewBox="0 0 12 12" fill="none"
          style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }}>
          <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      {open && (
        <div className="trd__kv-list trd__kv-list--nested">
          {Object.entries(data).map(([k, v]) => (
            <div key={k} className="trd__kv-row">
              <span className="trd__kv-key">{k}</span>
              <span className="trd__kv-val">
                {v === null
                  ? '—'
                  : Array.isArray(v)
                    ? v.join(', ')
                    : typeof v === 'object'
                      ? JSON.stringify(v)
                      : String(v)
                }
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function TechStackResult({ result, rawOutput }) {
  const [showSources, setShowSources] = useState(false)

  const INFERRED_LABELS = {
    webServer: 'Web Server', language: 'Language', framework: 'Framework',
    rendering: 'Rendering', siteName: 'Site Name', cloud: 'Cloud',
    cdn: 'CDN', dns: 'DNS', deployment: 'Deployment', email: 'Email',
    analytics: 'Analytics', heatmap: 'Heatmap', payment: 'Payment',
    crm: 'CRM', support: 'Support', ecommerce: 'E-commerce', cms: 'CMS',
    backendHint: 'Backend Hint', requestTracking: 'Request Tracking', generator: 'Generator',
  }

  // task uses inferredFromHeaders, context uses inferred — handle both
  const inferred = result.inferredFromHeaders || result.inferred || {}

  return (
    <div className="trd__techstack">

      {result.detected?.length > 0 && (
        <>
          <div className="trd__section-title">Detected Technologies</div>
          <div className="trd__tags">
            {result.detected.map((t) => (
              <span key={t} className="trd__tag">{t}</span>
            ))}
          </div>
        </>
      )}

      {Object.keys(inferred).length > 0 && (
        <>
          <div className="trd__section-title" style={{ marginTop: 16 }}>Intelligence</div>
          <div className="trd__kv-list">
            {Object.entries(inferred)
              .filter(([_, v]) => v)
              .map(([k, v]) => (
                <div key={k} className="trd__kv-row">
                  <span className="trd__kv-key">{INFERRED_LABELS[k] || k}</span>
                  <span className="trd__kv-val">{String(v)}</span>
                </div>
              ))
            }
          </div>
        </>
      )}

      {result.sources && Object.keys(result.sources).length > 0 && (
        <div className="trd__collapsible" style={{ marginTop: 12 }}>
          <button className="trd__collapsible-trigger" onClick={() => setShowSources((p) => !p)}>
            <span>Analysis Sources</span>
            <svg viewBox="0 0 12 12" fill="none"
              style={{ transform: showSources ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }}>
              <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          {showSources && (
            <div className="trd__kv-list trd__kv-list--nested">
              {Object.entries(result.sources).map(([k, v]) => {
                const ok = v === 'analyzed'
                return (
                  <div key={k} className="trd__kv-row">
                    <span className="trd__kv-key">{k}</span>
                    <span className="trd__kv-val" style={{ color: ok ? '#059669' : '#dc2626' }}>
                      {String(v)}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

    </div>
  )
}

// ── Result router ─────────────────────────────────────────────────────────────
function renderResult(type, result, rawOutput) {
  if (typeof result === 'string') {
    return (
      <div className="trd__raw-block">
        <div className="trd__raw-header">
          <span className="trd__raw-label">Raw output</span>
          <button className="trd__copy-btn" onClick={() => navigator.clipboard.writeText(result)}>
            <svg viewBox="0 0 14 14" fill="none">
              <rect x="4" y="4" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1.2"/>
              <path d="M2 10V2h8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
            Copy
          </button>
        </div>
        <pre className="trd__raw-pre">{result}</pre>
      </div>
    )
  }

  if (typeof result === 'object' && result !== null) {
    if (type === 'WHOIS')    return <WhoisResult result={result} rawOutput={rawOutput} />
    if (type === 'SSL_CERT') return <SslResult   result={result} rawOutput={rawOutput} />
    if (type === 'TECH_STACK') return <TechStackResult result={result} rawOutput={rawOutput} />
    if (type === 'DNS_HISTORY')    return <DnsHistoryResult    result={result} rawOutput={rawOutput} />
    if (type === 'DIRECT_IP_SCAN') return <DirectIpScanResult  result={result} rawOutput={rawOutput} />
    if (type === 'SUBDOMAIN_SCAN') return <SubdomainScanResult result={result} rawOutput={rawOutput} />

    return <GenericResult result={result} rawOutput={rawOutput} />
  }

  return null
}

// ── Main drawer ───────────────────────────────────────────────────────────────
export default function TaskResultDrawer({ open, task, onClose }) {
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    if (open) document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  const s = task ? (STATUS_MAP[task.status] || STATUS_MAP.PENDING) : null

  return createPortal(
    <>
      <div
        className={`trd__overlay ${open ? 'trd__overlay--open' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className={`trd ${open ? 'trd--open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Task result"
      >
        {task && (
          <>
            <div className="trd__header">
              <div className="trd__header-left">
                <span className="trd__type">{task.type}</span>
                <span className={`trd__badge trd__badge--${s.cls}`}>{s.label}</span>
              </div>
              <button className="trd__close" onClick={onClose} aria-label="Close">
                <svg viewBox="0 0 16 16" fill="none">
                  <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </button>
            </div>

            <div className="trd__meta">
              {task.completedAt && (
                <span className="trd__meta-item">
                  <svg viewBox="0 0 14 14" fill="none" className="trd__meta-icon">
                    <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.2"/>
                    <path d="M7 4v3.5l2 1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                  </svg>
                  {task.completedAt.slice(0, 16).replace('T', ' ')}
                </span>
              )}
              {task.tool && (
                <span className="trd__meta-item">
                  <svg viewBox="0 0 14 14" fill="none" className="trd__meta-icon">
                    <path d="M2 12L6 8M9 2l3 3-5 5-3-1-1-3 5-5-.5 1Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  {task.tool}
                </span>
              )}
            </div>

            <div className="trd__scroll">
              {task.status === 'FAILED' ? (
                <div className="trd__error-block">
                  <div className="trd__error-icon">
                    <svg viewBox="0 0 20 20" fill="none">
                      <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.4"/>
                      <path d="M10 6v4M10 13h.01" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <div>
                    <p className="trd__error-title">Task failed</p>
                    <p className="trd__error-msg">{task.errorMessage || 'No error details available.'}</p>
                  </div>
                </div>
              ) : task.result ? (
                <div className="trd__result-sections">
                  {renderResult(task.type, task.result, task.rawOutput)}
                </div>
              ) : (
                <div className="trd__no-result">No result data available.</div>
              )}
            </div>
          </>
        )}
      </div>
    </>,
    document.body
  )
}