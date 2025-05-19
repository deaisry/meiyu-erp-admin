/*
 * @Author: deaisry
 * @Date: 2025-05-15 10:50:49
 * @LastEditors: e deaisry@163.com
 * @LastEditTime: 2025-05-15 14:54:20
 * @FilePath: \vue-vben-admin\playground\vite.config.mts
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
import { defineConfig } from '@vben/vite-config';

export default defineConfig(async () => {
  return {
    application: {},
    vite: {
      server: {
        proxy: {
          '/api': {
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/api/, ''),
            // mock代理目标地址
            target: 'http://localhost:8081',
            ws: true,
          },
        }
      },
    },
  };
});
