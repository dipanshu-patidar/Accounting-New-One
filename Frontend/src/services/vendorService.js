import api from '../api/axios';

const createVendor = async (vendorData) => {
    const response = await api.post('/vendors', vendorData);
    return response.data;
};

const getVendors = async (companyId) => {
    const params = companyId ? { company_id: companyId } : {};
    const response = await api.get('/vendors', { params });
    return response.data;
};

const getVendor = async (id) => {
    const response = await api.get(`/vendors/${id}`);
    return response.data;
};

const updateVendor = async (id, vendorData) => {
    const response = await api.put(`/vendors/${id}`, vendorData);
    return response.data;
};

const deleteVendor = async (id) => {
    const response = await api.delete(`/vendors/${id}`);
    return response.data;
};

const vendorService = {
    createVendor,
    getVendors,
    getVendor,
    updateVendor,
    deleteVendor
};

export default vendorService;
