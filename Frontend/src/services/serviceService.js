import api from '../api/axios';

const getServices = async () => {
    const response = await api.get('/services');
    return response.data;
};

const getService = async (id) => {
    const response = await api.get(`/services/${id}`);
    return response.data;
};

const createService = async (serviceData) => {
    const response = await api.post('/services', serviceData);
    return response.data;
};

const updateService = async (id, serviceData) => {
    const response = await api.put(`/services/${id}`, serviceData);
    return response.data;
};

const deleteService = async (id) => {
    const response = await api.delete(`/services/${id}`);
    return response.data;
};

const serviceService = {
    getServices,
    getService,
    createService,
    updateService,
    deleteService
};

export default serviceService;
