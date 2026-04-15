import type { CreateUserAttrs } from '$services/types';
import { genId } from '$services/utils';
import { client } from '$services/redis';
import { usersKey, usernamesUniqueKey, usernamesKey } from '$services/keys';

export const getUserByUsername = async (username: string) => {
	const score = await client.zscore(usernamesKey(), username);

	if (!score) {
		throw Error('Username does not exist');
	}

	const id = Number(score).toString(16);

	const user = await client.hgetall(usersKey(id));

	if (!user || !Object.keys(user).length) {
		throw new Error('User not found');
	}

	const deserialized = deserialize(id, user);
	return deserialized;
};

export const getUserById = async (id: string) => {
	const user = await client.hgetall(usersKey(id));

	return deserialize(id, user);
};

export const createUser = async (attrs: CreateUserAttrs) => {
	const id = genId();

	const isExists = await client.sismember(usernamesUniqueKey(), attrs.username);

	if (isExists) {
		throw Error('Username is taken');
	}

	await client.hset(usersKey(id), serialize(attrs));
	await client.sadd(usernamesUniqueKey(), attrs.username);
	await client.zadd(usernamesKey(), parseInt(id, 16), attrs.username);

	return id;
};

export const serialize = (user: CreateUserAttrs) => {
	return {
		username: user.username,
		password: user.password
	};
};

export const deserialize = (id: string, user: { [key: string]: string }) => {
	return {
		id,
		username: user.username,
		password: user.password
	};
};
