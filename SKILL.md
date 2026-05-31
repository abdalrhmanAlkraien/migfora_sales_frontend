# MIGFORA Skeleton — SKILL.md
> Read this file before every task. It defines the project rules, architecture, and conventions.

---

## Project Overview

**Name:** MIGFORA Skeleton  
**Purpose:** A reusable base React application skeleton for MIGFORA projects. Every new project starts from this skeleton.  
**Stack:** Vite + React JS (JavaScript only — no TypeScript), React Router v6, Axios, Zustand, Recharts  
**Package Manager:** npm  
**Styling:** Plain CSS files — one CSS file per component/page  
**Language:** English only  

---

## Folder Structure

```
src/
├── api/
│   ├── axiosInstance.js        # Base axios config + request/response interceptors
│   └── auth.js                 # Auth API calls (login, register, logout)
│                               # Add one file per domain: clients.js, projects.js, etc.
│
├── components/
│   ├── styles/                 # All component CSS files live here
│   │   ├── Navbar.css
│   │   ├── SubNavbar.css
│   │   ├── Sidebar.css
│   │   └── Footer.css
│   ├── Navbar.jsx              # Top navigation bar
│   ├── SubNavbar.jsx           # Secondary bar (page title + sidebar toggle)
│   ├── Sidebar.jsx             # Overlay sidebar with nav items
│   ├── Footer.jsx              # Bottom footer
│   └── dashboard/              # Page-specific components for Dashboard
│       ├── styles/
│       │   ├── StatsRow.css
│       │   ├── RevenueChart.css
│       │   ├── RecentClients.css
│       │   ├── ActiveProjects.css
│       │   └── QuickActions.css
│       ├── StatsRow.jsx
│       ├── RevenueChart.jsx
│       ├── RecentClients.jsx
│       ├── ActiveProjects.jsx
│       └── QuickActions.jsx
│
├── config/
│   └── appConfig.js            # Feature flags + backend response key mapping
│
├── layouts/
│   ├── AppLayout.jsx           # Layout for authenticated pages (Navbar + SubNavbar + Sidebar + Footer)
│   ├── AuthLayout.jsx          # Layout for public pages (centered dark background)
│   └── styles/
│       ├── AppLayout.css
│       └── AuthLayout.css
│
├── pages/
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── Dashboard.jsx
│   └── styles/
│       ├── Login.css
│       └── Register.css
│
├── routes/
│   ├── AppRoutes.jsx           # All route definitions
│   └── ProtectedRoute.jsx      # Auth guard — redirects to /login if no token
│
├── store/
│   └── authStore.js            # Zustand auth store (token + user)
│
├── App.jsx                     # Root component — renders AppRoutes
├── main.jsx                    # React entry point
└── index.css                   # Global CSS variables + reset
```

---

## Design System

All values are defined as CSS variables in `src/index.css`. Never hardcode colors or fonts.

### Colors
```css
--color-navy:       #0D1B2A   /* dominant brand color */
--color-orange:     #FF9900   /* accent, CTAs, highlights */
--color-white:      #FFFFFF
--color-off-white:  #F8F9FB   /* page background */
--color-navy-2:     #162233   /* navbar background */
--color-navy-3:     #1E2D40   /* cards on dark backgrounds */
--color-orange-2:   #FFB347   /* hover states */
--color-darkest:    #080F18   /* footer background */
```

### Typography
```css
--font-heading: 'Syne', Arial Black, sans-serif   /* bold, letter-spaced */
--font-body:    'DM Sans', Calibri, sans-serif    /* light, readable */
```

### Layout
```css
--navbar-height:       64px
--subnavbar-height:    40px
--sidebar-width:       260px
--sidebar-toggle-size: 40px
```

---

## CSS Rules

