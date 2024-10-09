const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target: "https://forum-api.dicoding.dev",
      changeOrigin: true,
    })
  );
};
