import { terser } from 'rollup-plugin-terser'
import { nodeResolve } from '@rollup/plugin-node-resolve' //将外部引入的js打包进来
import commonjs from '@rollup/plugin-commonjs' //将commonjs 转换成es5
import babel from 'rollup-plugin-babel'
import json from 'rollup-plugin-json'
import nodePolyfills from 'rollup-plugin-node-polyfills'
import replace from '@rollup/plugin-replace'
export default {
    input: './src/index.js',
    output: [
        {
            file: './dist/index.umd.js',
            format: 'umd',
            name: 'VueTrackPlush',
        },
        {
            file: './dist/index.amd.js',
            format: 'amd',
        },
        {
            file: './dist/index.es.js',
            format: 'es',
        },
    ],
    plugins: [
        nodeResolve({ jsnext: true, preferBuiltins: true, browser: true }),
        commonjs({
            include: 'node_modules/**',
            browser: true,
        }),
        terser(),
        babel({
            exclude: 'node_modules/**',
        }),
        nodePolyfills(),
        json(),
    ],
}
