import {IUser} from '../models/IUser';
import {makeAutoObservable} from 'mobx';
import AuthService from '../services/AuthService';
import axios from 'axios';
import {AuthResponse} from '../models/response/AuthResponse';
import {AUTH_API_URL} from '../http/url/urls';
import {jwtDecode} from 'jwt-decode';

interface JwtPayload {
    user_id: number;
    exp: number;
    is_superuser: boolean;
}

const isUserSuperuser = (): boolean => {
    const token = localStorage.getItem('token');
    if (token) {
        try {
            const decoded: JwtPayload = jwtDecode<JwtPayload>(token);
            return decoded.is_superuser;
        } catch (error) {
            console.error('Ошибка при декодировании токена:', error);
            return false;
        }
    }
    return false;
};

export default class Store {
    user = {} as IUser;
    isAuth = false;
    isSuperUser = false;
    isLoading = false;

    constructor() {
        makeAutoObservable(this);
    }

    setAuth(bool: boolean) {
        this.isAuth = bool;
    }

    setUser(user: IUser) {
        this.user = user;
    }

    setSuperUser(bool: boolean) {
        this.isSuperUser = bool;
    }

    setLoading(bool: boolean) {
        this.isLoading = bool;
    }

    async login(email: string, password: string) {
        try {
            const response = await AuthService.login(email, password);
            localStorage.setItem('token', response.data.access);
            this.setAuth(true);
            this.setSuperUser(isUserSuperuser());
            this.setUser(response.data.user);
        } catch (e) {
            // @ts-ignore
            console.log(e.response?.data?.message);
        }
    }

    async verify(email: string, username: string) {
        try {
            // The code is only emailed; the client never sees it.
            await AuthService.verify(email, username);
            return Promise.resolve();
        } catch (e) {
            // @ts-ignore
            return Promise.reject(e);
        }
    }

    // Rejects with the server's error (e.g. a wrong code), so the form can show it.
    async registration(username: string, email: string, password: string, code: string) {
        const response = await AuthService.registration(username, email, password, code);
        localStorage.setItem('token', response.data.access);
        this.setAuth(true);
        this.setSuperUser(isUserSuperuser());
    }

    async logout() {
        try {
            const response = await AuthService.logout();
            localStorage.removeItem('token');
            this.setAuth(false);
            this.setUser({} as IUser);
        } catch (e: any) {
            console.log(e.response?.data?.message);
        }
    }

    async checkAuth() {
        this.setLoading(true);
        try {
            const response = await axios.post<AuthResponse>(
                `${AUTH_API_URL}/refresh/`,
                {},
                {
                    withCredentials: true,
                },
            );
            localStorage.setItem('token', response.data.access);
            this.setAuth(true);
            this.setSuperUser(isUserSuperuser());
            this.setUser(response.data.user);
            return Promise.resolve();
        } catch (e: any) {
            if (e.response?.status === 401) {
                this.setAuth(false);
                localStorage.removeItem('token');
                console.log('Не удалось обновить токен: пользователь не авторизован.');
            } else {
                console.log('Ошибка авторизации:', e.response?.data?.message);
            }
            return Promise.reject(e);
        } finally {
            this.setLoading(false);
        }
    }
}
