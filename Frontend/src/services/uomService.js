import api from '../api/axios';

const getUnits = async () => {
    const response = await api.get('/uom');
    return response.data;
};

const getUnit = async (id) => {
    const response = await api.get(`/uom/${id}`);
    return response.data;
};

const createUnit = async (unitData) => {
    const response = await api.post('/uom', unitData);
    return response.data;
};

const updateUnit = async (id, unitData) => {
    const response = await api.put(`/uom/${id}`, unitData);
    return response.data;
};

const deleteUnit = async (id) => {
    const response = await api.delete(`/uom/${id}`);
    return response.data;
};

const uomService = {
    getUnits,
    getUnit,
    createUnit,
    updateUnit,
    deleteUnit
};

export default uomService;
