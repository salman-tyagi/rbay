import { client } from '$services/redis';
import { itemsIndexKey } from '$services/keys';
import { deserialize } from './deserialize';

export const searchItems = async (term: string, size: number = 5) => {
	const cleaned = term
		.replaceAll(/^a-zA-Z0-9 /g, '')
		.trim()
		.split(' ')
		.map((word) => (word ? `%${word}%` : ''))
		.join(' ');

	if (cleaned === '') {
		return [];
	}

	let results = (await client.call(
		'FT.SEARCH',
		itemsIndexKey(),
		cleaned,
		'LIMIT',
		'0',
		size
	)) as any;

	const [, ...rest] = results;

	const items = [];

	for (let i = 0; i < rest.length; i += 2) {
		const id = rest[i];
		const item = rest[i + 1];

		const obj: Record<string, string> = {};

		for (let j = 0; j < item.length; j += 2) {
			const key = item[j];
			const value = item[j + 1];

			obj[key] = value;
		}

		items.push(deserialize(id, obj));
	}

	return items;
};
