import { itemsIndexKey } from '$services/keys';
import { client } from '$services/redis';
import { deserialize } from './deserialize';

interface QueryOpts {
	page: number;
	perPage: number;
	sortBy: string;
	direction: string;
}

export const itemsByUser = async (userId: string, opts: QueryOpts) => {
	const page = Number(opts.page) || 1;
	const limit = Number(opts.perPage) || 1;

	const args: (string | number)[] = [itemsIndexKey(), `@ownerId:{${userId}}`];

	if (opts.sortBy && opts.direction) {
		args.push('SORTBY', opts.sortBy, opts.direction);
	}

	const offset = (page - 1) * limit;
	args.push('LIMIT', offset, limit);

	const [total, ...documents] = (await client.call('FT.SEARCH', ...args)) as any[];

	const items = [];

	for (let i = 0; i < documents.length; i += 2) {
		const id = documents[i];
		const doc = documents[i + 1];

		const item: Record<string, string> = {};

		for (let j = 0; j < doc.length; j += 2) {
			const key = doc[j];
			const value = doc[j + 1];

			item[key] = value;
		}

		items.push(deserialize(id.replace('items#', ''), item));
	}

	return {
		totalPages: Math.ceil(total / limit),
		items
	};
};
