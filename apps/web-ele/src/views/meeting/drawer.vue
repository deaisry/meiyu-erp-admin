<script lang="ts" setup>
import { ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';
import {
  meetingTypeOptions,
  meetingPlaceOptions,
  meetingConveneOptions,
} from '@vben/types';

import { message } from 'ant-design-vue';
import { ElDatePicker} from 'element-plus';
import { useVbenForm } from '#/adapter/form';
import type {MeetingInfo} from '@vben/types'
import { submitMeetingInfo } from '#/api/meeting/meeting'

// 引入部门员工层级下拉菜单组件
import DepartmentEmployeeSelect from '#/views/utils/DepartmentEmployeeSelect.vue';
const participantsProps = ref({
  autoLoad: true, // 启用自动加载数据
  placeholder: '请选择部门/人员',
  multiple: true,
  filterable: true,
  clearable: true
})

const isDirty = ref(false); // 记录数据是否被修改
const isInitializing = ref(false); // 标记是否处于初始化阶段

const [Drawer, drawerApi] = useVbenDrawer({
  destroyOnClose: true,
  onCancel() {
    drawerApi.close();
  },
  async onConfirm() {
    try {
      if (!isDirty.value) {
        drawerApi.close();
        return;
      }
      const response = submitMeetingInfo((await formApi.submitForm()) as MeetingInfo);
      if((await response).state == 200){
        message.success('提交成功');
        formApi.resetForm();
        isDirty.value = false; // 提交后重置脏状态
      }else{
        message.error('提交失败');
      }

      drawerApi.close();
    } catch {
      drawerApi.close();
      message.error('提交失败');
    }
  },
  onOpenChange(isOpen: boolean) {
    if (isOpen) {
      isInitializing.value = true; // 标记初始化开始
      const initialData = drawerApi.getData<Record<string, any>>() || {};
      formApi.setValues(initialData);
    } else {
      formApi.resetForm();
      isDirty.value = false;
    }
  },
  title: '员工信息',
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
      fieldName: 'meetingId',
      label: '会议编号',
    },
    {
      component: 'RadioGroup',
      fieldName: 'isConvene',
      label: '召开状态',
      componentProps: {
        options: meetingConveneOptions,
      },
    },
    {
      component: 'Select',
      componentProps: {
        options: meetingTypeOptions,
        placeholder: '请选择会议类型',
        allowClear: true,
        filterOption: true,
        showSearch: true,
      },
      fieldName: 'meetingType',
      label: '会议类型',
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入会议名称',
      },
      fieldName: 'meetingName',
      label: '会议名称',
    },
    {
      component: 'Select',
      componentProps: {
        options: meetingPlaceOptions,
      },
      fieldName: 'meetingPlace',
      label: '会议地点',
    },
    {
      component: DepartmentEmployeeSelect,
      fieldName: 'participants',
      label: '与会人员',
      componentProps: participantsProps, // 直接传递 ref 对象
      rules: 'required',
    },
    {
      component: 'DatePicker',
      fieldName: 'meetingTime',
      label: '会议时间',
      componentProps: {
        format: 'YYYY-MM-DD HH:mm',    // 显示格式（不需要秒）
        valueFormat: 'YYYY-MM-DD HH:mm:ss', // 绑定值格式（带秒）
        placeholder: '请选择会议时间',
        type:'datetime',  
      }
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入会议纪要',
      },
      fieldName: 'meetingContent',
      label: '会议纪要',
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '',
      },
      fieldName: 'comment',
      label: '备注',
    },
  ],
  wrapperClass: 'grid grid-cols-2 gap-4',
  showDefaultActions: false,
  // eslint-disable-next-line unused-imports/no-unused-vars
  handleValuesChange(_values, fieldsChanged) {
    if (isInitializing.value) {
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
