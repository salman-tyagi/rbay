import { client } from '$services/redis';

const CACHE_ROUTES = ['/about', '/privacy-policy', '/auth/signup', '/auth/signin'];

export const getCachedPage = (route: string) => {
	if (!CACHE_ROUTES.includes(route)) return null;

	return client.get('cachePage#' + route);
};

export const setCachedPage = (route: string, page: string) => {
	if (!CACHE_ROUTES.includes(route)) return null;

	return client.set('cachePage#' + route, page, '2s');
};
