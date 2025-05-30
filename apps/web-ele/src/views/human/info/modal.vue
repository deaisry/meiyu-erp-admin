<script lang="ts" setup>
import { useVbenModal } from '@vben/common-ui';

import { message } from 'ant-design-vue';
import {
  departmentOptions,
  educationOptions,
  employmentTypeOptions,
  genderOptions,
  marryOptions,
  workStatusOptions,
} from '@vben/types';
import { useVbenForm } from '#/adapter/form';

defineOptions({
  name: 'FormModel',
});

const [Form, formApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
  },
  layout: 'vertical',
  schema: [
    {
      component: 'Label',
      // componentProps: {
      //   disabled: true,
      //   placeholder: '系统自动生成',
      // },
      fieldName: 'id',
      label: '工号',
    },
    {
      component: 'RadioGroup',
      fieldName: 'isWork',
      label: '在职状态',
      componentProps: {
        options: workStatusOptions,
      },
    },
    {
      component: 'Input',
      componentProps: {
        disabled: true,
        placeholder: '系统自动生成',
      },
      fieldName: 'attendanceId',
      label: '考勤号',
    },
    {
      component: 'Select',
      componentProps: {
        options: departmentOptions,
        placeholder: '请选择部门',
        allowClear: true,
        filterOption: true,
        showSearch: true,
      },
      fieldName: 'dept',
      label: '部门',
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入姓名',
      },
      fieldName: 'cnName',
      label: '姓名',
    },
    {
      component: 'RadioGroup',
      componentProps: {
        options: genderOptions,
      },
      fieldName: 'sex',
      label: '性别',
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入身份证号',
      },
      fieldName: 'idNbr',
      label: '身份证号',
    },
    {
      component: 'Select',
      componentProps: {
        options: educationOptions,
        placeholder: '请选择学历',
        showSearch: true,
      },
      fieldName: 'edu',
      label: '学历',
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入籍贯',
      },
      fieldName: 'nativePlace',
      label: '籍贯',
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入民族',
      },
      fieldName: 'ethnicGroup',
      label: '民族',
    },
    {
      component: 'RadioGroup',
      componentProps: {
        options: marryOptions,
      },
      fieldName: 'isMarried',
      label: '婚姻状况',
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入职务',
      },
      fieldName: 'title',
      label: '职务',
    },
    {
      component: 'Select',
      componentProps: {
        options: employmentTypeOptions,
      },
      fieldName: 'employeeType',
      label: '用工性质',
    },
    {
      component: 'DatePicker',
      componentProps: {
        format: 'YYYY-MM-DD',
        valueFormat: 'YYYY-MM-DD',
        placeholder: '请选择入职日期',
      },
      fieldName: 'enterDate',
      label: '入职日期',
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入联系方式',
      },
      fieldName: 'phone',
      label: '联系方式',
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入详细地址',
        autoSize: { minRows: 2 },
      },
      fieldName: 'address',
      label: '家庭住址',
    },
    {
      component: 'DatePicker',
      componentProps: {
        format: 'YYYY-MM-DD',
        valueFormat: 'YYYY-MM-DD',
        placeholder: '请选择出生日期',
      },
      fieldName: 'birthday',
      label: '出生日期',
    },
  ],
  wrapperClass: 'grid grid-cols-2 gap-4',
  showDefaultActions: true,
});

const [Modal, modalApi] = useVbenModal({
  fullscreenButton: false,
  onCancel() {
    modalApi.close();
  },
  onConfirm: async () => {
    await formApi.validateAndSubmitForm();
    // modalApi.close();
  },
  onOpenChange(isOpen: boolean) {
    debugger;
    if (isOpen) {
      const initialData = modalApi.getData<Record<string, any>>() || {};
      formApi.setValues(initialData);
    }
  },
  title: '内嵌表单示例',
});

// function onSubmit(values: Record<string, any>) {
//   message.loading({
//     content: '正在提交中...',
//     duration: 0,
//     key: 'is-form-submitting',
//   });
//   modalApi.lock();
//   setTimeout(() => {
//     modalApi.close();
//     message.success({
//       content: `提交成功：${JSON.stringify(values)}`,
//       duration: 2,
//       key: 'is-form-submitting',
//     });
//   }, 3000);
// }
</script>
<template>
  <Modal>
    <Form />
  </Modal>
</template>
