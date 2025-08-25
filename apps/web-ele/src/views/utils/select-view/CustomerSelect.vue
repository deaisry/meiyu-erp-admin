<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Select } from 'ant-design-vue'; // 或者 element-plus 的 <el-select>
import { requestClient } from '#/api/request';

// 接收表单传入的 props
defineProps<{
  modelValue?: string | number;
  placeholder?: string;
  allowClear?: boolean;
  multiple?: boolean;
}>();

const emit = defineEmits(['update:modelValue']);

// 下拉数据
const options = ref<{ label: string; value: string | number }[]>([]);

// 加载客户数据
async function loadCustomers() {
  try {
    const res = await requestClient.get('/customer/findList');
    if (res?.state === 200 && Array.isArray(res.data)) {
      options.value = res.data.map((item: any) => ({
        label: item.custName,
        value: item.id ?? item.custName, // 可根据后端数据结构调整
      }));
    }
  } catch (e) {
    console.error('加载客户列表失败', e);
  }
}

onMounted(() => {
  loadCustomers();
});
</script>

<template>
  <Select
    :options="options"
    :placeholder="placeholder || '请选择客户'"
    :allowClear="allowClear !== false"
    :mode="multiple ? 'multiple' : undefined"
    :value="modelValue"
    @update:value="val => emit('update:modelValue', val)"
    style="width: 100%"
  />
</template>
