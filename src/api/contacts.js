import axiosInstance from './axiosInstance'

export const getCompanyContactsApi = (companyId, params) =>
  axiosInstance.get(`/contacts/companies/${companyId}`, { params })

export const createContactApi = (companyId, data) =>
  axiosInstance.post(`/contacts/companies/${companyId}`, data)

export const getContactApi = (id) =>
  axiosInstance.get(`/contacts/${id}`)

export const updateContactApi = (id, data) =>
  axiosInstance.patch(`/contacts/${id}`, data)

export const updateContactStatusApi = (id, status) =>
  axiosInstance.patch(`/contacts/${id}/status`, { status })

export const deleteContactApi = (id) =>
  axiosInstance.delete(`/contacts/${id}`)