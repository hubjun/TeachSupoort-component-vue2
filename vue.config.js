let path = require('path')

module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
  lintOnSave: true,
  productionSourceMap: false,
  devServer: {
    index: 'index.html', // 默认启动的页面
    open: true,
    host: 'localhost',
    port: 8088,
    https: false,
    hotOnly: true,
    before: app => {},
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  },
  configureWebpack: config => {

  },
  chainWebpack: (config) => {
    config.resolve.symlinks(true)
    config.resolve.alias
      .set('@', path.resolve(__dirname, './src'))
  },
  css: {
    extract: process.env.NODE_ENV === 'production', // 是否使用css分离插件 ExtractTextPlugin
    sourceMap: false, // 开启 CSS source maps?
    loaderOptions: {
      css: {}, // 这里的选项会传递给 css-loader
      postcss: {} // 这里的选项会传递给 postcss-loader
    }, // css预设器配置项 详见https://cli.vuejs.org/zh/config/#css-loaderoptions
    modules: false // 启用 CSS modules for all css / pre-processor files.
  }
}
