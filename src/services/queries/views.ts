import { client } from '$services/redis';
import { itemsKey, itemsByViewsKey, itemsViewsKey } from '$services/keys';

export const incrementView = async (itemId: string, userId: string) => {
	// const inserted = await client.pfadd(itemsViewsKey(itemId), userId);

	// if (!inserted) return;

	// return Promise.all([
	// 	client.hincrby(itemsKey(itemId), 'views', 1),
	// 	client.zincrby(itemsByViewsKey(), 1, itemId)
	// ]);

	return client.incrementView(
		itemsViewsKey(itemId),
		itemsKey(itemId),
		itemsByViewsKey(),
		itemId,
		userId
	);
};

// Keys --> itemsViewsKey, itemsKey, itemsByViewsKey
// Arguments --> itemId, userId
