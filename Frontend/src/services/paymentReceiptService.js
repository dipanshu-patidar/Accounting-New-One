import api from '../api/axios';

const getPayments = async (params = {}) => {
    const response = await api.get('/sales/payments', { params });
    return response.data;
};

const getPayment = async (id) => {
    const response = await api.get(`/sales/payments/${id}`);
    return response.data;
};

const createPayment = async (paymentData) => {
    const response = await api.post('/sales/payments', paymentData);
    return response.data;
};

const deletePayment = async (id) => {
    const response = await api.delete(`/sales/payments/${id}`);
    return response.data;
};

const getInvoicesForPayment = async (customerId) => {
    const params = customerId ? { customerId } : {};
    const response = await api.get('/sales/payments/invoices', { params });
    return response.data;
};

const paymentReceiptService = {
    getPayments,
    getPayment,
    createPayment,
    deletePayment,
    getInvoicesForPayment
};

export default paymentReceiptService;
