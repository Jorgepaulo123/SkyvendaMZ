import axios from "axios";

const isDevelopment = window.location.hostname === 'localhost' || 
                      window.location.hostname === '192.168.1.63' || 
                      window.location.hostname === '192.168.1.36';

// Direct API access without proxy
export const base_url = 'https://skyvendamz-1.onrender.com';

const api = axios.create({
    baseURL: base_url,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    withCredentials: false // Disable credentials for CORS
});

// Add a request interceptor to handle tokens if needed
api.interceptors.request.use(function (config) {
    // You can add authorization headers here if needed
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add CORS headers to the request
    config.headers['Access-Control-Allow-Origin'] = '*';
    config.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
    config.headers['Access-Control-Allow-Headers'] = 'Origin, Content-Type, Accept, Authorization, X-Request-With';
    
    return config;
}, function (error) {
    return Promise.reject(error);
});

// Add a response interceptor to handle common errors
api.interceptors.response.use(
    response => response,
    error => {
        // Handle CORS errors more gracefully
        if (error.message === 'Network Error') {
            console.error('CORS or Network Error. Please check if the server allows cross-origin requests.');
        }
        return Promise.reject(error);
    }
);

// Create a function to make API calls with CORS handling
export const apiCall = async (method, endpoint, data = null, params = null) => {
    try {
        let url = `${base_url}${endpoint}`;
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            mode: 'cors' // Enable CORS mode
        };

        if (data) {
            options.body = JSON.stringify(data);
        }

        if (params) {
            const queryParams = new URLSearchParams(params).toString();
            url += `?${queryParams}`;
        }

        const response = await fetch(url, options);
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('API call error:', error);
        throw error;
    }
};

export default api;
