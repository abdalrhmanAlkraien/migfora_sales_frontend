import axiosInstance from './axiosInstance'

// ── Changed: was /investigations/company/:id, now /investigations/platform/:id
export const getPlatformInvestigationsApi = (platformId, params) =>
  axiosInstance.get(`/investigations/platform/${platformId}`, { params })

// ── Changed: body now requires platformId instead of companyId
export const createInvestigationApi = (data) =>
  axiosInstance.post('/investigations', data)
// data shape: { platformId, domain? }

export const getInvestigationApi = (id) =>
  axiosInstance.get(`/investigations/${id}`)

export const getTasksLookupApi = () =>
  axiosInstance.get('/investigations/tasks/lookup')

export const checkTaskApi = (investigationId, taskType) =>
  axiosInstance.post(`/investigations/${investigationId}/tasks/check`, { taskType })

export const runTasksApi = (investigationId, tasks) =>
  axiosInstance.post(`/investigations/${investigationId}/run`, { tasks })

export const runAllTasksApi = (investigationId, options) =>
  axiosInstance.post(`/investigations/${investigationId}/run-all`, options)

export const getTaskResultApi = (investigationId, taskId) =>
  axiosInstance.get(`/investigations/${investigationId}/tasks/${taskId}`)

export const getInvestigationContextApi = (id) =>
  axiosInstance.get(`/investigations/${id}/context`)

export const validatePipelineApi = (payload) =>
  axiosInstance.post('/pipelines/validate', payload)

export const createPipelineApi = (payload) =>
  axiosInstance.post('/pipelines', payload)

export const runPipelineApi = (pipelineId, investigationId) =>
  axiosInstance.post(`/pipelines/${pipelineId}/run`, { investigationId })