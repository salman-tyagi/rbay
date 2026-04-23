import { DateTime } from 'luxon';

import type { CreateBidAttrs, Bid } from '$services/types';
import { itemBidHistoryKey, itemsKey } from '$services/keys';
import { client } from '$services/redis';
import { getItem } from './items';

export const createBid = async (attrs: CreateBidAttrs) => {
	const item = await getItem(attrs.itemId);

	if (!item) throw new Error('Item does not exist');

	if (item.price >= attrs.amount) throw Error('Bid too low');

	if (item.endingAt.toMillis() - Date.now() < 0) throw Error('Item closed to bidding');

	const serializedBid = serializeHistory(attrs.amount, attrs.createdAt.toMillis());

	return Promise.all([
		client.rpush(itemBidHistoryKey(attrs.itemId), serializedBid),
		client.hset(
			itemsKey(item.id),
			'bids',
			item.bids + 1,
			'price',
			attrs.amount,
			'highestBidUser',
			attrs.userId
		)
	]);
};

export const getBidHistory = async (itemId: string, offset = 0, count = 10): Promise<Bid[]> => {
	const startIndex = -1 * offset - count;
	const endIndex = -1 - offset;

	const range = await client.lrange(itemBidHistoryKey(itemId), startIndex, endIndex);

	return range.map((bid) => deserializeHistory(bid));
};

export const serializeHistory = (amount: number, createdAt: number) => {
	return `${amount}:${createdAt}`;
};

export const deserializeHistory = (stored: string): { amount: number; createdAt: DateTime } => {
	const [amount, createdAt] = stored.split(':');

	return {
		amount: parseFloat(amount),
		createdAt: DateTime.fromMillis(parseInt(createdAt))
	};
};
