<script lang="ts" setup>
import { ElCard, ElCol, ElRow } from 'element-plus';
</script>

<template>
  <ElRow :gutter="12">
    <ElCol :span="8">
      <ElCard shadow="always"> 总是显示 </ElCard>
    </ElCol>
    <ElCol :span="8">
      <ElCard shadow="hover"> 鼠标悬浮时显示 </ElCard>
    </ElCol>
    <ElCol :span="8">
      <ElCard shadow="never"> 从不显示 </ElCard>
    </ElCol>
  </ElRow>
</template>

<style>
.text {
  font-size: 14px;
}

.item {
  padding: 18px 0;
}

.box-card {
  width: 480px;
}
</style>
