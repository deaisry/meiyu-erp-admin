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
import { fi } from 'element-plus/es/locales.mjs';
// import { isEqual } from 'lodash-es';

const isDirty = ref(false);         // 记录数据是否被修改
const isInitializing = ref(false);  // 标记是否处于初始化阶段

const [Drawer, drawerApi] = useVbenDrawer({
  destroyOnClose: true,
  onCancel() {
    drawerApi.close();
  },
async onConfirm() {
    try {
      if(!isDirty.value){
        drawerApi.close();
        return;
      }
      await submitHumanInfo(await formApi.submitForm());
      message.success('提交成功');
      formApi.resetForm();
      isDirty.value = false; // 提交后重置脏状态
      drawerApi.close();
    } catch (error) {
      drawerApi.close();
      message.error('提交失败');
    }
  },
  onOpenChange(isOpen: boolean) {
    if (isOpen) {
      isInitializing.value = true; // 标记初始化开始
      const initialData = drawerApi.getData<Record<string, any>>() || {};
      formApi.setValues(initialData);
    }else{
          formApi.resetForm();
          isDirty.value = false;
    }
  },
  title: "员工信息"
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
  showDefaultActions: false,
  handleValuesChange(_values, fieldsChanged) {
    if(isInitializing.value){
      // 判断是不是第一次进handleValuesChange
      isInitializing.value = false;
      return;
    }
    isDirty.value = true;
  },
});

</script>
<template>
    <Drawer>
    <Form />
  </Drawer>
</template>


