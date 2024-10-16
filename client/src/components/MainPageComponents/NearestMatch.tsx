import React, {useEffect, useState} from 'react';
import img1 from '../../images/rectangle1.png';
import logoTeam1 from '../../images/logoteam1.png';
import './NearestMatch.css';
import {Link} from 'react-router-dom';
import MatchService from '../../api/services/MatchService';
import {MatchResponse} from '../../api/models/response/MatchResponse';

function getWeekDay(date: Date) {
    let days = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
    return days[date.getDay()];
}

// Функция для форматирования даты
function formatDate(dateString: string) {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
        day: '2-digit', // Два символа для дня
        month: 'long', // Полное название месяца
        year: 'numeric', // Год в формате 4 цифры
    };

    // Форматируем дату с нужными параметрами и на русском языке
    return date.toLocaleDateString('ru-RU', options).replace(' г.', ''); // Убираем лишнее "г."
}

const NearestMatch: React.FC = () => {
    const [matchData, setMatchData] = useState<MatchResponse | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        fetchNearestMatch();
    }, []);

    const fetchNearestMatch = async () => {
        setIsLoading(true);
        try {
            const response = await MatchService.getLastOne();
            setMatchData(response.data);
        } catch (error) {
            setErrorMessage('Ошибка загрузки данных о ближайшем матче.');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return <div className="loading-spinner"></div>;
    }

    if (errorMessage) {
        return <div className="error-message">{errorMessage}</div>;
    }

    if (!matchData) {
        return null;
    }

    return (
        <div
            className="nearestMatchWrapper"
            style={{
                backgroundImage: `url(${img1})`,
            }}
        >
            <div
                className="matchBlock"
                style={{
                    display: 'flex',
                    height: '80%',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '5px',
                }}
            >
                <div
                    className="titleWrapper"
                    style={{width: '100%', display: 'flex', justifyContent: 'flex-start', marginLeft: '15px'}}
                >
                    <div className="titleMatch">
                        <h1>{matchData.division.toUpperCase()}</h1>
                    </div>
                </div>
                <div className="dateInfo">
                    {/* Форматируем дату и убираем секунды из времени */}
                    <div>
                        {formatDate(matchData.match_date)} — {getWeekDay(new Date(matchData.match_date))} —{' '}
                        {matchData.match_time.slice(0, 5)}
                    </div>
                </div>
                {/* Логотипы команд */}
                <div className="logosTeams" style={{display: 'flex', alignItems: 'center', marginBottom: '20px'}}>
                    <div className="logoAndName">
                        <img src={logoTeam1} alt="Team 1" style={{}} />
                        <span>{matchData.team_home}</span>
                    </div>
                    <h1 className="count">
                        {matchData.score_home} - {matchData.score_away}
                    </h1>{' '}
                    {/* Счет */}
                    <div className="logoAndName">
                        <img src={matchData.team_away_logo_url} alt="Team 2" style={{}} />
                        <span>{matchData.team_away_name}</span>
                    </div>
                </div>
                <Link to={`/match/${matchData.id}`}>
                    <button className="styled-button">О матче</button>
                </Link>
            </div>
        </div>
    );
};

export default NearestMatch;
