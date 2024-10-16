import {createApiInstance} from './apiInterceptorsFactory/apiInterceptorsFactory';
import {MATCH_API_URL} from './url/urls';

export const matchApi = createApiInstance(MATCH_API_URL, /^\/delete\/\d+\/$/, /^\/update\/\d+\/$/, '/create/');
