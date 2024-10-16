export interface MatchResponse {
    id: number;
    team_home: string;
    team_away_name: string;
    team_away_logo_url: string;
    score_home: number;
    score_away: number;
    location: string;
    division: string;
    video_url: string;
    match_date: string;
    match_time: string;
}
