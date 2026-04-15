import { client } from '$services/redis';
import { itemsKey, itemsByViewsKey } from '$services/keys';

export const incrementView = async (itemId: string, userId: string) => {
	// await client.hincrby(itemsKey(itemId), 'views',  1);
	// await client.zincrby(itemsByViewsKey(), 1, itemId);

	return Promise.all([
		client.hincrby(itemsKey(itemId), 'views', 1),
		client.zincrby(itemsByViewsKey(), 1, itemId)
	]);
};
