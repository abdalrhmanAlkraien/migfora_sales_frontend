import axiosInstance from './axiosInstance'

export const getCompaniesApi = (params) =>
  axiosInstance.get('/companies', { params })

export const getCompanyApi = (id) =>
  axiosInstance.get(`/companies/${id}`)

export const createCompanyApi = (data) =>
  axiosInstance.post('/companies', data)

export const updateCompanyApi = (id, data) =>
  axiosInstance.patch(`/companies/${id}`, data)

export const deleteCompanyApi = (id) =>
  axiosInstance.delete(`/companies/${id}`)

export const getCompanyContactsApi = (id, params) =>
  axiosInstance.get(`/companies/${id}/contacts`, { params })

export const getCompanyReportsApi = (id, params) =>
  axiosInstance.get(`/companies/${id}/reports`, { params })

export const getCompanyInvestigationsApi = (id, params) =>
  axiosInstance.get(`/companies/${id}/investigations`, { params })

export const getPlatformInvestigationsApi = (id, params) =>
  axiosInstance.get(`/companies/${id}/investigations/platform`, { params })


export const getCompanyNotesApi = (companyId, params) =>
  axiosInstance.get(`/companies/${companyId}/notes`, { params })

export const createCompanyNotesBulkApi = (companyId, notes) =>
  axiosInstance.post(`/companies/${companyId}/notes/bulk`, notes)

export const updateNoteApi = (noteId, content) =>
  axiosInstance.patch(`/notes/${noteId}`, { content })

export const deleteNoteApi = (noteId) =>
  axiosInstance.delete(`/notes/${noteId}`)