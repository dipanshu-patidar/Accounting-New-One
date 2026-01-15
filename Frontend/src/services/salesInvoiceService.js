import api from '../api/axios';

const getInvoices = async (params = {}) => {
    const response = await api.get('/sales/invoices', { params });
    return response.data;
};

const getInvoice = async (id) => {
    const response = await api.get(`/sales/invoices/${id}`);
    return response.data;
};

const createInvoice = async (invoiceData) => {
    const response = await api.post('/sales/invoices', invoiceData);
    return response.data;
};

const updateInvoice = async (id, invoiceData) => {
    const response = await api.put(`/sales/invoices/${id}`, invoiceData);
    return response.data;
};

const deleteInvoice = async (id) => {
    const response = await api.delete(`/sales/invoices/${id}`);
    return response.data;
};

const sendInvoice = async (id) => {
    const response = await api.post(`/sales/invoices/${id}/send`);
    return response.data;
};

const salesInvoiceService = {
    getInvoices,
    getInvoice,
    createInvoice,
    updateInvoice,
    deleteInvoice,
    sendInvoice
};

export default salesInvoiceService;
