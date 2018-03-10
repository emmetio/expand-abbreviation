'use strict';

import nodeResolve from 'rollup-plugin-node-resolve';

const config = [{
	input: './index.js',
	external: [
		'@emmetio/abbreviation',
		'@emmetio/css-abbreviation',
		'@emmetio/css-snippets-resolver',
		'@emmetio/stylesheet-formatters',
		'@emmetio/lorem',
		'@emmetio/snippets',
		'@emmetio/snippets-registry',
		'@emmetio/html-snippets-resolver',
		'@emmetio/output-profile',
		'@emmetio/html-transform',
		'@emmetio/variable-resolver',
		'@emmetio/markup-formatters'
	],
	output: [
		{ format: 'cjs', file: 'dist/expand.cjs.js' },
		{ format: 'es', file: 'dist/expand.es.js' }
	]
}];

if (process.env.NODE_ENV !== 'test') {
	config.push({
		input: './index.js',
		plugins: [nodeResolve({ jsnext: true })],
		output: {
			format: 'umd',
			name: 'emmet',
			file: 'dist/expand-full.js',
		}
	});
}

export default config;
