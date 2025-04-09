import api from './api'

const setupHttpInterceptors = () => {
    api.interceptors.request.use(
        (req) => {
            const token = localStorage.getItem('access-token');
            if (token) {
                req.headers['Authorization'] = `Bearer ${token}`;
            }
            return req;
        },
        (err) => Promise.reject(err)
    );
    
    api.interceptors.response.use(
        (res) => res,
        async (err) => {
            const original_request = err.config;
    
            if (err.response?.status === 401) {
                try {
                    const refresh = localStorage.getItem('refresh-token');
                    const response = await api.post('/token/refresh', { refresh });
                    const token = response.data.access;
        
                    localStorage.setItem('access-token', token);
                    original_request.headers['Authorization'] = `Bearer: ${token}`;
                    return api(original_request);
                } catch (e) {
                    localStorage.removeItem('access-token');
                    localStorage.removeItem('refresh-token');
                    return Promise.reject(e);
                }
    
            }
    
            return Promise.reject(err);
        }
    )
}

export default setupHttpInterceptors;