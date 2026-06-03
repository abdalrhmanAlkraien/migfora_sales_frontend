import axiosInstance from './axiosInstance'

export const inviteUserApi = (data) =>
  axiosInstance.post(`/users`, data)

export const getUsersApi = (params) =>
  axiosInstance.get('/users', { params })

export const getUserApi = (sub) =>
  axiosInstance.get(`/users/${sub}`)

export const updateUserApi = (sub, data) =>
  axiosInstance.patch(`/users/${sub}`, data)

export const enableUserApi = (sub) =>
  axiosInstance.patch(`/users/${sub}/enable`)

export const disableUserApi = (sub) =>
  axiosInstance.patch(`/users/${sub}/disable`)

export const deleteUserApi = (sub) =>
  axiosInstance.delete(`/users/${sub}`)

export const resetPasswordApi = (sub) =>
  axiosInstance.post(`/users/${sub}/reset-password`)

export const getMeApi = () =>
  axiosInstance.get('/auth/me')