import axiosInstance from './axiosInstance'

export const getTemplatesApi = (params) =>
  axiosInstance.get('/templates', { params })

export const getTemplateApi = (id) =>
  axiosInstance.get(`/templates/${id}`)

export const createTemplateApi = (data) =>
  axiosInstance.post('/templates', data)

export const updateTemplateApi = (id, data) =>
  axiosInstance.patch(`/templates/${id}`, data)

export const deleteTemplateApi = (id) =>
  axiosInstance.delete(`/templates/${id}`)

export const markTemplateUsedApi = (id) =>
  axiosInstance.post(`/templates/${id}/used`)