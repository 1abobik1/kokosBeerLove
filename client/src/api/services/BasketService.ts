import {basketApi} from '../http/basket';
import {ProductToAdd} from '../models/ProductToAdd';
import {ShopResponse} from '../models/response/ShopResponse';

export default class BasketService {
    static async addToBasket(product: number, quantity: number, size: string) {
        // @ts-ignore
        return basketApi.post<ProductToAdd>('/add_to_cart/', {product, quantity, size});
    }
    static async getAllBasket() {
        // @ts-ignore
        return basketApi.get<ShopResponse>(`/get_all_items_from_cart/`);
    }

    static async removeItemFromBasket(productId: number, size: string) {
        return basketApi.delete(`/remove_item_from_cart/${productId}/`, {
            params: {size},
        });
    }
}
