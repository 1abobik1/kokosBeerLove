import React, {useEffect, useState} from 'react';
import './ShopPreview.css';
import {Link} from 'react-router-dom';
import {ShopResponse} from '../../api/models/response/ShopResponse';
import ShopService from '../../api/services/ShopService';
import ShopCard from '../Shop_and_Main_PageComponents/ShopCard';

const ShopPreview = () => {
    const [shopData, setShopData] = useState<ShopResponse[]>([]);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        fetchShop();
    }, []);

    const fetchShop = async () => {
        setIsLoading(true);
        try {
            const response = await ShopService.getAllProducts();
            setShopData(response.data);
        } catch (error) {
            setErrorMessage('Ошибка загрузки товаров.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="shop-container">
            <div className="shop-content">
                <div className="title-links">
                    <h1>Магазин</h1>
                    <Link to="/shop" className="shop-link">
                        Переходите в официальный магазин команды
                    </Link>
                </div>
                <div className="card-container">
                    {isLoading && <div className="loading-spinner"></div>}
                    {errorMessage && <div className="error-message">{errorMessage}</div>}
                    {shopData.slice(0, 3).map((item) => (
                        <ShopCard
                            id={item.id}
                            key={item.id}
                            name={item.name}
                            description={item.description}
                            price={item.price}
                            url_images={item.url_images}
                            discount={item.discount}
                            category={item.category}
                            sizes={item.sizes}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ShopPreview;
