import {newsApi} from '../http/news';
import {NewsResponse} from '../models/response/NewsResponse';

export default class NewsService {
    static async getAllNews() {
        // @ts-ignore
        return newsApi.get<NewsResponse[]>('/get_all/');
    }
    static async getNewsId(articleId: number) {
        // @ts-ignore
        return newsApi.get<NewsResponse>(`/${articleId}/`);
    }
    static async createNews(title: string, text: string, image_url: string) {
        return newsApi.post(`/create/`, {title, text, image_url});
    }

    static async deleteNews(articleId: number) {
        return newsApi.delete(`/${articleId}/delete/`);
    }
    static async updateFullNews(articleId: number, title: string, text: string, image_url: string) {
        return newsApi.put(`/${articleId}/update/`, {title, text, image_url});
    }

    static async updatePartNews(articleId: number, title: string, text: string, image_url: string) {
        return newsApi.patch(`/${articleId}/update/`, {title, text, image_url});
    }
}
