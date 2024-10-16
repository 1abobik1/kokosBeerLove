import React, {useState, useEffect} from 'react';
import {Edit as EditIcon, Delete as DeleteIcon} from '@mui/icons-material';
import TeamService from '../../api/services/TeamService';
import {TeamResponse} from '../../api/models/response/TeamResponse';
import {uploadImage} from './functions/uploadImage';
import './TeamAdmin.css';

const roles = ['защитник', 'нападающий', 'вратарь', 'полузащитник'];

const TeamAdmin = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [middleName, setMiddleName] = useState('');
    const [role, setRole] = useState(roles[0]);
    const [gamesPlayed, setGamesPlayed] = useState<number>(0);
    const [goalsScored, setGoalsScored] = useState<number>(0);
    const [assistsMade, setAssistsMade] = useState<number>(0);
    const [yellowCards, setYellowCards] = useState<number>(0);
    const [redCards, setRedCards] = useState<number>(0);
    const [photo, setPhoto] = useState<File | null>(null); // Добавлено состояние для фото
    const [photoUrl, setPhotoUrl] = useState<string>(''); // Для хранения URL загруженного фото
    const [playersList, setPlayersList] = useState<TeamResponse[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editPlayerId, setEditPlayerId] = useState<number | null>(null);
    const [originalPlayer, setOriginalPlayer] = useState<TeamResponse | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    useEffect(() => {
        fetchPlayers();
    }, []);

    const fetchPlayers = async () => {
        try {
            const response = await TeamService.getAllPlayers();
            setPlayersList(response.data);
        } catch (error) {
            setErrorMessage('Ошибка загрузки игроков.');
        }
    };

    const handleAddOrUpdatePlayer = async () => {
        if (
            !firstName ||
            !lastName ||
            !middleName ||
            gamesPlayed < 0 ||
            goalsScored < 0 ||
            assistsMade < 0 ||
            yellowCards < 0 ||
            redCards < 0
        ) {
            setErrorMessage('Заполните все поля корректно!');
            return;
        }

        try {
            // Загрузка фото, если оно выбрано
            let uploadedPhotoUrl = '';
            if (photo) {
                uploadedPhotoUrl = await uploadImage(photo, setSuccessMessage, setErrorMessage, 'player_photos');
            }

            if (isEditing && editPlayerId !== null) {
                if (originalPlayer) {
                    const isPlayerChanged =
                        originalPlayer.first_name !== firstName ||
                        originalPlayer.last_name !== lastName ||
                        originalPlayer.middle_name !== middleName ||
                        originalPlayer.role !== role ||
                        originalPlayer.games_played !== gamesPlayed ||
                        originalPlayer.goals_scored !== goalsScored ||
                        originalPlayer.assists_made !== assistsMade ||
                        originalPlayer.yellow_cards !== yellowCards ||
                        originalPlayer.red_cards !== redCards ||
                        originalPlayer.photo_url !== uploadedPhotoUrl; // Сравнение photo_url

                    if (isPlayerChanged) {
                        await TeamService.updatePartPlayer(
                            editPlayerId,
                            firstName,
                            lastName,
                            middleName,
                            role,
                            gamesPlayed,
                            goalsScored,
                            assistsMade,
                            yellowCards,
                            redCards,
                            uploadedPhotoUrl,
                        );
                        setSuccessMessage('Игрок обновлен.');
                    } else {
                        setSuccessMessage('Ничего не изменилось.');
                    }
                }
            } else {
                await TeamService.createPlayer(
                    firstName,
                    lastName,
                    middleName,
                    role,
                    gamesPlayed,
                    goalsScored,
                    assistsMade,
                    yellowCards,
                    redCards,
                    uploadedPhotoUrl,
                );
                setSuccessMessage('Игрок добавлен.');
            }

            // Очистка формы
            setFirstName('');
            setLastName('');
            setMiddleName('');
            setRole(roles[0]);
            setGamesPlayed(0);
            setGoalsScored(0);
            setAssistsMade(0);
            setYellowCards(0);
            setRedCards(0);
            setPhoto(null); // Очистка фото
            setPhotoUrl(''); // Очистка URL фото
            setIsEditing(false);
            setEditPlayerId(null);
            setOriginalPlayer(null);

            await fetchPlayers();
        } catch (error) {
            setErrorMessage('Ошибка при сохранении игрока.');
        }
    };

    const handleEditPlayer = async (playerId: number) => {
        try {
            const response = await TeamService.getPlayerId(playerId);
            const player = response.data;

            setFirstName(player.first_name);
            setLastName(player.last_name);
            setMiddleName(player.middle_name);
            setRole(player.role);
            setGamesPlayed(player.games_played);
            setGoalsScored(player.goals_scored);
            setAssistsMade(player.assists_made);
            setYellowCards(player.yellow_cards);
            setRedCards(player.red_cards);
            setPhotoUrl(player.photo_url);
            setIsEditing(true);
            setEditPlayerId(player.id);
            setOriginalPlayer(player);
        } catch (error) {
            setErrorMessage('Ошибка при загрузке игрока для редактирования.');
        }
    };

    const handleDeletePlayer = async (id: number) => {
        try {
            await TeamService.deletePlayer(id);
            setSuccessMessage('Игрок удален.');
            await fetchPlayers();
        } catch (error) {
            setErrorMessage('Ошибка при удалении игрока.');
        }
    };

    return (
        <div className="team-admin-container">
            <h2 className="team-admin-title">{isEditing ? 'Редактировать игрока' : 'Добавить игрока'}</h2>
            {errorMessage && <div className="error-message">{errorMessage}</div>}
            {successMessage && <div className="success-message">{successMessage}</div>}
            <label>
                Имя:
                <input
                    type="text"
                    className="team-admin-input"
                    placeholder="Имя"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                />
            </label>
            <label>
                Фамилия:
                <input
                    type="text"
                    className="team-admin-input"
                    placeholder="Фамилия"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                />
            </label>
            <label>
                Отчество:
                <input
                    type="text"
                    className="team-admin-input"
                    placeholder="Отчество"
                    value={middleName}
                    onChange={(e) => setMiddleName(e.target.value)}
                />
            </label>
            <label>
                Роль:
                <select className="team-admin-select" value={role} onChange={(e) => setRole(e.target.value)}>
                    {roles.map((role) => (
                        <option key={role} value={role}>
                            {role}
                        </option>
                    ))}
                </select>
            </label>
            <label>
                Игр сыграно:
                <input
                    type="number"
                    min="0"
                    className="team-admin-input"
                    placeholder="Игр сыграно"
                    value={gamesPlayed}
                    onChange={(e) => setGamesPlayed(Number(e.target.value))}
                />
            </label>
            <label>
                Количество голов:
                <input
                    type="number"
                    min="0"
                    className="team-admin-input"
                    placeholder="Количество голов"
                    value={goalsScored}
                    onChange={(e) => setGoalsScored(Number(e.target.value))}
                />
            </label>
            <label>
                Количество голевых передач:
                <input
                    type="number"
                    min="0"
                    className="team-admin-input"
                    placeholder="Количество голевых передач"
                    value={assistsMade}
                    onChange={(e) => setAssistsMade(Number(e.target.value))}
                />
            </label>
            <label>
                Желтые карточки:
                <input
                    type="number"
                    min="0"
                    className="team-admin-input"
                    placeholder="Желтые карточки"
                    value={yellowCards}
                    onChange={(e) => setYellowCards(Number(e.target.value))}
                />
            </label>
            <label>
                Красные карточки:
                <input
                    type="number"
                    min="0"
                    className="team-admin-input"
                    placeholder="Красные карточки"
                    value={redCards}
                    onChange={(e) => setRedCards(Number(e.target.value))}
                />
            </label>
            {/* Поле для загрузки изображения */}
            <label>
                Загрузить изображение:
                <input
                    type="file"
                    accept="image/*"
                    className="team-admin-input"
                    onChange={(e) => {
                        if (e.target.files && e.target.files.length > 0) {
                            setPhoto(e.target.files[0]); // Установка выбранного файла
                        }
                    }}
                />
            </label>
            {photoUrl && <img src={photoUrl} alt="Uploaded" className="uploaded-admin-image" />}{' '}
            {/* Предварительный просмотр изображения */}
            <button className="team-admin-button" onClick={handleAddOrUpdatePlayer}>
                {isEditing ? 'Сохранить изменения' : 'Добавить игрока'}
            </button>
            <div className="players-admin-list">
                <h3 className="players-admin-list-title">Список игроков</h3>
                <ul className="players-admin-list-items">
                    {playersList.map((player) => (
                        <li key={player.id} className="players-admin-list-item">
                            <div className="players-admin-list-item-content">
                                <h4>{`${player.first_name} ${player.last_name} ${player.middle_name}`}</h4>
                                <p>{`Роль: ${player.role}`}</p>
                                <p>{`Игр: ${player.games_played}, Голов: ${player.goals_scored}`}</p>
                                <p>{`Ассисты: ${player.assists_made}, Желтые: ${player.yellow_cards}, Красные: ${player.red_cards}`}</p>
                                {player.photo_url && (
                                    <img src={player.photo_url} alt="Player" className="player-admin-image" />
                                )}{' '}
                                {/* Предварительный просмотр изображения игрока */}
                            </div>
                            <div className="players-admin-list-item-actions">
                                <button className="edit-button" onClick={() => handleEditPlayer(player.id)}>
                                    <EditIcon />
                                </button>
                                <button className="delete-button" onClick={() => handleDeletePlayer(player.id)}>
                                    <DeleteIcon />
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default TeamAdmin;
