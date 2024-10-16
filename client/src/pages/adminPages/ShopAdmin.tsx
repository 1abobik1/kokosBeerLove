import React, {useState, useEffect} from 'react';
import {Edit as EditIcon, Delete as DeleteIcon} from '@mui/icons-material';
import ShopService from '../../api/services/ShopService';
import {uploadImage} from './functions/uploadImage';
import {ShopResponse} from '../../api/models/response/ShopResponse';
import './ShopAdmin.css';

const ShopAdmin = () => {
    const [productName, setProductName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState<string>('');
    const [discount, setDiscount] = useState<string>('0'); // Поле для скидки как строка
    const [category, setCategory] = useState<'Одежда' | 'Аксессуары' | ''>(''); // Поле для выбора категории
    const [sizes, setSizes] = useState<{size: 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL'; quantity: number}[]>([]); // Размеры и количество
    const [images, setImages] = useState<File[]>([]);
    const [existingImages, setExistingImages] = useState<string[]>([]);
    const [productList, setProductList] = useState<ShopResponse[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editProductId, setEditProductId] = useState<number | null>(null);
    const [originalProduct, setOriginalProduct] = useState<ShopResponse | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await ShopService.getAllProducts();
            setProductList(response.data);
        } catch (error) {
            setErrorMessage('Ошибка загрузки товаров.');
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const selectedFiles = Array.from(e.target.files);
            setImages((prevImages) => [...prevImages, ...selectedFiles]);
        }
    };

    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {value, selectionStart} = e.target;
        const regex = /^\d+(\.\d{0,2})?$/;

        if (value === '' || regex.test(value)) {
            setPrice(value);
            setTimeout(() => {
                e.target.setSelectionRange(selectionStart, selectionStart);
            }, 0);
        }
    };

    const handleDiscountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {value, selectionStart} = e.target;
        const regex = /^\d{1,2}$/;

        if (value === '' || regex.test(value)) {
            setDiscount(value);
            setTimeout(() => {
                e.target.setSelectionRange(selectionStart, selectionStart);
            }, 0);
        }
    };

    const handleSizeChange = (index: number, field: 'size' | 'quantity', value: string | number) => {
        const updatedSizes = [...sizes];
        updatedSizes[index] = {...updatedSizes[index], [field]: value};
        setSizes(updatedSizes);
    };

    const addSize = () => {
        setSizes((prevSizes) => [...prevSizes, {size: 'S', quantity: 0}]);
    };

    const removeSize = (index: number) => {
        setSizes((prevSizes) => prevSizes.filter((_, i) => i !== index));
    };

    const handleAddOrUpdateProduct = async () => {
        if (!productName || !description || price === '' || category === '' || sizes.length === 0) {
            setErrorMessage('Заполните все поля!');
            return;
        }

        try {
            let imageUrls: string[] = [...existingImages];

            if (images.length > 0) {
                const uploadedImageUrls = await Promise.all(
                    images.map((image) => uploadImage(image, setSuccessMessage, setErrorMessage, 'shop_images')),
                );
                imageUrls = [...imageUrls, ...uploadedImageUrls];
            }

            const parsedPrice = parseFloat(price);
            const parsedDiscount = discount ? parseInt(discount) : 0;
            if (isNaN(parsedPrice) || isNaN(parsedDiscount)) {
                setErrorMessage('Цена и скидка должны быть числами.');
                return;
            }

            if (isEditing && editProductId !== null) {
                if (originalProduct) {
                    const isNameChanged = originalProduct.name !== productName;
                    const isDescriptionChanged = originalProduct.description !== description;
                    const isPriceChanged = originalProduct.price !== parsedPrice;
                    const isImageChanged =
                        images.length > 0 || existingImages.length !== originalProduct.url_images.length;
                    const isCategoryChanged = originalProduct.category !== category;
                    const isSizesChanged = JSON.stringify(originalProduct.sizes) !== JSON.stringify(sizes);

                    if (
                        isNameChanged ||
                        isDescriptionChanged ||
                        isPriceChanged ||
                        isImageChanged ||
                        isCategoryChanged ||
                        isSizesChanged
                    ) {
                        await ShopService.updatePartProduct(
                            editProductId,
                            productName,
                            description,
                            parsedPrice,
                            parsedDiscount,
                            category,
                            imageUrls.length > 0 ? imageUrls : originalProduct.url_images,
                            sizes,
                        );
                        setSuccessMessage('Товар обновлен.');
                    } else {
                        setSuccessMessage('Изменений не обнаружено.');
                    }
                }
            } else {
                await ShopService.createProduct(
                    productName,
                    description,
                    parsedPrice,
                    parsedDiscount,
                    category,
                    imageUrls,
                    sizes,
                );
                setSuccessMessage('Товар добавлен.');
            }

            setProductName('');
            setDescription('');
            setPrice('');
            setDiscount('');
            setCategory('');
            setSizes([]);
            setImages([]);
            setExistingImages([]);
            setIsEditing(false);
            setEditProductId(null);
            setOriginalProduct(null);

            await fetchProducts();
        } catch (error) {
            setErrorMessage('Ошибка при сохранении товара.');
        }
    };

    return (
        <div className="shop-admin-container">
            <h2 className="shop-admin-title">{isEditing ? 'Редактировать товар' : 'Добавить товар'}</h2>

            {errorMessage && <div className="error-message">{errorMessage}</div>}
            {successMessage && <div className="success-message">{successMessage}</div>}

            <input
                type="text"
                className="shop-admin-input"
                placeholder="Название товара"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
            />
            <textarea
                className="shop-admin-textarea"
                placeholder="Описание товара"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />
            <input
                type="text"
                className="shop-admin-input"
                placeholder="Цена"
                value={price}
                onChange={handlePriceChange}
            />
            <input
                type="text"
                className="shop-admin-input"
                placeholder="Скидка (%)"
                value={discount}
                onChange={handleDiscountChange}
            />

            <select
                className="shop-admin-input"
                value={category}
                onChange={(e) => setCategory(e.target.value as 'Одежда' | 'Аксессуары')}
            >
                <option value="">Выберите категорию</option>
                <option value="Одежда">Одежда</option>
                <option value="Аксессуары">Аксессуары</option>
            </select>

            <h4>Размеры и количество:</h4>
            {sizes.map((size, index) => (
                <div key={index} className="shop-admin-size-row">
                    <select
                        className="shop-admin-input"
                        value={size.size}
                        onChange={(e) => handleSizeChange(index, 'size', e.target.value)}
                    >
                        <option value="XS">XS</option>
                        <option value="S">S</option>
                        <option value="M">M</option>
                        <option value="L">L</option>
                        <option value="XL">XL</option>
                        <option value="XXL">XXL</option>
                    </select>
                    <input
                        type="number"
                        className="shop-admin-input"
                        placeholder="Количество"
                        value={size.quantity}
                        onChange={(e) => handleSizeChange(index, 'quantity', parseInt(e.target.value))}
                    />
                    <button className="shop-admin-delete-size-button" onClick={() => removeSize(index)}>
                        Удалить
                    </button>
                </div>
            ))}
            <button className="shop-admin-button" onClick={addSize}>
                Добавить размер
            </button>

            <label className="shop-admin-file-label">
                Загрузить изображения:
                <input type="file" multiple accept="image/*" onChange={handleFileChange} />
            </label>

            {existingImages.length > 0 && (
                <div className="shop-admin-images-container">
                    {existingImages.map((image, index) => (
                        <img key={index} src={image} alt={`Продукт ${index}`} className="shop-admin-image" />
                    ))}
                </div>
            )}

            <button className="shop-admin-button" onClick={handleAddOrUpdateProduct}>
                {isEditing ? 'Сохранить изменения' : 'Добавить товар'}
            </button>
        </div>
    );
};

export default ShopAdmin;
