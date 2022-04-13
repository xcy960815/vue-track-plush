import {
    terser
} from 'rollup-plugin-terser'
import {
    nodeResolve
} from '@rollup/plugin-node-resolve' //将外部引入的js打包进来
import commonjs from '@rollup/plugin-commonjs' //将commonjs 转换成es5
import babel from 'rollup-plugin-babel'
import del from 'rollup-plugin-delete'
import nodePolyfills from 'rollup-plugin-node-polyfills'
import serve from 'rollup-plugin-serve'
import livereload from 'rollup-plugin-livereload'
const isProduction = process.env.NODE_ENV === 'production'
export default {
    input: './src/index.js',
    output: [{
            file: './dist/index.umd.js',
            format: 'umd',
            name: 'VueTrackPlush',
            globals: {
                "axios": "axios",
            }
        },
        {
            file: './test/index.umd.js',
            format: 'umd',
            name: 'VueTrackPlush',
            globals: {
                "axios": "axios",
            }
        },
    ],
    external: ['Axios'],
    onwarn: function (warning) {
        // Skip certain warnings

        // should intercept ... but doesn't in some rollup versions
        if (warning.code === 'THIS_IS_UNDEFINED') {
            return;
        }

        // console.warn everything else
        console.warn(warning.message);
    },
    plugins: [
        //源代码更改马上清空dist文件夹下面打包过的文件 防止代码冗余
        del({
            targets: ['dist', 'test/index.umd.js']
        }),
        nodeResolve({
            jsnext: true,
            preferBuiltins: true,
            browser: true
        }),
        commonjs({
            include: 'node_modules/**',
            browser: true,
        }),
        isProduction && terser(),
        babel({
            exclude: 'node_modules/**',
        }),
        nodePolyfills(),
        // 开启服务
        !isProduction &&
        serve({
            open: false,
            host: 'localhost',
            port: 9999,
            historyApiFallback: true,
            contentBase: 'test',
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
        }),
        // 热更新
        !isProduction && livereload(),
    ],
}