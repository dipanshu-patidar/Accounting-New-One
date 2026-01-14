import api from '../api/axios';

const createCustomer = async (customerData) => {
    const response = await api.post('/customers', customerData);
    return response.data;
};

const getCustomers = async (companyId) => {
    const params = companyId ? { company_id: companyId } : {};
    const response = await api.get('/customers', { params });
    return response.data;
};

const getCustomer = async (id) => {
    const response = await api.get(`/customers/${id}`);
    return response.data;
};

const updateCustomer = async (id, customerData) => {
    const response = await api.put(`/customers/${id}`, customerData);
    return response.data;
};

const deleteCustomer = async (id) => {
    const response = await api.delete(`/customers/${id}`);
    return response.data;
};

const customerService = {
    createCustomer,
    getCustomers,
    getCustomer,
    updateCustomer,
    deleteCustomer
};

export default customerService;
