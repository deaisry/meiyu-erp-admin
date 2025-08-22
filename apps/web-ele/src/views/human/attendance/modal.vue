<script lang="ts" setup>
import { useVbenModal } from '@vben/common-ui';
import { ElDatePicker, ElButton, ElMessage } from 'element-plus';
import { ref } from 'vue';
import { downloadAttendace } from '#/api/human/attendance'; // 调用封装好的下载函数
import type { MonthPicker } from '@vben/types';

const [Modal, modalApi] = useVbenModal();
const selectMonth = ref<string>(''); // 只存一个月份
const loading = ref(false);

/**
 * 处理下载
 */
const handleDownload = async () => {
  if (!selectMonth.value) {
    ElMessage.warning('请选择月份');
    return;
  }

  loading.value = true;
  try {
    await downloadAttendace({
      month: selectMonth.value, // 假设后端接收字段是 month
    } as MonthPicker);

    ElMessage.success('下载成功');
    modalApi.close();
  } catch (error) {
    ElMessage.error('下载失败，请稍后再试');
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <Modal title="下载考勤数据" width="400px" :footer="false">
    <div class="flex flex-col gap-4">
      <span>请选择下载月份</span>
      <ElDatePicker
        v-model="selectMonth"
        type="month"
        placeholder="选择月份"
        value-format="YYYY-MM"
      />
      <div class="flex justify-end gap-2 mt-4">
        <ElButton @click="modalApi.close()">取消</ElButton>
        <ElButton
          type="primary"
          :loading="loading"
          @click="handleDownload"
        >
          下载
        </ElButton>
      </div>
    </div>
  </Modal>
</template>

<style scoped>
.flex {
  display: flex;
}
.flex-col {
  flex-direction: column;
}
.gap-4 {
  gap: 1rem;
}
.justify-end {
  justify-content: flex-end;
}
.gap-2 {
  gap: 0.5rem;
}
.mt-4 {
  margin-top: 1rem;
}
</style>
