import React, {useState, useEffect} from 'react';
import {Edit as EditIcon, Delete as DeleteIcon} from '@mui/icons-material';
import MatchesService from '../../api/services/MatchService';
import {MatchResponse} from '../../api/models/response/MatchResponse';
import './MatchesAdmin.css';
import {uploadImage} from './functions/uploadImage';

const MatchesAdmin = () => {
    const [team1, setTeam1] = useState('КОКОС ГРУПП');
    const [team2, setTeam2] = useState('');
    const [opponentEmblem, setOpponentEmblem] = useState('');
    const [score1, setScore1] = useState<number>(0);
    const [score2, setScore2] = useState<number>(0);
    const [venue, setVenue] = useState('');
    const [league, setLeague] = useState('');
    const [vkVideoLink, setVkVideoLink] = useState('');
    const [matchDate, setMatchDate] = useState('');
    const [matchTime, setMatchTime] = useState('');
    const [matchesList, setMatchesList] = useState<MatchResponse[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editMatchId, setEditMatchId] = useState<number | null>(null);
    const [originalMatch, setOriginalMatch] = useState<MatchResponse | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    useEffect(() => {
        fetchMatches();
    }, []);

    const fetchMatches = async () => {
        try {
            const response = await MatchesService.getAllMatches();
            setMatchesList(response.data);
        } catch (error) {
            setErrorMessage('Ошибка загрузки матчей.');
        }
    };

    const handleAddOrUpdateMatch = async () => {
        if (!team1 || !team2 || !matchDate || !matchTime || !venue || !league) {
            setErrorMessage('Заполните все обязательные поля!');
            return;
        }

        // Оптимистично добавляем новый матч в список

        try {
            const formattedDate = matchDate;

            if (isEditing && editMatchId !== null) {
                await MatchesService.updatePartMatch(
                    editMatchId,
                    team1,
                    team2,
                    opponentEmblem,
                    score1,
                    score2,
                    venue,
                    league,
                    vkVideoLink,
                    formattedDate,
                    matchTime,
                );
                setSuccessMessage('Матч обновлен.');
            } else {
                await MatchesService.createMatch(
                    team1,
                    team2,
                    opponentEmblem,
                    score1,
                    score2,
                    venue,
                    league,
                    vkVideoLink,
                    formattedDate,
                    matchTime,
                );
                setSuccessMessage('Матч добавлен. Запись появится в течении 20 минут');
            }

            resetForm();
            await fetchMatches();
        } catch (error) {
            setErrorMessage('Ошибка при сохранении матча.');
        }
    };
    useEffect(() => {
        if (isEditing && originalMatch) {
            // Обновляем поля формы на основе загруженных данных
            setTeam1(originalMatch.team_home);
            setTeam2(originalMatch.team_away_name);
            setOpponentEmblem(originalMatch.team_away_logo_url);
            setScore1(originalMatch.score_home);
            setScore2(originalMatch.score_away);
            setVenue(originalMatch.location);
            setLeague(originalMatch.division);
            setVkVideoLink(originalMatch.video_url);
            setMatchDate(originalMatch.match_date);
            setMatchTime(originalMatch.match_time);
        }
    }, [isEditing, originalMatch]);

    const resetForm = () => {
        setTeam1('КОКОС ГРУПП');
        setTeam2('');
        setOpponentEmblem('');
        setScore1(0);
        setScore2(0);
        setVenue('');
        setLeague('');
        setVkVideoLink('');
        setMatchDate('');
        setMatchTime('');
        setIsEditing(false);
        setEditMatchId(null);
        setOriginalMatch(null);
    };

    const handleUploadImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && (file.type === 'image/png' || file.type === 'image/jpeg')) {
            const imageUrl = await uploadImage(file, setSuccessMessage, setErrorMessage, 'team_logos');
            if (imageUrl) {
                setOpponentEmblem(imageUrl);
            }
        } else {
            setErrorMessage('Пожалуйста, загрузите изображение в формате PNG или JPEG.');
        }
    };

    // Этот метод загружает матч и заполняет все поля
    const handleEditMatch = async (matchId: number) => {
        try {
            const response = await MatchesService.getMatchId(matchId);
            const match = response.data;

            // Установка полей редактирования
            setTeam1(match.team1);
            setTeam2(match.team2);
            setOpponentEmblem(match.opponentEmblem);
            setScore1(match.score1);
            setScore2(match.score2);
            setVenue(match.venue);
            setLeague(match.league);
            setVkVideoLink(match.vkVideoLink);
            setMatchDate(match.matchDate);
            setMatchTime(match.matchTime);

            // Переходим в режим редактирования
            setIsEditing(true);
            setEditMatchId(match.id);
            setOriginalMatch(match);
        } catch (error) {
            setErrorMessage('Ошибка при загрузке матча для редактирования.');
        }
    };

    const handleDeleteMatch = async (matchId: number) => {
        if (typeof matchId === 'undefined' || matchId === null) {
            setErrorMessage('Ошибка: ID матча не найден.');
            return;
        }

        try {
            await MatchesService.deleteMatch(matchId);
            setSuccessMessage('Матч удален.');
            await fetchMatches();
        } catch (error) {
            setErrorMessage('Ошибка при удалении матча.');
        }
    };

    return (
        <div className="matches-admin-container">
            <h2 className="matches-admin-title">{isEditing ? 'Редактировать матч' : 'Добавить матч'}</h2>

            {errorMessage && <div className="error-message">{errorMessage}</div>}
            {successMessage && <div className="success-message">{successMessage}</div>}

            <input
                type="text"
                className="matches-admin-input"
                placeholder="Наша команда"
                value={team1}
                onChange={(e) => setTeam1(e.target.value)}
            />
            <input
                type="text"
                className="matches-admin-input"
                placeholder="Команда 2"
                value={team2}
                onChange={(e) => setTeam2(e.target.value)}
            />

            <label>Эмблема команды противника</label>
            <input
                type="file"
                accept="image/png, image/jpeg"
                onChange={handleUploadImage}
                className="matches-admin-input"
            />
            {opponentEmblem && <img src={opponentEmblem} alt="Эмблема команды противника" className="match-image" />}

            <input
                type="number"
                className="matches-admin-input"
                placeholder="Счет нашей команды"
                value={score1}
                min="0"
                onChange={(e) => setScore1(Math.max(0, Number(e.target.value)))}
                onBlur={(e) => Number(e.target.value) < 0 && setScore1(0)}
            />

            <input
                type="number"
                className="matches-admin-input"
                placeholder="Счет команды 2"
                value={score2}
                min="0"
                onChange={(e) => setScore2(Math.max(0, Number(e.target.value)))}
                onBlur={(e) => Number(e.target.value) < 0 && setScore2(0)}
            />

            <input
                type="text"
                className="matches-admin-input"
                placeholder="Место проведения матча"
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
            />
            <input
                type="text"
                className="matches-admin-input"
                placeholder="Лига"
                value={league}
                onChange={(e) => setLeague(e.target.value)}
            />
            <input
                type="text"
                className="matches-admin-input"
                placeholder="Ссылка на ВК видео"
                value={vkVideoLink}
                onChange={(e) => setVkVideoLink(e.target.value)}
            />

            <input
                type="date"
                className="matches-admin-input"
                placeholder="Дата матча (гггг-мм-чч)"
                value={matchDate}
                onChange={(e) => setMatchDate(e.target.value)}
            />

            <input
                type="text"
                className="matches-admin-input"
                placeholder="Время начала матча (чч:мм)"
                value={matchTime}
                onChange={(e) => setMatchTime(e.target.value)}
            />

            <button className="matches-admin-button" onClick={handleAddOrUpdateMatch}>
                {isEditing ? 'Сохранить изменения' : 'Добавить матч'}
            </button>

            <div className="matches-admin-list">
                <h3 className="matches-admin-list-title">Список матчей</h3>
                <ul className="matches-admin-list-items">
                    {Array.isArray(matchesList) && matchesList.length > 0 ? (
                        matchesList.map((match) => (
                            <li key={match.id} className="matches-admin-list-item">
                                <div className="matches-admin-list-item-content">
                                    <h4>
                                        {match.team_home} vs {match.team_away_name}
                                    </h4>
                                    <p>
                                        Счет: {match.score_home} - {match.score_away}
                                    </p>
                                    <p>Лига: {match.division}</p>
                                    <p>Место: {match.location}</p>
                                    <p>
                                        Дата: {match.match_date}, Время: {match.match_time}
                                    </p>
                                    {match.team_away_logo_url && (
                                        <img
                                            src={match.team_away_logo_url}
                                            alt="Эмблема команды"
                                            className="match-admin-image"
                                        />
                                    )}
                                </div>
                                <div className="matches-admin-list-item-actions">
                                    <button onClick={() => handleEditMatch(match.id)} className="edit-button">
                                        <EditIcon />
                                    </button>
                                    <button onClick={() => handleDeleteMatch(match.id)} className="delete-button">
                                        <DeleteIcon />
                                    </button>
                                </div>
                            </li>
                        ))
                    ) : (
                        <p>Матчей нет</p>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default MatchesAdmin;
