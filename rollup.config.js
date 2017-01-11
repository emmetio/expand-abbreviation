'use strict';

import nodeResolve from 'rollup-plugin-node-resolve';

const options = {
    entry: './index.js',
    format: 'es',
    plugins: []
};

if (process.env.BUNDLE === 'full') {
    // build a full bundle, without dependencies
    options.plugins.push(nodeResolve({jsnext: true}));
} else {
    options.external = [
        '@emmetio/abbreviation',
        '@emmetio/snippets',
        '@emmetio/snippets-registry',
        '@emmetio/html-snippets-resolver',
        '@emmetio/output-profile',
        '@emmetio/html-transform',
        '@emmetio/variable-resolver',
        '@emmetio/markup-formatters'
    ];
}

export default options;
