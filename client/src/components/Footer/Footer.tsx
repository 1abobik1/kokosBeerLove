import React from 'react';
import {YouTube, Telegram, WhatsApp, MailOutline} from '@mui/icons-material';
import {Box, IconButton} from '@mui/material';
import './Footer.css';
import logokokos from '../../images/logo.jpg';
import phone from '../../images/icons/telephone.png';
import logohorizontal from '../../images/kokocgroup_logo_horizontal_red_background (1).jpg';
import {Link} from 'react-router-dom';
const Footer: React.FC = () => {
    return (
        <footer className="footer" id="footer">
            <div className="footer-content">
                <div className="contacts_koks">
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            '@media (max-width: 600px)': {
                                // Для мобильных устройств
                                justifyContent: 'flex-start',
                            },
                        }}
                        onClick={() => {
                            const headerElement = document.getElementById('header');
                            if (headerElement) {
                                headerElement.scrollIntoView({behavior: 'smooth'});
                            }
                        }}
                    >
                        <IconButton component={Link} to="/" sx={{padding: 0}}>
                            <Box
                                component="img"
                                src={logohorizontal}
                                alt="Logo"
                                sx={{
                                    height: '60px',
                                    '@media (max-width: 600px)': {
                                        // Для мобильных устройств
                                        height: '40px', // Уменьшаем размер логотипа на маленьких экранах
                                    },
                                    '@media (max-width: 400px)': {
                                        // Для мобильных устройств
                                        height: '30px', // Уменьшаем размер логотипа на маленьких экранах
                                    },
                                }}
                            />
                        </IconButton>
                    </Box>
                </div>

                <div className="icon_section">
                    <h3>
                        <img src={phone} alt="error" />
                        <a href="tel:+70000000000">+7 (000) 000 - 00 - 00</a>
                    </h3>
                    <Box sx={{display: 'flex', alignItems: 'center'}}>
                        <IconButton color="inherit">
                            <MailOutline />
                        </IconButton>

                        <IconButton color="inherit">
                            <YouTube />
                        </IconButton>
                        <IconButton color="inherit">
                            <Telegram />
                        </IconButton>
                        <IconButton color="inherit">
                            <WhatsApp />
                        </IconButton>
                        <IconButton color="inherit">
                            {/* ВК иконка, добавлена вручную через SVG */}
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" width="24px" height="24px">
                                <path
                                    fill="white"
                                    d="M41,4H9C6.24,4,4,6.24,4,9v32c0,2.76,2.24,5,5,5h32c2.76,0,5-2.24,5-5V9C46,6.24,43.76,4,41,4z M37.72,33l-3.73-0.01 c0,0-0.08,0.01-0.21,0.01c-0.3,0-0.92-0.08-1.65-0.58c-1.31-0.91-2.56-3.17-3.55-3.17c-0.07,0-0.13,0.01-0.19,0.03 c-0.86,0.27-1.12,1.13-1.12,2.18c0,0.37-0.26,0.54-0.96,0.54h-1.93c-2.16,0-4.25-0.05-6.6-2.62c-3.46-3.79-6.7-10.53-6.7-10.53 s-0.18-0.39,0.01-0.62c0.18-0.21,0.6-0.23,0.76-0.23c0.04,0,0.06,0,0.06,0h4c0,0,0.37,0.07,0.64,0.27c0.23,0.17,0.35,0.48,0.35,0.48 s0.68,1.32,1.53,2.81c1.43,2.46,2.2,3.28,2.75,3.28c0.09,0,0.18-0.02,0.27-0.07c0.82-0.45,0.58-4.09,0.58-4.09s0.01-1.32-0.42-1.9 c-0.33-0.46-0.96-0.59-1.24-0.63c-0.22-0.03,0.14-0.55,0.62-0.79c0.62-0.3,1.65-0.36,2.89-0.36h0.6c1.17,0.02,1.2,0.14,1.66,0.25 c1.38,0.33,0.91,1.62,0.91,4.71c0,0.99-0.18,2.38,0.53,2.85c0.05,0.03,0.12,0.05,0.21,0.05c0.46,0,1.45-0.59,3.03-3.26 c0.88-1.52,1.56-3.03,1.56-3.03s0.15-0.27,0.38-0.41c0.22-0.13,0.22-0.13,0.51-0.13h0.03c0.32,0,3.5-0.03,4.2-0.03h0.08 c0.67,0,1.28,0.01,1.39,0.42c0.16,0.62-0.49,1.73-2.2,4.03c-2.82,3.77-3.14,3.49-0.8,5.67c2.24,2.08,2.7,3.09,2.78,3.22 C39.68,32.88,37.72,33,37.72,33z"
                                />
                            </svg>
                        </IconButton>
                    </Box>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
