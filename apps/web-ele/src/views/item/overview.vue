<script lang="ts" setup>
import { computed } from 'vue';

import FollowOverview from './FollowOverview.vue';

const props = defineProps<{
  followList: Array<{ cnt: number; status: string }>;
  typeList: Array<{ cnt: number; type: string }>;
}>();

const statusOverviewItems = computed(() => props.followList);
const typeOverviewItems = computed(() => props.typeList);
</script>

<template>
  <div class="p-5">
    <FollowOverview
      :items="statusOverviewItems"
      :type-items="typeOverviewItems"
    />
  </div>
</template>
