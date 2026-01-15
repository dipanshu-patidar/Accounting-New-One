import api from '../api/axios';

// Accounts
const createAccount = async (accountData) => {
    const response = await api.post('/coa', accountData);
    return response.data;
};

const getAccounts = async (companyId) => {
    const params = companyId ? { company_id: companyId } : {};
    const response = await api.get('/coa', { params });
    return response.data;
};

const getAccount = async (id) => {
    const response = await api.get(`/coa/${id}`);
    return response.data;
};

const updateAccount = async (id, accountData) => {
    const response = await api.put(`/coa/${id}`, accountData);
    return response.data;
};

const deleteAccount = async (id) => {
    const response = await api.delete(`/coa/${id}`);
    return response.data;
};

const initializeCOA = async (companyId) => {
    const response = await api.post('/coa/initialize', { companyId });
    return response.data;
};

const getAccountTypes = async () => {
    const response = await api.get('/coa/types');
    return response.data;
};

// Ledgers
const createLedger = async (ledgerData) => {
    const response = await api.post('/ledgers', ledgerData);
    return response.data;
};

const getLedgers = async (companyId) => {
    const params = companyId ? { company_id: companyId } : {};
    const response = await api.get('/ledgers', { params });
    return response.data;
};

const getLedger = async (id) => {
    const response = await api.get(`/ledgers/${id}`);
    return response.data;
};

const getAccountLedger = async (accountId, startDate, endDate) => {
    const params = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    const response = await api.get(`/ledgers/account/${accountId}`, { params });
    return response.data;
};

const accountingService = {
    createAccount,
    getAccounts,
    getAccount,
    updateAccount,
    deleteAccount,
    initializeCOA,
    getAccountTypes,
    createLedger,
    getLedgers,
    getLedger,
    getAccountLedger,
};

export default accountingService;
