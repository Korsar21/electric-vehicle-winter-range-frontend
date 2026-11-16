import axios from 'axios';
import { Api } from './generated/Api';
export const electricCarLoadsApi = new Api({ baseURL: '/api', timeout: 8000 });
export const authApi = axios.create({ baseURL: '/api', timeout: 8000 });
let activeToken: string | null = null;
export function setApiToken(token: string | null) { activeToken = token; }
electricCarLoadsApi.instance.interceptors.request.use(config => {
    if (activeToken)
        config.headers.Authorization = `Bearer ${activeToken}`;
    return config;
});
export function mediaUrl(value: string | null | undefined, fallback: string) {
    if (!value)
        return fallback;
    if (value.startsWith('/static/'))
        return '/api-static/' + value.slice('/static/'.length);
    if (value.startsWith('http://localhost:9000/'))
        return '/s3/' + value.slice('http://localhost:9000/'.length);
    if (value.startsWith('http://localhost:8080/static/'))
        return value.replace('http://localhost:8080/static/', '/api-static/');
    return value;
}
export function errorMessage(error: unknown): string {
    return axios.isAxiosError(error) ? error.response?.data?.message || (error.response ? `Ошибка сервера: ${error.response.status}` : 'Сервер недоступен') : error instanceof Error ? error.message : 'Не удалось выполнить операцию';
}
