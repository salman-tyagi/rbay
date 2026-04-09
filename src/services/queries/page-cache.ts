import { pageCacheKey } from '$services/keys';
import { client } from '$services/redis';

const CACHE_ROUTES = ['/about', '/privacy-policy', '/auth/signup', '/auth/signin'];

export const getCachedPage = (route: string) => {
	if (!CACHE_ROUTES.includes(route)) return null;

	return client.get(pageCacheKey(route));
};

export const setCachedPage = (route: string, page: string) => {
	if (!CACHE_ROUTES.includes(route)) return null;

	return client.set(pageCacheKey(route), page, 'EX', 2);
};
