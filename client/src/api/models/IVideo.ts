import {MatchResponse} from './response/MatchResponse';

export interface IVideo extends MatchResponse {
    video_url: string;
    hd: number;
    width: number;
    height: number;
    autoplay?: boolean;
}
