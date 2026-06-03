import axiosInstance from './axiosInstance'

export const triggerRemindersApi = () =>
  axiosInstance.post('/admin/jobs/reminders/trigger')