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
  return (
    <ContextSection title="Tech Stack" icon={
      <svg viewBox="0 0 14 14" fill="none">
        <path d="M2 4.5l5-3 5 3v5l-5 3-5-3v-5Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
      </svg>
    }>
      <div className="ctx-kv-list">
        <KVRow label="BuiltWith"   value={tech.builtWith} />
        <KVRow label="Wappalyzer" value={tech.wappalyzer} />
        <KVRow label="Web Server" value={tech.webServer} />
        <KVRow label="Language"   value={tech.language} />
        <KVRow label="CDN"        value={tech.cdn} />
      </div>
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
        </div>
      )}
    </div>
  )
}