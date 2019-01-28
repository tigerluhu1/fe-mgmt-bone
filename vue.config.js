// const Jarvis = require('webpack-jarvis')
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
module.exports = {
  baseUrl: './',
  configureWebpack: {
    plugins: [
      // new Jarvis({
      //   port: 1337
      // }),
      // new BundleAnalyzerPlugin()
    ]
  }
}
