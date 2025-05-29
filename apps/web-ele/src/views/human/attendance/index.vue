<script lang="ts" setup>
import type { DeptOverviewItem } from '@vben/common-ui';
import { computed } from 'vue'

import {
  DeptOverview,
} from '@vben/common-ui';

// const deptList = inject('deptData', () => [])

const props = defineProps<{
  deptList: Array<{ dept: string; cnt: number }>
}>();
const overviewItems = computed(() => props.deptList);

// const overviewItems: DeptOverviewItem[] = [
// {
//   dept:'业务部',
//   cnt:200
// },
// ...
// ];
</script>

<template>
  <div class="p-5">
    <DeptOverview :items="overviewItems" />
  </div>
</template>
