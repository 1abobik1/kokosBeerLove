import React, {useEffect, useState} from 'react';
import './AboutClub.css';
import clubPic from '../../../images/Group 135.png';
import Header from '../../../components/HeaderAndItsComponents/Header';
import Footer from '../../../components/Footer/Footer';
import {AboutResponse} from '../../../api/models/response/AboutResponse';
import AboutService from '../../../api/services/AboutService';

const AboutClub = () => {
    const [about, setAbout] = useState<AboutResponse>();
    const [errorMessage, setErrorMessage] = useState<string | null>(null); // Для обработки ошибок
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        fetchAbout();
    }, []);

    const fetchAbout = async () => {
        setIsLoading(true);
        try {
            const response = await AboutService.getInfoClub();
            setAbout(response.data);
        } catch (error) {
            setErrorMessage('Ошибка загрузки информации о клубе.');
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <div className="about-club-container">
            <Header />
            <div className="aboutclub-content">
                <div className="aboutclub-h1">
                    <h1>О КЛУБЕ</h1>
                </div>
                <div className="aboutclub-top-container">
                    <img src={clubPic} alt="team" className="aboutclub-club-image" />
                </div>
                <div className="aboutclub-content-low">
                    {isLoading && <div className="loading-spinner"></div>}
                    {errorMessage && <div className="error-message">{errorMessage}</div>}
                    <p>{about?.about_text}</p>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default AboutClub;
