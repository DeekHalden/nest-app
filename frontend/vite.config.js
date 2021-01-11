const proxy = require('koa-proxy')



export default {
  outDir: './../backend/public',
  proxy: {
    '/api/': {
      target: 'http://localhost:3000/',
      changeOrigin: true,
      secure: false,
      ws: true,
    }
  },
  rollupOutputOptions: {
    entryFileNames: `[name].js`,
    chunkFileNames: `[name].js`,
    assetFileNames: `[name].[ext]`
  }
}