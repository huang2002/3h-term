import rollupPluginBabel from "rollup-plugin-babel";

const input = './js/index.js';

export default [
    {
        input,
        plugins: [
            rollupPluginBabel()
        ],
        output: {
            format: 'umd',
            name: 'T',
            file: './dist/term-js.umd.js'
        }
    },
    {
        input,
        output: {
            format: 'esm',
            file: './dist/term-js.js'
        }
    }
];
