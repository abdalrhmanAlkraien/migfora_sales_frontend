import axiosInstance from './axiosInstance'

// ── Changed: body now requires platformId instead of companyId
export const createReportApi = (data) =>
  axiosInstance.post('/reports', data)
// data shape: { platformId, investigationId, type }

export const getReportApi = (id) =>
  axiosInstance.get(`/reports/${id}`)

// ── All reports across all platforms of a company
export const getCompanyReportsApi = (companyId, params) =>
  axiosInstance.get(`/reports/company/${companyId}`, { params })

// ── Reports for a specific platform
export const getPlatformReportsApi = (platformId, params) =>
  axiosInstance.get(`/reports/platform/${platformId}`, { params })

export const deleteReportApi = (id) =>
  axiosInstance.delete(`/reports/${id}`)