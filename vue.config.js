const path = require('path');

module.exports = {
  publicPath: process.env.VUE_APP_RES_URL,
  outputDir: process.env.VUE_APP_ENV === "example" ? "example/build" : "dist",
  assetsDir: "assets",
  productionSourceMap: false,
  lintOnSave: process.env.NODE_ENV === "development",
  pages: {
    index:
      process.env.VUE_APP_ENV === "example"
        ? {
            entry: "example/index.js",
            template: "example/index.html",
            filename: "index.html",
            favicon: "example/favicon.svg",
            title: "0xGen Widget Example",
          }
        : {
            entry: "public/index.js",
            template: "public/index.html",
            filename: "index.html",
            favicon: "public/favicon.svg",
            title: "0xGen Widget",
          },
  },
  css: {
    sourceMap: false,
    // extract:
    //   process.env.VUE_APP_ENV === "lib" || process.env.NODE_ENV === "production"
    //     ? true
    //     : false,
  },
  configureWebpack: (config) => {
    if (process.env.VUE_APP_ENV === "lib") {
      config.externals = {
        vue: "vue",
      };
      config.output.libraryExport = "default";
    }
  },
  chainWebpack: (config) => {
    if (process.env.VUE_APP_ENV == "lib") {
      config.plugins.delete("html");
      config.plugins.delete("preload");
      config.plugins.delete("prefetch");
    }
    config.module
    .rule("mjs")
    .test(/\.mjs$/)
    .type("javascript/auto")
    .include.add(/node_modules/)
    .end();

    config.module
      .rule('thejs')
      .test(/\.js$/)
      .include
        .add(path.resolve('node_modules/_@saberhq_token-utils@1.13.29@@saberhq/token-utils/'))
        .add(path.resolve('node_modules/@saberhq/token-utils/'))
        .end()
      .use('babel-loader')
        .loader('babel-loader')
        .end()
    // config
    // .plugin('webpack-bundle-analyzer')
    // .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin);
  },
  devServer: {
    disableHostCheck: true,
    overlay: {
      warnings: false,
      errors: true,
    },
  },
};
