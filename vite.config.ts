import path from 'path'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import { viteMockServe } from 'vite-plugin-mock'
import vueJsx from '@vitejs/plugin-vue-jsx'

function resolve(dir: string) {
  return path.join(process.cwd(), dir)
}

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd())
  return {
    base: '/', // 公共基础路径
    resolve: {
      alias: {
        '@': resolve("src")
      }
    },
    css: {
      preprocessorOptions: {
        scss: {
          // 移除charset，打包会有警告信息
          charset: false
        }
      }
    },
    plugins: [
      vue(),
      // see https://github.com/vbenjs/vite-plugin-svg-icons
      createSvgIconsPlugin({
        iconDirs: [resolve('src/icons/svg')], // svg icon目录
        symbolId: 'icon-[name]', // svg symbol id
      }),
      // see https://github.com/vbenjs/vite-plugin-mock
      viteMockServe({
        ignore: /^\_/,  // 忽略_开头的文件
        mockPath: 'mock', // mock文件目录
        localEnabled: command === 'serve',  // 是否启用开发模式支持
        prodEnabled: command !== 'serve' && env.VITE_PROD_MOCK === '1', // 是否启用产品模式支持
        supportTs: true, // 启用ts支持
        // prodEnabled为true时会动态注入此代码到main.ts底部，避免未启用产品模式支持时也会导入mock.js
        injectCode: `
          import { setupProdMockServer } from '../mock/_mockProdServer'
          setupProdMockServer()
        `
      }),
      // see https://github.com/vitejs/vite/tree/main/packages/plugin-vue-jsx
      vueJsx()
    ],
    server: {
      // 配置代理，vite-plugin-mock不支持在mock中读取环境变量
      proxy: {
        "/dev-api": {
          target: 'http://localhost:3000',
          changeOrigin: true,
          rewrite: (path) => path.replace(new RegExp(`^/dev-api`), ''),
        }
      }
    },
    build: {
      outDir: 'dist'  // 输出目录
    }
  }
})
