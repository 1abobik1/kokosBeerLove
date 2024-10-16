import React, {useEffect, useState} from 'react';
import './ClubPreview.css';
import clubPic from '../../images/Group 135.png';
import {Link} from 'react-router-dom';
import AboutService from '../../api/services/AboutService';
import {AboutResponse} from '../../api/models/response/AboutResponse';

const ClubPreview = () => {
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
        <div className="club-container">
            <div className="image-container">
                <div className="text-overlay">
                    <h2>О КЛУБЕ</h2>
                    {isLoading && <div className="loading-spinner"></div>}
                    {errorMessage && <div className="error-message">{errorMessage}</div>}
                    <p>{about?.about_text}</p>
                    <Link to="/about">Узнать больше...</Link>
                </div>
                <img src={clubPic} alt="team" className="club-image" />
            </div>
        </div>
    );
};
export default ClubPreview;
