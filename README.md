# MIGFORA Sales Intelligence Frontend

A sales intelligence platform built for MIGFORA — a cloud engineering company targeting GCC/MENA clients. This frontend enables the sales team to research prospects, manage contacts, run technical investigations, and generate AI-powered reports.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 (Vite) |
| Routing | React Router v6 |
| State | Zustand |
| HTTP | Axios |
| Styling | Plain CSS (BEM-style) |
| Auth | AWS Cognito (JWT) |
| Language | JavaScript (no TypeScript) |

---

## Project Structure

```
src/
├── api/                        # Axios API modules
│   ├── axiosInstance.js        # Base instance, token injection, 401 refresh
│   ├── auth.js                 # Login, change password, refresh token
│   ├── companies.js            # Company CRUD
│   ├── contacts.js             # Contact CRUD + status update
│   ├── followups.js            # Follow-up CRUD
│   ├── investigations.js       # Investigation + task runner APIs
│   ├── reports.js              # Report generation + management
│   ├── users.js                # User management + profile
│   ├── adminJobs.js            # Admin job triggers
│   └── dashboard.js            # Dashboard stats + aggregates
│
├── config/
│   └── appConfig.js            # Token keys, challenge constants, base URL
│
├── store/
│   └── authStore.js            # Zustand: token, user, challengeSession
│
├── routes/
│   ├── AppRoutes.jsx           # All route definitions
│   └── ProtectedRoute.jsx      # Auth guard + adminOnly guard
│
├── layouts/
│   ├── AppLayout.jsx           # Navbar + SubNavbar + Sidebar + Footer
│   └── AuthLayout.jsx          # Centered dark layout for auth pages
│
├── pages/
│   ├── styles/
│   ├── Login.jsx
│   ├── ChangePassword.jsx      # First-login NEW_PASSWORD_REQUIRED flow
│   ├── Dashboard.jsx           # Role-split dashboard (admin vs sales)
│   ├── Companies.jsx           # Company list with search/filter/pagination
│   ├── CompanyProfile.jsx      # Company detail + recent sections
│   ├── CreateCompany.jsx
│   ├── CompanyInvestigations.jsx
│   ├── CreateInvestigation.jsx
│   ├── InvestigationDetail.jsx
│   ├── InvestigationLab.jsx    # Task runner (one-by-one / run-all / pipeline)
│   ├── CompanyContacts.jsx
│   ├── CreateContact.jsx
│   ├── ContactDetail.jsx       # Contact + follow-up history
│   ├── CompanyReports.jsx
│   ├── ReportDetail.jsx        # Markdown renderer + PDF download
│   ├── UserManagement.jsx      # Admin only
│   ├── UserDetail.jsx          # Admin only
│   ├── UserProfile.jsx         # All users
│   └── AdminJobs.jsx           # Admin only
│
├── components/
│   ├── common/
│   │   ├── styles/
│   │   ├── ConfirmDialog.jsx
│   │   └── Pagination.jsx
│   ├── company/
│   │   ├── styles/
│   │   ├── CompanyCard.jsx
│   │   ├── CompanyFilters.jsx
│   │   ├── CompanyEditDrawer.jsx
│   │   ├── CompanyProfileHeader.jsx
│   │   ├── CompanyRecentSection.jsx
│   │   └── CompanyStatsBar.jsx
│   ├── contact/
│   │   ├── styles/
│   │   ├── ContactsTable.jsx
│   │   ├── ContactStatusBadge.jsx
│   │   ├── ContactQuickStatus.jsx  # Portal dropdown for inline status change
│   │   ├── ContactEditDrawer.jsx
│   │   ├── ContactFilters.jsx
│   │   ├── FollowUpList.jsx
│   │   └── FollowUpDrawer.jsx
│   ├── investigation/
│   │   ├── styles
│   │   └── TaskResultDrawer.jsx    # Rich result renderers per task type
│   ├── lab/
│   │   ├── styles/
│   │   ├── InvestigationContext.jsx # Context panel with all sections
│   │   ├── LabModeSelector.jsx
│   │   ├── TaskCard.jsx            # Check → run → poll pattern
│   │   ├── RunAllPanel.jsx
│   │   └── PipelineBuilder.jsx
│   ├── report/
│   │   ├── styles/
│   │   └── GenerateReportModal.jsx # Select type → generating → done/failed
│   ├── user/
│   │   ├── styles/
│   │   ├── UserTable.jsx
│   │   ├── UserStatusBadge.jsx
│   │   ├── UserRoleBadge.jsx
│   │   ├── UserEditDrawer.jsx
│   │   ├── InviteUserModal.jsx
│   │   └── ResetPasswordModal.jsx  # Admin reset (email) + self (form)
│   ├── dashboard/
│   │   ├── styles/
│   │   ├── DashboardStats.jsx
│   │   ├── FollowUpsToday.jsx
│   │   ├── RecentCompanies.jsx
│   │   ├── RecentInvestigations.jsx
│   │   └── PipelineOverview.jsx
│   ├── styles/
│   ├── Navbar.jsx
│   ├── SubNavbar.jsx               # Dynamic page titles via matchPath
│   ├── Sidebar.jsx                 # Role-aware nav (admin sees Users + Admin Jobs)
│   └── Footer.jsx
```

