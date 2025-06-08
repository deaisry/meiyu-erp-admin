<script lang="ts" setup>
import { computed } from 'vue';

import { Progress } from 'ant-design-vue';

const props = defineProps({
  progress: {
    type: Number,
    required: true,
    default: 0,
    validator: (value: number) => value >= 0 && value <= 100,
  },
});

const status = computed(() => {
  if (props.progress >= 100) return 'success';
  if (props.progress > 0) return 'active';
  return 'normal';
});
</script>

<template>
  <Progress
    :percent="progress"
    :status="status"
    size="small"
    :stroke-width="15"
    class="progress-bar"
  />
</template>

<style scoped>
.progress-bar {
  min-width: 80px;
}
</style>
