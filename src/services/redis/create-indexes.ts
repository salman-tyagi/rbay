import { client } from './client';
import { itemsIndexKey, itemsKey } from '$services/keys';

export const createIndexes = async () => {
	const indexes = (await client.call('FT._LIST')) as string[];

	const isExist = indexes.find((idx) => idx === itemsIndexKey());

	if (isExist) return;

	return client.call(
		'FT.CREATE',
		itemsIndexKey(),
		'ON',
		'HASH',
		'PREFIX',
		'1',
		itemsKey(''),
		'SCHEMA',
		'name',
		'TEXT',
		'SORTABLE',
		'description',
		'TEXT',
		'ownerId',
		'TAG',
		'price',
		'NUMERIC',
		'SORTABLE',
		'endingAt',
		'NUMERIC',
		'SORTABLE',
		'bids',
		'NUMERIC',
		'SORTABLE',
		'views',
		'NUMERIC',
		'SORTABLE',
		'likes',
		'NUMERIC',
		'SORTABLE'
	);
};
