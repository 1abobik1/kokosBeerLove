import React, {useEffect, useState} from 'react';
import {Box, Card, CardContent, Typography, Button, Avatar, TextField, Alert} from '@mui/material';
import Header from '../../../components/HeaderAndItsComponents/Header';
import Footer from '../../../components/Footer/Footer';
import {uploadImage} from '../../adminPages/functions/uploadImage';
import AuthService from '../../../api/services/AuthService';
import {ProfileEdit} from '../../../api/models/ProfileEdit';

const fieldNames: Record<keyof ProfileEdit, string> = {
    first_name: 'Имя',
    last_name: 'Фамилия',
    phone_number: 'Номер телефона',
    telegram: 'Телеграм',
    avatar_url: 'Аватар',
};

const UserProfile: React.FC = () => {
    const [user, setUser] = useState<ProfileEdit | null>();
    const [isEditing, setIsEditing] = useState(false);
    const [image, setImage] = useState<string>('');
    const [showInput, setShowInput] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        fetchUser();
    }, []);

    const fetchUser = async () => {
        setIsLoading(true);
        try {
            const response = await AuthService.getUserData();
            setUser(response.data);
            setErrorMessage(null);
        } catch (error: any) {
            setErrorMessage('Ошибка загрузки пользователя.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (field: keyof ProfileEdit, value: string) => {
        if (user) {
            setUser({...user, [field]: value});
        }
    };

    const handleImageEditing = async () => {
        if (showInput && user) {
            const hasImageChanged = image && image !== user.avatar_url;
            if (hasImageChanged) {
                try {
                    await AuthService.profileEdit(
                        user.first_name,
                        user.last_name,
                        user.phone_number,
                        user.telegram,
                        image || user.avatar_url,
                    );
                    setSuccessMessage('Фотография успешно обновлена!');
                    setErrorMessage(null);
                } catch (error) {
                    setErrorMessage('Произошла ошибка при обновлении фотографии.');
                    setSuccessMessage(null);
                }
            } else {
                setErrorMessage('');
            }
        }
        setShowInput(!showInput);
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && (file.type === 'image/png' || file.type === 'image/jpeg')) {
            try {
                const imageUrl = await uploadImage(file, setSuccessMessage, setErrorMessage, 'user_avatar');
                if (imageUrl) {
                    setImage(imageUrl);
                    setSuccessMessage('Изображение успешно загружено!');
                    setErrorMessage(null);
                }
            } catch (error) {
                setErrorMessage('Ошибка при загрузке изображения.');
                setSuccessMessage(null);
            }
        } else {
            setErrorMessage('Пожалуйста, загрузите изображение в формате PNG или JPEG.');
        }
    };

    const handleSave = async () => {
        if (user) {
            try {
                await AuthService.profileEdit(
                    user.first_name,
                    user.last_name,
                    user.phone_number,
                    user.telegram,
                    image || user.avatar_url,
                );
                setSuccessMessage('Профиль успешно обновлен!');
                setErrorMessage(null);
                setIsEditing(false); // Отключаем режим редактирования
            } catch (error) {
                setErrorMessage('Произошла ошибка при сохранении данных.');
                setSuccessMessage(null);
            }
        }
    };

    return (
        <>
            <Box display="flex" flexDirection="column" minHeight="100vh">
                <Header />
                <Box flexGrow={1} display="flex" justifyContent="center" alignItems="flex-start" p={2}>
                    <Box display="flex" flexDirection={{xs: 'column', md: 'row'}} gap={2} width="90%" maxWidth="1200px">
                        <Box flex="1" display="flex" justifyContent="center">
                            <Card sx={{textAlign: 'center', padding: 2, backgroundColor: '#ffffff', width: '100%'}}>
                                <Avatar
                                    sx={{width: 120, height: 120, margin: '0 auto 16px auto'}}
                                    src={image || user?.avatar_url}
                                    alt="Profile Image"
                                />
                                <Button
                                    style={{margin: '15px'}}
                                    variant="outlined"
                                    color="error"
                                    onClick={handleImageEditing}
                                >
                                    {showInput ? 'Сохранить' : 'Загрузить аватар'}
                                </Button>

                                {showInput && (
                                    <input
                                        style={{margin: '15px'}}
                                        type="file"
                                        onChange={handleFileChange}
                                        accept="image/*"
                                    />
                                )}

                                {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
                                {successMessage && <Alert severity="success">{successMessage}</Alert>}

                                <Typography variant="h5" gutterBottom>
                                    {user?.first_name} {user?.last_name}
                                </Typography>
                                <Typography variant="subtitle1" color="textSecondary">
                                    Болельщик
                                </Typography>
                            </Card>
                        </Box>

                        <Box flex="2" display="flex" justifyContent="center">
                            <Card sx={{padding: 2, backgroundColor: '#ffffff', width: '100%'}}>
                                <CardContent>
                                    {(
                                        ['first_name', 'last_name', 'phone_number', 'telegram'] as Array<
                                            keyof ProfileEdit
                                        >
                                    ).map((field) => (
                                        <Box key={field} mb={2}>
                                            <Typography variant="h6" gutterBottom>
                                                {fieldNames[field]}
                                            </Typography>
                                            {isEditing ? (
                                                <TextField
                                                    fullWidth
                                                    variant="outlined"
                                                    value={user ? user[field] : ''}
                                                    onChange={(e) => handleInputChange(field, e.target.value)}
                                                />
                                            ) : (
                                                <Typography variant="body2" color="textSecondary">
                                                    {user ? user[field] : ''}
                                                </Typography>
                                            )}
                                        </Box>
                                    ))}
                                    <Button
                                        variant="contained"
                                        color="error"
                                        onClick={isEditing ? handleSave : () => setIsEditing(true)}
                                    >
                                        {isEditing ? 'Сохранить' : 'Редактировать'}
                                    </Button>
                                </CardContent>
                            </Card>
                        </Box>
                    </Box>
                </Box>
                <Footer />
            </Box>
        </>
    );
};

export default UserProfile;
