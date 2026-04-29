import Redis from 'ioredis';

interface CustomRedis extends Redis {
	addOneAndStore(key: string, value: number): Promise<any>;
}

export const client = new Redis({
	host: process.env.REDIS_HOST,
	port: +process.env.REDIS_PORT,
	password: process.env.REDIS_PW
}) as CustomRedis;

client.defineCommand('addOneAndStore', {
	numberOfKeys: 1,
	lua: `
		local key = KEYS[1]
		local newValue = 1 + ARGV[1]

		return redis.call('SET', key, newValue)
	`
});

client.on('connect', async () => {
	await client.addOneAndStore('item:count', 5);
	const result = await client.get('item:count');
	console.log(result);
});
