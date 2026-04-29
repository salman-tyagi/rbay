import { itemsByPriceKey, itemsKey } from '$services/keys';
import { client } from '$services/redis';
import { deserialize } from './deserialize';

export const itemsByPrice = async (order: 'DESC' | 'ASC' = 'DESC', offset = 0, count = 10) => {
	let results: any = await client.sort(
		itemsByPriceKey(),
		'BY',
		'nosort',
		'GET',
		'#',
		'GET',
		`${itemsKey('*')}->name`,
		'GET',
		`${itemsKey('*')}->price`,
		'GET',
		`${itemsKey('*')}->views`,
		'GET',
		`${itemsKey('*')}->imageUrl`,
		'GET',
		`${itemsKey('*')}->endingAt`,
		'LIMIT',
		offset,
		count,
		order
	);

	const items = [];
	while (results.length) {
		const [id, name, price, views, imageUrl, endingAt, ...rest] = results;
		const item = deserialize(id, { name, price, views, imageUrl, endingAt });
		items.push(item);

		results = rest;
	}

	return items;
};
