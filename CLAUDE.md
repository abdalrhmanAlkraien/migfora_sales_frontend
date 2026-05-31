# MIGFORA Skeleton — CLAUDE.md
> Instructions for Claude when working on this project. Read this before every task.

---

## Project Identity

**Name:** MIGFORA Skeleton  
**Type:** React JS base skeleton — reused across multiple MIGFORA projects  
**Owner:** MIGFORA — AWS Partner, Cloud & Technology Solutions (GCC/MENA market)  
**Stack:** Vite + React JS + React Router v6 + Axios + Zustand + Recharts  
**Styling:** Plain CSS (no Tailwind, no Bootstrap, no CSS-in-JS)  
**Language:** JavaScript only — never suggest or use TypeScript  

---

## Before Every Task

1. Read `SKILL.md` to understand the full architecture
2. Identify which files need to be created or modified
3. Follow the folder structure exactly — do not invent new patterns
4. Check if the task requires:
   - A new page → follow the "Adding a New Page" checklist
   - A new API → create a new file in `src/api/`
   - A new store → create a new file in `src/store/`
   - A new component → create `.jsx` + `.css` in the same folder

---

## Code Style Rules

### General
- JavaScript only — never write TypeScript, never add type annotations
- Functional components only — no class components
- Named exports for stores and utilities, default exports for components and pages
- Always use `const` — never `var`, avoid `let` unless reassignment is needed
- Arrow functions for callbacks, regular `function` keyword for components

### Imports Order
```js
// 1. React
import { useState, useEffect } from 'react'

// 2. React Router
import { useNavigate, useLocation } from 'react-router-dom'

// 3. Third-party libraries
import { BarChart } from 'recharts'

// 4. Internal — stores
import useAuthStore from '../store/authStore'

// 5. Internal — config
import appConfig from '../config/appConfig'

// 6. Internal — API
import { loginApi } from '../api/auth'

// 7. Internal — components
import Navbar from '../components/Navbar'

// 8. CSS — always last
import './styles/ComponentName.css'
```

### Component Structure
```jsx
// 1. Imports
// 2. Constants / static data (outside component)
// 3. Component function
//    a. Store hooks
//    b. Router hooks
//    c. State declarations
//    d. Derived values
//    e. useEffect hooks
//    f. Handler functions
//    g. Return JSX
// 4. Export
```

---

## CSS Rules

- One `.css` file per `.jsx` file — same name, same folder
- Layouts: CSS goes in `layouts/styles/`
- Pages: CSS goes in `pages/styles/`
- Dashboard sub-components: CSS goes in `components/dashboard/styles/`
- Never write inline styles
- Always use CSS variables — never hardcode values
- BEM-like class naming: `.block__element--modifier`
- Shared form classes live in `pages/styles/Login.css` — import it when reusing

---

## Task Checklists

### Adding a New Page

```
□ Create src/pages/NewPage.jsx
□ Create src/pages/styles/NewPage.css
□ Add route in src/routes/AppRoutes.jsx (wrap with ProtectedRoute + AppLayout)
□ Add to NAV_ITEMS in src/components/Sidebar.jsx
□ Add to PAGE_TITLES in src/components/SubNavbar.jsx
□ Create src/api/newPage.js (with MOCK_ENABLED pattern)
□ If page has sub-components → create src/components/newPage/ folder
□ Each sub-component gets its own .jsx + styles/ folder
```

### Adding a New API Domain

```
□ Create src/api/domainName.js
□ Import axiosInstance from './axiosInstance'
□ Add MOCK_ENABLED = true flag
□ Write mock functions with 800ms setTimeout delay
□ Export real functions that check MOCK_ENABLED before calling axiosInstance
□ Use appConfig.auth.messageKey for error messages
```

### Adding a New Store

```
□ Create src/store/storeName.js
□ Use zustand create()
□ Define initial state
□ Define set actions
□ Export as default useStoreName
```

### Adding a New Sidebar Item

```
□ Open src/components/Sidebar.jsx
□ Find the NAV_ITEMS array
□ Add new entry: { label, path, icon }
□ Icon must be an inline SVG (width=18, height=18, stroke="currentColor", strokeWidth=2)
□ Also add to PAGE_TITLES in src/components/SubNavbar.jsx
```

---

## API Pattern

Every API file follows this exact pattern:

```js
import axiosInstance from './axiosInstance'

// ─── MOCK — set to false when real API is ready ──────────────
const MOCK_ENABLED = true

const mockFunctionName = (data) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // resolve or reject with shaped response
      resolve({ data: { ... } })
    }, 800)
  })
}
// ─────────────────────────────────────────────────────────────

export const apiFunctionName = (data) => {
  if (MOCK_ENABLED) return mockFunctionName(data)
  return axiosInstance.post('/endpoint', data)
}
```

