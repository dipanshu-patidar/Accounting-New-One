import api from '../api/axios';

const createProduct = async (productData) => {
    const response = await api.post('/products', productData);
    return response.data;
};

const getProducts = async (companyId) => {
    const params = companyId ? { company_id: companyId } : {};
    const response = await api.get('/products', { params });
    return response.data;
};

const getProduct = async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
};

const updateProduct = async (id, productData) => {
    const response = await api.put(`/products/${id}`, productData);
    return response.data;
};

const deleteProduct = async (id) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
};

const productService = {
    createProduct,
    getProducts,
    getProduct,
    updateProduct,
    deleteProduct
};

export default productService;
