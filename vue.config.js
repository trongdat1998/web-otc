const getIp = () => {
  var interfaces = require("os").networkInterfaces();
  for (var devName in interfaces) {
    var iface = interfaces[devName];
    for (var i = 0; i < iface.length; i++) {
      var alias = iface[i];
      if (
        alias.family === "IPv4" &&
        alias.address !== "127.0.0.1" &&
        !alias.internal
      ) {
        return alias.address;
      }
    }
  }
};

module.exports = {
  // 选项...
  publicPath: "/",
  outputDir: "build",

  assetsDir: "static",

  productionSourceMap: process.env.NODE_ENV !== "production",

  css: {
    loaderOptions: {
      less: {
        javascriptEnabled: true,
      },
    },
  },
  chainWebpack: (config) => {
    // 移除 prefetch 插件
    config.plugins.delete("prefetch");

    if (process.env.NODE_ENV === "production") {
      config.plugin("html").tap((args) => {
        Object.assign(args[0].minify, {
          minifyJS: true,
          minifyCSS: true,
        });
        return args;
      });
    }
  },
  devServer: {
    // 选项...'
    host: "localhost",
    open: true,
    proxy: {
      "/api": {
        target: "https://otc.cheerex.com/",
        cookieDomainRewrite: getIp(),
        headers: {
          "x-forwarded-host": "otc.cheerex.com",
          Referer: "https://otc.cheerex.com/",
        },
      },
      "/s_api": {
        target: "https://otc.cheerex.com/",
        cookieDomainRewrite: getIp(),
        headers: {
          "x-forwarded-host": "otc.cheerex.com",
          Referer: "https://otc.cheerex.com/",
        },
      },
    },
  },
};
