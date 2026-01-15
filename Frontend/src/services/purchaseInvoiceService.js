import api from '../api/axios';

const getInvoices = async (params = {}) => {
    const response = await api.get('/purchases/invoices', { params });
    return response.data;
};

const getInvoice = async (id) => {
    const response = await api.get(`/purchases/invoices/${id}`);
    return response.data;
};

const createInvoice = async (invoiceData) => {
    const response = await api.post('/purchases/invoices', invoiceData);
    return response.data;
};

const updateInvoice = async (id, invoiceData) => {
    const response = await api.put(`/purchases/invoices/${id}`, invoiceData);
    return response.data;
};

const deleteInvoice = async (id) => {
    const response = await api.delete(`/purchases/invoices/${id}`);
    return response.data;
};

const receiveInvoice = async (id) => {
    const response = await api.post(`/purchases/invoices/${id}/receive`);
    return response.data;
};

const purchaseInvoiceService = {
    getInvoices,
    getInvoice,
    createInvoice,
    updateInvoice,
    deleteInvoice,
    receiveInvoice
};

export default purchaseInvoiceService;
