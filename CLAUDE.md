# CLAUDE.md — MIGFORA Sales Intelligence Frontend

This file tells Claude how this project is structured, what conventions to follow, and what has already been built. Read this before making any changes.

---

## Project Identity

**Product:** MIGFORA Sales Intelligence Platform
**Stack:** React 18 + Vite, React Router v6, Zustand, Axios, plain CSS
**Language:** JavaScript only — no TypeScript
**Backend:** Spring Boot (separate repo), runs on `http://localhost:8080`
**Auth:** AWS Cognito — JWT tokens (accessToken, refreshToken, idToken)

---

## Non-negotiable Rules

1. **No TypeScript** — `.jsx` and `.js` files only
2. **No CSS frameworks** — plain CSS with BEM-style class names
3. **No component libraries** — build everything from scratch
4. **Portal pattern for overlays** — all drawers, modals, dropdowns use `createPortal(…, document.body)` with `position: fixed`
5. **Zustand for global state** — auth store only; component state for everything else
6. **One API file per domain** — `companies.js`, `contacts.js`, etc. in `src/api/`
7. **No `any` workarounds** — handle null/undefined explicitly

---

## File Naming Conventions

| Type | Convention | Example |
|------|-----------|---------|
| Pages | PascalCase | `CompanyProfile.jsx` |
| Components | PascalCase | `ContactEditDrawer.jsx` |
| CSS | same name as component, in `styles/` subfolder | `styles/ContactEditDrawer.css` |
| API modules | camelCase domain name | `investigations.js` |
| Store | camelCase + Store suffix | `authStore.js` |

---

## CSS Class Naming

BEM-style with component prefix:

```css
.company-profile__header          /* block__element */
.company-profile__btn--primary     /* block__element--modifier */
```

Page CSS goes in `src/pages/styles/`.
Component CSS goes in `src/components/{domain}/styles/`.

---

## Design System Tokens

Always use these CSS variables — never hardcode colors:

```css
--color-navy:      #0D1B2A
--color-orange:    #FF9900
--color-navy-2:    #162233
--color-navy-3:    #1E2D40
--color-orange-2:  #FFB347
--color-darkest:   #080F18
--color-off-white: #F8F9FB
--color-white:     #FFFFFF

--font-heading: 'Syne'
--font-body:    'DM Sans'

--navbar-height:    64px
--subnavbar-height: 40px
--sidebar-width:    260px
```

---

## Z-Index Scale

| Layer | Value |
|-------|-------|
| Navbar | 851 |
| SubNavbar | 850 |
| Sidebar background | 953 |
| Sidebar | 954 |
| Drawer overlay | 1300 |
| Drawer | 1301 |
| Modal overlay | 1400 |
| Modal | 1401 |

---

## Auth Store Shape

```js
// src/store/authStore.js
{
  token:             string | null,   // accessToken
  refreshToken:      string | null,
  idToken:           string | null,
  user:              object | null,   // { sub, email, name, familyName, groups, isAdmin }
  challengeSession:  string | null,   // NEW_PASSWORD_REQUIRED session
  challengeEmail:    string | null,
  temporaryPassword: string | null,   // stored for change-password API call
}
```

**Role check pattern:**
```js
const user    = useAuthStore((s) => s.user)
const groups  = user?.['cognito:groups'] || user?.groups || []
const isAdmin = groups.includes('admin_group')
```

---

## API Module Pattern

```js
// src/api/companies.js
import axiosInstance from './axiosInstance'

export const getCompaniesApi   = (params) => axiosInstance.get('/companies', { params })
export const getCompanyApi     = (id)     => axiosInstance.get(`/companies/${id}`)
export const createCompanyApi  = (data)   => axiosInstance.post('/companies', data)
export const updateCompanyApi  = (id, data) => axiosInstance.patch(`/companies/${id}`, data)
export const deleteCompanyApi  = (id)     => axiosInstance.delete(`/companies/${id}`)
```

axiosInstance handles:
- Base URL from `VITE_API_BASE_URL`
- Bearer token injection on every request
- 401 → queue requests → refresh token → retry
- If refresh fails → clearAuth() → redirect to /login

---

## Page Pattern

```jsx
export default function SomePage() {
  const [data,    setData]    = useState([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState('')

  useEffect(() => {
    const fetch = async () => {
      setLoading(true)
      try {
        const { data } = await getSomeApi()
        setData(data)
      } catch {
        setError('Failed to load.')
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [])

  if (loading) return <div className="page__loading">Loading…</div>
  if (error)   return <div className="page__error">{error}</div>
  return <div className="page">…</div>
}
```

---

## Drawer Pattern

All drawers use:
- `createPortal(…, document.body)`
- `position: fixed; top:0; right:0; bottom:0; width: 460px`
- `transform: translateX(100%)` → `translateX(0)` on open
- `z-index: 1301` (overlay at 1300)
- `document.body.style.overflow = open ? 'hidden' : ''` in useEffect
- Escape key closes the drawer

---

## Modal Pattern

All modals use:
- `createPortal(…, document.body)`
- `position: fixed; inset: 0` backdrop
- Centered box with `max-width`
- `z-index: 1401` (backdrop at 1400)
- Animation: `scale(.95) → scale(1)`

---

## Polling Pattern

Used for task results and report generation:

