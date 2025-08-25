<script lang="ts" setup>
import { ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';
import { currencyOptions, materialTypeOptions } from '@vben/types';

import { useVbenForm } from '#/adapter/form';
import RemoteSelect from '#/views/utils/select-view/remoteSelect.vue';

// 这里接收父组件传过来的数据（新增一般为空，编辑时可能有默认值）
const formData = ref<Record<string, any>>({});

// 表单提交
async function handleSubmit(values: Record<string, any>) {
  console.info('提交表单：', values);
  // TODO: 调用后端 API 保存
  modalApi.close();
}

// 配置表单
const [MaterialForm, formApi] = useVbenForm({
  layout: 'horizontal',
  handleSubmit,
  resetButtonOptions: { show: true },
  schema: [
    {
      component: 'Select',
      componentProps: {
        allowClear: true,
        options: materialTypeOptions,
        placeholder: '请选择',
      },
      fieldName: 'materialType',
      label: '物料类型',
      rules: 'required',
    },
    {
      component: 'Input',
      fieldName: 'materialId',
      label: '物料编号',
      componentProps: { placeholder: '请输入物料编号' },
      rules: 'required',
    },
    {
      component: 'Input',
      fieldName: 'supplier',
      label: '供应商',
      componentProps: { placeholder: '请输入供应商' },
    },
    {
      component: RemoteSelect,
      fieldName: 'customer',
      label: '客户',
      componentProps: {
        url: '/custBasicInfo/listName',
        labelKey: 'custName',
        valueKey: 'custId',
        placeholder: '请选择客户',
        optionsCache: false, // 默认已启用
      },
    },
    {
      component: 'Select',
      componentProps: {
        allowClear: true,
        options: currencyOptions,
        placeholder: '请选择',
      },
      fieldName: 'currency',
      label: '币种',
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入原币单价',
      },
      fieldName: 'unitPrice',
      label: '单价',
    },
  ],
  wrapperClass: '.add-modal grid-cols-1 md:grid-cols-2 gap-x-6', // 两列，列间有间距
  submitButtonOptions: { show: false },
});

// 弹窗
const [Modal, modalApi] = useVbenModal({
  onCancel() {
    modalApi.close();
  },
  onConfirm() {
    formApi.submitForm(); // 触发表单提交
  },
  onOpenChange(isOpen: boolean) {
    if (isOpen) {
      const data = modalApi.getData<Record<string, any>>() || {};
      formData.value = data;
      formApi.setValues(data); // 打开时填充表单数据
    }
  },
});
</script>

<template>
  <Modal title="新增 / 编辑物料">
    <MaterialForm />
  </Modal>
</template>

<style lang="css" scoped>
.add-modal {
  /* 设置最小宽度为1000px，确保内容有足够展示空间 */
  min-width: 1000px;
  max-width: 1200px; /* 增加最大宽度限制，避免过宽 */
}
</style>
