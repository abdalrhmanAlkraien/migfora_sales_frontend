import axiosInstance from './axiosInstance'

// Company notes
export const getCompanyNotesApi = (companyId, params) =>
  axiosInstance.get(`/companies/${companyId}/notes`, { params })

export const createCompanyNotesBulkApi = (companyId, notes) =>
  axiosInstance.post(`/companies/${companyId}/notes/bulk`, notes)

// Contact notes
export const getContactNotesApi = (contactId, params) =>
  axiosInstance.get(`/contacts/${contactId}/notes`, { params })

export const createContactNotesBulkApi = (contactId, notes) =>
  axiosInstance.post(`/contacts/${contactId}/notes/bulk`, notes)

// Shared — owner only
export const updateNoteApi = (noteId, content) =>
  axiosInstance.patch(`/notes/${noteId}`, { content })

export const deleteNoteApi = (noteId) =>
  axiosInstance.delete(`/notes/${noteId}`)