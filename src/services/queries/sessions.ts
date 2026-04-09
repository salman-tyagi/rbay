import type { Session } from '$services/types';
import { client } from '$services/redis';
import { sessionsKey } from '$services/keys';

export const getSession = async (id: string) => {
	const session = await client.hgetall(sessionsKey(id));

	if (!Object.keys(session).length) {
		return null;
	}

	return serialize(id, session);
};

export const saveSession = async (session: Session) => {
	await client.hset(sessionsKey(session.id), deserialize(session));

	return session.id;
};

const serialize = (id: string, session: { [key: string]: string }) => {
	return {
		id,
		userId: session.userId,
		username: session.username
	};
};

const deserialize = (session: { [key: string]: any }) => {
	return {
		userId: session.userId,
		username: session.username
	};
};
