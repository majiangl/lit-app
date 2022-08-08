import nodeResolve from '@rollup/plugin-node-resolve';

export default {
    input: 'my-element.js',
    output: {
        dir: 'dist',
        file: 'dev-bundle.js',
        format: 'iife'
    },
    plugins: [
        nodeResolve()
    ]
};