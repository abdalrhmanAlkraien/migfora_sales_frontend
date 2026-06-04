import axiosInstance from './axiosInstance'

export const getCompanyPlatformsApi = (companyId) =>
  axiosInstance.get(`/companies/${companyId}/platforms`)

export const createPlatformApi = (companyId, data) =>
  axiosInstance.post(`/companies/${companyId}/platforms`, data)

export const getPlatformApi = (id) =>
  axiosInstance.get(`/platforms/${id}`)

export const updatePlatformApi = (id, data) =>
  axiosInstance.patch(`/platforms/${id}`, data)

export const deletePlatformApi = (id) =>
  axiosInstance.delete(`/platforms/${id}`)