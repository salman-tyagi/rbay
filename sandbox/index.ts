import 'dotenv/config';
import { client } from '../src/services/redis';

const run = async () => {
	await client.hset('car', {
		color: 'red',
		year: 1950
		// engine: { cylinders: 8 },
		// owner: null,
		// service: undefined
	});

	const car = await client.hgetall('car');

	if (!car || !Object.keys(car).length) {
		console.log('Car not found with status code 404');
		return;
	}

	console.log(car);
};
run();
