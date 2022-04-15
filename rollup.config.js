import {
    terser
} from 'rollup-plugin-terser'
import babel from 'rollup-plugin-babel'
import clear from 'rollup-plugin-delete'
import serve from 'rollup-plugin-serve'
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
                file: './test/index.umd.js',
                format: 'umd',
                name: 'VueTrackPlush',
                exports: 'named',
            },
        ],
        plugins: [
            clear({
                targets: ['dist']
            }),
            babel({
                exclude: 'node_modules/**'
            }),
            isProduction && terser()
        ]
    }
    if (isDev) {
        config.plugins.push(
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
            livereload()
        )
    }
    return config
}

export default initConfig()