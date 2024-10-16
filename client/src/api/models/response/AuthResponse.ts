import {IUser} from '../IUser';

export interface AuthResponse {
    access: string;
    is_superuser: boolean;
    refreshToken: string;
    user: IUser;
}
