'use strict';

import nodeResolve from 'rollup-plugin-node-resolve';

const options = {
	entry: './index.js'
};

if (process.env.BUILD_FULL) {
	Object.assign(options, {
		format: 'umd',
		plugins: [nodeResolve({jsnext: true})],
		dest: 'dist/expand-full.js',
		moduleName: 'emmet'
	});
} else {
	Object.assign(options, {
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
		targets: [
			{format: 'cjs', dest: 'dist/expand.cjs.js'},
			{format: 'es',  dest: 'dist/expand.es.js'}
		]
	});
}

export default options;
