import type { CreateItemAttrs } from '$services/types';
import { client } from '$services/redis';
import { genId } from '$services/utils';
import { itemsKey, itemsByViewsKey, itemsByEndingAtKey } from '$services/keys';
import { serialize } from './serialize';
import { deserialize } from './deserialize';

export const getItem = async (id: string) => {
	const item = await client.hgetall(itemsKey(id));

	if (!Object.keys(item).length) {
		return null;
	}

	return deserialize(id, item);
};

export const getItems = async (ids: string[]) => {
	const commands = ids.map((id) => {
		return client.hgetall(itemsKey(id));
	});

	const results = await Promise.all(commands);

	const items = results.map((res, i) => {
		if (!Object.keys(res).length) {
			return null;
		}

		return deserialize(ids[i], res);
	});

	return items;
};

export const createItem = async (attrs: CreateItemAttrs, userId: string) => {
	const itemId = genId();

	const commands = [
		client.hset(itemsKey(itemId), serialize(attrs)),
		client.zadd(itemsByViewsKey(), 0, itemId),
		client.zadd(itemsByEndingAtKey(), attrs.endingAt.toMillis(), itemId)
	];

	await Promise.all(commands);

	return itemId;
};
