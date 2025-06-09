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
    <Transition name="fade">
      <div
        v-if="visible"
        class="confirm-dialog-overlay"
        @click.self="handleOverlayClick"
      >
        <div class="confirm-dialog">
          <div class="confirm-dialog-header">
            <h3>确认删除</h3>
          </div>

          <div class="confirm-dialog-body">
            <div class="icon-wrapper">
              <svg class="warning-icon" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M12,2L1,21H23M12,6l7.53,13H4.47M11,10v4h2v-4h-2m0,6v2h2v-2h-2Z"
                />
              </svg>
            </div>
            <!-- <p>{{ message }}</p> -->
          </div>

          <div class="confirm-dialog-footer">
            <button class="cancel-btn" @click="cancel">取消</button>
            <button class="confirm-btn" @click="confirm">确认删除</button>
          </div>
        </div>
      </div>
    </Transition>
  </Modal>
</template>
<style scoped></style>
