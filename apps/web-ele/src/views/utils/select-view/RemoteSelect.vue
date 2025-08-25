<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue';

import { ElOption, ElSelect } from 'element-plus';

import { requestClient } from '#/api/request';

interface Props {
  modelValue?: number | string;
  url: string; // 请求地址
  labelKey?: string; // 后端返回对象的 label 字段
  valueKey?: string; // 后端返回对象的 value 字段
  placeholder?: string; // 占位提示
  clearable?: boolean;
  optionsCache?: boolean; // 是否启用本地缓存
  cacheKey?: string; // 缓存 key（区分不同下拉）
}

const props = withDefaults(defineProps<Props>(), {
  labelKey: 'label',
  valueKey: 'value',
  placeholder: '请选择',
  clearable: true,
  optionsCache: true,
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: number | string | undefined): void;
}>();

const options = ref<{ label: string; value: any }[]>([]);
const loading = ref(false);

async function fetchOptions() {
  // === 1. 如果启用了缓存，先尝试从 localStorage 读取 ===
  if (props.optionsCache) {
    const cacheKey = props.cacheKey || `RemoteSelect:${props.url}`;
    const cacheStr = localStorage.getItem(cacheKey);
    if (cacheStr) {
      try {
        const cacheData = JSON.parse(cacheStr);
        if (Array.isArray(cacheData)) {
          options.value = cacheData;
          return;
        }
      } catch (error) {
        console.warn('RemoteSelect 缓存解析失败:', error);
      }
    }
  }

  // === 2. 请求接口 ===
  loading.value = true;
  try {
    const res = await requestClient.get(props.url);
    if (res?.data) {
      const mapped = res.data.map((item: any) => ({
        label: item[props.labelKey!],
        value: item[props.valueKey!],
      }));
      options.value = mapped;

      // === 3. 缓存到 localStorage ===
      if (props.optionsCache) {
        const cacheKey = props.cacheKey || `RemoteSelect:${props.url}`;
        localStorage.setItem(cacheKey, JSON.stringify(mapped));
      }
    }
  } finally {
    loading.value = false;
  }
}

onMounted(fetchOptions);

watch(
  () => props.url,
  () => {
    // url 变动时重新加载
    fetchOptions();
  },
);

function handleChange(val: any) {
  emit('update:modelValue', val);
}
</script>

<template>
  <ElSelect
    v-bind="$attrs"
    :loading="loading"
    :placeholder="placeholder"
    :clearable="clearable"
    :model-value="modelValue"
    @update:model-value="handleChange"
    style="width: 100%"
  >
    <ElOption
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    />
  </ElSelect>
</template>
