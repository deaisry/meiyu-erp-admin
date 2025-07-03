<!--
 * @Author: deaisry
 * @Date: 2025-05-20 11:19:04
 * @LastEditors: e deaisry@163.com
 * @LastEditTime: 2025-06-29 18:35:55
 * @FilePath: \meiyu-erp-admin\apps\web-ele\src\views\human\attendance\index.vue
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
-->
<script lang="ts" setup>
import type { UploadProps, UploadUserFile } from 'element-plus';

import { ref } from 'vue';

import { ElButton, ElMessage, ElMessageBox, ElUpload } from 'element-plus';

import { upload_file_url } from '#/api/utils/upload'; // 导入上传方法
import ReusableUpload from '#/views/utils/upload/ReusableUpload.vue';

const attendanceUploadUrl = '/human/import';
const employeeUploadUrl = '/employee/import';

const fileList = ref<UploadUserFile[]>([]);

const handleRemove: UploadProps['onRemove'] = (file, uploadFiles) => {
  console.log(file, uploadFiles);
};

const handlePreview: UploadProps['onPreview'] = (uploadFile) => {
  console.log(uploadFile);
};

const handleExceed: UploadProps['onExceed'] = (files, uploadFiles) => {
  ElMessage.warning(
    `The limit is 3, you selected ${files.length} files this time, add up to ${
      files.length + uploadFiles.length
    } totally`,
  );
};

const beforeRemove: UploadProps['beforeRemove'] = (uploadFile, uploadFiles) => {
  return ElMessageBox.confirm(`确定取消上传 ${uploadFile.name} 吗?`).then(
    () => true,
    () => false,
  );
};

// 自定义上传方法
const customUpload: UploadProps['httpRequest'] = async (options) => {
  const { file, onProgress, onSuccess, onError } = options;

  try {
    // 调用自定义上传方法
    await upload_file_url({
      file,
      url: '/human/import', // 替换为实际的上传API地址
      onProgress: (progress: { percent: any }) => {
        // 调用Element的进度回调
        onProgress?.({ percent: progress.percent });
      },
      onSuccess: (data, file) => {
        // 调用Element的成功回调
        onSuccess?.(data, file);
      },
      onError: (error) => {
        // 调用Element的错误回调
        onError?.(error);
        ElMessage.error(`上传失败: ${error.message}`);
      },
    });
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    onError?.(err);
    ElMessage.error(`上传异常: ${err.message}`);
  }
};
defineExpose({
  fileList,
  clearFiles: () => {
    fileList.value = [];
    emit('file-change', fileList.value);
  },
  submitUpload: () => {
    // 如果需要手动触发上传，可以调用此方法
    // 注意：这需要与autoUpload=false配合使用
  },
});
</script>
<template>
  <ElUpload
    v-model:file-list="fileList"
    multiple
    :on-preview="handlePreview"
    :on-remove="handleRemove"
    :before-remove="beforeRemove"
    :limit="3"
    :on-exceed="handleExceed"
    :auto-upload="true"
    :http-request="customUpload"
  >
    <ElButton type="primary">上传文件</ElButton>
  </ElUpload>
  <ReusableUpload
    :upload-url="employeeUploadUrl"
    button-text="上传员工信息"
    :limit="1"
    accept=".xlsx,.xls,.csv"
  />
</template>
