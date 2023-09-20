const { defineConfig } = require('@vue/cli-service')
const path = require('path');
function resolve(dir) {
  return path.join(__dirname, dir);
}
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  publicPath: '',
  chainWebpack: (config) => {
    config.resolve.alias
      .set('@', resolve('src'))

    config.module
      .rule('svg')
      .exclude.add(resolve('packages/assets/icons'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('packages/assets/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()
  },
})
