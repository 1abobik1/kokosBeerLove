import {createApiInstance} from './apiInterceptorsFactory/apiInterceptorsFactory';
import {NEWS_API_URL} from './url/urls';

export const newsApi = createApiInstance(NEWS_API_URL, /^\/\d+\/delete\/$/, /^\/\d+\/update\/$/, '/create/');
