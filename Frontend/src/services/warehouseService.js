import api from '../api/axios';

const getWarehouses = async () => {
    const response = await api.get('/warehouses');
    return response.data;
};

const getWarehouse = async (id) => {
    const response = await api.get(`/warehouses/${id}`);
    return response.data;
};

const createWarehouse = async (warehouseData) => {
    const response = await api.post('/warehouses', warehouseData);
    return response.data;
};

const updateWarehouse = async (id, warehouseData) => {
    const response = await api.put(`/warehouses/${id}`, warehouseData);
    return response.data;
};

const deleteWarehouse = async (id) => {
    const response = await api.delete(`/warehouses/${id}`);
    return response.data;
};

const warehouseService = {
    getWarehouses,
    getWarehouse,
    createWarehouse,
    updateWarehouse,
    deleteWarehouse
};

export default warehouseService;
