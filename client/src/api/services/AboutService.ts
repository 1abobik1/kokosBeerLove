import {AboutResponse} from '../models/response/AboutResponse';
import {teamAboutApi} from '../http/team_and_aboutClub';

export default class AboutService {
    static async getInfoClub() {
        // @ts-ignore
        return teamAboutApi.get<AboutResponse>('/get_info_club/');
    }

    static async updateFullAbout(
        games_played: number,
        wins: number,
        goals_scored: number,
        tournaments: number,
        about_text: string,
    ) {
        // @ts-ignore
        return teamAboutApi.put<AboutResponse>(`/info_club/update/`, {
            games_played,
            wins,
            goals_scored,
            tournaments,
            about_text,
        });
    }

    static async updatePartAbout(
        games_played: number,
        wins: number,
        goals_scored: number,
        tournaments: number,
        about_text: string,
    ) {
        // @ts-ignore
        return teamAboutApi.patch<AboutResponse>(`/info_club/update/`, {
            games_played,
            wins,
            goals_scored,
            tournaments,
            about_text,
        });
    }
}
