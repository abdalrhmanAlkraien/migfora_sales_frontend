import { useState } from 'react'
import './styles/InvestigationContext.css'

const PERFORMANCE_RATING = {
  EXCELLENT: { label: 'Excellent', cls: 'excellent' },
  GOOD:      { label: 'Good',      cls: 'good' },
  AVERAGE:   { label: 'Average',   cls: 'average' },
  POOR:      { label: 'Poor',      cls: 'poor' },
}

function ContextSection({ title, icon, children }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="ctx-section">
      <button className="ctx-section__trigger" onClick={() => setOpen((p) => !p)}>
        <div className="ctx-section__trigger-left">
          <span className="ctx-section__icon">{icon}</span>
          <span className="ctx-section__title">{title}</span>
        </div>
        <svg viewBox="0 0 12 12" fill="none" className="ctx-section__chevron"
          style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }}>
          <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      {open && <div className="ctx-section__body">{children}</div>}
    </div>
  )
}

function KVRow({ label, value }) {
  if (!value && value !== 0 && value !== false) return null
  return (
    <div className="ctx-kv-row">
      <span className="ctx-kv-key">{label}</span>
      <span className="ctx-kv-val">
        {Array.isArray(value) ? value.join(', ') : String(value)}
      </span>
    </div>
  )
}

function DnsSection({ dns, nsLookup }) {
  return (
    <ContextSection title="DNS" icon={
      <svg viewBox="0 0 14 14" fill="none">
        <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.2"/>
        <path d="M7 1.5C7 1.5 5 4 5 7s2 5.5 2 5.5M7 1.5C7 1.5 9 4 9 7s-2 5.5-2 5.5M1.5 7h11" stroke="currentColor" strokeWidth="1.2"/>
      </svg>
    }>
      <div className="ctx-kv-list">
        <KVRow label="Resolved IP"  value={dns.resolvedIp} />
        <KVRow label="CDN"          value={dns.cdnDetected ? `${dns.cdnProvider || 'Detected'}` : 'Not detected'} />
        <KVRow label="A Records"    value={dns.aRecords} />
        <KVRow label="MX Records"   value={dns.mxRecords?.length ? dns.mxRecords : null} />
        <KVRow label="TXT Records"  value={dns.txtRecords?.length ? dns.txtRecords : null} />
        <KVRow label="Nameservers"  value={dns.nsRecords} />
      </div>
      {dns.cdnDetected && (
        <div className="ctx-cdn-badge">
          <svg viewBox="0 0 14 14" fill="none">
            <path d="M7 1.5L1.5 11.5h11L7 1.5Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
            <path d="M7 6v2.5M7 10h.01" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
          </svg>
          CDN detected — {dns.cdnProvider} — IP may not reflect origin server
        </div>
      )}
    </ContextSection>
  )
}

// ── WHOIS specific renderer ───────────────────────────────────────────────────

function WhoisSection({ whois }) {
  return (
    <ContextSection title="WHOIS" icon={
      <svg viewBox="0 0 14 14" fill="none">
        <rect x="2" y="1.5" width="10" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
        <path d="M4.5 5h5M4.5 7.5h5M4.5 10h3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      </svg>
    }>
      <div className="ctx-kv-list">
        <KVRow label="Registrant"  value={whois.registrantName} />
        <KVRow label="Registrar"   value={whois.registrar} />
        <KVRow label="Status"      value={whois.status} />
        <KVRow label="Created"     value={whois.createdDate} />
        <KVRow label="Updated"     value={whois.updatedDate} />
        <KVRow label="Nameservers" value={whois.nameservers} />
        <KVRow label="DNSSEC"      value={whois.dnssec} />
        <KVRow label="IP Org"      value={whois.ipOrg} />
        <KVRow label="IP Location" value={[whois.ipCity, whois.ipCountry].filter(Boolean).join(', ')} />
      </div>
    </ContextSection>
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
        <KVRow label="HTTPS"        value={headers.httpsAvailable ? 'Available' : 'Not available'} />
        <KVRow label="Status"       value={headers.httpStatusCode} />
        <KVRow label="Server"       value={headers.server} />
        <KVRow label="X-Powered-By" value={headers.xPoweredBy} />
        <KVRow label="X-Frame"      value={headers.xFrameOptions} />
        <KVRow label="CSP"          value={headers.contentSecurityPolicy} />
        <KVRow label="HSTS"         value={headers.strictTransportSecurity} />
        <KVRow label="CF-Ray"       value={headers.cfRay} />
      </div>

      {headers.allHeaders && Object.keys(headers.allHeaders).length > 0 && (
        <AllHeadersSection allHeaders={headers.allHeaders} />
      )}
    </ContextSection>
  )
}

