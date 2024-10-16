import {createApiInstance} from './apiInterceptorsFactory/apiInterceptorsFactory';
import {AUTH_API_URL} from './url/urls';

export const authApi = createApiInstance(AUTH_API_URL, /^\s*$/, /^\s*$/, '');
