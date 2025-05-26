<script lang="ts" setup>
import { nextTick, ref, watch } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';
import {
  departmentOptions,
  educationOptions,
  employmentTypeOptions,
  genderOptions,
  marryOptions,
  workStatusOptions,
} from '@vben/types';

import { message } from 'ant-design-vue';
import dayjs from 'dayjs';

import { useVbenForm } from '#/adapter/form';
import { submitHumanInfo } from '#/api/human/human';

const data = ref();

const [Drawer, drawerApi] = useVbenDrawer({
  onCancel() {
    drawerApi.close();
  },
  onConfirm() {
    // todo
    const response = await submitHumanInfo(data);
    console.log(response);
  },
  onOpenChange(isOpen: boolean) {
    if (isOpen) {
      debugger;
      // 确保DOM更新后设置数据
      nextTick().then(() => {
        const rowData = drawerApi.getData<Record<string, any>>();
        data.value = rowData;
        // updateFormModel(rowData)
      });
    } else {
      // resetForm()
    }
  },
});

const [BaseForm, formApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
  },
  handleSubmit: onSubmit,
  layout: 'vertical',
  schema: [
    {
      component: 'Input',
      componentProps: {
        disabled: true,
        placeholder: '系统自动生成',
      },
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
  // // 初始化空表单模型
  // model: {},
  wrapperClass: 'grid grid-cols-2 gap-4',
  showDefaultActions: false,
});

function onSubmit(values: Record<string, any>) {
  // 转换日期格式
  const formattedValues = {
    ...values,
    enterDate: dayjs(values.enterDate).format('YYYY-MM-DD'),
    birthday: values.birthday
      ? dayjs(values.birthday).format('YYYY-MM-DD')
      : null,
  };

  message.success({
    content: `提交数据：${JSON.stringify(formattedValues)}`,
  });
}
// 监听数据变化同步到表单
watch(
  data,
  (newVal) => {
    formApi.setValues(newVal);
  },
  { deep: true },
);
</script>
<template>
  <Drawer title="员工信息" width="680">
    <BaseForm v-model:model="data" />
  </Drawer>
</template>
