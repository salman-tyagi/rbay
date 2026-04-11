import 'dotenv/config';
import { client } from '../src/services/redis';

const run = async () => {
	await client.hset('car1', {
		color: 'red',
		year: 1950
	});

	await client.hset('car2', {
		color: 'green',
		year: 1955
	});

	await client.hset('car3', {
		color: 'blue',
		year: 1960
	});

	// Batching or Pipelining

	const commands = Array.from({ length: 3 }).map((_, i) => client.hgetall(`car${i + 1}`));

	// const results = await Promise.all([
	// 	client.hgetall('car1'),
	// 	client.hgetall('car2'),
	// 	client.hgetall('car3')
	// ]);

	const results = await Promise.all(commands);

	console.log(results);
};
run();
