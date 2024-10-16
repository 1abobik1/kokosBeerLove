import React, {useContext, useEffect, useState} from 'react';
import {
    Modal,
    Box,
    Button,
    Typography,
    IconButton,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import {observer} from 'mobx-react-lite';
import BasketService from '../../api/services/BasketService';
import img from '../../images/T-shirt Mockup.png';

interface BasketType {
    id: number;
    product_name: number;
    description: string;
    url_images: string[];
    size: string;
    quantity: number;
}

const Basket: React.FC<{open: boolean; handleClose: () => void}> = ({open, handleClose}) => {
    const [isBuying, setBuying] = useState<BasketType[]>([]);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        fetchBacket();
    }, []);

    const fetchBacket = async () => {
        // The cart belongs to a signed-in user; anonymous visitors only got 401s here.
        if (!localStorage.getItem('token')) return;
        setIsLoading(true);
        try {
            const response = await BasketService.getAllBasket();
            setBuying(response.data);
        } catch (error: any) {
            if (error.response && error.response.status === 404) {
                setErrorMessage('Товары не найдены.');
            } else {
                setErrorMessage('Ошибка загрузки товаров.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleRemoveItem = async (productId: number, size: string) => {
        try {
            setIsLoading(true);
            await BasketService.removeItemFromBasket(productId, size);

            setBuying((prevItems) => {
                return prevItems
                    .map((item) => {
                        if (item.id === productId && item.size === size) {
                            if (item.quantity > 1) {
                                return {...item, quantity: item.quantity - 1};
                            }
                            return undefined;
                        }
                        return item;
                    })
                    .filter((item): item is BasketType => item !== undefined);
            });
        } catch (error) {
            setErrorMessage('Ошибка при удалении товара из корзины.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCheckout = () => {
        handleClose();
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <Box
                sx={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    borderRadius: '12px',
                    padding: '20px',
                    width: {xs: '90%', sm: '80%', md: '60%', lg: '500px'},
                    textAlign: 'center',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    maxHeight: '80vh',
                    overflowY: 'auto', // Для прокрутки на маленьких экранах
                }}
            >
                <IconButton
                    onClick={handleClose}
                    sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        color: 'red',
                    }}
                >
                    <CloseIcon />
                </IconButton>

                <Typography variant="h5" sx={{mb: 2, color: '#E62526', fontSize: {xs: '24px', md: '30px'}}}>
                    Корзина
                </Typography>

                {isBuying.length > 0 ? (
                    <>
                        <List>
                            {isBuying.map((item, index) => (
                                <ListItem key={index} sx={{display: 'flex', alignItems: 'center'}}>
                                    <img
                                        src={item.url_images[0] || img}
                                        alt="error"
                                        style={{width: '50px', marginRight: '15px'}}
                                    />
                                    <ListItemText
                                        primary={`Название: ${item.product_name}`}
                                        secondary={
                                            <>
                                                <Typography component="span" variant="body2" color="text.secondary">
                                                    Размер: {item.size}
                                                </Typography>
                                                <br />
                                                <Typography component="span" variant="body2" color="text.secondary">
                                                    Количество: {item.quantity}
                                                </Typography>
                                            </>
                                        }
                                    />
                                    <ListItemSecondaryAction>
                                        <IconButton edge="end" onClick={() => handleRemoveItem(item.id, item.size)}>
                                            <DeleteIcon sx={{color: '#E62526'}} />
                                        </IconButton>
                                    </ListItemSecondaryAction>
                                </ListItem>
                            ))}
                        </List>

                        <Button
                            variant="contained"
                            sx={{
                                mt: 2,
                                backgroundColor: '#E62526',
                                color: 'white',
                                borderRadius: '12px',
                                width: '100%',
                            }}
                            onClick={handleCheckout}
                        >
                            Перейти к оформлению
                        </Button>
                    </>
                ) : (
                    <Typography sx={{mt: 2, color: 'gray'}}>Ваша корзина пуста.</Typography>
                )}
            </Box>
        </Modal>
    );
};

export default observer(Basket);
