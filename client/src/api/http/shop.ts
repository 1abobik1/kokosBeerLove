import {createApiInstance} from './apiInterceptorsFactory/apiInterceptorsFactory';
import {SHOP_API_URL} from './url/urls';

export const shopApi = createApiInstance(
    SHOP_API_URL,
    /^\/delete_product\/\d+\/$/,
    /^\/update_product\/\d+\/$/,
    '/create_product/',
);
