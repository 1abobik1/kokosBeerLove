import {createApiInstance} from './apiInterceptorsFactory/apiInterceptorsFactory';
import {TEAM_AND_ABOUT_CLUB_URL} from './url/urls';

export const teamAboutApi = createApiInstance(
    TEAM_AND_ABOUT_CLUB_URL,
    /^\/delete_player\/\d+\/$/,
    /^(\/info_club\/update\/|\/update_player\/\d+\/)$/,
    '/create_player/',
);
