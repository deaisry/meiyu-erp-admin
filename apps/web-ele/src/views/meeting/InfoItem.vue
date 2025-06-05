<!-- InfoItem 子组件 -->
<script setup lang="ts">
const props = defineProps({
  label: {
    type: String,
    required: true
  },
  value: {
    type: [String, Number],
    required: true
  },
  icon: {
    type: String,
    default: 'info'
  }
});
</script>

<template>
  <div class="info-item">
    <div class="info-label">
      <i :class="`el-icon-${icon}`"></i>
      <span>{{ label }}</span>
    </div>
    <div class="info-value">{{ value }}</div>
  </div>
</template>

<style scoped>
.info-item {
  display: flex;
  flex-direction: column;
}

.info-label {
  display: flex;
  align-items: center;
  margin-bottom: 4px;
  font-size: 0.9rem;
}

.info-label i {
  margin-right: 6px;
  font-size: 1.1rem;
}

.info-value {
  font-size: 1.05rem;
  font-weight: 500;
}
</style>
