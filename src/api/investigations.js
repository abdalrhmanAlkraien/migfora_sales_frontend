import axiosInstance from './axiosInstance'

export const getCompanyInvestigationsApi = (companyId, params) =>
  axiosInstance.get(`/investigations/company/${companyId}`, { params })

export const createInvestigationApi = (data) =>
  axiosInstance.post('/investigations', data)

export const getInvestigationApi = (id) =>
  axiosInstance.get(`/investigations/${id}`)

export const getTasksLookupApi = () =>
  axiosInstance.get('/investigations/tasks/lookup')

export const validatePipelineApi = (payload) =>
  axiosInstance.post('/pipelines/validate', payload)

export const checkTaskApi = (investigationId, taskType) =>
  axiosInstance.post(`/investigations/${investigationId}/tasks/check`, { taskType })

export const runTasksApi = (investigationId, tasks) =>
  axiosInstance.post(`/investigations/${investigationId}/run`, { tasks })

export const runAllTasksApi = (investigationId, options) =>
  axiosInstance.post(`/investigations/${investigationId}/run-all`, options)

export const createPipelineApi = (payload) =>
  axiosInstance.post('/pipelines', payload)

export const runPipelineApi = (pipelineId, investigationId) =>
  axiosInstance.post(`/pipelines/${pipelineId}/run`, { investigationId })

export const getTaskResultApi = (investigationId, taskId) =>
  axiosInstance.get(`/investigations/${investigationId}/tasks/${taskId}`)

export const getInvestigationContextApi = (id) =>
  axiosInstance.get(`/investigations/${id}/context`)