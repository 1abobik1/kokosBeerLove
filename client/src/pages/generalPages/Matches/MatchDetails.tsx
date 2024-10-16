import React, {useEffect, useState} from 'react';
import {Link, useParams} from 'react-router-dom';
import CreateVideoFrame from '../../../components/MatchesPageComponents/CreateVideoFrame';
import './MatchDetails.css';
import Header from '../../../components/HeaderAndItsComponents/Header';
import Footer from '../../../components/Footer/Footer';
import {IVideo} from '../../../api/models/IVideo';
import MatchService from '../../../api/services/MatchService';
import imglogo from '../../../images/logoteam1.png';

const MatchDetails: React.FC = () => {
    const {id} = useParams<{id: string}>();
    const matchId = parseInt(id || '', 10);
    const [isLoading, setIsLoading] = useState(true);
    const [matchdata, setMatchdata] = useState<IVideo | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        fetchMatches();
    }, []);

    const fetchMatches = async () => {
        setIsLoading(true);
        try {
            const response = await MatchService.getMatchId(matchId);
            setMatchdata(response.data);
        } catch (error) {
            setErrorMessage('Ошибка загрузки товаров.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const iframes = document.querySelectorAll('iframe');
        let loadedIframes = 0;

        const handleIframeLoad = () => {
            loadedIframes++;
            if (loadedIframes === iframes.length) {
                setIsLoading(false);
            }
        };

        iframes.forEach((iframe) => {
            iframe.addEventListener('load', handleIframeLoad);
        });

        return () => {
            iframes.forEach((iframe) => {
                iframe.removeEventListener('load', handleIframeLoad);
            });
        };
    }, []);

    if (!matchdata) {
        return <div>Матч не найден</div>;
    }

    // Function to format the date as "дд - месяц словами - гггг"
    function formatDate(dateString: string): string {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0'); // Get day of the month
        const monthNames = [
            'Января',
            'Февраля',
            'Марта',
            'Апреля',
            'Мая',
            'Июня',
            'Июля',
            'Августа',
            'Сентября',
            'Октября',
            'Ноября',
            'Декабря',
        ];
        const month = monthNames[date.getMonth()]; // Get month name
        const year = date.getFullYear(); // Get full year

        return `${day} - ${month} - ${year}`;
    }

    // Function to format the time as "чч:мм" (removing seconds)
    function formatTime(timeString: string): string {
        const [hours, minutes] = timeString.split(':'); // Split the time string into hours and minutes
        return `${hours}:${minutes}`; // Return the time in "чч:мм" format
    }

    return (
        <div style={{height: '100vh'}}>
            <Header />

            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '90vh'}}>
                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
                    <h1 style={{display: isLoading ? 'none' : 'block'}}>Детали матча</h1>
                    {isLoading && (
                        <div className="loading-spinner-container">
                            <div className="loading-spinner"></div>
                        </div>
                    )}
                    <div style={{width: '60vw', display: isLoading ? 'none' : 'block'}}>
                        <CreateVideoFrame
                            video_url={matchdata.video_url}
                            hd={matchdata.hd}
                            width={matchdata.width}
                            height={matchdata.height}
                        />
                    </div>

                    <div style={{display: isLoading ? 'none' : 'block'}} className="match-table-container">
                        <table className="match-table">
                            <tbody>
                                <tr>
                                    <th>Дата</th>
                                    <td>{formatDate(matchdata.match_date)}</td>
                                </tr>
                                <tr>
                                    <th>Время</th>
                                    <td>{formatTime(matchdata.match_time)}</td>
                                </tr>

                                <tr>
                                    <th>Счет</th>
                                    <td>
                                        <img src={imglogo} alt="Home Team Logo" className="team-logo" />
                                        {matchdata.score_home} - {matchdata.score_away}
                                        <img
                                            src={matchdata.team_away_logo_url}
                                            alt="Away Team Logo"
                                            className="team-logo"
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <th>Место</th>
                                    <td>{matchdata.location}</td>
                                </tr>
                                <tr>
                                    <th>Лига</th>
                                    <td>{matchdata.division}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default MatchDetails;
