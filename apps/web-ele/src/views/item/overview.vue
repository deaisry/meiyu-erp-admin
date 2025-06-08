<script lang="ts" setup>
import { computed } from 'vue';

import FollowOverview from './FollowOverview.vue';

const props = defineProps<{
  followList: Array<{ cnt: number; status: string }>;
}>();

const overviewItems = computed(() => props.followList);
</script>

<template>
  <div class="p-5">
    <FollowOverview :items="overviewItems" />
  </div>
</template>
