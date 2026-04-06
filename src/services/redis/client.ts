import Redis from 'ioredis';

export const client = new Redis({
	host: process.env.REDIS_HOST,
	port: +process.env.REDIS_PORT,
	password: process.env.REDIS_PW
});
