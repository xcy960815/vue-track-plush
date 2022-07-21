import {
    terser
} from 'rollup-plugin-terser'
import babel from '@rollup/plugin-babel'
import clear from 'rollup-plugin-delete'
import livereload from 'rollup-plugin-livereload'

const isProduction = process.env.NODE_ENV === 'production'

const isDev = !isProduction

const initConfig = () => {
    const config = {
        input: 'src/index.js',
        output: [{
                file: './dist/index.umd.js',
                format: 'umd',
                name: 'VueTrackPlush',
                exports: 'named',
            },
            {
                file: './dist/index.esm.js',
                format: 'esm',
                name: 'VueTrackPlush',
            },
        ],
        plugins: [
            !isDev && clear({
                targets: ['dist']
            }),
            babel({
                exclude: 'node_modules/**',
                babelHelpers: 'runtime',
                skipPreflightCheck: true
            }),
            isProduction && terser()
        ]
    }
    if (isDev) {
        config.plugins.push(
            // 热更新
            livereload()
        )
    }
    return config
}

export default initConfig()