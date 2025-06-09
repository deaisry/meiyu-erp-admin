<script setup lang="ts">
import type { FollowOverviewItem, TypeOverviewItem } from '@vben/types';

import { Card, CardContent, VbenCountToAnimator } from '@core/ui-kit/shadcn-ui';

interface Props {
  items?: FollowOverviewItem[];
  typeItems?: TypeOverviewItem[];
}

defineOptions({
  name: 'FollowOverview',
});

withDefaults(defineProps<Props>(), {
  items: () => [],
  typeItems: () => [],
});

// onMounted(() => {
//   console.log('FollowOverview.vue');
// });
</script>

<template>
  <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-10">
    <template v-for="item in items" :key="item.title">
      <Card class="w-full">
        <CardContent class="flex items-center justify-between p-4">
          <!-- 左侧标题 -->
          <div class="space-y-0.5">
            <h3
              class="text-muted-foreground text-sm font-medium tracking-tight"
            >
              {{ item.status }}
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

    <template v-for="item in typeItems" :key="item.title">
      <Card class="w-full">
        <CardContent class="flex items-center justify-between p-4">
          <!-- 左侧标题 -->
          <div class="space-y-0.5">
            <h3
              class="text-muted-foreground text-sm font-medium tracking-tight"
            >
              {{ item.type }}
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
