import axios from 'axios';
import {AuthResponse} from '../../models/response/AuthResponse';
import {AUTH_API_URL} from '../url/urls';

export const createApiInstance = (
    baseURL: string,
    deleteRegex: RegExp,
    updateRegex: RegExp,
    createString: string,
    getRegex?: RegExp,
): any => {
    const api = axios.create({
        withCredentials: true,
        baseURL: baseURL,
    });

    api.interceptors.request.use(
        (config) => {
            const token = localStorage.getItem('token');

            if (baseURL === AUTH_API_URL) {
                if (
                    (token &&
                        config.url !== '/signup/' &&
                        config.url !== '/login/' &&
                        config.url !== '/verify-email/') ||
                    (token && config.url === '/profile/update/') ||
                    (token && config.url === '/profile/get_user_data/')
                ) {
                    // @ts-ignore
                    config.headers.Authorization = `Bearer ${token}`;
                }
            } else if (
                (config.url === createString ||
                    deleteRegex.test(config.url || '') ||
                    updateRegex.test(config.url || '') ||
                    getRegex?.test(config.url || '')) &&
                token
            ) {
                // @ts-ignore
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        },
    );

    api.interceptors.response.use(
        (config) => {
            return config;
        },
        async (error) => {
            const originalRequest = error.config;

            if (error.response.status === 401 && !originalRequest._isRetry) {
                originalRequest._isRetry = true;

                try {
                    const response = await axios.post<AuthResponse>(
                        `${AUTH_API_URL}/refresh/`,
                        {},
                        {
                            withCredentials: true,
                        },
                    );
                    localStorage.setItem('token', response.data.access);
                    originalRequest.headers.Authorization = `Bearer ${response.data.access}`;
                    return api.request(originalRequest);
                } catch (e) {
                    console.log('Ошибка авторизации');
                }
            }
            return Promise.reject(error);
        },
    );

    return api;
};
