import { DateTime } from 'luxon';

import type { CreateBidAttrs, Bid } from '$services/types';
import { itemBidHistoryKey } from '$services/keys';
import { client } from '$services/redis';

export const createBid = async (attrs: CreateBidAttrs) => {
	const serializedBid = serializeHistory(attrs.amount, attrs.createdAt.toMillis());

	return client.rpush(itemBidHistoryKey(attrs.itemId), serializedBid);
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
