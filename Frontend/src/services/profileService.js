import axios from 'axios';

const API_URL = 'http://localhost:5000/api/profile';

const getProfile = async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

const updateProfile = async (data) => {
    const token = localStorage.getItem('token');
    const response = await axios.put(`${API_URL}/update`, data, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

const changePassword = async (data) => {
    const token = localStorage.getItem('token');
    const response = await axios.put(`${API_URL}/change-password`, data, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

export default {
    getProfile,
    updateProfile,
    changePassword
};
