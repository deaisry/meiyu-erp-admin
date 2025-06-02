<!--
 * @Author: deaisry
 * @Date: 2025-05-29 11:05:31
 * @LastEditors: e deaisry@163.com
 * @LastEditTime: 2025-05-29 17:23:38
 * @FilePath: \meiyu-erp-admin\packages\effects\common-ui\src\ui\dashboard\human\DeptOverView.vue
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
-->
<script setup lang="ts">
import type { DeptOverviewItem } from '@vben/types';

import { onMounted } from 'vue';

// import { Card, CardContent, VbenCountToAnimator } from '@vben-core/shadcn-ui';

interface Props {
  items?: DeptOverviewItem[];
}

defineOptions({
  name: 'DeptOverview',
});

withDefaults(defineProps<Props>(), {
  items: () => [],
});

onMounted(() => {
  console.log('DeptOverview.vue');
});
</script>

<template>
  <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-8">
    <template v-for="item in items" :key="item.title">
      <Card class="w-full">
        <CardContent class="flex items-center justify-between p-4">
          <!-- 左侧标题 -->
          <div class="space-y-0.5">
            <h3
              class="text-muted-foreground text-sm font-medium tracking-tight"
            >
              {{ item.dept }}
            </h3>
          </div>

          <!-- 右侧数值 -->
          <VbenCountToAnimator
            :end-val="item.cnt"
            :start-val="1"
            class="text-xl font-semibold"
          />
        </CardContent>
      </Card>
    </template>
  </div>
</template>
