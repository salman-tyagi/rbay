import { client } from '$services/redis';
import { itemsKey, userLikesKey } from '$services/keys';
import { getItems } from './items';

export const userLikesItem = async (itemId: string, userId: string) => {
	return client.sismember(userLikesKey(userId), itemId);
};

export const likedItems = async (userId: string) => {
	const ids = await client.smembers(userLikesKey(userId));
	return getItems(ids);
};

export const likeItem = async (itemId: string, userId: string) => {
	const inserted = await client.sadd(userLikesKey(userId), itemId);

	if (!inserted) return;

	await client.hincrby(itemsKey(itemId), 'likes', inserted);
};

export const unlikeItem = async (itemId: string, userId: string) => {
	const removed = await client.srem(userLikesKey(userId), itemId);

	if (!removed) return;

	await client.hincrby(itemsKey(itemId), 'likes', -removed);
};

export const commonLikedItems = async (userOneId: string, userTwoId: string) => {
	const ids = await client.sinter([userLikesKey(userOneId), userLikesKey(userTwoId)]);

	return getItems(ids);
};
