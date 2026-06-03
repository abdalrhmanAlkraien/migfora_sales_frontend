import axiosInstance from './axiosInstance'

export const createReportApi = (data) =>
  axiosInstance.post('/reports', data)

export const getReportApi = (id) =>
  axiosInstance.get(`/reports/${id}`)

export const getCompanyReportsApi = (companyId, params) =>
  axiosInstance.get(`/reports/company/${companyId}`, { params })

export const deleteReportApi = (id) =>
  axiosInstance.delete(`/reports/${id}`)