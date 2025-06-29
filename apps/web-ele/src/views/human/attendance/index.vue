<script lang="ts" setup>
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { UploadProps, UploadUserFile } from 'element-plus'
import {ElUpload, ElButton} from 'element-plus'
import { upload_file_url } from '#/api/utils/upload' // 导入上传方法

const fileList = ref<UploadUserFile[]>([])

const handleRemove: UploadProps['onRemove'] = (file, uploadFiles) => {
  console.log(file, uploadFiles)
}

const handlePreview: UploadProps['onPreview'] = (uploadFile) => {
  console.log(uploadFile)
}

const handleExceed: UploadProps['onExceed'] = (files, uploadFiles) => {
  ElMessage.warning(
    `The limit is 3, you selected ${files.length} files this time, add up to ${
      files.length + uploadFiles.length
    } totally`
  )
}

const beforeRemove: UploadProps['beforeRemove'] = (uploadFile, uploadFiles) => {
  return ElMessageBox.confirm(
    `确定取消上传 ${uploadFile.name} 吗?`
  ).then(
    () => true,
    () => false
  )
}

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
      }
    });
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    onError?.(err);
    ElMessage.error(`上传异常: ${err.message}`);
  }
}
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
</template>
