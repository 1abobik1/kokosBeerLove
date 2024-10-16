import React, {FC, useEffect, useState} from 'react';
import './MatchesPreview.css';
import MatchService from '../../api/services/MatchService';
import {MatchResponse} from '../../api/models/response/MatchResponse';
import {AboutResponse} from '../../api/models/response/AboutResponse';
import logoTeam1 from '../../images/logoteam1.png';
import AboutService from '../../api/services/AboutService';

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

const MatchCard: FC<{match: MatchResponse; label: string}> = ({match, label}) => (
    <div className="card">
        <h5 className="labelMatchPreview">{label}</h5>
        <div className="card-content">
            <h5 className="divisionPreview">{match.division}</h5>
            <h6>
                {match.team_home} - {match.team_away_name}
            </h6>
            <p>
                {formatDate(match.match_date)} - {getWeekDay(new Date(match.match_date))} -{' '}
                {match.match_time.slice(0, 5)}
            </p>{' '}
            {/* Убираем секунды */}
            <div style={{display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'center'}}>
                <img src={logoTeam1} className="logosTeamPreview" alt="Team 1" style={{marginRight: '10px'}} />
                <h4>
                    {match.score_home} - {match.score_away}
                </h4>
                <img
                    src={match.team_away_logo_url}
                    className="logosTeamPreview"
                    alt="Team 2"
                    style={{marginLeft: '10px'}}
                />
            </div>
            <p>{match.location}</p>
        </div>
    </div>
);

const StatsCard: FC<{stats: AboutResponse}> = ({stats}) => (
    <div className="stats-card">
        <h5 className="statsMatchPreview">Статистика</h5>
        <div className="stats-card-content">
            <div className="stats-card-info">
                <p>Игры:</p> <span>{stats.games_played}</span>
            </div>
            <div className="stats-card-info">
                <p>Победы:</p> <span>{stats.wins}</span>
            </div>
            <div className="stats-card-info">
                <p>Голы:</p> <span>{stats.goals_scored}</span>
            </div>
            <div className="stats-card-info">
                <p>Турниры:</p> <span>{stats.tournaments}</span>
            </div>
        </div>
    </div>
);

const MatchesPreview: FC = () => {
    const [matches, setMatches] = useState<MatchResponse[]>([]); // Используем интерфейс MatchResponse для типа матчей
    const [stats, setStats] = useState<AboutResponse | null>(null); // Статистика
    const [errorMessage, setErrorMessage] = useState<string | null>(null); // Для обработки ошибок
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        fetchMatches();
    }, []);

    const fetchMatches = async () => {
        setIsLoading(true);
        try {
            const upComingResponse = await MatchService.getUpComing();
            const lastTwoResponse = await MatchService.getLastThree();

            let combinedMatches: MatchResponse[] = [];

            if (upComingResponse.data.length !== 0) {
                // Если есть будущий матч, показываем "Следующий матч" и "Предыдущий матч"
                combinedMatches = [upComingResponse.data[0], lastTwoResponse.data[1]];
            } else if (lastTwoResponse.data.length >= 2) {
                // Если нет будущего матча, показываем два "Предыдущий матч"
                combinedMatches = [lastTwoResponse.data[1], lastTwoResponse.data[2]];
            }
            setMatches(combinedMatches);

            const statsResponse = await AboutService.getInfoClub();
            setStats(statsResponse.data);
        } catch (error) {
            setErrorMessage('Ошибка загрузки матчей.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container_matches">
            {isLoading && <div className="loading-spinner"></div>}
            {errorMessage && <div className="error-message">{errorMessage}</div>}

            {matches.length === 2 && (
                <>
                    {/* Логика отображения в зависимости от наличия предстоящего матча */}
                    {matches[0] && (
                        <MatchCard
                            match={matches[0]}
                            label={
                                matches[0].match_date > new Date().toISOString().split('T')[0]
                                    ? 'Следующий матч'
                                    : 'Предыдущий матч'
                            }
                        />
                    )}
                    {matches[1] && <MatchCard match={matches[1]} label="Предыдущий матч" />}
                </>
            )}

            {stats && <StatsCard stats={stats} />}
        </div>
    );
};

export default MatchesPreview;
