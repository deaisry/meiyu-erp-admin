<script lang="ts" setup>
import type { DeptOverviewItem } from '@vben/common-ui';

import {
  DeptOverview,
} from '@vben/common-ui';
const overviewItems: DeptOverviewItem[] = [
{
  title:'业务部',
  value:200
},
...
];
</script>

<template>
  <div class="p-5">
    <DeptOverview :items="overviewItems" />
  </div>
</template>
