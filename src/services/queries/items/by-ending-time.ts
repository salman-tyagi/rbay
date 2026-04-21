import { client } from '$services/redis';
import { itemsByEndingAtKey, itemsKey } from '$services/keys';
import { deserialize } from './deserialize';

export const itemsByEndingTime = async (order: 'DESC' | 'ASC' = 'DESC', offset = 0, count = 10) => {
	const itemIds = await client.zrange(
		itemsByEndingAtKey(),
		Date.now(),
		'+inf',
		'BYSCORE',
		'LIMIT',
		offset,
		count
	);

	const results = await Promise.all(itemIds.map((id) => client.hgetall(itemsKey(id))));

	return results.map((item, i) => deserialize(itemIds[i], item));
};