1. **Every component has its own CSS file** — same name, inside the `styles/` subfolder.
2. **Shared components** store CSS in `components/styles/`.
3. **Layouts** store CSS in `layouts/styles/`.
4. **Page components** store CSS in `pages/styles/`.
5. **Dashboard sub-components** store CSS in `components/dashboard/styles/`.
5. **Never use inline styles** — always use CSS classes.
6. **Always use CSS variables** — never hardcode colors, fonts, or sizes.
7. **BEM-like naming** — `.component__element--modifier`.
   - Example: `.sidebar__nav-link--active`

---

## Component Rules

### Navbar (`src/components/Navbar.jsx`)
- Logo on the left — always visible regardless of sidebar state
- Settings icon + Login/Logout button on the right
- Logout calls `clearAuth()` from `useAuthStore` then navigates to `/login`
- Login/Logout visibility is controlled by `token` from `useAuthStore`
- **No hamburger menu here** — that belongs to SubNavbar

### SubNavbar (`src/components/SubNavbar.jsx`)
- Sits directly below Navbar (`top: var(--navbar-height)`)
- Contains: sidebar toggle button (left) + divider + current page title (right)
- Page title is auto-resolved from `PAGE_TITLES` map using `useLocation()`
- **When adding a new page**, add its path + title to `PAGE_TITLES` in `SubNavbar.jsx`
- Toggle icon changes: ☰ when closed, ✕ when open

### Sidebar (`src/components/Sidebar.jsx`)
- Overlay style — slides in from the left over the content
- `NAV_ITEMS` array defines all navigation links
- **When adding a new page to the sidebar**, add an entry to `NAV_ITEMS`:
  ```js
  {
    label: 'Page Name',
    path: '/route-path',
    icon: <svg>...</svg>,
  }
  ```
- Closing: only via toggle button or Escape key — backdrop click does NOT close
- Active link is highlighted with `--color-orange` + `--color-navy-3` background

### Footer (`src/components/Footer.jsx`)
- Always at the bottom of the page
- Shifts right with `margin-left: var(--sidebar-width)` when sidebar is open

---

## Layout Rules

### AppLayout (`src/layouts/AppLayout.jsx`)
- Used for all authenticated/protected pages
- Manages sidebar open/close state
- Sidebar state is persisted in `localStorage` key: `migfora_sidebar_open`
- Default: **open** on desktop, **closed** on mobile (< 768px)
- On resize to mobile: sidebar auto-closes
- Main content and footer shift right by `--sidebar-width` when sidebar is open
- `margin-top` of main = `calc(var(--navbar-height) + var(--subnavbar-height))`

### AuthLayout (`src/layouts/AuthLayout.jsx`)
- Used for Login and Register pages only
- Centered content on dark navy background (`--color-navy`)
- No Navbar, SubNavbar, Sidebar, or Footer

---

## Routing Rules (`src/routes/AppRoutes.jsx`)

| Path | Layout | Protected |
|---|---|---|
| `/login` | AuthLayout | No |
| `/register` | AuthLayout | No |
| `/dashboard` | AppLayout | Yes |
| `*` (fallback) | — | Redirects to `/dashboard` |

### Adding a New Page
1. Create `src/pages/NewPage.jsx`
2. Create `src/pages/styles/NewPage.css`
3. Add route in `AppRoutes.jsx`:
   ```jsx
   <Route path="/new-page" element={
     <ProtectedRoute>
       <AppLayout>
         <NewPage />
       </AppLayout>
     </ProtectedRoute>
   }/>
   ```
4. Add to `NAV_ITEMS` in `Sidebar.jsx`
5. Add to `PAGE_TITLES` in `SubNavbar.jsx`
6. Create `src/api/newPage.js` if the page needs API calls

### ProtectedRoute
- Reads `token` from `useAuthStore`
- If no token → redirects to `/login`
- If token exists → renders children

---

## API Layer Rules

### `src/api/axiosInstance.js`
- Base URL from `import.meta.env.VITE_API_BASE_URL` (set in `.env`)
- Request interceptor: attaches `Authorization: Bearer <token>` automatically
- Response interceptor: on 401 → clears localStorage + redirects to `/login`

