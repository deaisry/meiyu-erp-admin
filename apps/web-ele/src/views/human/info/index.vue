<!--
 * @Author: deaisry
 * @Date: 2025-05-20 11:19:03
 * @LastEditors: e deaisry@163.com
 * @LastEditTime: 2025-05-26 17:53:57
 * @FilePath: \meiyu-erp-admin\apps\web-ele\src\views\human\info\index.vue
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
-->
<script lang="ts" setup>
import type { HumanInfo } from '@vben/types';

import type { VbenFormProps } from '#/adapter/form';
import type { VxeGridProps } from '#/adapter/vxe-table';

import { Page, useVbenDrawer } from '@vben/common-ui';
import {
  departmentOptions,
  employmentTypeOptions,
  genderOptions,
  workStatusOptions,
} from '@vben/types';

import { Button } from 'ant-design-vue';
import dayjs from 'dayjs';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { fetchHumanList } from '#/api/human/human';
import { mapEnumValue } from '#/api/utils/format';
import ExtraDrawer from '#/views/utils/drawer/drawer.vue';

// 编辑抽屉
defineOptions({ name: 'DrawerExample' });

const formOptions: VbenFormProps = {
  // 默认收起
  collapsed: true,
  fieldMappingTime: [['date', ['start', 'end']]],
  schema: [
    {
      component: 'Input',
      defaultValue: '',
      fieldName: 'cnName',
      label: '姓名',
    },
    {
      component: 'Select',
      componentProps: {
        allowClear: true,
        options: departmentOptions,
        placeholder: '请选择',
      },
      fieldName: 'dept',
      label: '部门',
    },
    {
      component: 'Select',
      fieldName: 'sex',
      label: '性别',
      componentProps: {
        allowClear: true,
        options: genderOptions,
        placeholder: '请选择',
      },
    },
    {
      component: 'Select',
      fieldName: 'employeeType',
      label: '用工性质',
      componentProps: {
        allowClear: true,
        options: employmentTypeOptions,
        placeholder: '请选择',
      },
    },
    {
      component: 'Select',
      fieldName: 'isWork',
      label: '在职状态',
      componentProps: {
        allowClear: true,
        options: workStatusOptions,
        placeholder: '请选择',
      },
    },
    // {
    //   component: 'DatePicker',
    //   defaultValue: [dayjs().subtract(7, 'days'), dayjs()],
    //   fieldName: 'enterDate',
    //   label: '入厂时间',
    // },
  ],
  // 控制表单是否显示折叠按钮
  showCollapseButton: true,
  // 是否在字段值改变时提交表单
  submitOnChange: false,
  // 按下回车时是否提交表单
  submitOnEnter: true,
};

const gridOptions: VxeGridProps<HumanInfo> = {
  checkboxConfig: {
    highlight: true,
    labelField: 'name',
  },
  columns: [
    { type: 'checkbox', width: 30 },
    {
      title: '序号',
      type: 'seq',
      width: 50,
    },
    {
      field: 'id',
      title: '工号',
      width: 120,
    },
    {
      field: 'isWork',
      title: '在职状态',
      width: 80,
      formatter: ({ cellValue }) => mapEnumValue(workStatusOptions, cellValue),
    },
    {
      field: 'attendanceId',
      title: '考勤号',
      width: 120,
    },
    {
      field: 'dept',
      title: '部门',
      sortable: true,
      width: 120,
      formatter: ({ cellValue }) => mapEnumValue(departmentOptions, cellValue),
    },
    {
      field: 'cnName',
      title: '姓名',
      width: 100,
    },
    {
      field: 'sex',
      title: '性别',
      formatter: ({ cellValue }) => mapEnumValue(genderOptions, cellValue),
      width: 80,
    },
    {
      field: 'idNbr',
      title: '身份证号',
      width: 180,
    },
    {
      field: 'edu',
      title: '学历',
    },
    {
      field: 'nativePlace',
      title: '籍贯',
      width: 120,
    },
    {
      field: 'ethnicGroup',
      title: '民族',
      width: 100,
    },
    {
      field: 'isMarried',
      title: '婚否',
      formatter: ({ cellValue }) => (cellValue === '1' ? '是' : '否'),
      width: 80,
    },
    {
      field: 'title',
      title: '职务',
      width: 120,
    },
    {
      field: 'employeeType',
      title: '用工性质',
      formatter: ({ cellValue }) =>
        mapEnumValue(employmentTypeOptions, cellValue),
      width: 120,
    },
    {
      field: 'enterDate',
      title: '入厂日期',
      // formatter: ({ cellValue }) =>
      //   dayjs(cellValue).format('YYYY-MM-DD'),
      width: 120,
    },
    {
      field: 'phone',
      title: '联系方式',
      width: 120,
    },
    {
      field: 'address',
      title: '家庭住址',
      width: 200,
    },
    {
      field: 'birthday',
      title: '出生日期',
      formatter: ({ cellValue }) => dayjs(cellValue).format('YYYY-MM-DD'),
      width: 140,
    },
    {
      field: 'action',
      fixed: 'right',
      slots: { default: 'action' },
      title: '操作',
      width: 200,
    },
  ],
  proxyConfig: {
    ajax: {
      query: async ({ page }, formValues) => {
        try {
          debugger;
          const response = await fetchHumanList({
            pageNo: page.currentPage,
            pageSize: page.pageSize,
            ...formValues,
          });
          return {
            items: response.data.records, // 关键字段映射
            total: response.data.total,
          };
        } catch (error) {
          console.error('请求失败:', error);
          return { items: [], total: 0 };
        }
      },
    },
  },
  exportConfig: {},
  height: 'auto',
  keepSource: true,
  pagerConfig: {},
  toolbarConfig: {
    custom: true,
    export: true,
    refresh: true,
    resizable: true,
    // search: true,
    zoom: true,
  },
};

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions,
  gridOptions,
});

const [Drawer, drawerApi] = useVbenDrawer({
  // 连接抽离的组件
  connectedComponent: ExtraDrawer,
});

function open(row) {
  drawerApi
    .setData({
      ...row, // 传递整个行数据
    })
    .open();
}
</script>

<template>
  <Page auto-content-height>
    <Drawer />
    <Grid>
      <template #toolbar-actions>
        <Button class="mr-2" type="primary" @click="() => gridApi.query()">
          刷新当前页面
        </Button>
        <Button type="primary" @click="() => gridApi.reload()">
          刷新并返回第一页
        </Button>
      </template>
      <template #action="{ row }">
        <Button type="link" @click="open(row)"> 编辑 </Button>
        <Button type="link">启用</Button>
        <Button type="link">停用</Button>
      </template>
    </Grid>
  </Page>
</template>
