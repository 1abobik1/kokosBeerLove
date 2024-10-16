import React, {useEffect, useState} from 'react';

import {Link, useNavigate} from 'react-router-dom';

import {TextField, List, ListItem, Box} from '@mui/material';

import {ListItemButton, ListItemText} from '@mui/material';
import './News.css';
import Header from '../../../components/HeaderAndItsComponents/Header';
import Footer from '../../../components/Footer/Footer';
import {NewsResponse} from '../../../api/models/response/NewsResponse';
import NewsService from '../../../api/services/NewsService';
import NewsCard from '../../../components/News_and_Main_PageComponents/NewsCard';

const News = () => {
    const [newsData, setNewsData] = useState<NewsResponse[]>([]);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [suggestions, setSuggestions] = useState<NewsResponse[]>([]);
    const navigate = useNavigate();

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

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchQuery(query);

        // Фильтруем новости по заголовку на основе запроса
        const filteredSuggestions = newsData.filter((news) => news.title.toLowerCase().includes(query.toLowerCase()));
        setSuggestions(filteredSuggestions);
    };

    const handleSuggestionClick = (id: number) => {
        navigate(`/news/${id}`);
    };

    return (
        <div className="container-news">
            <Header />
            <div className="news-section">
                <h1>НОВОСТИ</h1>

                {/* Поле поиска */}
                <Box mb={3} style={{color: 'red'}}>
                    <TextField
                        label="Поиск новостей"
                        variant="outlined"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        sx={{
                            maxWidth: '300px', // Уменьшаем ширину строки поиска
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: 'red', // Красная рамка
                                },
                                '&:hover fieldset': {
                                    borderColor: 'darkred', // Более темная красная рамка при наведении
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: 'red', // Красная рамка при фокусе
                                },
                            },
                        }}
                        InputLabelProps={{
                            sx: {color: 'red'}, // Красный цвет для надписи
                        }}
                    />
                    {suggestions.length > 0 && (
                        <List>
                            {suggestions.map((news) => (
                                <ListItemButton
                                    key={news.id}
                                    onClick={() => handleSuggestionClick(news.id)}
                                    sx={{width: '200px'}}
                                >
                                    <ListItemText primary={news.title} />
                                </ListItemButton>
                            ))}
                        </List>
                    )}
                </Box>

                <div className="news-cards-container">
                    {isLoading && <div className="loading-spinner"></div>}
                    {errorMessage && <div className="error-message">{errorMessage}</div>}
                    {newsData.map((news) => (
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
            <Footer />
        </div>
    );
};

export default News;
