import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import AuthLayout from '../layouts/AuthLayout'
import AppLayout from '../layouts/AppLayout'
import ProtectedRoute from './ProtectedRoute'
import Login from '../pages/Login'
import Dashboard from '../pages/Dashboard'
import Register from '../pages/Register'
import ChangePassword from '../pages/ChangePassword'
import Companies from '../pages/Companies'
import CompanyProfile from '../pages/CompanyProfile'
import CreateCompany from '../pages/CreateCompany'


export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public routes — Auth layout */}
        <Route path="/login" element={
          <AuthLayout>
            <Login />
          </AuthLayout>
        }/>

        <Route path="/change-password" element={
          <AuthLayout><ChangePassword /></AuthLayout>
        }/>

        <Route path="/register" element={
          <AuthLayout>
            <Register />
          </AuthLayout>
        }/>

        {/* Protected routes — App layout */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <AppLayout>
              <Dashboard />
            </AppLayout>
          </ProtectedRoute>
        }/>

        <Route path="/comapnies" element={
          <ProtectedRoute>
            <AppLayout>
              <Companies />
            </AppLayout>
          </ProtectedRoute>
        }/>

        <Route path="/companies/:id" element={
          <ProtectedRoute>
            <AppLayout>
              <CompanyProfile />
              </AppLayout>
              </ProtectedRoute>
        }/>

        <Route path="/companies/new" element={
          <ProtectedRoute>
            <AppLayout>
              <CreateCompany />
              </AppLayout>
          </ProtectedRoute>
        }/>        

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />

      </Routes>
    </BrowserRouter>
  )
}