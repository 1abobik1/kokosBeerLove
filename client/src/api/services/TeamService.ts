import {teamAboutApi} from '../http/team_and_aboutClub';
import {TeamResponse} from '../models/response/TeamResponse';

export default class TeamService {
    static async getAllPlayers() {
        // @ts-ignore
        return teamAboutApi.get<TeamResponse[]>('/get_all_players/');
    }

    static async getPlayerId(playerId: number) {
        // @ts-ignore
        return teamAboutApi.get<TeamResponse>(`/get_player/${playerId}/`);
    }

    static async createPlayer(
        first_name: string,
        last_name: string,
        middle_name: string,
        role: string,
        games_played: number,
        goals_scored: number,
        assists_made: number,
        yellow_cards: number,
        red_cards: number,
        photo_url: string,
    ) {
        // @ts-ignore
        return teamAboutApi.post<TeamResponse>('/create_player/', {
            first_name,
            last_name,
            middle_name,
            role,
            games_played,
            goals_scored,
            assists_made,
            yellow_cards,
            red_cards,
            photo_url,
        });
    }

    static async deletePlayer(playerId: number) {
        return teamAboutApi.delete(`/delete_player/${playerId}/`);
    }

    static async updateFullPlayer(
        playerId: number,
        first_name: string,
        last_name: string,
        middle_name: string,
        role: string,
        games_played: number,
        goals_scored: number,
        assists_made: number,
        yellow_cards: number,
        red_cards: number,
        photo_url: string,
    ) {
        // @ts-ignore
        return teamAboutApi.put<TeamResponse>(`/update_player/${playerId}/`, {
            first_name,
            last_name,
            middle_name,
            role,
            games_played,
            goals_scored,
            assists_made,
            yellow_cards,
            red_cards,
            photo_url,
        });
    }

    static async updatePartPlayer(
        playerId: number,
        first_name: string,
        last_name: string,
        middle_name: string,
        role: string,
        games_played: number,
        goals_scored: number,
        assists_made: number,
        yellow_cards: number,
        red_cards: number,
        photo_url: string,
    ) {
        // @ts-ignore
        return teamAboutApi.patch<TeamResponse>(`/update_player/${playerId}/`, {
            first_name,
            last_name,
            middle_name,
            role,
            games_played,
            goals_scored,
            assists_made,
            yellow_cards,
            red_cards,
            photo_url,
        });
    }
}
