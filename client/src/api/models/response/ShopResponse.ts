import {ProductSize} from '../ProductSize';

export interface ShopResponse {
    id: string;
    name: string;
    description: string;
    price: number;
    discount: number;
    category: 'Одежда' | 'Аксессуары';
    url_images: string[];
    sizes: ProductSize[];
}