---

## State Management Pattern

### Reading auth state
```js
const { token, user, setAuth, clearAuth } = useAuthStore()
```

### Protecting a page
```jsx
// In AppRoutes.jsx
<Route path="/page" element={
  <ProtectedRoute>
    <AppLayout>
      <PageComponent />
    </AppLayout>
  </ProtectedRoute>
}/>
```

### After successful login
```js
setAuth(token, user)  // saves to Zustand + localStorage
navigate('/dashboard')
```

### After logout
```js
clearAuth()           // removes from Zustand + localStorage
navigate('/login')
```

---

## Response Handling Pattern

Always use `appConfig` keys when reading backend responses:

```js
import appConfig from '../config/appConfig'

// Reading token
const token = data[appConfig.auth.tokenKey]

// Reading user
const user = data[appConfig.auth.userKey]

// Reading error message
const message = err.response?.data?.[appConfig.auth.messageKey]
```

Never hardcode response field names like `data.token` or `data.message`.

---

## Layout Usage

| Page Type | Layout | Auth Required |
|---|---|---|
| Login | AuthLayout | No |
| Register | AuthLayout | No |
| All other pages | AppLayout | Yes (ProtectedRoute) |

### AppLayout behavior
- Sidebar default: **open** on desktop, **closed** on mobile (< 768px)
- Sidebar state saved in localStorage key: `migfora_sidebar_open`
- Main content + footer shift by `--sidebar-width` when sidebar opens
- `margin-top` = `calc(var(--navbar-height) + var(--subnavbar-height))` = 104px

---

## Component Ownership

| Concern | Component | File |
|---|---|---|
| Top bar + logo + logout | Navbar | `components/Navbar.jsx` |
| Sidebar toggle + page title | SubNavbar | `components/SubNavbar.jsx` |
| Navigation links | Sidebar | `components/Sidebar.jsx` |
| Page bottom | Footer | `components/Footer.jsx` |
| Auth state | Zustand | `store/authStore.js` |
| Feature flags | Config | `config/appConfig.js` |
| HTTP client | Axios | `api/axiosInstance.js` |
| Route definitions | Router | `routes/AppRoutes.jsx` |
| Auth guard | HOC | `routes/ProtectedRoute.jsx` |

---

## Environment

```
.env (project root)
VITE_API_BASE_URL=http://localhost:8080/api
```

- All env vars must be prefixed with `VITE_`
- Access in code: `import.meta.env.VITE_API_BASE_URL`
- Never hardcode base URLs

---

## Future Backend Integration (Spring Boot)

When connecting to a real Spring Boot backend:

1. Set `MOCK_ENABLED = false` in all `src/api/*.js` files
2. Update `VITE_API_BASE_URL` in `.env` to point to real server
3. Update `appConfig.auth` keys to match actual response fields:
   ```js
   auth: {
     tokenKey:   'accessToken',  // match Spring Boot response
     userKey:    'userDetails',
     messageKey: 'errorMessage',
   }
   ```
4. If backend uses refresh tokens → update `axiosInstance.js` response interceptor
5. If backend returns different error shapes → update error handling in API files

---

## What Claude Should Never Do

- Never use TypeScript or add type annotations
- Never use inline styles — always CSS classes
- Never hardcode colors, fonts, or layout values — use CSS variables
- Never use `fetch` directly — always use `axiosInstance`
- Never use Tailwind, Bootstrap, or any CSS framework
- Never add the sidebar toggle to `Navbar.jsx` — it belongs in `SubNavbar.jsx`
- Never close the sidebar on nav item click — only toggle button or Escape
- Never read/write auth state directly from localStorage — always go through `useAuthStore`
- Never create a page without its own `styles/` CSS file
- Never create an API file without the `MOCK_ENABLED` pattern
- Never hardcode backend response keys — always use `appConfig.auth.*`
- Never add class components — functional components only
- Never use `var` for variable declarations

---

## Quick Reference

```
New page?         → checklist: page + css + route + sidebar + subnav + api
New API?          → src/api/name.js with MOCK_ENABLED pattern
New store?        → src/store/useName.js with zustand create()
New sidebar item? → NAV_ITEMS in Sidebar.jsx + PAGE_TITLES in SubNavbar.jsx
Auth state?       → useAuthStore() — never read localStorage directly
Colors/fonts?     → CSS variables in index.css — never hardcode
Error message?    → appConfig.auth.messageKey — never hardcode 'message'
HTTP call?        → axiosInstance — never raw fetch or axios
```