<script lang="ts" setup>
import { ref } from 'vue';
import { useVbenModal, type VbenFormProps } from '@vben/common-ui';
const formRef = ref();

// 表单配置 schema，可复用
const formOptions: VbenFormProps = {
  schema: [
    {
      component: 'Input',
      fieldName: 'materialId',
      label: '物料编号',
      componentProps: { placeholder: '请输入物料编号' },
    },
    {
      component: 'Input',
      fieldName: 'supplier',
      label: '供应商',
      componentProps: { placeholder: '请输入供应商' },
    },
    {
      component: 'Input',
      fieldName: 'customer',
      label: '客户',
      componentProps: { placeholder: '请输入客户' },
    },
    {
      component: 'Select',
      fieldName: 'materialType',
      label: '物料类型',
      componentProps: {
        options: [
          { label: '原材料', value: 'raw' },
          { label: '半成品', value: 'semi' },
          { label: '成品', value: 'finished' },
        ],
        placeholder: '请选择物料类型',
        allowClear: true,
      },
    },
  ],
};

const data = ref<Record<string, any>>({});

const [Modal, modalApi] = useVbenModal({
  onCancel() {
    modalApi.close();
  },
  async onConfirm() {
    // 获取表单值
    const values = await formRef.value?.getValues();
    console.info('提交表单：', values);

    // TODO: 调用后端接口
    modalApi.close();
  },
  onOpenChange(isOpen: boolean) {
    if (isOpen) {
      data.value = modalApi.getData<Record<string, any>>();
      // 赋初始值给表单
      formRef.value?.setValues(data.value || {});
    }
  },
});
</script>

<template>
  <Modal title="新增 / 编辑数据">
    <VbenForm ref="formRef" v-bind="formOptions" />
  </Modal>
</template>
