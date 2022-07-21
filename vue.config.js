const {
    defineConfig
} = require('@vue/cli-service')
module.exports = defineConfig({
    runtimeCompiler: true,
    transpileDependencies: true,
    pages: {
        //配置多页面入口
        index: {
            entry: './example/main.js',
            template: 'example/index.html',
        },
    },
})