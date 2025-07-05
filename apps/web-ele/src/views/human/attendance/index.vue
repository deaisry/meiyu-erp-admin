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
import { message } from 'ant-design-vue';

// 导入上传方法
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
    :limit="5"
    button-text="上传员工信息"
    :multiple="true"
    <!-- @success="handleSuccess"
    @error="handleError" --
>
  />
</fileuploader>
</template>
