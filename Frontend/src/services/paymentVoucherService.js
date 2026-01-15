import api from '../api/axios';

const getPayments = async (params = {}) => {
    const response = await api.get('/purchases/payments', { params });
    return response.data;
};

const getPayment = async (id) => {
    const response = await api.get(`/purchases/payments/${id}`);
    return response.data;
};

const createPayment = async (paymentData) => {
    const response = await api.post('/purchases/payments', paymentData);
    return response.data;
};

const deletePayment = async (id) => {
    const response = await api.delete(`/purchases/payments/${id}`);
    return response.data;
};

const getInvoicesForPayment = async (vendorId) => {
    const params = vendorId ? { vendorId } : {};
    const response = await api.get('/purchases/payments/invoices', { params });
    return response.data;
};

const paymentVoucherService = {
    getPayments,
    getPayment,
    createPayment,
    deletePayment,
    getInvoicesForPayment
};

export default paymentVoucherService;
