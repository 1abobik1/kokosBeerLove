export interface TeamResponse {
    id: number;
    first_name: string;
    last_name: string;
    middle_name: string;
    role: 'защитник' | 'нападающий' | 'вратарь' | 'полузащитник';
    games_played: number;
    goals_scored: number;
    assists_made: number;
    yellow_cards: number;
    red_cards: number;
    photo_url: string;
}
