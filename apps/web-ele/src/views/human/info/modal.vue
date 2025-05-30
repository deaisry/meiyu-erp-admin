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
} from '@vben/types'; // 请根据实际路径调整

// 定义完整的字段映射配置
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
  { key: 'address', label: '家庭住址' },
  { key: 'birthday', label: '出生日期' },
  { key: 'dept', label: '部门', options: departmentOptions },
  { key: 'isWork', label: '在职状态', options: workStatusOptions },
];

const data = ref<Record<string, any>>({});

// 计算属性：生成带描述信息的显示数据
const displayData = computed(() => {
  return fieldConfig.map((item) => {
    const value = data.value?.[item.key] ?? '';
    let displayValue = value;

    // 处理枚举值转换
    if (item.options && value !== undefined && value !== null) {
      const option = item.options.find(
        (opt) => String(opt.value) === String(value),
      );
      displayValue = option ? option.label : value;
    }

    return {
      label: item.label,
      value: displayValue || '未填写',
      key: item.key,
    };
  });
});

const [Modal, modalApi] = useVbenModal({
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
    <div class="info-container">
      <div v-for="(item, index) in displayData" :key="index" class="info-row">
        <div class="info-label">{{ item.label }}</div>
        <div
          class="info-value"
          :class="{
            'status-active': item.key === 'isWork' && data.isWork === '1',
            'status-inactive': item.key === 'isWork' && data.isWork !== '1',
          }"
        >
          {{ item.value }}
        </div>
      </div>
    </div>
  </Modal>
</template>

<style scoped>
.info-container {
  padding: 16px;
}

.info-row {
  display: flex;
  margin-bottom: 16px;
  padding-bottom: 16px;
  /* border-bottom: 1px dashed #f0f0f0; */
}

.info-label {
  width: 120px;
  font-weight: 500;
  flex-shrink: 0;
}

.info-value {
  flex: 1;
}
</style>
