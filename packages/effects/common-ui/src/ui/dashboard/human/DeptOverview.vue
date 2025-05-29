<!--
 * @Author: deaisry
 * @Date: 2025-05-29 11:05:31
 * @LastEditors: e deaisry@163.com
 * @LastEditTime: 2025-05-29 11:50:55
 * @FilePath: \meiyu-erp-admin\packages\effects\common-ui\src\ui\dashboard\human\DeptOverView.vue
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
-->
<script setup lang="ts">
import type { DeptOverviewItem } from '../typing';

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  VbenCountToAnimator,
  VbenIcon,
} from '@vben-core/shadcn-ui';

interface Props {
  items?: DeptOverviewItem[];
}

defineOptions({
  name: 'DeptOverview',
});

withDefaults(defineProps<Props>(), {
  items: () => [],
});
</script>

<template>
  <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-8">
    <template v-for="item in items" :key="item.title">
      <Card class="w-full">
        <CardContent class="flex items-center justify-between p-4">
          <!-- 左侧标题 -->
          <div class="space-y-0.5">
            <h3 class="text-sm font-medium text-muted-foreground tracking-tight">
              {{ item.title }}
            </h3>
          </div>

          <!-- 右侧数值 -->
          <VbenCountToAnimator
            :end-val="item.value"
            :start-val="1"
            class="text-xl font-semibold"
          />
        </CardContent>
      </Card>
    </template>
  </div>
</template>
