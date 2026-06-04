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
import CreateInvestigation from '../pages/CreateInvestigation'
import InvestigationDetail from '../pages/InvestigationDetail'
import InvestigationLab from '../pages/InvestigationLab'
import CompanyContacts from '../pages/CompanyContacts'
import CreateContact from '../pages/CreateContact'
import ContactDetail from '../pages/ContactDetail'
import CompanyReports from '../pages/CompanyReports'
import ReportDetail from '../pages/ReportDetail'
import UserManagement from '../pages/UserManagement'
import UserProfile from '../pages/UserProfile'
import UserDetail from '../pages/UserDetail'
import AdminJobs from '../pages/AdminJobs'
import CompanyPlatforms from '../pages/CompanyPlatforms'
import CreatePlatform from '../pages/CreatePlatform'
import PlatformDetail from '../pages/PlatformDetail'
import PlatformInvestigations from '../pages/PlatformInvestigations'
import PlatformReports from '../pages/PlatformReports'


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
        
        <Route path="/companies" element={
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

        <Route path="/companies/:id/platforms" element={
          <ProtectedRoute><AppLayout><CompanyPlatforms /></AppLayout></ProtectedRoute>
        }/>
        <Route path="/companies/:id/platforms/new" element={
          <ProtectedRoute><AppLayout><CreatePlatform /></AppLayout></ProtectedRoute>
        }/>
        <Route path="/platforms/:id" element={
          <ProtectedRoute><AppLayout><PlatformDetail /></AppLayout></ProtectedRoute>
        }/>
        <Route path="/platforms/:id/investigations" element={
          <ProtectedRoute><AppLayout><PlatformInvestigations /></AppLayout></ProtectedRoute>
        }/>
        <Route path="/platforms/:id/investigations/new" element={
          <ProtectedRoute><AppLayout><CreateInvestigation /></AppLayout></ProtectedRoute>
        }/>
        <Route path="/platforms/:id/reports" element={
          <ProtectedRoute><AppLayout><PlatformReports /></AppLayout></ProtectedRoute>
        }/>


        <Route path="/investigations/:id" element={
          <ProtectedRoute><AppLayout><InvestigationDetail /></AppLayout></ProtectedRoute>
        }/>
        <Route path="/investigations/:id/lab" element={
          <ProtectedRoute><AppLayout><InvestigationLab /></AppLayout></ProtectedRoute>
        }/>         

        <Route path="/companies/:id/contacts" element={
          <ProtectedRoute><AppLayout><CompanyContacts /></AppLayout></ProtectedRoute>
        }/>
        <Route path="/companies/:id/contacts/new" element={
          <ProtectedRoute><AppLayout><CreateContact /></AppLayout></ProtectedRoute>
        }/>
        <Route path="/contacts/:id" element={
          <ProtectedRoute><AppLayout><ContactDetail /></AppLayout></ProtectedRoute>
        }/>  
        
        <Route path="/companies/:id/reports" element={
          <ProtectedRoute><AppLayout><CompanyReports /></AppLayout></ProtectedRoute>
        }/>
        <Route path="/reports/:id" element={
          <ProtectedRoute><AppLayout><ReportDetail /></AppLayout></ProtectedRoute>
        }/>              

        <Route path="/users" element={
          <ProtectedRoute adminOnly><AppLayout><UserManagement /></AppLayout></ProtectedRoute>
        }/>
        <Route path="/profile" element={
          <ProtectedRoute><AppLayout><UserProfile /></AppLayout></ProtectedRoute>
        }/>

        <Route path="/users/:sub" element={
          <ProtectedRoute adminOnly><AppLayout><UserDetail /></AppLayout></ProtectedRoute>
        }/>  

        <Route path="/admin/jobs" element={
          <ProtectedRoute adminOnly><AppLayout><AdminJobs /></AppLayout></ProtectedRoute>
        }/>
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />

      </Routes>
    </BrowserRouter>
  )
}