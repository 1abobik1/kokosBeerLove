import React, {useEffect, useState} from 'react';
import './Shop.css';
import Header from '../../../components/HeaderAndItsComponents/Header';
import Footer from '../../../components/Footer/Footer';
import {ShopResponse} from '../../../api/models/response/ShopResponse';
import ShopService from '../../../api/services/ShopService';
import ShopCard from '../../../components/Shop_and_Main_PageComponents/ShopCard';

const Shop = () => {
    const [shopData, setShopData] = useState<ShopResponse[]>([]);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;
    const [searchQuery, setSearchQuery] = useState(''); // Состояние для текста поиска

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

    // Фильтрация товаров по имени
    const filteredShopData = shopData.filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()));

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredShopData.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredShopData.length / itemsPerPage);

    const handlePrevPage = () => {
        setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev));
    };

    const handleNextPage = () => {
        setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev));
    };

    return (
        <div className="container-shop">
            <Header />
            <div className="shop-section">
                <h1 style={{color: 'black'}}>Магазин</h1>
                {/* Поле поиска */}
                <div className="search-container">
                    <input
                        type="text"
                        placeholder="Поиск товара"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{
                            padding: '10px',
                            border: '1px solid red',
                            borderRadius: '5px',
                            width: '300px',
                            marginBottom: '20px',
                        }}
                    />
                </div>
                <div className="shop-cards-container">
                    {isLoading && <div className="loading-spinner"></div>}
                    {errorMessage && <div className="error-message">{errorMessage}</div>}
                    {currentItems.map((item) => (
                        <ShopCard
                            key={item.id}
                            id={item.id}
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
                <div className="pagination">
                    <button onClick={handlePrevPage} disabled={currentPage === 1}>
                        Предыдущая
                    </button>
                    <span style={{color: 'white'}}>
                        Страница {currentPage} из {totalPages}
                    </span>
                    <button onClick={handleNextPage} disabled={currentPage === totalPages}>
                        Следующая
                    </button>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Shop;
