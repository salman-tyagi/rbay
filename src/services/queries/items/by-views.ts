import { client } from '$services/redis';
import { itemsKey, itemsByViewsKey } from '$services/keys';
import { deserialize } from './deserialize';

export const itemsByViews = async (order: 'DESC' | 'ASC' = 'DESC', offset = 0, count = 10) => {
	let results: any = await client.sort(
		itemsByViewsKey(),
		'BY',
		'nosort',
		'LIMIT',
		offset,
		count,
		'GET',
		'#',
		'GET',
		`${itemsKey('*')}->name`,
		'GET',
		`${itemsKey('*')}->views`,
		'GET',
		`${itemsKey('*')}->imageUrl`,
		'GET',
		`${itemsKey('*')}->price`,
		'GET',
		`${itemsKey('*')}->endingAt`,
		order
	);

	const items = [];

	while (results.length) {
		const [id, name, views, imageUrl, price, endingAt, ...rest] = results;
		const item = deserialize(id, { name, views, price, endingAt, imageUrl });

		items.push(item);
		results = rest;
	}

	return items;
};
