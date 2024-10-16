import React, {useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import './AdminNav.css';
import {store} from '../../../index';

const AdminNav = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogOut = () => {
        store.logout();
        navigate('/', {replace: true});
        setIsMenuOpen(false); // Закрываем меню при выходе
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false); // Закрываем меню при клике на ссылку
    };

    return (
        <div className="admin-nav-container">
            <div className="admin-burger-menu" onClick={toggleMenu}>
                &#9776; {/* Иконка бургер-меню */}
            </div>

            <div className={`admin-nav ${isMenuOpen ? 'open' : ''}`}>
                <Link to="/" onClick={closeMenu}>
                    На главную
                </Link>
                <Link to="news" onClick={closeMenu}>
                    Новости
                </Link>
                <Link to="matches" onClick={closeMenu}>
                    Матчи
                </Link>
                <Link to="team" onClick={closeMenu}>
                    Команда
                </Link>
                <Link to="about" onClick={closeMenu}>
                    О клубе
                </Link>
                <Link to="shop" onClick={closeMenu}>
                    Магазин
                </Link>
                <button onClick={handleLogOut}>Выйти</button>
            </div>
        </div>
    );
};

export default AdminNav;
