import {createApiInstance} from './apiInterceptorsFactory/apiInterceptorsFactory';
import {SHOP_API_URL} from './url/urls';

export const basketApi = createApiInstance(
    SHOP_API_URL,
    /^\/remove_item_from_cart\/\d+\/$/,
    /^\s*$/,
    '/add_to_cart/',
    /\/get_all_items_from_cart\/\d+/,
);
