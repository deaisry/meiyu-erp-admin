<script lang="ts" setup>
import type { UploadProps, UploadUserFile } from 'element-plus';

import { ref } from 'vue';

import { ElButton, ElMessage, ElMessageBox, ElUpload } from 'element-plus';

import { upload_file_url } from '#/api/utils/upload'; // 请根据实际路径修改

// 接收父组件参数
const props = defineProps<{
  buttonText?: string;
  limit?: number;
  multiple?: boolean;
  uploadUrl: string;
}>();

const emit = defineEmits<{
  error: [file: UploadUserFile, error: any];
  success: [file: UploadUserFile, response: any];
}>();

const fileList = ref<UploadUserFile[]>([]);

// 事件处理函数
const handleRemove: UploadProps['onRemove'] = (file, uploadFiles) => {
  console.log('Removed:', file);
};

const handlePreview: UploadProps['onPreview'] = (file) => {
  console.log('Preview:', file);
};

const handleExceed: UploadProps['onExceed'] = (files, uploadFiles) => {
  ElMessage.warning(
    `最多上传 ${props.limit || 3} 个文件，你选了 ${files.length} 个，总共 ${
      files.length + uploadFiles.length
    } 个`,
  );
};

const beforeRemove: UploadProps['beforeRemove'] = (file, fileList) => {
  return ElMessageBox.confirm(`确定取消上传 ${file.name} 吗?`).then(
    () => true,
    () => false,
  );
};

// 自定义上传函数
const customUpload: UploadProps['httpRequest'] = async (options) => {
  const { file, onProgress, onSuccess, onError } = options;
  try {
    await upload_file_url({
      file,
      url: props.uploadUrl,
      onProgress: (progress: { percent: number }) => {
        onProgress?.({ percent: progress.percent });
      },
      onSuccess: (data, file) => {
        onSuccess?.(data, file);
        emit('success', file, data);
      },
      onError: (error) => {
        onError?.(error);
        ElMessage.error(`上传失败: ${error.message}`);
        emit('error', file, error);
      },
    });
  } catch (error_) {
    const error = error_ instanceof Error ? error_ : new Error(String(error_));
    onError?.(error);
    ElMessage.error(`上传异常: ${error.message}`);
    emit('error', file, error);
  }
};
</script>

<template>
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
  >
    <ElButton type="primary">{{ props.buttonText ?? '上传文件' }}</ElButton>
  </ElUpload>
</template>
