import axiosInstance from './axiosInstance'

export const getContactFollowUpsApi = (contactId, params) =>
  axiosInstance.get(`/contacts/${contactId}/followups`, { params })

export const createFollowUpApi = (contactId, data) =>
  axiosInstance.post(`/contacts/${contactId}/followups`, data)

export const getFollowUpApi = (id) =>
  axiosInstance.get(`/contacts/followups/${id}`)

export const updateFollowUpApi = (id, data) =>
  axiosInstance.patch(`/contacts/followups/${id}`, data)

export const deleteFollowUpApi = (id) =>
  axiosInstance.delete(`/contacts/followups/${id}`)