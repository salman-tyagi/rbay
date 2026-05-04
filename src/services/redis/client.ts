import Redis from 'ioredis';

interface CustomRedis extends Redis {
	addOneAndStore(key: string, value: number): Promise<any>;
	incrementView(
		itemsViewsKey: string,
		itemsKey: string,
		itemsByViewsKey: string,
		itemId: string,
		userId: string
	): Promise<void>;
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

client.defineCommand('incrementView', {
	numberOfKeys: 3,
	lua: `
		local itemsViewsKey = KEYS[1]
		local itemsKey = KEYS[2]
		local itemsByViewsKey = KEYS[3]

		local itemId = ARGV[1]
		local userId = ARGV[2]

		local inserted = redis.call('PFADD', itemsViewsKey, userId)

		if inserted == 1 then
			redis.call('HINCRBY', itemsKey, 'views', 1)
			redis.call('ZINCRBY', itemsByViewsKey, 1, itemId)
		end
	`
});
