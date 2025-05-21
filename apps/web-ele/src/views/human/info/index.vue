<script lang="ts" setup>
import type { HumanInfo } from '@vben/types';

import type { VbenFormProps } from '#/adapter/form';
import type { VxeGridProps } from '#/adapter/vxe-table';

import { Page } from '@vben/common-ui';

import dayjs from 'dayjs';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { fetchHumanList } from '#/api/human/human';

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
        options: [
          {
            label: '总经办',
            value: '1',
          },
          {
            label: '业务部',
            value: '2',
          },
        ],
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
        options: [
          {
            label: '男',
            value: '1',
          },
          {
            label: '女',
            value: '0',
          },
        ],
        placeholder: '请选择',
      },
    },
    {
      component: 'Select',
      fieldName: 'employeeType',
      label: '用工性质',
      componentProps: {
        allowClear: true,
        options: [
          {
            label: '正式工',
            value: '1',
          },
          {
            label: '临时工',
            value: '0',
          },
        ],
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
  submitOnChange: true,
  // 按下回车时是否提交表单
  submitOnEnter: false,
};

const gridOptions: VxeGridProps<HumanInfo> = {
  checkboxConfig: {
    highlight: true,
    labelField: 'name',
  },
  columns: [
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
    // {
    //   field: 'attendanceId',
    //   title: '考勤号',
    //   width: 120
    // },
    {
      field: 'dept',
      title: '部门',
      width: 120,
    },
    {
      field: 'cnName',
      title: '姓名',
      width: 100,
    },
    {
      field: 'sex',
      title: '性别',
      formatter: ({ cellValue }) => (cellValue === '1' ? '男' : '女'),
      width: 80,
    },
    {
      field: 'idNbr',
      title: '身份证号',
      width: 180,
    },
    // {
    //   field: 'edu',
    //   title: '学历',
    //   formatter: ({ cellValue }) =>
    //     ({
    //       '1':'初中',
    //       '2':'高中',
    //       '3':'大专',
    //       '4':'本科',
    //       '5':'硕士'
    //     }[cellValue]),
    //   width: 100
    // },
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
    // {
    //   field: 'isMarried',
    //   title: '婚否',
    //   formatter: ({ cellValue }) =>
    //     cellValue === '1' ? '是' : '否',
    //   width: 80
    // },
    {
      field: 'title',
      title: '职务',
      width: 120,
    },
    {
      field: 'employeeType',
      title: '用工性质',
      formatter: ({ cellValue }) => (cellValue === '1' ? '正式工' : '临时工'),
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
      width: 260,
    },
    {
      field: 'birthday',
      title: '出生日期',
      formatter: ({ cellValue }) => dayjs(cellValue).format('YYYY-MM-DD'),
      width: 140,
    },
    // {
    //   field: 'createTime',
    //   title: '创建时间',
    //   formatter: ({ cellValue }) =>
    //     dayjs(cellValue).format('YYYY-MM-DD HH:mm'),
    //   width: 150
    // },
    // {
    //   field: 'updateTime',
    //   title: '更新时间',
    //   formatter: ({ cellValue }) =>
    //     dayjs(cellValue).format('YYYY-MM-DD HH:mm'),
    //   width: 150
    // },
    // {
    //   field: 'deleteFlag',
    //   title: '状态',
    //   formatter: ({ cellValue }) =>
    //     cellValue === '1' ? '已删除' : '正常',
    //   width: 80
    // }
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

const [Grid] = useVbenVxeGrid({
  formOptions,
  gridOptions,
});
</script>

<template>
  <Page auto-content-height>
    <Grid />
  </Page>
</template>
