import React, {useEffect, useState} from 'react';
import './NewsPreview.css';
import {Link} from 'react-router-dom';
import {NewsResponse} from '../../api/models/response/NewsResponse';
import NewsService from '../../api/services/NewsService';
import NewsCard from '../News_and_Main_PageComponents/NewsCard';

const NewsPreview = () => {
    const [newsData, setNewsData] = useState<NewsResponse[]>([]);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        fetchNews();
    }, []);

    const fetchNews = async () => {
        setIsLoading(true);
        try {
            const response = await NewsService.getAllNews();
            setNewsData(response.data);
        } catch (error) {
            setErrorMessage('Ошибка загрузки новостей.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="news-section">
            <h1>НОВОСТИ</h1>
            <button className="more-button">
                <Link to="/news" style={{textDecoration: 'none', color: 'white'}}>
                    Узнать больше
                </Link>
            </button>
            <div className="news-cards-container">
                {isLoading && <div className="loading-spinner"></div>}
                {errorMessage && <div className="error-message">{errorMessage}</div>}
                {newsData.slice(0, 6).map((news) => (
                    <NewsCard
                        key={news.id}
                        id={news.id}
                        title={news.title}
                        text={news.text}
                        image_url={news.image_url}
                        created_at={news.created_at}
                    />
                ))}
            </div>
        </div>
    );
};

export default NewsPreview;
