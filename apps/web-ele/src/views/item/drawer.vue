<script lang="ts" setup>
import type { HumanInfo, ItemInfo } from '@vben/types';

import { ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';
import {
  departmentOptions,
  itemRelaTypeOptions,
  itemTypeOptions,
} from '@vben/types';
import {processFormParams} from '#/api/human/human'
import DepartmentEmployeeSelect from '#/views/utils/DepartmentEmployeeSelect.vue';
import { message } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { submitItemInfo } from '#/api/item/item';
// import { isEqual } from 'lodash-es';

const isDirty = ref(false); // 记录数据是否被修改
const isInitializing = ref(false); // 标记是否处于初始化阶段
const participantsProps = ref({
  autoLoad: true,
  placeholder: '请选择人员',
  multiple: true,
  filterable: true,
  clearable: true,
  useWorkIdMode: true, // 确保是工号模式，这样组件返回的是工号数组
});
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
      debugger;
      const submitItems = processFormParams((await formApi.submitForm()),['follower', 'responsibleP'] as const);
      const response = await submitItemInfo(submitItems as ItemInfo);
      if(response.state === 200){
        message.success('提交成功');
      }else{
        message.error('提交失败');
      }
      formApi.resetForm();
      isDirty.value = false; // 提交后重置脏状态
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
  title: '事项信息',
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
      component:'Input',
      fieldName:'itemId',
      label:'事项编号',
      componentProps: {
        disabled: true,
        placeholder: '系统自动生成',
      },
    },
    {
      component: 'Input',
      defaultValue: '',
      fieldName: 'itemName',
      label: '事项名称',
    },
    {
      component: 'Select',
      componentProps: {
        allowClear: true,
        options: itemRelaTypeOptions,
        placeholder: '请选择',
      },
      fieldName: 'relaType',
      label: '关联类型',
    },
    {
      component: 'Select',
      componentProps: {
        allowClear: true,
        options: itemTypeOptions,
        placeholder: '请选择',
      },
      fieldName: 'itemType',
      label: '事项类型',
    },
    {
      component: 'Select',
      componentProps: {
        allowClear: true,
        options: departmentOptions,
        placeholder: '请选择',
      },
      fieldName: 'dept',
      label: '责任部门',
    },
    {
      component: DepartmentEmployeeSelect,
      fieldName: 'responsibleP',
      label: '负责人',
      componentProps: {
        ...participantsProps.value,
      },
        // 正确的值转换方式
  valueModifier: {
    get: (value) => {
      if (typeof value === 'string') {
        return value.split(',').filter(Boolean);
      }
      return value || [];
    },
    set: (value) => {
      return Array.isArray(value) ? value.join(',') : value;
    }
  }
    },
{
  component: DepartmentEmployeeSelect,
  fieldName: 'follower',
  label: '跟进人',
  componentProps: {
    ...participantsProps.value,
  },
  // 正确的值转换方式
  valueModifier: {
    get: (value) => {
      if (typeof value === 'string') {
        return value.split(',').filter(Boolean);
      }
      return value || [];
    },
    set: (value) => {
      return Array.isArray(value) ? value.join(',') : value;
    }
  }
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