```js
const poll = async () => {
  if (stopped) return
  try {
    const { data } = await getResultApi(id)
    if (data.status === 'COMPLETED') {
      stopped = true
      // handle success
      return
    }
    if (data.status === 'FAILED') {
      stopped = true
      // handle failure
      return
    }
    count++
    if (count < MAX_POLLS) setTimeout(poll, INTERVAL)
    else { stopped = true; /* timeout */ }
  } catch {
    count++
    if (!stopped && count < MAX_POLLS) setTimeout(poll, INTERVAL)
  }
}
setTimeout(poll, INTERVAL)
```

---

## Routes

All routes are in `src/routes/AppRoutes.jsx`.

| Path | Component | Guard |
|------|-----------|-------|
| `/login` | Login | public |
| `/change-password` | ChangePassword | public |
| `/dashboard` | Dashboard | auth |
| `/companies` | Companies | auth |
| `/companies/new` | CreateCompany | auth |
| `/companies/:id` | CompanyProfile | auth |
| `/companies/:id/investigations` | CompanyInvestigations | auth |
| `/companies/:id/investigations/new` | CreateInvestigation | auth |
| `/investigations/:id` | InvestigationDetail | auth |
| `/investigations/:id/lab` | InvestigationLab | auth |
| `/companies/:id/contacts` | CompanyContacts | auth |
| `/companies/:id/contacts/new` | CreateContact | auth |
| `/contacts/:id` | ContactDetail | auth |
| `/companies/:id/reports` | CompanyReports | auth |
| `/reports/:id` | ReportDetail | auth |
| `/users` | UserManagement | adminOnly |
| `/users/:sub` | UserDetail | adminOnly |
| `/profile` | UserProfile | auth |
| `/admin/jobs` | AdminJobs | adminOnly |

---

## What Has Been Built

### Auth
- Login with email/password
- NEW_PASSWORD_REQUIRED challenge → change password page
- Silent token refresh on 401
- Zustand store persisted in localStorage

### Companies
- List with search, status filter, sort, pagination
- Company profile with stats bar and recent sections (investigations, contacts, reports)
- Create, edit (drawer), delete with confirm dialog

### Investigations
- List per company with progress bars
- Investigation detail with task list and "View result" drawer
- Investigation Lab:
  - **One by One** — check dependencies → run → poll result
  - **Run All** — trigger all tasks, poll progress
  - **Pipeline** — custom ordered sequence with validate → save → run
- Investigation Context panel — collapsible sections:
  DNS, WHOIS, Headers (+ all headers collapsible), Performance, SSL (with expiry badge), Tech Stack (detected + inferred + sources), Subdomains, IP Info, Shodan, DNS History, Direct IP Scan, Subdomain Scan

### Task Types Supported
`DNS_LOOKUP`, `WHOIS`, `HEADERS`, `TECH_STACK`, `SSL_CERT`, `PERFORMANCE`, `SUBDOMAINS`, `IP_INFO`, `SHODAN`, `CENSYS`, `DNS_HISTORY`, `DIRECT_IP_SCAN`, `SUBDOMAIN_SCAN`

### Contacts
- List per company with search, status filter pills
- Quick status change via portal dropdown
- Contact detail with follow-up history timeline
- Follow-up drawer: type, date/time, status, notes, outcome (when DONE)
- Create, edit (drawer), delete

### Reports
- Generate from investigation detail — select type → poll → done/failed
- Report types: `TECHNICAL_OVERVIEW`, `SALES_ROADMAP`
- List per company with status badges
- Report detail with full markdown renderer (h1/h2/h3, bold, italic, code, tables, lists, hr)
- Download PDF via pre-signed S3 URL

### Users (Admin Only)
- List with search, role badge, status badge, enable/disable toggle
- Invite user — name, email, phone, role selection
- User detail — edit drawer, reset password (sends email), delete
- User profile (all users) — view info, edit profile, change password form

### Dashboard
- **Admin view:** 7 stat cards, follow-ups today, recent companies, recent investigations, contact pipeline bars
- **Sales view:** 4 stat cards, follow-ups today, recent companies
- All data from real APIs with skeleton loading states

### Admin Jobs
- Follow-up reminders trigger — sends emails to all users for today's follow-ups

---

## SubNavbar Dynamic Titles

Defined in `src/components/SubNavbar.jsx` as `DYNAMIC_TITLES` array using `matchPath`. Add new entries here when adding new pages.

---

## Sidebar Navigation

- **All users:** Dashboard, Companies, My Profile
- **Admin only:** Users, Admin Jobs (injected conditionally based on `isAdmin`)

---

## Known Gotchas

1. **ContactQuickStatus dropdown** uses `position: fixed` + `getBoundingClientRect()` + `createPortal` — viewport coords only, no scroll offset
2. **InvestigationContext** sections are closed by default — `useState(false)` in `ContextSection`
3. **Follow-up fields** — API uses `scheduledAt` and `notes` (not `scheduledDate` or `note`)
4. **Report polling** — interval is 5 seconds, max 60 polls (5 minutes timeout)
5. **Task polling** — interval is 3 seconds, max 30 polls (90 seconds timeout)
6. **Company `domain`** — API returns `website` field, not `domain`. Extract with `.replace(/^https?:\/\//, '')`
7. **User groups** — check both `user['cognito:groups']` and `user.groups` for compatibility