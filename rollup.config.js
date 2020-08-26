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
            file: './dist/3h-term.umd.js'
        }
    },
    {
        input,
        output: {
            format: 'esm',
            file: './dist/3h-term.js'
        }
    }
];
