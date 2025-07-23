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

// 定义字段配置
const fieldConfig = [
  { key: 'id', label: '工号' },
  { key: 'cnName', label: '姓名' },
  { key: 'sex', label: '性别', options: genderOptions },
  { key: 'dept', label: '部门', options: departmentOptions },
  { key: 'title', label: '职务' },
  { key: 'edu', label: '学历', options: educationOptions },
  { key: 'nativePlace', label: '籍贯' },
  { key: 'ethnicGroup', label: '民族' },
  { key: 'dorm', label: '宿舍' }, // 前9个字段
  { key: 'enterDate', label: '入职日期' },
  { key: 'employeeType', label: '用工性质', options: employmentTypeOptions },
  { key: 'idNbr', label: '身份证号' },
  { key: 'phone', label: '联系方式' },
  { key: 'birthday', label: '出生日期' },
  { key: 'isWork', label: '在职状态', options: workStatusOptions },
  { key: 'isMarried', label: '婚姻状况', options: marryOptions },
  { key: 'address', label: '家庭住址' },
];

const data = ref<Record<string, any>>({});

// 计算显示数据（分组为两列）
const groupedDisplayData = computed(() => {
  const items = fieldConfig.map((item, index) => {
    const value = data.value?.[item.key] ?? '';
    let displayValue = value;

    if (item.options && value !== undefined && value !== null) {
      const option = item.options.find(
        (opt) => String(opt.value) === String(value),
      );
      displayValue = option ? option.label : value;
    }

    // 添加索引和类别标识
    return {
      ...item,
      index,
      value: displayValue || '未填写',
    };
  });

  // 将数据分成两列
  const midIndex = Math.ceil(items.length / 2);
  return [items.slice(0, midIndex), items.slice(midIndex)];
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
  <Modal title="人员信息详情" width="800px">
    <div class="modal-container">
      <div class="grid-container">
        <div class="grid-column">
          <div
            v-for="(item, index) in groupedDisplayData[0]"
            :key="index"
            class="data-item"
          >
            <span
              class="label"
              :class="{
                'short-label': item.index < 9,
                'long-label': item.index >= 9,
              }"
              >{{ item.label }}：</span
            >
            <span class="value">{{ item.value }}</span>
          </div>
        </div>
        <div class="grid-column">
          <div
            v-for="(item, index) in groupedDisplayData[1]"
            :key="index"
            class="data-item"
          >
            <span
              class="label"
              :class="{
                'short-label': item.index < 9,
                'long-label': item.index >= 9,
              }"
              >{{ item.label }}：</span
            >
            <span class="value">{{ item.value }}</span>
          </div>
        </div>
      </div>
    </div>
  </Modal>
</template>

<style scoped>
.modal-container {
  padding: 16px;
}

.grid-container {
  display: flex;
  gap: 16px; /* 减少列间距 */
}

.grid-column {
  flex: 1;
}

.data-item {
  display: flex;
  margin-bottom: 6px; /* 大幅减少行间距 */
  line-height: 1.3; /* 减少行高 */
}

/* 标签样式 */
.label {
  white-space: nowrap; /* 确保标签不换行 */
  padding-right: 8px; /* 减少标签右间距 */
}

.label.short-label {
  min-width: 40px;
}

.label.long-label {
  min-width: 80px;
}

/* 值样式 - 紧凑布局 */
.value {
  word-break: break-word; /* 确保长词可以断行 */
  white-space: normal;
  line-height: 1.3; /* 值行高保持一致 */
  flex: 1;
}
</style>
