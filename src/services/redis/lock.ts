import { randomUUID } from 'node:crypto';

import { client } from './client';

export const withLock = async (lockId: string, cb: (signal: any) => Promise<any>) => {
	const delay = 100;
	let retryAttempts = 20;

	const lockKey = `lock:${lockId}`;
	const token = randomUUID().split('-').join('');

	while (retryAttempts >= 0) {
		retryAttempts--;

		const acquired = await client.set(lockKey, token, 'PX', 2000, 'NX');

		if (!acquired) {
			await pause(delay);
			continue;
		}

		try {
			const signal = { expired: false };

			setTimeout(() => {
				signal.expired = true;
			}, 2000);

			const result = await cb(signal);
			return result;
		} finally {
			await client.unlock(lockKey, token);
		}
	}
};

const buildClientProxy = () => {};

const pause = (duration: number) => {
	return new Promise((resolve) => {
		setTimeout(resolve, duration);
	});
};