function AllHeadersSection({ allHeaders }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="ctx-collapsible">
      <button className="ctx-collapsible-trigger" onClick={() => setOpen((p) => !p)}>
        <span>All Headers ({Object.keys(allHeaders).length})</span>
        <svg viewBox="0 0 12 12" fill="none"
          style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }}>
          <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      {open && (
        <div className="ctx-kv-list ctx-kv-list--nested">
          {Object.entries(allHeaders).map(([k, v]) => (
            <div key={k} className="ctx-kv-row">
              <span className="ctx-kv-key">{k}</span>
              <span className="ctx-kv-val">{String(v)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function PerformanceSection({ perf }) {
  const RATING_MAP = {
    EXCELLENT: { label: 'Excellent', cls: 'excellent' },
    GOOD:      { label: 'Good',      cls: 'good' },
    AVERAGE:   { label: 'Average',   cls: 'average' },
    POOR:      { label: 'Poor',      cls: 'poor' },
  }
  const rating = RATING_MAP[perf.rating] || { label: perf.rating, cls: 'average' }

  const formatSize = (bytes) => {
    if (!bytes) return null
    if (bytes < 1024)        return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <ContextSection title="Performance" icon={
      <svg viewBox="0 0 14 14" fill="none">
        <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.2"/>
        <path d="M7 4v3.5l2 1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      </svg>
    }>
      <div className="ctx-kv-list">
        <KVRow label="TTFB"        value={perf.ttfbMs    !== undefined ? `${perf.ttfbMs} ms`    : null} />
        <KVRow label="DNS"         value={perf.dnsMs     !== undefined ? `${perf.dnsMs} ms`     : null} />
        <KVRow label="Connect"     value={perf.connectMs !== undefined ? `${perf.connectMs} ms` : null} />
        <KVRow label="TLS"         value={perf.tlsMs     !== undefined ? `${perf.tlsMs} ms`     : null} />
        <KVRow label="Total"       value={perf.totalMs   !== undefined ? `${perf.totalMs} ms`   : null} />
        <KVRow label="HTTP Code"   value={perf.httpCode} />
        <KVRow label="Page Size"   value={formatSize(perf.sizeBytes)} />
      </div>
      <div style={{ marginTop: 8 }}>
        <span className={`ctx-perf-rating ctx-perf-rating--${rating.cls}`}>
          {rating.label}
        </span>
      </div>
    </ContextSection>
  )
}

// ── SSL specific renderer ───────────────────────────────────────────────────

function SslSection({ ssl }) {
  const EXPIRY_STATUS = {
    VALID:         { label: 'Valid',         cls: 'valid' },
    EXPIRING_SOON: { label: 'Expiring Soon', cls: 'expiring-soon' },
    EXPIRED:       { label: 'Expired',       cls: 'expired' },
  }

  return (
    <ContextSection title="SSL Certificate" icon={
      <svg viewBox="0 0 14 14" fill="none">
        <rect x="2.5" y="6" width="9" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
        <path d="M4.5 6V4a2.5 2.5 0 0 1 5 0v2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      </svg>
    }>
      <div className="ctx-kv-list">
        <KVRow label="Issuer"            value={ssl.issuer} />
        <KVRow label="Expiry"            value={ssl.expiry?.slice(0, 10)} />
        <KVRow label="Valid"             value={ssl.valid ? 'Yes' : 'No'} />
        <KVRow label="Days until expiry" value={ssl.daysUntilExpiry !== undefined ? `${ssl.daysUntilExpiry} days` : null} />
        <KVRow label="Certs found"       value={ssl.totalCertsFound} />
      </div>
      {ssl.expiryStatus && (
        <div style={{ marginTop: 8 }}>
          <span className={`ctx-ssl-badge ctx-ssl-badge--${(EXPIRY_STATUS[ssl.expiryStatus]?.cls || 'valid')}`}>
            {EXPIRY_STATUS[ssl.expiryStatus]?.label || ssl.expiryStatus}
          </span>
        </div>
      )}
    </ContextSection>
  )
}

function TechStackSection({ tech }) {
  const INFERRED_LABELS = {
    webServer:       'Web Server',
    language:        'Language',
    framework:       'Framework',
    rendering:       'Rendering',
    siteName:        'Site Name',
    cloud:           'Cloud',
    cdn:             'CDN',
    dns:             'DNS',
    deployment:      'Deployment',
    email:           'Email',
    analytics:       'Analytics',
    heatmap:         'Heatmap',
    payment:         'Payment',
    crm:             'CRM',
    support:         'Support',
    ecommerce:       'E-commerce',
    cms:             'CMS',
    backendHint:     'Backend Hint',
    requestTracking: 'Request Tracking',
    generator:       'Generator',
  }

  const [showSources, setShowSources] = useState(false)

  return (
    <ContextSection title="Tech Stack" icon={
      <svg viewBox="0 0 14 14" fill="none">
        <path d="M2 4.5l5-3 5 3v5l-5 3-5-3v-5Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
      </svg>
    }>

      {/* Detected technologies */}
      {tech.detected?.length > 0 && (
        <>
          <div className="ctx-section-label">Detected Technologies</div>
          <div className="ctx-tags">
            {tech.detected.map((t) => (
              <span key={t} className="ctx-tag">{t}</span>
            ))}
          </div>
        </>
      )}

      {/* Inferred intel */}
      {tech.inferred && Object.keys(tech.inferred).length > 0 && (
        <>
          <div className="ctx-section-label" style={{ marginTop: 14 }}>Intelligence</div>
          <div className="ctx-kv-list">
            {Object.entries(tech.inferred)
              .filter(([_, v]) => v)
              .map(([k, v]) => (
                <div key={k} className="ctx-kv-row">
                  <span className="ctx-kv-key">{INFERRED_LABELS[k] || k}</span>
                  <span className="ctx-kv-val">{String(v)}</span>
                </div>
              ))
            }
          </div>
        </>
      )}

      {/* Sources */}
      {tech.sources && Object.keys(tech.sources).length > 0 && (
        <div className="ctx-collapsible" style={{ marginTop: 10 }}>
          <button className="ctx-collapsible-trigger" onClick={() => setShowSources((p) => !p)}>
            <span>Analysis Sources</span>
            <svg viewBox="0 0 12 12" fill="none"
              style={{ transform: showSources ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }}>
              <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          {showSources && (
            <div className="ctx-kv-list ctx-kv-list--nested">
              {Object.entries(tech.sources).map(([k, v]) => {
                const ok = v === 'analyzed'
                return (
                  <div key={k} className="ctx-kv-row">
                    <span className="ctx-kv-key">{k}</span>
                    <span className="ctx-kv-val" style={{ color: ok ? '#059669' : '#dc2626' }}>
                      {String(v)}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

    </ContextSection>
  )
}

function SubdomainsSection({ sub }) {
  return (
    <ContextSection title="Subdomains" icon={
      <svg viewBox="0 0 14 14" fill="none">
        <circle cx="7" cy="3" r="1.5" stroke="currentColor" strokeWidth="1.2"/>
        <circle cx="3" cy="11" r="1.5" stroke="currentColor" strokeWidth="1.2"/>
        <circle cx="11" cy="11" r="1.5" stroke="currentColor" strokeWidth="1.2"/>
        <path d="M7 4.5v2M7 6.5L3 9.5M7 6.5l4 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      </svg>
    }>
      <div className="ctx-kv-list">
        <KVRow label="Total"  value={sub.total} />
        <KVRow label="Source" value={sub.source} />
      </div>
      {sub.subdomains?.length > 0 && (
        <div className="ctx-tags">
          {sub.subdomains.map((s) => (
            <span key={s} className="ctx-tag">{s}</span>
          ))}
        </div>
      )}
    </ContextSection>
  )
}

function IpInfoSection({ ipInfo }) {
  return (
    <ContextSection title="IP Info" icon={
      <svg viewBox="0 0 14 14" fill="none">
        <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.2"/>
        <path d="M7 5h.01M7 7v3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      </svg>
    }>
      <div className="ctx-kv-list">
        <KVRow label="IP"       value={ipInfo.ip} />
        <KVRow label="Hostname" value={ipInfo.hostname} />
        <KVRow label="Org"      value={ipInfo.org} />
        <KVRow label="ASN"      value={ipInfo.asn} />
        <KVRow label="City"     value={ipInfo.city} />
        <KVRow label="Region"   value={ipInfo.region} />
        <KVRow label="Country"  value={ipInfo.country} />
        <KVRow label="Timezone" value={ipInfo.timezone} />
      </div>
    </ContextSection>
  )
}

function ShodanSection({ shodan }) {
  return (
    <ContextSection title="Shodan" icon={
      <svg viewBox="0 0 14 14" fill="none">
        <rect x="1.5" y="3" width="11" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
        <path d="M4 7h2M8 7h2M4 9.5h6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      </svg>
    }>
      <div className="ctx-kv-list">
        <KVRow label="IP"           value={shodan.ip} />
        <KVRow label="Organization" value={shodan.organization} />
        <KVRow label="ISP"          value={shodan.isp} />
        <KVRow label="Location"     value={[shodan.city, shodan.country].filter(Boolean).join(', ')} />
        <KVRow label="Open Ports"   value={shodan.openPorts} />
        <KVRow label="Tags"         value={shodan.tags} />
      </div>
      {shodan.services && Object.keys(shodan.services).length > 0 && (
        <div className="ctx-services">
          <span className="ctx-services-title">Services</span>
          <div className="ctx-tags">
            {Object.entries(shodan.services).map(([port, svc]) => (
              <span key={port} className="ctx-tag">:{port} {svc}</span>
            ))}
          </div>
        </div>
      )}
    </ContextSection>
  )
}

function DnsHistorySection({ dnsHistory }) {
  const [showFull, setShowFull] = useState(false)
  return (
    <ContextSection title="DNS History" icon={
      <svg viewBox="0 0 14 14" fill="none">
        <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.2"/>
        <path d="M7 4v3l2 1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      </svg>
    }>
      <div className="ctx-kv-list">
        <KVRow label="Total Records" value={dnsHistory.totalRecords} />
        <KVRow label="Real IP Found" value={dnsHistory.realIpFound ? 'Yes' : 'No'} />
        {dnsHistory.realIp && (
          <div className="ctx-kv-row">
            <span className="ctx-kv-key">Real IP</span>
            <span className="ctx-kv-val" style={{ color: '#059669', fontWeight: 600 }}>{dnsHistory.realIp}</span>
          </div>
        )}
      </div>

      {dnsHistory.nonCdnIps?.length > 0 && (
        <>
          <div className="ctx-section-label" style={{ marginTop: 10 }}>Non-CDN IPs</div>
          <div className="ctx-kv-list">
            {dnsHistory.nonCdnIps.map((r, i) => (
              <div key={i} className="ctx-kv-row">
                <span className="ctx-kv-key" style={{ color: '#059669' }}>{r.ip}</span>
                <span className="ctx-kv-val">{r.host}</span>
              </div>
            ))}
          </div>
        </>
      )}

      {dnsHistory.fullHistory?.length > 0 && (
        <div className="ctx-collapsible" style={{ marginTop: 10 }}>
          <button className="ctx-collapsible-trigger" onClick={() => setShowFull((p) => !p)}>
            <span>Full History ({dnsHistory.fullHistory.length})</span>
            <svg viewBox="0 0 12 12" fill="none"
              style={{ transform: showFull ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }}>
              <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          {showFull && (
            <div className="ctx-kv-list ctx-kv-list--nested">
              {dnsHistory.fullHistory.map((r, i) => (
                <div key={i} className="ctx-kv-row">
                  <span className="ctx-kv-key" style={{ color: r.isCdn === 'false' ? '#059669' : undefined }}>
                    {r.ip}
                  </span>
                  <span className="ctx-kv-val">
                    {r.host || r.type || ''}{r.note ? ` · ${r.note}` : ''}{r.isCdn === 'false' ? ' ✓' : ''}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </ContextSection>
  )
}

function DirectScanSection({ directScan }) {
  return (
    <ContextSection title="Direct IP Scan" icon={
      <svg viewBox="0 0 14 14" fill="none">
        <circle cx="7" cy="7" r="2" stroke="currentColor" strokeWidth="1.2"/>
        <path d="M7 1.5v2M7 10.5v2M1.5 7h2M10.5 7h2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      </svg>
    }>
      <div className="ctx-kv-list">
        <KVRow label="Scanned IP"    value={directScan.scannedIp} />
        <KVRow label="Real Server"   value={directScan.realServer} />
        <KVRow label="HTTP"          value={directScan.httpReachable ? 'Reachable' : 'Not reachable'} />
        <KVRow label="HTTPS"         value={directScan.httpsReachable ? 'Reachable' : 'Not reachable'} />
        <KVRow label="Load Balanced" value={directScan.loadBalanced ? 'Yes' : 'No'} />
        <KVRow label="Orchestration" value={directScan.orchestration} />
      </div>
    </ContextSection>
  )
}

function SubdomainScanSection({ subdomainScan }) {
  const FLAG_COLORS = {
    API_ENDPOINT:     '#7c3aed',
    ACCESSIBLE:       '#059669',
    DEV_ENVIRONMENT:  '#b45309',
    FORBIDDEN_EXISTS: '#b45309',
    REAL_IP_EXPOSED:  '#dc2626',
  }

  return (
    <ContextSection title="Subdomain Scan" icon={
      <svg viewBox="0 0 14 14" fill="none">
        <circle cx="7" cy="3" r="1.5" stroke="currentColor" strokeWidth="1.2"/>
        <circle cx="3" cy="11" r="1.5" stroke="currentColor" strokeWidth="1.2"/>
        <circle cx="11" cy="11" r="1.5" stroke="currentColor" strokeWidth="1.2"/>
        <path d="M7 4.5v2M7 6.5L3 9.5M7 6.5l4 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      </svg>
    }>
      <div className="ctx-kv-list">
        <KVRow label="Total Scanned" value={subdomainScan.totalScanned} />
        <KVRow label="Flagged"       value={subdomainScan.flaggedCount} />
      </div>

      {subdomainScan.flagged?.length > 0 && (
        <>
          <div className="ctx-section-label" style={{ marginTop: 10 }}>Flagged</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {subdomainScan.flagged.map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 10px', background: 'rgba(13,27,42,.03)', borderRadius: 7, border: '1px solid rgba(13,27,42,.07)' }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', flexShrink: 0, background: s.reachable ? '#10b981' : 'rgba(13,27,42,.2)' }} />
                <span style={{ fontFamily: 'monospace', fontSize: '.78rem', color: 'var(--color-navy)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {s.subdomain}
                </span>
                <div style={{ display: 'flex', gap: 3, flexShrink: 0 }}>
                  {s.flags?.map((f) => (
                    <span key={f} style={{ fontFamily: 'var(--font-body)', fontSize: '.6rem', fontWeight: 600, padding: '1px 5px', borderRadius: 20, background: `${FLAG_COLORS[f] || '#6b7280'}18`, color: FLAG_COLORS[f] || '#6b7280' }}>
                      {f.replace(/_/g, ' ')}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {subdomainScan.subdomains?.length > 0 && (
        <>
          <div className="ctx-section-label" style={{ marginTop: 10 }}>
            All Subdomains ({subdomainScan.subdomains.length})
          </div>
          <div className="ctx-tags">
            {subdomainScan.subdomains.map((s, i) => (
              <span key={i} className="ctx-tag" style={{ fontFamily: 'monospace', fontSize: '.72rem' }}>
                {s.subdomain}
              </span>
            ))}
          </div>
        </>
      )}
    </ContextSection>
  )
}

export default function InvestigationContext({ context, loading, onRefresh }) {
  if (loading) {
    return (
      <div className="inv-ctx inv-ctx--loading">
        <div className="inv-ctx__spinner" />
        Loading context…
      </div>
    )
  }

  const hasData = context && Object.entries(context)
    .filter(([k]) => !['investigationId', 'updatedAt'].includes(k))
    .some(([_, v]) => v !== null)
    

  return (
    <div className="inv-ctx">
      <div className="inv-ctx__header">
        <div className="inv-ctx__header-left">
          <h3 className="inv-ctx__title">Investigation Context</h3>
          {context?.updatedAt && (
            <span className="inv-ctx__updated">
              Updated {context.updatedAt.slice(0, 16).replace('T', ' ')}
            </span>
          )}
        </div>
        <button className="inv-ctx__refresh" onClick={onRefresh} title="Refresh context">
          <svg viewBox="0 0 16 16" fill="none">
            <path d="M2 8a6 6 0 1 1 1.5 4M2 12V8h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Refresh
        </button>
      </div>

      {!hasData ? (
        <div className="inv-ctx__empty">
          <svg viewBox="0 0 48 48" fill="none" className="inv-ctx__empty-icon">
            <circle cx="24" cy="24" r="18" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M24 16v8M24 28h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <p>No tasks have run yet</p>
          <span>Run tasks below to populate the investigation context</span>
        </div>
      ) : (
        <div className="inv-ctx__sections">
          {context.dns        && <DnsSection        dns={context.dns} nsLookup={context.nsLookup} />}
          {context.whois      && <WhoisSection      whois={context.whois} />}
          {context.headers    && <HeadersSection    headers={context.headers} />}
          {context.performance && <PerformanceSection perf={context.performance} />}
          {context.ssl        && <SslSection        ssl={context.ssl} />}
          {context.techStack  && <TechStackSection  tech={context.techStack} />}
          {context.subdomains && <SubdomainsSection sub={context.subdomains} />}
          {context.ipInfo     && <IpInfoSection     ipInfo={context.ipInfo} />}
          {context.shodan     && <ShodanSection     shodan={context.shodan} />}
          {context.dnsHistory    && <DnsHistorySection    dnsHistory={context.dnsHistory} />}
          {context.directScan    && <DirectScanSection    directScan={context.directScan} />}
          {context.subdomainScan && <SubdomainScanSection subdomainScan={context.subdomainScan} />}
        </div>
      )}
    </div>
  )
}