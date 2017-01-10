import nodeResolve from 'rollup-plugin-node-resolve';

export default {
    entry: './index.js',
    format: 'es',
    plugins: [nodeResolve({
        jsnext: true
    })]
};
