<script lang="ts" setup>
import FileUploader from '#/views/utils/upload/FileUploader.vue';

const handleSuccess = (file, response) => {
  debugger;
  message.info('上传成功');
  console.log('上传成功:', file.name, response);
};

const handleError = (file, error) => {
  message.error('上传失败');
  console.error('上传失败:', file.name, error);
};
</script>

<template>
  <FileUploader
    upload-url="/human/import"
    button-text="上传员工信息"
    :multiple="true"
    @success="handleSuccess"
    @error="handleError"
  />
</template>
