import colors from 'kleur';
import { create_builder } from './builder.js';

/**
 * @param {import('types').ValidatedConfig} config
 * @param {import('types').BuildData} build_data
 * @param {import('types').ServerMetadata} server_metadata
 * @param {import('types').Prerendered} prerendered
 * @param {import('types').PrerenderMap} prerender_map
 * @param {import('types').Logger} log
 */
export async function adapt(config, build_data, server_metadata, prerendered, prerender_map, log) {
	const { name, adapt } = config.kit.adapter;

	console.log(colors.bold().cyan(`\n> Using ${name}`));

	const builder = create_builder({
		config,
		build_data,
		server_metadata,
		routes: build_data.manifest_data.routes.filter((route) => {
			if (!route.page && !route.endpoint) return false;

			const prerender = prerender_map.get(route.id);
			return prerender === false || prerender === undefined || prerender === 'auto';
		}),
		prerendered,
		log
	});
	await adapt(builder);

	log.success('done');
}
