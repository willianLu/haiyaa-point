import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import eslintPlugin from '@nabla/vite-plugin-eslint'
import { compression } from 'vite-plugin-compression2'
// vant 按需加载
import Components from 'unplugin-vue-components/vite'
import { VantResolver } from 'unplugin-vue-components/resolvers'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'

const isDev = process.env.NODE_ENV === 'develpoment'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: '0.0.0.0',
    proxy: {
      '/json': {
        target: 'http://testsg.haiyaapi.com/'
      }
    }
  },
  define: {
    'import.meta.env.SERVER_ENV': JSON.stringify(process.env.SERVER_ENV || '')
  },
  plugins: [
    vue(),
    Components({
      resolvers: [VantResolver()]
    }),
    eslintPlugin({
      eslintOptions: {
        cache: false
      }
    }),
    // 开启pwa，必须https服务支持
    // VitePWA({
    //   injectRegister: 'auto',
    //   manifest: {
    //     name: 'viteApp',
    //     short_name: 'cm20',
    //     description: 'cm20 操作系统',
    //     icons: [
    //       {
    //         src: '/love.png',
    //         sizes: '128x128',
    //         type: 'image/png'
    //       }
    //     ],
    //     background_color: '#ee5353'
    //   },
    //   registerType: 'autoUpdate'
    // }),
    compression(),
    createSvgIconsPlugin({
      // 公用库lib中的icon
      iconDirs: [resolve(__dirname, 'src/icons')],
      // 指定symbolId格式
      symbolId: 'icon-[dir]-[name]'
    })
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src') // 把 @ 指向到 src 目录去
    }
  },
  base: './',
  build: {
    emptyOutDir: true,
    rollupOptions: {
      output: {
        // chunk代码输入位置
        chunkFileNames: 'js/[name]-[hash].js',
        // 入口文件代码输出位置
        entryFileNames: 'js/[name]-[hash].js',
        // 资源文件输入位置处理
        assetFileNames: assetInfo => {
          const { name } = assetInfo
          const index = name.lastIndexOf('.')
          const ext = name.substring(index + 1)
          // 图片类型文件存放在images文件夹下
          if (/^[png|jpg|gif|jpeg|svg]$/.test(name.toLocaleLowerCase())) {
            return `images/[name]-[hash].${ext}`
          }
          return `${ext}/[name]-[hash].${ext}`
        },
        // code splitting 拆包
        manualChunks(id) {
          // vue相关包放到一起
          if (/node_modules\/(vue|vue-router)/.test(id)) {
            return 'vue-vendor'
          }
        }
      }
    }
  },
  esbuild: {
    // 打包删除console 和 debugger
    drop: isDev ? [] : ['console', 'debugger']
  }
})
