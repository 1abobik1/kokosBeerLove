import {authApi} from "../http/auth";

import {AuthResponse} from "../models/response/AuthResponse";
import {CodeResponse} from "../models/response/CodeResponse";
import {ProfileEdit} from "../models/ProfileEdit";

export default class AuthService {
    static async login(email: string, password: string) {
        // @ts-ignore
        return authApi.post<AuthResponse>('/login/', {email, password})
    }

    static async registration(username: string, email: string, password: string) {
        // @ts-ignore
        return authApi.post<AuthResponse>('/signup/', {username, email, password})
    }

    static async logout(): Promise<unknown> {
        return authApi.post('/logout/')
    }

    static async verify(email: string) {
        // @ts-ignore
        return authApi.post<CodeResponse>('/verify-email/', {email})
    }

    static async getUserData(){
        // @ts-ignore
        return authApi.get<ProfileEdit>('/profile/get_user_data/')
    }

    static async profileEdit(username:string,first_name: string, last_name: string, phone_number: string, telegram: string, avatar_url: string){
        // @ts-ignore
        return authApi.patch<ProfileEdit>('/profile/update/', {username,first_name, last_name, phone_number, telegram, avatar_url})
    }

}