### Adding a New API Domain
Create a new file `src/api/domainName.js`:
```js
import axiosInstance from './axiosInstance'

export const getItemsApi = (params) => {
  return axiosInstance.get('/domain/items', { params })
}

export const createItemApi = (data) => {
  return axiosInstance.post('/domain/items', data)
}
```

### Mock Pattern
Every API file supports a `MOCK_ENABLED` flag for development without a backend:
```js
const MOCK_ENABLED = true

const mockGetItems = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ data: { items: [...] } })
    }, 800)
  })
}

export const getItemsApi = (params) => {
  if (MOCK_ENABLED) return mockGetItems(params)
  return axiosInstance.get('/domain/items', { params })
}
```
Set `MOCK_ENABLED = false` when real API is ready — nothing else changes.

---

## State Management Rules

### `src/store/authStore.js`
- Manages: `token`, `user`
- `setAuth(token, user)` → saves to Zustand + localStorage
- `clearAuth()` → removes from Zustand + localStorage
- On app load: initializes from localStorage automatically

### Adding a New Store
Create `src/store/newStore.js`:
```js
import { create } from 'zustand'

const useNewStore = create((set) => ({
  // state
  items: [],

  // actions
  setItems: (items) => set({ items }),
  clearItems: () => set({ items: [] }),
}))

export default useNewStore
```

---

## Config Rules (`src/config/appConfig.js`)

All project-level feature flags and backend response mappings live here.

```js
const appConfig = {
  loginIdentifier: 'username', // 'email' | 'username' | 'phone'

  auth: {
    tokenKey:   'token',    // key in backend login response
    userKey:    'user',     // key in backend login response
    messageKey: 'message',  // key in backend error response
  }
}
```

**To adapt this skeleton for a new project:**
1. Change `loginIdentifier` to match the new project's login field
2. Update `auth` keys to match the new backend response structure
3. Set `MOCK_ENABLED = false` in all API files when backend is ready

---

## Form Rules

Shared form CSS classes are defined in `src/pages/styles/Login.css` and reused across auth pages:

| Class | Purpose |
|---|---|
| `.form-group` | Wraps label + input |
| `.form-label` | Input label |
| `.form-input` | Text input field |
| `.form-input--otp` | OTP input (centered, large, spaced) |
| `.form-error` | Red error message box |
| `.form-btn` | Primary submit button (orange) |
| `.form-btn-ghost` | Ghost/secondary button |

Always import `Login.css` when reusing these classes in other auth pages.

---

## Environment Variables

```
# .env (project root)
VITE_API_BASE_URL=http://localhost:8080/api
```

All env variables must be prefixed with `VITE_` to be accessible in the browser.

---

## Do's and Don'ts

### ✅ Do
- Always use CSS variables for colors, fonts, and layout values
- Always create a `.css` file alongside every `.jsx` file
- Always use `useAuthStore` for reading/writing auth state
- Always use `axiosInstance` for HTTP calls — never raw `fetch` or `axios`
- Always add mock support when creating new API files
- Always add new pages to both `Sidebar.jsx` (NAV_ITEMS) and `SubNavbar.jsx` (PAGE_TITLES)
- Always wrap new protected pages with `<ProtectedRoute>` and `<AppLayout>`

### ❌ Don't
- Don't use TypeScript — this project is JavaScript only
- Don't use inline styles — use CSS classes
- Don't hardcode colors or fonts — use CSS variables
- Don't use `fetch` directly — always use `axiosInstance`
- Don't store auth state only in localStorage — always sync with Zustand
- Don't add hamburger/sidebar toggle to Navbar — it belongs to SubNavbar
- Don't close sidebar on nav item click — only toggle button or Escape key closes it
- Don't use any CSS framework (Tailwind, Bootstrap, etc.)