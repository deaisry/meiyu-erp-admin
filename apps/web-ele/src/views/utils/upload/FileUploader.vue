<<<<<<< HEAD
<!-- eslint-disable n/no-extraneous-import -->
=======
<!--
 * @Author: deaisry
 * @Date: 2025-07-05 13:17:29
 * @LastEditors: e deaisry@163.com
 * @LastEditTime: 2025-07-07 19:37:52
 * @FilePath: \meiyu-erp-admin\apps\web-ele\src\views\utils\upload\FileUploader.vue
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
-->
>>>>>>> 88b7d4d35c06e7fe56a66e22046cbd4a341b7479
<script lang="ts" setup>
import type {
  UploadInstance,
  UploadProps,
  UploadRawFile,
  UploadUserFile,
} from 'element-plus';

import { computed, ref, watch } from 'vue';

// 引入vue-office预览组件
import VueOfficeDocx from '@vue-office/docx';
import VueOfficeExcel from '@vue-office/excel';
import VueOfficePdf from '@vue-office/pdf';
import {
  ElButton,
  ElDialog,
  ElMessage,
  ElMessageBox,
  ElUpload,
  genFileId,
} from 'element-plus';

import { upload_file_url } from '#/api/utils/upload';
// 接收父组件参数
const props = defineProps<{
  buttonText?: string;
  limit?: number;
  multiple?: boolean;
  uploadButtonText?: string;
  uploadUrl: string;
}>();
const emit = defineEmits<{
  error: [file: UploadUserFile, error: any];
  success: [file: UploadUserFile, response: any];
}>();
// 请根据实际路径修改
const isUploading = ref(false);
const fileList = ref<UploadUserFile[]>([]);
const previewVisible = ref(false);
const previewFileUrl = ref('');
const currentPreviewType = ref(''); // 'docx' | 'xlsx' | 'pdf'
const upload = ref<UploadInstance>();
// 支持的预览文件类型映射
const previewComponents = {
  docx: VueOfficeDocx,
  xlsx: VueOfficeExcel,
  pdf: VueOfficePdf,
};
const hasFiles = ref(false);
// 计算当前预览组件
const previewComponent = computed(() => {
  return previewComponents[
    currentPreviewType.value as keyof typeof previewComponents
  ];
});

// 释放预览文件URL
function revokePreviewUrl() {
  if (previewFileUrl.value && previewFileUrl.value.startsWith('blob:')) {
    URL.revokeObjectURL(previewFileUrl.value);
  }
}

// 文件预览处理
const handlePreview: UploadProps['onPreview'] = (file) => {
  // 关闭之前的预览（如有）
  previewVisible.value = false;

  // 确保之前的URL被释放
  revokePreviewUrl();

  // 获取文件后缀并转换为小写
  const fileExt = file.name?.split('.').pop()?.toLowerCase() || '';

  // 检查文件格式是否支持预览
  const supportTypes = ['docx', 'xlsx', 'pdf'];
  if (!supportTypes.includes(fileExt)) {
    ElMessage.warning('不支持预览该文件格式');
    return;
  }

  // 获取文件的预览URL
  let previewUrl = '';
  if (file.url) {
    previewUrl = file.url;
  } else if (file.raw) {
    previewUrl = URL.createObjectURL(file.raw);
  } else {
    ElMessage.warning('无法获取文件内容');
    return;
  }

  // 设置预览参数
  previewFileUrl.value = previewUrl;
  currentPreviewType.value = fileExt;
  previewVisible.value = true;
};

// 对话框关闭处理
const closePreview = () => {
  revokePreviewUrl();
  previewVisible.value = false;
};

const handleRemove: UploadProps['onRemove'] = (file, uploadFiles) => {
  console.log('Removed:', file);
};

const handleExceed: UploadProps['onExceed'] = (files, uploadFiles) => {
  upload.value!.clearFiles();
  const file = files[0] as UploadRawFile;
  file.uid = genFileId();
  upload.value!.handleStart(file);
};

const beforeRemove: UploadProps['beforeRemove'] = (file, fileList) => {
  return ElMessageBox.confirm(`确定取消上传 ${file.name} 吗?`).then(
    () => true,
    () => false,
  );
};

// 手动上传按钮事件处理
const handleManualUpload = async () => {
  if (fileList.value.length === 0) {
    ElMessage.warning('请先选择文件');
    return;
  }

  isUploading.value = true;

  try {
    for (const file of fileList.value) {
      if (file.status === 'success') continue;

      const uploadOptions = {
        file: file.raw || file,
        onProgress: (progress: { percent: number }) => {
          file.percentage = progress.percent;
          file.status = 'uploading';
        },
        onSuccess: (response: any) => {
          file.status = 'success';
          emit('success', file, response);
        },
        onError: (error: any) => {
          file.status = 'fail';
          emit('error', file, error);
        },
      };

      await customUpload(uploadOptions);
    }

    ElMessage.success('文件上传成功');
  } catch (error) {
    ElMessage.error(`上传过程中发生错误: ${error.message}`);
  } finally {
    isUploading.value = false;
  }
};
const customUpload: UploadProps['httpRequest'] = async (options) => {
  debugger;
  const { file, onProgress, onSuccess } = options;
  try {
    await upload_file_url({
      file,
      url: props.uploadUrl,
      onProgress: (progress: { percent: number }) => {
        onProgress?.({ percent: progress.percent });
      },
      onSuccess: (data) => {
        onSuccess?.(data);
        emit('success', file, data);
        isUploading.value = false;
        hasFiles.value = false;
      },
    });
  } catch (error_) {
    const error = error_ instanceof Error ? error_ : new Error(String(error_));
    ElMessage.error(`上传异常: ${error.message}`);
    emit('error', file, error);
  }
};
// 监听文件列表变化
watch(
  fileList,
  (newList) => {
    hasFiles.value = newList.length > 0;
  },
  { deep: true },
);
</script>

<template>
  <!-- 左侧：上传文件按钮 -->
  <ElUpload
    v-model:file-list="fileList"
    :multiple="props.multiple ?? true"
    :on-preview="handlePreview"
    :on-remove="handleRemove"
    :before-remove="beforeRemove"
    :limit="props.limit ?? 3"
    :on-exceed="handleExceed"
    :auto-upload="false"
    :http-request="customUpload"
    class="employee-uploader"
  >
    <template #trigger>
      <ElButton type="primary" class="select-button">
        {{ props.buttonText || '上传员工信息' }}
      </ElButton>
    </template>
    <ElButton
      class="ml-3"
      v-if="hasFiles"
      type="success"
      :disabled="isUploading"
      :loading="isUploading"
      @click="handleManualUpload"
    >
      {{ props.uploadButtonText || '开始上传' }}
    </ElButton>
  </ElUpload>

  <!-- 文件预览对话框 -->
  <ElDialog
    v-model="previewVisible"
    :title="`文件预览 - ${previewFileUrl}`"
    width="80%"
    top="5vh"
    @close="closePreview"
  >
    <!-- 根据文件类型动态加载预览组件 -->
    <component
      v-if="previewComponent && previewFileUrl"
      :is="previewComponent"
      :src="previewFileUrl"
      style="height: 70vh"
    />
    <div v-else>加载预览失败</div>
  </ElDialog>
</template>
