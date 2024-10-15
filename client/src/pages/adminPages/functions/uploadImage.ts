import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import {AuthResponse} from '../../../api/models/response/AuthResponse';
import {AUTH_API_URL} from '../../../api/http/url/urls';

const AVATAR_FOLDER = 'user_avatar';

function currentUserId(token: string | null): number | null {
    if (!token) return null;
    try {
        return jwtDecode<{user_id: number}>(token).user_id;
    } catch {
        return null;
    }
}

// nginx accepts the file only with a valid access token (checked by the auth service).
// On 401 the token is refreshed once through the refresh cookie and the upload is retried.
async function putWithToken(url: string, file: File) {
    const put = (token: string | null) =>
        axios.put(url, file, {
            headers: {
                'Content-Type': file.type,
                ...(token ? {Authorization: `Bearer ${token}`} : {}),
            },
        });

    try {
        return await put(localStorage.getItem('token'));
    } catch (error: any) {
        if (error?.response?.status !== 401) throw error;
        const refreshed = await axios.post<AuthResponse>(`${AUTH_API_URL}/refresh/`, {}, {withCredentials: true});
        localStorage.setItem('token', refreshed.data.access);
        return put(refreshed.data.access);
    }
}

export const uploadImage = async (
    file: File,
    setSuccessMessage: (message: string | null) => void,
    setErrorMessage: (message: string | null) => void,
    folder: string,
): Promise<string> => {
    // Преобразуем имя файла: заменяем пробелы на "_" и удаляем невалидные символы
    const sanitizedFileName = file.name
        .toLowerCase()
        .replace(/\s+/g, '_')
        .replace(/[^a-z0-9_.-]/g, '');

    // An avatar must start with the user's id: the server lets users write only their own avatars.
    const owner = folder === AVATAR_FOLDER ? `${currentUserId(localStorage.getItem('token'))}_` : '';
    const uniqueFileName = `${owner}${Date.now()}_${sanitizedFileName}`;
    // Stored in the database as an absolute URL of the current site (the fields are URLField).
    const url = `${window.location.origin}/uploads/${folder}/${uniqueFileName}`;

    try {
        await putWithToken(url, file);
        setSuccessMessage('Изображение успешно загружено.');
        return url;
    } catch (error: any) {
        const status = error?.response?.status;
        if (status === 401) {
            setErrorMessage('Вы не авторизованы');
        } else if (status === 403) {
            setErrorMessage('Недостаточно прав для загрузки изображения.');
        } else if (status === 413) {
            setErrorMessage('Файл слишком большой (максимум 10 МБ).');
        } else if (status === 404) {
            setErrorMessage('Можно загружать только изображения JPG, PNG, WEBP или GIF.');
        } else {
            setErrorMessage('Ошибка при загрузке изображения.');
        }
        return '';
    }
};
