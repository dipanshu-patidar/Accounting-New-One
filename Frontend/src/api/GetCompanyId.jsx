// const GetCompanyId = () => {
//   return localStorage.getItem("CompanyId"); 
// };

const GetCompanyId = () => {
    try {
        const userStr = localStorage.getItem('user');
        const user = userStr ? JSON.parse(userStr) : null;
        return user?.id || null;
    } catch (err) {
        console.error('Error parsing user from localStorage:', err);
        return null;
    }
};

export default GetCompanyId;