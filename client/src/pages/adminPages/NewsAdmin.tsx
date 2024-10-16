import React, {useState, useEffect} from 'react';
import {Edit as EditIcon, Delete as DeleteIcon} from '@mui/icons-material';
import NewsService from '../../api/services/NewsService';
import {NewsResponse} from '../../api/models/response/NewsResponse';
import {uploadImage} from './functions/uploadImage';
import './NewsAdmin.css';

const NewsAdmin = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [image, setImage] = useState<string>('');
    const [newsList, setNewsList] = useState<NewsResponse[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editNewsId, setEditNewsId] = useState<number | null>(null);
    const [originalNews, setOriginalNews] = useState<NewsResponse | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    useEffect(() => {
        fetchNews();
    }, []);

    const fetchNews = async () => {
        try {
            const response = await NewsService.getAllNews();
            setNewsList(response.data);
        } catch (error) {
            setErrorMessage('Ошибка загрузки новостей.');
        }
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && (file.type === 'image/png' || file.type === 'image/jpeg')) {
            const imageUrl = await uploadImage(file, setSuccessMessage, setErrorMessage, 'news_images');
            if (imageUrl) {
                setImage(imageUrl);
            }
        } else {
            setErrorMessage('Пожалуйста, загрузите изображение в формате PNG или JPEG.');
        }
    };

    const handleAddOrUpdateNews = async () => {
        if (!title || !content) {
            setErrorMessage('Заполните все поля!');
            return;
        }

        try {
            if (isEditing && editNewsId !== null) {
                if (originalNews) {
                    const isTitleChanged = originalNews.title !== title;
                    const isContentChanged = originalNews.text !== content;
                    const isImageChanged = image !== '';

                    if (isTitleChanged && isContentChanged && isImageChanged) {
                        await NewsService.updateFullNews(editNewsId, title, content, image || originalNews.image_url);
                        setSuccessMessage('Новость полностью обновлена.');
                    } else {
                        await NewsService.updatePartNews(editNewsId, title, content, image || originalNews.image_url);
                        setSuccessMessage('Новость частично обновлена.');
                    }
                }
            } else {
                await NewsService.createNews(title, content, image);
                setSuccessMessage('Новость добавлена.');
            }

            // Очистка формы
            setTitle('');
            setContent('');
            setImage('');
            setIsEditing(false);
            setEditNewsId(null);
            setOriginalNews(null);

            await fetchNews();
        } catch (error) {
            setErrorMessage('Ошибка при сохранении новости.');
        }
    };

    const handleEditNews = async (newsId: number) => {
        try {
            const response = await NewsService.getNewsId(newsId);
            const news = response.data;

            setTitle(news.title);
            setContent(news.text);
            setIsEditing(true);
            setEditNewsId(news.id);
            setOriginalNews(news);
        } catch (error) {
            setErrorMessage('Ошибка при загрузке новости для редактирования.');
        }
    };

    const handleDeleteNews = async (id: number) => {
        try {
            await NewsService.deleteNews(id);
            setSuccessMessage('Новость удалена.');
            await fetchNews();
        } catch (error) {
            setErrorMessage('Ошибка при удалении новости.');
        }
    };

    return (
        <div className="news-admin-container">
            <h2 className="news-admin-title">{isEditing ? 'Редактировать новость' : 'Добавить новость'}</h2>

            {errorMessage && <div className="error-message">{errorMessage}</div>}
            {successMessage && <div className="success-message">{successMessage}</div>}

            <input
                type="text"
                className="news-admin-input"
                placeholder="Заголовок"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
                className="news-admin-textarea"
                placeholder="Содержание"
                value={content}
                onChange={(e) => setContent(e.target.value)}
            />
            <label className="news-admin-file-label">
                Загрузить изображение
                <input
                    type="file"
                    accept="image/png, image/jpeg"
                    className="news-admin-file-input"
                    onChange={handleFileChange}
                />
            </label>
            {image && <img src={image} alt="Новость" className="match-image" />}

            <button className="news-admin-button" onClick={handleAddOrUpdateNews}>
                {isEditing ? 'Сохранить изменения' : 'Добавить новость'}
            </button>

            <div className="news-admin-list">
                <h3 className="news-admin-list-title">Список новостей</h3>
                <ul className="news-admin-list-items">
                    {Array.isArray(newsList) && newsList.length > 0 ? (
                        newsList.map((news) => (
                            <li key={news.id} className="news-admin-list-item">
                                <div className="news-admin-list-item-content">
                                    <h4>{news.title}</h4>
                                    <p>{news.text}</p>
                                    <img src={news.image_url} alt={news.title} className="news-admin-image" />
                                </div>
                                <div className="news-admin-list-item-actions">
                                    <button onClick={() => handleEditNews(news.id)} className="edit-button">
                                        <EditIcon />
                                    </button>
                                    <button onClick={() => handleDeleteNews(news.id)} className="delete-button">
                                        <DeleteIcon />
                                    </button>
                                </div>
                            </li>
                        ))
                    ) : (
                        <p>Новостей нет</p>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default NewsAdmin;
