export default {
    entry: './index.js',
    format: 'es',
    external: [
        '@emmetio/abbreviation',
        '@emmetio/snippets',
        '@emmetio/snippets-registry',
        '@emmetio/html-snippets-resolver',
        '@emmetio/output-profile',
        '@emmetio/html-transform',
        '@emmetio/variable-resolver',
        '@emmetio/markup-formatters'
    ]
};
