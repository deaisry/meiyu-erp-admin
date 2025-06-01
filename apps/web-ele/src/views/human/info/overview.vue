<script lang="ts" setup>
import { computed } from 'vue';

import { DeptOverview } from '@vben/common-ui';

// const deptList = inject('deptData', () => [])

const props = defineProps<{
  deptList: Array<{ cnt: number; dept: string }>;
}>();

const overviewItems = computed(() => props.deptList);
</script>

<template>
  <div class="p-5">
    <DeptOverview :items="overviewItems" />
  </div>
</template>
