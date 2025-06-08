import path from 'node:path'; // 添加 path 模块

import { defineConfig } from '@vben/vite-config';

import ElementPlus from 'unplugin-element-plus/vite';

export default defineConfig(async () => {
  return {
    application: {},
    vite: {
      resolve: {
        // 添加别名配置
        alias: {
          '@core/ui-kit/shadcn-ui': path.resolve(
            import.meta.dirname,
            '../../packages/@core/ui-kit/shadcn-ui/src',
          ),
          '@shadcn': path.resolve(
            import.meta.dirname,
            '../../packages/@core/ui-kit/shadcn-ui/src',
          ),
          '#': path.resolve(import.meta.dirname, './src'),
        },
      },
      plugins: [
        ElementPlus({
          format: 'esm',
        }),
      ],
      server: {
        proxy: {
          '/api': {
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/api/, ''),
            // mock代理目标地址
            target: 'http://localhost:8081/api',
            ws: true,
          },
        },
      },
    },
  };
});
