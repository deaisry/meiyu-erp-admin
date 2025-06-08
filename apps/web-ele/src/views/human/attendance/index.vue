<script lang="ts" setup>
import { Progress } from 'ant-design-vue';
</script>

<template>
  <Progress :percent="30" />
  <Progress :percent="70" status="exception" />
  <Progress :percent="100" />
</template>
