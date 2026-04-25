import { itemsByPriceKey, itemsKey } from '$services/keys';
import { client } from '$services/redis';
import { deserialize } from './deserialize';

export const itemsByPrice = async (order: 'DESC' | 'ASC' = 'DESC', offset = 0, count = 10) => {
	const ranges = await client.zrange(itemsByPriceKey(), '-inf', '+inf', 'BYSCORE');

	const items = await Promise.all(ranges.map((item) => client.hgetall(itemsKey(item))));

	return items.map((item, i) => deserialize(ranges[i], item));
};
