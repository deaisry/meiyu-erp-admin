<script lang="ts" setup>
import { computed, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';
import {
  departmentOptions,
  educationOptions,
  employmentTypeOptions,
  genderOptions,
  marryOptions,
  workStatusOptions,
} from '@vben/types';

import { ElDescriptions, ElDescriptionsItem } from 'element-plus';

// 定义字段配置
const fieldConfig = [
  { key: 'id', label: '工号' },
  { key: 'attendanceId', label: '考勤号' },
  { key: 'cnName', label: '姓名' },
  { key: 'sex', label: '性别', options: genderOptions },
  { key: 'idNbr', label: '身份证号' },
  { key: 'edu', label: '学历', options: educationOptions },
  { key: 'nativePlace', label: '籍贯' },
  { key: 'ethnicGroup', label: '民族' },
  { key: 'isMarried', label: '婚姻状况', options: marryOptions },
  { key: 'title', label: '职务' },
  { key: 'employeeType', label: '用工性质', options: employmentTypeOptions },
  { key: 'enterDate', label: '入职日期' },
  { key: 'phone', label: '联系方式' },
  { key: 'birthday', label: '出生日期' },
  { key: 'dept', label: '部门', options: departmentOptions },
  { key: 'isWork', label: '在职状态', options: workStatusOptions },
  { key: 'address', label: '家庭住址' },
];

const data = ref<Record<string, any>>({});

// 计算显示数据
const displayData = computed(() => {
  return fieldConfig.map((item) => {
    const value = data.value?.[item.key] ?? '';
    let displayValue = value;

    if (item.options && value !== undefined && value !== null) {
      const option = item.options.find(
        (opt) => String(opt.value) === String(value),
      );
      displayValue = option ? option.label : value;
    }

    return {
      ...item,
      value: displayValue || '未填写',
    };
  });
});

const [Modal, modalApi] = useVbenModal({
  showCancelButton: false,
  showConfirmButton: false,
  onCancel() {
    modalApi.close();
  },
  onConfirm() {
    console.info('onConfirm');
  },
  onOpenChange(isOpen: boolean) {
    if (isOpen) {
      data.value = modalApi.getData<Record<string, any>>();
    }
  },
});
</script>

<template>
  <Modal title="员工信息详情">
    <ElDescriptions :column="2">
      <ElDescriptionsItem
        v-for="(item, index) in displayData"
        :key="index"
        :label="item.label"
      >
        {{ item.value }}
      </ElDescriptionsItem>
    </ElDescriptions>
  </Modal>
</template>
<style scoped></style>
