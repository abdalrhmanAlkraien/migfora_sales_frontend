import axiosInstance from './axiosInstance'

// dropdown — all active industries
export const getIndustriesApi = () =>
  axiosInstance.get('/industries')

// pageable — admin management
export const getIndustriesPageableApi = (params) =>
  axiosInstance.get('/industries/pageable', { params })

export const getIndustryApi = (id) =>
  axiosInstance.get(`/industries/${id}`)

export const createIndustryApi = (data) =>
  axiosInstance.post('/industries', data)

export const updateIndustryApi = (id, data) =>
  axiosInstance.patch(`/industries/${id}`, data)

export const deleteIndustryApi = (id) =>
  axiosInstance.delete(`/industries/${id}`)