
import React, {useEffect, useState} from 'react';
import {AppBar, Toolbar, Box, IconButton, MenuItem, Typography,Drawer, Menu, Button} from '@mui/material';
import {YouTube, Telegram, WhatsApp,Menu as MenuIcon , AccountCircle} from '@mui/icons-material';
import {Link, useNavigate} from 'react-router-dom';
import RegistrationModal from './RegistrationModal';
import { store } from '../../index';
import logo from '../../images/logo.jpg';
import Basket from './Basket';
import {  Badge } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import BasketService from '../../api/services/BasketService';

interface BasketType{
    id:number;
    product_name: number,
    description: string,
    url_images: string[],
    size: string,
    quantity: number
}

const Header = () => {
    const [open, setOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null); // Для меню профиля
    const [drawerOpen, setDrawerOpen] = useState(false);
    const navigate = useNavigate();
    const [isCartOpen, setIsCartOpen] = useState(false);
    const[isBuying,setBuying]=useState<BasketType[]>([])
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const handleOpenCart = () => {
        setIsCartOpen(true);
    };

    const handleCloseCart = () => {
        setIsCartOpen(false);
    };


    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const handleProfileClick = (event: React.MouseEvent<HTMLElement>) => {
        event.stopPropagation(); // Предотвращает распространение события
        setAnchorEl(event.currentTarget); // Открываем меню профиля
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = async () => {
        await store.logout();
        handleMenuClose();
        navigate('/');
    };

    const handleProfileNavigate = () => {
        if (store.isSuperUser) {
            navigate('/admin');
        } else {
            navigate('/fan');
        }
        handleMenuClose();
    };

    const handleDrawerToggle = () => {
        setDrawerOpen(!drawerOpen);
    };

    useEffect(()=>{
        fetchBacket()
    },[])


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

    return (
        <AppBar position="static" color="transparent" elevation={0}>
            <Toolbar sx={{flexDirection: 'column', alignItems: 'center', paddingBottom: '20px'}}>
                <Box
                    className="HighLine"
                    sx={{
                        width: '80%',
                        backgroundColor: 'white',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderBottomLeftRadius: '10px',
                        borderBottomRightRadius: '10px',
                        boxShadow: '0 0 6px 0.5px #E62526',
                        padding: '10px',
                        marginBottom: '1px',
                        '@media (max-width: 700px)': {
                            width: '90%',
                        },
                    }}
                >
                    <Box
                        className="Highline_Elements"
                        sx={{
                            width: '100%',
                            display: 'flex',
                            flexWrap: 'wrap',
                            justifyContent: 'space-between',
                        }}
                    >
                        {/* Логотип */}
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <IconButton component={Link} to="/" sx={{ padding: 0 }}>
                                <img src={logo} alt="Logo" style={{ height: '50px' }} />
                            </IconButton>
                        </Box>

                        {/* Бургер-кнопка, отображается только на мобильных устройствах */}
                        <Box sx={{ display: { xs: 'block', md: 'none' } }}>
                            <IconButton onClick={handleDrawerToggle} color="inherit">
                                <MenuIcon />
                            </IconButton>
                        </Box>


                        {/* Навигация */}
                        <Box className="links" sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', flexWrap: 'wrap' }}>
                            <MenuItem style={{fontWeight: 'bold'}} component={Link} to="/news">Новости</MenuItem>
                            <MenuItem style={{fontWeight: 'bold'}} component={Link} to="/matches">Матчи</MenuItem>
                            <MenuItem style={{fontWeight: 'bold'}} component={Link} to="/team">Команда</MenuItem>
                            <MenuItem style={{fontWeight: 'bold'}} component={Link} to="/about">О клубе</MenuItem>
                            <MenuItem style={{fontWeight: 'bold'}} component={Link} to="/shop">Магазин</MenuItem>
                            <MenuItem style={{fontWeight: 'bold'}} component="div"
                                       onClick={() => {
                                           const footerElement = document.getElementById('footer');
                                           if (footerElement) {
                                               footerElement.scrollIntoView({ behavior: 'smooth' });
                                           }
                                       }}>Контакты</MenuItem>
                        </Box>

                        {/* Социальные сети */}
                        <Box sx={{display: { xs: 'none', md: 'flex' }, alignItems: 'center', marginLeft: 'auto'}}>
                            <IconButton color="inherit">
                                <YouTube/>
                            </IconButton>
                            <IconButton color="inherit">
                                <Telegram/>
                            </IconButton>
                            <IconButton color="inherit">
                                <WhatsApp/>
                            </IconButton>
                            <IconButton color="inherit">
                                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="24" height="24"
                                     viewBox="0 0 50 50">
                                    <path
                                        d="M41,4H9C6.24,4,4,6.24,4,9v32c0,2.76,2.24,5,5,5h32c2.76,0,5-2.24,5-5V9C46,6.24,43.76,4,41,4z M37.72,33l-3.73-0.01 c0,0-0.08,0.01-0.21,0.01c-0.3,0-0.92-0.08-1.65-0.58c-1.31-0.91-2.56-3.17-3.55-3.17c-0.07,0-0.13,0.01-0.19,0.03 c-0.86,0.27-1.12,1.13-1.12,2.18c0,0.37-0.26,0.54-0.96,0.54h-1.93c-2.16,0-4.25-0.05-6.6-2.62c-3.46-3.79-6.7-10.53-6.7-10.53 s-0.18-0.39,0.01-0.62c0.18-0.21,0.6-0.23,0.76-0.23c0.04,0,0.06,0,0.06,0h4c0,0,0.37,0.07,0.64,0.27c0.23,0.17,0.35,0.48,0.35,0.48 s0.68,1.32,1.53,2.81c1.43,2.46,2.2,3.28,2.75,3.28c0.09,0,0.18-0.02,0.27-0.07c0.82-0.45,0.58-4.09,0.58-4.09s0.01-1.32-0.42-1.9 c-0.33-0.46-0.96-0.59-1.24-0.63c-0.22-0.03,0.14-0.55,0.62-0.79c0.62-0.3,1.65-0.36,2.89-0.36h0.6c1.17,0.02,1.2,0.14,1.66,0.25 c1.38,0.33,0.91,1.62,0.91,4.71c0,0.99-0.18,2.38,0.53,2.85c0.05,0.03,0.12,0.05,0.21,0.05c0.46,0,1.45-0.59,3.03-3.26 c0.88-1.52,1.56-3.03,1.56-3.03s0.15-0.27,0.38-0.41c0.22-0.13,0.22-0.13,0.51-0.13h0.03c0.32,0,3.5-0.03,4.2-0.03h0.08 c0.67,0,1.28,0.01,1.39,0.42c0.16,0.62-0.49,1.73-2.2,4.03c-2.82,3.77-3.14,3.49-0.8,5.67c2.24,2.08,2.7,3.09,2.78,3.22 C39.68,32.88,37.72,33,37.72,33z"></path>
                                </svg>
                            </IconButton>
                        </Box>


                        {/* Поиск и Логин / Профиль */}
                        <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', marginLeft: 'auto', color: 'white' }}>


                            {store.isAuth ? (
                                <>
                                <IconButton onClick={handleOpenCart} color="primary" aria-label="Корзина">
                <Badge badgeContent={isBuying.length} color="error">
                    <ShoppingCartIcon style={{color:"red"}}/>
                </Badge>
            </IconButton>
                                    <IconButton onClick={handleProfileClick}>
                                        <AccountCircle style={{color: '#E62526'}}/>
                                    </IconButton>

                                    <Menu
                                        anchorEl={anchorEl}
                                        open={Boolean(anchorEl)}
                                        onClose={handleMenuClose}
                                    >
                                        <MenuItem onClick={handleProfileNavigate}>Профиль</MenuItem>
                                        <MenuItem onClick={handleLogout}>Выйти</MenuItem>
                                    </Menu>
                                </>
                            ) : (
                                <IconButton onClick={handleOpen}>
                                    <svg width="25" height="25" viewBox="2 -2 31 31" fill="none"
                                         xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M9 18.3333L7.6 16.7L10.2 13.6667H0V11.3333H10.2L7.6 8.3L9 6.66667L14 12.5L9 18.3333ZM18 4.33333H10V2H18C19.1 2 20 3.05 20 4.33333V20.6667C20 21.95 19.1 23 18 23H10V20.6667H18V4.33333Z"
                                            fill="#E62526" />
                                    </svg>
                                    <Typography color={'#E62526'}> Войти</Typography>
                                </IconButton>
                            )}
                        </Box>
                    </Box>
                </Box>

                {/* Бургер-меню */}
                <Drawer anchor="left" open={drawerOpen} onClose={handleDrawerToggle}>
                    <Box sx={{ width: 250 }} role="presentation" onClick={handleDrawerToggle} onKeyDown={handleDrawerToggle}>

                        {store.isAuth ? (
                            <>
                            <IconButton onClick={handleOpenCart} color="primary" aria-label="Корзина">
                <Badge badgeContent={isBuying.length} color="error">
                    <ShoppingCartIcon style={{color:"red"}}/>
                </Badge>
            </IconButton>
                                <IconButton onClick={handleProfileClick}>
                                    <AccountCircle style={{color: '#E62526'}}/>
                                </IconButton>
                                <Menu
                                    anchorEl={anchorEl}
                                    open={Boolean(anchorEl)}
                                    onClose={handleMenuClose}
                                >
                                    <MenuItem onClick={handleProfileNavigate}>Профиль</MenuItem>
                                    <MenuItem onClick={handleLogout}>Выйти</MenuItem>
                                </Menu>
                            </>
                        ) : (
                            <IconButton onClick={handleOpen}>
                                <svg width="25" height="25" viewBox="2 -2 31 31" fill="none"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M9 18.3333L7.6 16.7L10.2 13.6667H0V11.3333H10.2L7.6 8.3L9 6.66667L14 12.5L9 18.3333ZM18 4.33333H10V2H18C19.1 2 20 3.05 20 4.33333V20.6667C20 21.95 19.1 23 18 23H10V20.6667H18V4.33333Z"
                                        fill="#E62526" />
                                </svg>
                                <Typography color={'#E62526'}> Войти</Typography>
                            </IconButton>
                        )}
                        <MenuItem component={Link} to="/">Главная</MenuItem>
                        <MenuItem component={Link} to="/news">Новости</MenuItem>
                        <MenuItem component={Link} to="/matches">Матчи</MenuItem>
                        <MenuItem component={Link} to="/team">Команда</MenuItem>
                        <MenuItem component={Link} to="/about">О клубе</MenuItem>
                        <MenuItem component={Link} to="/shop">Магазин</MenuItem>

                        <div className='icons'>
                            <IconButton color="inherit">
                                <YouTube/>
                            </IconButton>
                            <IconButton color="inherit">
                                <Telegram/>
                            </IconButton>
                            <IconButton color="inherit">
                                <WhatsApp/>
                            </IconButton>
                            <IconButton color="inherit">
                                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="24" height="24"
                                     viewBox="0 0 50 50">
                                    <path
                                        d="M41,4H9C6.24,4,4,6.24,4,9v32c0,2.76,2.24,5,5,5h32c2.76,0,5-2.24,5-5V9C46,6.24,43.76,4,41,4z M37.72,33l-3.73-0.01 c0,0-0.08,0.01-0.21,0.01c-0.3,0-0.92-0.08-1.65-0.58c-1.31-0.91-2.56-3.17-3.55-3.17c-0.07,0-0.13,0.01-0.19,0.03 c-0.86,0.27-1.12,1.13-1.12,2.18c0,0.37-0.26,0.54-0.96,0.54h-1.93c-2.16,0-4.25-0.05-6.6-2.62c-3.46-3.79-6.7-10.53-6.7-10.53 s-0.18-0.39,0.01-0.62c0.18-0.21,0.6-0.23,0.76-0.23c0.04,0,0.06,0,0.06,0h4c0,0,0.37,0.07,0.64,0.27c0.23,0.17,0.35,0.48,0.35,0.48 s0.68,1.32,1.53,2.81c1.43,2.46,2.2,3.28,2.75,3.28c0.09,0,0.18-0.02,0.27-0.07c0.82-0.45,0.58-4.09,0.58-4.09s0.01-1.32-0.42-1.9 c-0.33-0.46-0.96-0.59-1.24-0.63c-0.22-0.03,0.14-0.55,0.62-0.79c0.62-0.3,1.65-0.36,2.89-0.36h0.6c1.17,0.02,1.2,0.14,1.66,0.25 c1.38,0.33,0.91,1.62,0.91,4.71c0,0.99-0.18,2.38,0.53,2.85c0.05,0.03,0.12,0.05,0.21,0.05c0.46,0,1.45-0.59,3.03-3.26 c0.88-1.52,1.56-3.03,1.56-3.03s0.15-0.27,0.38-0.41c0.22-0.13,0.22-0.13,0.51-0.13h0.03c0.32,0,3.5-0.03,4.2-0.03h0.08 c0.67,0,1.28,0.01,1.39,0.42c0.16,0.62-0.49,1.73-2.2,4.03c-2.82,3.77-3.14,3.49-0.8,5.67c2.24,2.08,2.7,3.09,2.78,3.22 C39.68,32.88,37.72,33,37.72,33z"></path>
                                </svg>
                            </IconButton>
                        </div>
                    </Box>
                </Drawer>
                <Basket open={isCartOpen} handleClose={handleCloseCart} />
                <RegistrationModal open={open} handleClose={handleClose}/>
            </Toolbar>
        </AppBar>
    );
};

export default Header;