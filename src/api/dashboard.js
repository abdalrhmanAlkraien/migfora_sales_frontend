import axiosInstance from './axiosInstance'

export const getDashboardStatsApi = () =>
  axiosInstance.get('/dashboard/stats')

export const getFollowUpsTodayApi = (params) =>
  axiosInstance.get('/followups/today', { params })

export const getRecentInvestigationsApi = (params) =>
  axiosInstance.get('/investigations', { params })

export const getContactStatsApi = () =>
  axiosInstance.get('/contacts/stats')