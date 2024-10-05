import React, { useState } from 'react';
import {AppBar, Toolbar, Box, IconButton, MenuItem, Typography} from '@mui/material';
import {YouTube, Telegram, WhatsApp} from '@mui/icons-material';
import {Link} from 'react-router-dom';
import logo from "../images/logo.jpg"
import RegistrationModal from './RegistrationModal';
import './Header.css';

const Header = () => {
    const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

    return (
        <AppBar position="static" color="transparent" elevation={0}>
            <Toolbar sx={{flexDirection: 'column', alignItems: 'center'}}>
                {/* Верхняя часть шапки */}
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
                        <Box sx={{display: 'flex', alignItems: 'center'}}>
                            <IconButton component={Link} to="/" sx={{padding: 0}}>
                                <img src={logo} alt="Logo" style={{height: '50px'}}/>
                            </IconButton>
                        </Box>
                        {/* Навигация */}
                        <Box className='links' sx={{display: 'flex', alignItems: 'center', flexWrap: 'wrap'}}>
                            <MenuItem component={Link} to="/news">Новости</MenuItem>
                            <MenuItem component={Link} to="/matches">Матчи</MenuItem>
                            <MenuItem component={Link} to="/team">Команда</MenuItem>
                            <MenuItem component={Link} to="/about">О клубе</MenuItem>
                            <MenuItem component={Link} to="/shop">Магазин</MenuItem>
                            <MenuItem component={Link} to="/contacts">Контакты</MenuItem>
                        </Box>
                        {/* Поиск и Логин */}
                        <Box sx={{display: 'flex', alignItems: 'center', marginLeft: 'auto', color: 'white'}}>
                            <IconButton>
                                <svg width="25" height="25" viewBox="2 -2 31 31" fill="none"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="12" cy="10" r="8" stroke="#E62526" strokeWidth="2"/>
                                    <path d="M17 16L22 21" stroke="#E62526" strokeWidth="2"/>
                                </svg>
                                <Typography color={'#E62526'}> Поиск</Typography>
                            </IconButton>
                            <IconButton onClick={handleOpen}  >
                                <svg width="25" height="25" viewBox="2 -2 31 31" fill="none"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M9 18.3333L7.6 16.7L10.2 13.6667H0V11.3333H10.2L7.6 8.3L9 6.66667L14 12.5L9 18.3333ZM18 4.33333H10V2H18C19.1 2 20 3.05 20 4.33333V20.6667C20 21.95 19.1 23 18 23H10V20.6667H18V4.33333Z"
                                        fill="#E62526"/>
                                </svg>
                                <Typography color={'#E62526'} >Вход</Typography>
                            </IconButton>
                        </Box>
                    </Box>
                </Box>

                {/* Нижняя часть шапки */}
                <Box
                    className="LowLine"
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: '60vw',
                        maxWidth: '1200px',
                        padding: {xs: '10px', sm: '15px', md: '20px'},
                    }}
                >
                    {/* Социальные сети */}
                    <Box sx={{display: 'flex', alignItems: 'center'}}>
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
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" width="20px" height="20px">
                                <path
                                    d="M41,4H9C6.24,4,4,6.24,4,9v32c0,2.76,2.24,5,5,5h32c2.76,0,5-2.24,5-5V9C46,6.24,43.76,4,41,4z M37.72,33l-3.73-0.01 c0,0-0.08,0.01-0.21,0.01c-0.3,0-0.92-0.08-1.65-0.58c-1.31-0.91-2.56-3.17-3.55-3.17c-0.07,0-0.13,0.01-0.19,0.03 c-0.86,0.27-1.12,1.13-1.12,2.18c0,0.37-0.26,0.54-0.96,0.54h-1.93c-2.16,0-4.25-0.05-6.6-2.62c-3.46-3.79-6.7-10.53-6.7-10.53 s-0.18-0.39,0.01-0.62c0.18-0.21,0.6-0.23,0.76-0.23c0.04,0,0.06,0,0.06,0h4c0,0,0.37,0.07,0.64,0.27c0.23,0.17,0.35,0.48,0.35,0.48 s0.68,1.32,1.53,2.81c1.43,2.46,2.2,3.28,2.75,3.28c0.09,0,0.18-0.02,0.27-0.07c0.82-0.45,0.58-4.09,0.58-4.09s0.01-1.32-0.42-1.9 c-0.33-0.46-0.96-0.59-1.24-0.63c-0.22-0.03,0.14-0.55,0.62-0.79c0.62-0.3,1.65-0.36,2.89-0.36h0.6c1.17,0.02,1.2,0.14,1.66,0.25 c1.38,0.33,0.91,1.62,0.91,4.71c0,0.99-0.18,2.38,0.53,2.85c0.05,0.03,0.12,0.05,0.21,0.05c0.46,0,1.45-0.59,3.03-3.26 c0.88-1.52,1.56-3.03,1.56-3.03s0.15-0.27,0.38-0.41c0.22-0.13,0.22-0.13,0.51-0.13h0.03c0.32,0,3.5-0.03,4.2-0.03h0.08 c0.67,0,1.28,0.01,1.39,0.42c0.16,0.62-0.49,1.73-2.2,4.03c-2.82,3.77-3.14,3.49-0.8,5.67c2.24,2.08,2.7,3.09,2.78,3.22 C39.68,32.88,37.72,33,37.72,33z"
                                />
                            </svg>
                        </IconButton>
                    </Box>
                </Box>
            </Toolbar>
            <RegistrationModal open={open} handleClose={handleClose} />
        </AppBar>);
};

export default Header;