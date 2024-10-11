import React, {useEffect, useState} from 'react';
import './Team.css';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import BigBosses from '../../components/BigBosses';
import {TeamResponse} from "../../api/models/response/TeamResponse";
import TeamService from "../../api/services/TeamService";


const Team = () => {
    const [players, setPlayers] = useState<TeamResponse[]>([]);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        fetchTeam();
    }, []);

    const fetchTeam = async () => {
        setIsLoading(true);
        try {
            const response = await TeamService.getAllPlayers();
            setPlayers(response.data);

        } catch (error) {
            setErrorMessage('Ошибка загрузки команды.');
        } finally {
            setIsLoading(false);
        }
    };


    // Группировка игроков по ролям
    const groupedPlayers = players.reduce((acc: Record<string, TeamResponse[]>, player) => {
        if (!acc[player.role]) {
            acc[player.role] = [];
        }
        acc[player.role].push(player);
        return acc;
    }, {});

    return (
        <div className="team-container">
            <Header/>
            <BigBosses/>
            <table className="team-table">
                <thead>
                <tr>
                    <th>№</th>
                    <th>ФИО</th>
                    <th>ИГРЫ</th>
                    <th>ГОЛЫ</th>
                    <th>ПАСЫ</th>
                    <th>
                        <div style={{
                            backgroundColor: "yellow",
                            height: "20px",
                            width: "15px",
                            borderRadius: "5px"
                        }}></div>
                    </th>
                    <th>
                        <div style={{backgroundColor: "red", height: "20px", width: "15px", borderRadius: "5px"}}></div>
                    </th>
                </tr>
                </thead>
                <tbody>
                {isLoading && <div className="loading-spinner"></div>}
                {errorMessage && <div className="error-message">{errorMessage}</div>}
                {Object.keys(groupedPlayers).map((role) => (
                    <React.Fragment key={role}>
                        <tr className="category-row">
                            <td colSpan={8}>{role.toUpperCase()}</td>
                        </tr>
                        {groupedPlayers[role].map((player) => (
                            <tr key={player.id}>
                                <td>{player.id}</td>
                                <td>
                                    <div className="player-info">
                                        <img src={player.photo_url} alt={`${player.middle_name} ${player.first_name} ${player.last_name}`}
                                             className="player-image"/>
                                        <div className="player-name-role">
                                            <strong>{`${player.middle_name} ${player.first_name} ${player.last_name}`}</strong>
                                            <span>{player.role}</span>
                                        </div>
                                    </div>
                                </td>
                                <td>{player.games_played}</td>
                                <td>{player.goals_scored}</td>
                                <td>{player.assists_made}</td>
                                <td>{player.yellow_cards}</td>
                                <td>{player.red_cards}</td>
                            </tr>
                        ))}
                    </React.Fragment>
                ))}
                </tbody>
            </table>
            <Footer/>
        </div>
    );
};

export default Team;
