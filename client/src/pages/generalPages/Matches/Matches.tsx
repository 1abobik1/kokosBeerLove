import React, {FC, useState, useEffect} from 'react';
import Header from '../../../components/HeaderAndItsComponents/Header';
import Footer from '../../../components/Footer/Footer';
import './Matches.css';
import CreateVideoFrame from '../../../components/MatchesPageComponents/CreateVideoFrame';
import {Link, useNavigate} from 'react-router-dom';
import {IVideo} from '../../../api/models/IVideo';
import MatchService from '../../../api/services/MatchService';
import imglogo from '../../../images/logoteam1.png';
import {
    Box,
    FormControl,
    InputLabel,
    List,
    ListItemButton,
    ListItemText,
    MenuItem,
    Select,
    TextField,
} from '@mui/material';

const Matches: FC = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [videosToShow, setVideosToShow] = useState(0);

    const [mathesData, setMatchesData] = useState<IVideo[]>([]);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [translationData, setTranslationData] = useState<IVideo>();
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState<IVideo[]>([]);

    const [selectedMonth, setSelectedMonth] = useState<number | ''>('');
    const [selectedYear, setSelectedYear] = useState<number | ''>('');
    const [selectedDay, setSelectedDay] = useState<number | ''>('');
    const [hasMoreVideos, setHasMoreVideos] = useState(true);

    // useEffect(() => {
    //     setMatchesData();
    //     setTranslationData();
    // }, []);

    useEffect(() => {
        fetchMathes(videosToShow);
    }, [videosToShow]);

    const fetchMathes = async (limit: number) => {
        setIsLoading(true);
        try {
            const response = await MatchService.getNext(limit);
            if (response.data.length === 0) {
                // Если новых видео нет, устанавливаем флаг, что больше нет данных
                setHasMoreVideos(false);
            } else {
                setMatchesData((prevData) => [...prevData, ...response.data]); // Добавляем новые видео к уже загруженным
            }
        } catch (error) {
            setErrorMessage('Ошибка загрузки товаров.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTranslation();
    }, []);

    const fetchTranslation = async () => {
        setIsLoading(true);
        try {
            const response = await MatchService.getLastOne();
            setTranslationData(response.data);
        } catch (error) {
            setErrorMessage('Ошибка загрузки последнего матча');
        } finally {
            setIsLoading(false);
        }
    };

    const handleShowMore = () => {
        const newLimit = videosToShow + 4; // Увеличиваем количество видео для показа
        setVideosToShow(newLimit); // Обновляем состояние для отображаемого количества видео
        fetchMathes(newLimit); // Вызываем функцию для загрузки дополнительных видео
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
    }, [translationData, mathesData]);

    const navigate = useNavigate();

    const handleCardClick = (id: number) => {
        navigate(`/match/${id}`);
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const query = event.target.value;
        setSearchQuery(query);
        if (query) {
            const filteredMatches = mathesData.filter((match) =>
                match.match_date?.toLowerCase().includes(query.toLowerCase()),
            );
            setSuggestions(filteredMatches);
        } else {
            setSuggestions([]);
        }
    };

    // Функция для фильтрации матчей по выбранным месяцу, году и дню
    const filterMatchesByDate = () => {
        return mathesData.filter((match) => {
            if (!match.match_date) return false; // Проверка на наличие даты

            // Разделение даты на год, месяц и день
            const [year, month, day] = match.match_date.split('.').map(Number);
            const matchDate = new Date(year, month - 1, day); // Создание объекта Date

            const matchYear = matchDate.getFullYear();
            const matchMonth = matchDate.getMonth() + 1; // getMonth() возвращает 0-11
            const matchDay = matchDate.getDate();

            const yearMatches = selectedYear ? matchYear === Number(selectedYear) : true; // Преобразование selectedYear в number
            const monthMatches = selectedMonth ? matchMonth === Number(selectedMonth) : true; // Преобразование selectedMonth в number
            const dayMatches = selectedDay ? matchDay === Number(selectedDay) : true; // Преобразование selectedDay в number

            return yearMatches && monthMatches && dayMatches;
        });
    };

    const filteredMatches = filterMatchesByDate();

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
        <div>
            <Header />
            <div className="container">
                <h1 className={`hiddenToo ${isLoading ? 'hidden' : ''}`}>Матчи</h1>
                <Box mb={3}>
                    <TextField
                        label="Поиск матчей"
                        variant="outlined"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        className={`searchMAtch ${isLoading ? 'hidden' : ''}`}
                        sx={{
                            width: '300px',
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: 'red',
                                },
                                '&:hover fieldset': {
                                    borderColor: 'darkred',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: 'red',
                                },
                            },
                        }}
                        InputLabelProps={{
                            sx: {color: 'red'},
                        }}
                    />
                    {suggestions.length > 0 && (
                        <List>
                            {suggestions.map((match) => (
                                <ListItemButton
                                    key={match.id}
                                    onClick={() => handleCardClick(match.id)}
                                    sx={{width: '200px'}}
                                >
                                    <ListItemText primary={match.match_date} />
                                </ListItemButton>
                            ))}
                        </List>
                    )}
                </Box>

                <div className="content">
                    {isLoading && <div className="loading-spinner"></div>}

                    <div className={`TraslateVk ${isLoading ? 'hidden' : ''}`}>
                        {isLoading && <div className="loading-spinner"></div>}

                        <CreateVideoFrame
                            video_url={translationData?.video_url || ''}
                            hd={translationData?.hd}
                            width={720}
                            height={1280}
                            autoplay={1}
                        />
                    </div>

                    <div className="low-content-matches">
                        <div className={`hiddenToo ${isLoading ? 'hidden' : ''}`}>
                            <h2 className={`hiddenToo ${isLoading ? 'hidden' : ''}`}>Записи матчей</h2>

                            <Box mb={3} display="flex" gap={2} flexWrap="wrap" flexDirection="row">
                                <FormControl variant="outlined" sx={{minWidth: 120}}>
                                    <InputLabel>Год</InputLabel>
                                    <Select
                                        value={selectedYear}
                                        onChange={(e) => setSelectedYear(Number(e.target.value))}
                                        label="Год"
                                    >
                                        <MenuItem value="">
                                            <em>Все</em>
                                        </MenuItem>
                                        {Array.from(
                                            new Set(
                                                mathesData.map((match) => {
                                                    if (match.match_date) {
                                                        return new Date(match.match_date).getFullYear();
                                                    }
                                                    return undefined;
                                                }),
                                            ),
                                        )
                                            .filter((year) => year !== undefined)
                                            .map((year) => (
                                                <MenuItem key={year} value={year}>
                                                    {year}
                                                </MenuItem>
                                            ))}
                                    </Select>
                                </FormControl>
                                <FormControl variant="outlined" sx={{minWidth: 120}}>
                                    <InputLabel>Месяц</InputLabel>
                                    <Select
                                        value={selectedMonth}
                                        onChange={(e) => setSelectedMonth(Number(e.target.value))}
                                        label="Месяц"
                                    >
                                        <MenuItem value="">
                                            <em>Все</em>
                                        </MenuItem>
                                        {[...Array(12)].map((_, month) => (
                                            <MenuItem key={month + 1} value={month + 1}>
                                                {month + 1}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <FormControl variant="outlined" sx={{minWidth: 120}}>
                                    <InputLabel>День</InputLabel>
                                    <Select
                                        value={selectedDay}
                                        onChange={(e) => setSelectedDay(Number(e.target.value))}
                                        label="День"
                                    >
                                        <MenuItem value="">
                                            <em>Все</em>
                                        </MenuItem>
                                        {Array.from(new Array(31)).map((_, index) => {
                                            const day = index + 1;
                                            const isValidDay =
                                                selectedMonth && selectedYear
                                                    ? new Date(selectedYear, selectedMonth - 1, day).getMonth() + 1 ===
                                                      selectedMonth
                                                    : true;
                                            return isValidDay ? (
                                                <MenuItem key={day} value={day}>
                                                    {day}
                                                </MenuItem>
                                            ) : null;
                                        })}
                                    </Select>
                                </FormControl>
                            </Box>
                        </div>
                        <div className="lastephire">
                            {filteredMatches.slice(0, videosToShow).map((video) => (
                                <div className="ephir-1" key={video.id} onClick={() => handleCardClick(video.id)}>
                                    <div className={`videosVk ${isLoading ? 'hidden' : ''}`}>
                                        <CreateVideoFrame
                                            video_url={video.video_url}
                                            hd={video?.hd}
                                            width={720}
                                            height={1280}
                                        />
                                        <div className="video-info">
                                            <table className="match-table">
                                                <tbody>
                                                    <tr>
                                                        <th>Дата</th>
                                                        <td>{formatDate(video.match_date)}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>Время</th>
                                                        <td>{formatTime(video.match_time)}</td>
                                                    </tr>

                                                    <tr>
                                                        <th>Счет</th>
                                                        <td>
                                                            <img
                                                                src={imglogo}
                                                                alt="Home Team Logo"
                                                                className="team-logo"
                                                            />
                                                            {video.score_home} - {video.score_away}
                                                            <img
                                                                src={video.team_away_logo_url}
                                                                alt="Away Team Logo"
                                                                className="team-logo"
                                                            />
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <th>Место</th>
                                                        <td>{video.location}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>Лига</th>
                                                        <td>{video.division}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                            <button className="button" onClick={() => handleCardClick(video.id)}>
                                                Подробнее
                                                <span className="arrow">→</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {hasMoreVideos && isLoading && <div className="loading-spinner"></div>}
                        {!isLoading && (
                            <button
                                onClick={handleShowMore}
                                className={`show-more-button ${!hasMoreVideos ? 'hidden' : ''}`}
                                disabled={!hasMoreVideos}
                            >
                                Показать больше
                            </button>
                        )}
                        {!hasMoreVideos && <div className="no-more-videos-message">Видео больше нет</div>}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Matches;
