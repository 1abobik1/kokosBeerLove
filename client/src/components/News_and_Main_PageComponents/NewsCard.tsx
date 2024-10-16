import React from 'react';
import {NewsResponse} from '../../api/models/response/NewsResponse';
import {Link} from 'react-router-dom';
import {truncateText} from '../../pages/generalPages/functions/truncateText';
import {parseAndFormatDate} from '../../pages/generalPages/functions/dateParser';
import './NewsCard.css';

const NewsCard: React.FC<NewsResponse> = ({id, title, text, image_url, created_at}) => {
    return (
        <Link to={`/news/${id}`} className="news-card">
            <div className="news-content-text">
                <h3 className="news-title">{truncateText(title, 20)}</h3>
                <p className="news-text">{truncateText(text, 50)}</p>
                <p className="news-time">{parseAndFormatDate(created_at)}</p>
            </div>
            <div className="news-content-img">
                <img src={image_url} alt={title} className="news-image" />
            </div>
        </Link>
    );
};

export default NewsCard;
