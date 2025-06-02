<script lang="ts" setup>
import type { HumanInfo } from '@vben/types';

import { ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';
import {
  departmentOptions,
  educationOptions,
  employmentTypeOptions,
  genderOptions,
  marryOptions,
  workStatusOptions,
  meetingTypeOptions,
  meetingPlaceOptions,
  meetingConveneOptions,
} from '@vben/types';

import { message } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { submitHumanInfo } from '#/api/human/human';
import { submitMeetingInfo } from '#/api/meeting/meeting'
// import { isEqual } from 'lodash-es';

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
      await submitMeetingInfo((await formApi.submitForm()) as MeetingInfo);
      message.success('提交成功');
      formApi.resetForm();
      isDirty.value = false; // 提交后重置脏状态
      drawerApi.close();
    } catch {
      drawerApi.close();
      message.error('提交失败');
    }
  },
  onOpenChange(isOpen: boolean) {
    debugger;
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
