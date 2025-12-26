import axios, {AxiosError, type AxiosInstance, type AxiosResponse, type InternalAxiosRequestConfig} from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
console.log(API_BASE_URL)
export const axiosInstance: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor
axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {

        // Log request in development
        if (import.meta.env.DEV) {
            console.log('Request:', {
                method: config.method?.toUpperCase(),
                url: config.url,
                data: config.data,
            });
        }

        return config;
    },
    (error: AxiosError) => {
        console.error('Request Error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor
axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => {
        // Log response in development
        if (import.meta.env.DEV) {
            console.log('Response:', {
                status: response.status,
                url: response.config.url,
                data: response.data,
            });
        }

        return response;
    },
    (error: AxiosError) => {
        // Handle errors globally
        if (error.response) {
            // Server responded with error
            const status = error.response.status;

            switch (status) {
                case 401:
                    console.error('Unauthorized - Please login');
                    break;
                case 403:
                    console.error('Forbidden - Access denied');
                    break;
                case 404:
                    console.error('Not Found');
                    break;
                case 500:
                    console.error('Internal Server Error');
                    break;
                default:
                    console.error('Error:', error.response.data);
            }
        } else if (error.request) {
            console.error('No response from server:', error.request);
        } else {
            console.error('Request setup error:', error.message);
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;