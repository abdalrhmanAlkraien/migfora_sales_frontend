import axiosInstance from './axiosInstance'

const MOCK_ENABLED = true

// ── Mocks ─────────────────────────────────────────────
const MOCK_DATA = [
  {
    id: '1',
    name: 'Tade',
    domain: 'tade.sa',
    status: 'LEAD',
    industry: 'E-commerce',
    investigationsCount: 3,
    contactsCount: 2,
    reportsCount: 1,
  },
  {
    id: '2',
    name: 'Soyolah',
    domain: 'soyolah.com',
    status: 'PROSPECT',
    industry: 'SaaS / Fintech',
    investigationsCount: 1,
    contactsCount: 4,
    reportsCount: 0,
  },
  {
    id: '3',
    name: 'Emkan Finance',
    domain: 'emkan.sa',
    status: 'ACTIVE',
    industry: 'Financial Services',
    investigationsCount: 5,
    contactsCount: 7,
    reportsCount: 3,
  },
  {
    id: '4',
    name: 'NexCorp',
    domain: 'nexcorp.io',
    status: 'INACTIVE',
    industry: 'Technology',
    investigationsCount: 0,
    contactsCount: 1,
    reportsCount: 0,
  },
]

const delay = (ms = 600) => new Promise((r) => setTimeout(r, ms))

const mockGetCompanies = async () => {
  await delay()
  return { data: { companies: MOCK_DATA, total: MOCK_DATA.length } }
}

const mockGetCompany = async (id) => {
  await delay()
  const company = MOCK_DATA.find((c) => c.id === id)
  if (!company) throw { response: { status: 404, data: { message: 'Company not found' } } }
  return { data: company }
}

const mockCreateCompany = async (payload) => {
  await delay()
  const newCompany = {
    id: String(Date.now()),
    investigationsCount: 0,
    contactsCount: 0,
    reportsCount: 0,
    ...payload,
  }
  return { data: newCompany }
}

const mockUpdateCompany = async (id, payload) => {
  await delay()
  return { data: { id, ...payload } }
}

const mockDeleteCompany = async () => {
  await delay()
  return { data: { success: true } }
}

// ── Public API ─────────────────────────────────────────

/** GET /api/v1/companies */
export const getCompaniesApi = (params) => {
  return axiosInstance.get('/companies', { params })
}

export const getCompanyApi = (id) =>
  axiosInstance.get(`/companies/${id}`)

export const createCompanyApi = (data) => {
  return axiosInstance.post('/companies', data)
}

export const updateCompanyApi = (id, data) =>
  axiosInstance.patch(`/companies/${id}`, data)

export const deleteCompanyApi = (id) =>
  axiosInstance.delete(`/companies/${id}`)

export const getCompanyInvestigationsApi = (id, params) =>
  axiosInstance.get(`/companies/${id}/investigations`, { params })

export const getCompanyContactsApi = (id, params) =>
  axiosInstance.get(`/companies/${id}/contacts`, { params })

export const getCompanyReportsApi = (id, params) =>
  axiosInstance.get(`/companies/${id}/reports`, { params })