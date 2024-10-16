import React, {useState, useEffect} from 'react';
import AboutService from '../../api/services/AboutService';
import {AboutResponse} from '../../api/models/response/AboutResponse';
import './AboutClubAdmin.css';

const AboutClubAdmin = () => {
    const [gamesPlayed, setGamesPlayed] = useState<number>(0);
    const [wins, setWins] = useState<number>(0);
    const [goals, setGoals] = useState<number>(0);
    const [tournaments, setTournaments] = useState<number>(0);
    const [aboutText, setAboutText] = useState<string | null>('');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState<boolean>(false); // Состояние для редактирования

    useEffect(() => {
        fetchClubInfo();
    }, []);

    const fetchClubInfo = async () => {
        try {
            const response = await AboutService.getInfoClub();
            const data: AboutResponse = response.data;
            setGamesPlayed(data.games_played);
            setWins(data.wins);
            setGoals(data.goals_scored);
            setTournaments(data.tournaments);
            setAboutText(data.about_text || ''); // Устанавливаем текст о команде
        } catch (error) {
            setErrorMessage('Ошибка загрузки информации о клубе.');
        }
    };

    const handleUpdateInfo = async () => {
        if (gamesPlayed < 0 || wins < 0 || tournaments < 0) {
            setErrorMessage('Все числовые поля должны быть не менее 0.');
            return;
        }

        try {
            await AboutService.updatePartAbout(gamesPlayed, wins, goals, tournaments, aboutText || '');
            setSuccessMessage('Информация о клубе успешно обновлена.');
            setErrorMessage(null); // Сброс ошибки
            setIsEditing(false); // Завершение редактирования
        } catch (error) {
            setErrorMessage('Ошибка при обновлении информации о клубе.');
        }
    };

    return (
        <div className="about-club-admin-container">
            <h2 className="about-club-admin-title">Информация о клубе</h2>

            {errorMessage && <div className="error-message">{errorMessage}</div>}
            {successMessage && <div className="success-message">{successMessage}</div>}

            {isEditing ? (
                <>
                    <label>
                        Количество игр сыграно:
                        <input
                            type="number"
                            min="0"
                            className="about-club-admin-input"
                            value={gamesPlayed}
                            onChange={(e) => setGamesPlayed(Number(e.target.value))}
                        />
                    </label>
                    <label>
                        Победы:
                        <input
                            type="number"
                            min="0"
                            className="about-club-admin-input"
                            value={wins}
                            onChange={(e) => setWins(Number(e.target.value))}
                        />
                    </label>
                    <label>
                        Забито голов:
                        <input
                            type="number"
                            min="0"
                            className="about-club-admin-input"
                            value={goals}
                            onChange={(e) => setGoals(Number(e.target.value))}
                        />
                    </label>
                    <label>
                        Турниры:
                        <input
                            type="number"
                            min="0"
                            className="about-club-admin-input"
                            value={tournaments}
                            onChange={(e) => setTournaments(Number(e.target.value))}
                        />
                    </label>
                    <label>
                        Информация о команде:
                        <textarea
                            className="about-club-admin-textarea"
                            value={aboutText || ''}
                            onChange={(e) => setAboutText(e.target.value)}
                        />
                    </label>

                    <button className="about-club-admin-button" onClick={handleUpdateInfo}>
                        Сохранить изменения
                    </button>
                </>
            ) : (
                <div className="club-info">
                    <p>
                        <strong>Количество игр сыграно:</strong> {gamesPlayed}
                    </p>
                    <p>
                        <strong>Победы:</strong> {wins}
                    </p>
                    <p>
                        <strong>Забито голов:</strong> {goals}
                    </p>
                    <p>
                        <strong>Турниры:</strong> {tournaments}
                    </p>
                    <p>
                        <strong>Информация о клубе:</strong> {aboutText}
                    </p>
                </div>
            )}

            <button className="about-club-admin-button" onClick={() => setIsEditing(!isEditing)}>
                {isEditing ? 'Отменить редактирование' : 'Редактировать'}
            </button>
        </div>
    );
};

export default AboutClubAdmin;