---

## Authentication Flow

```
POST /api/v1/auth/login
  → 200: setAuth() → /dashboard
  → 428: setChallenge() → /change-password (NEW_PASSWORD_REQUIRED)

POST /api/v1/auth/change-password
  body: { email, temporaryPassword, newPassword, session }
  → 200: setAuth() → /dashboard

401 on any request:
  → axiosInstance queues requests
  → POST /api/v1/auth/refresh
  → retry all queued requests
  → if refresh fails → clearAuth() → /login
```

Token storage: `localStorage` via keys defined in `appConfig.js`.

---

## Role System

| Role | Access |
|------|--------|
| `admin_group` | Full access — all pages including Users, Admin Jobs |
| `sales` | Companies, Contacts, Investigations, Reports, Dashboard, Profile |

Role is read from `cognito:groups` array in the JWT / user object stored in Zustand.

---

## Environment Variables

Create `.env` in project root:

```env
VITE_API_BASE_URL=http://localhost:8080/api/v1
```

Used in `src/config/appConfig.js`.

---

## Getting Started

```bash
npm install
npm run dev
```

Runs on `http://localhost:5173`.

---

## API Base URL

All requests go through `src/api/axiosInstance.js` which reads `VITE_API_BASE_URL`. The Bearer token is injected automatically on every request.

---

## Design System

Defined in `src/index.css` as CSS variables:

```css
--color-navy:      #0D1B2A   /* primary dark */
--color-orange:    #FF9900   /* accent */
--color-navy-2:    #162233
--color-navy-3:    #1E2D40
--color-orange-2:  #FFB347
--color-darkest:   #080F18
--color-off-white: #F8F9FB

--font-heading: 'Syne'
--font-body:    'DM Sans'

--navbar-height:    64px
--subnavbar-height: 40px
--sidebar-width:    260px
```

---

## Key Patterns

**API modules** — each domain has its own file in `src/api/`. All functions return Axios promises. No global error handling — each page handles its own errors.

**Portal pattern** — all drawers, modals, and dropdowns use `createPortal(…, document.body)` with `position: fixed` to escape overflow clipping from parent containers.

**Optimistic updates** — status changes (contact status, user enable/disable) update state immediately and revert on API failure.

**Polling** — task results and report generation use a `stopped` flag pattern with `setTimeout` recursion. Max polls defined per use case (30 for tasks, 60 for reports).

**MOCK_ENABLED** — `src/api/auth.js` supports a `MOCK_ENABLED` flag for local development without a backend.