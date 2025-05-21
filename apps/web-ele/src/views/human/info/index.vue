<script lang="ts" setup>
import type { VxeGridProps } from '#/adapter/vxe-table';
import { message } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { Button } from 'ant-design-vue';
import type { HumanInfo } from '@vben/types'
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { fetchHumanList } from '#/api/human/human';


const [QueryForm] = useVbenForm({
  // 默认展开
  collapsed: false,
  // 所有表单项共用，可单独在表单内覆盖
  commonConfig: {
    // 所有表单项
    componentProps: {
      class: 'w-full',
    },
  },
  // 提交函数
  handleSubmit: onSubmit,
  // 垂直布局，label和input在不同行，值为vertical
  // 水平布局，label和input在同一行
  layout: 'horizontal',
  schema: [
    {
      // 组件需要在 #/adapter.ts内注册，并加上类型
      component: 'Input',
      // 对应组件的参数
      componentProps: {
        placeholder: '请输入用户名',
      },
      // 字段名
      fieldName: 'username',
      // 界面显示的label
      label: '字符串',
    },
    {
      component: 'InputPassword',
      componentProps: {
        placeholder: '请输入密码',
      },
      fieldName: 'password',
      label: '密码',
    },
    {
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入',
      },
      fieldName: 'number',
      label: '数字(带后缀)',
      suffix: () => '¥',
    },
    {
      component: 'Select',
      componentProps: {
        allowClear: true,
        filterOption: true,
        options: [
          {
            label: '选项1',
            value: '1',
          },
          {
            label: '选项2',
            value: '2',
          },
        ],
        placeholder: '请选择',
        showSearch: true,
      },
      fieldName: 'options',
      label: '下拉选',
    },
    {
      component: 'DatePicker',
      fieldName: 'datePicker',
      label: '日期选择框',
    },
  ],
  // 是否可展开
  showCollapseButton: true,
  submitButtonOptions: {
    content: '查询',
  },
  wrapperClass: 'grid-cols-1 md:grid-cols-2',
});
function onSubmit(values: Record<string, any>) {
  message.success({
    content: `form values: ${JSON.stringify(values)}`,
  });
}

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
      formatter: ({ cellValue }) => (cellValue === '1' ? '是' : '否'),
      width: 80,
    },
    // {
    //   field: 'idNbr',
    //   title: '身份证号',
    //   width: 180
    // },
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
    // {
    //   field: 'address',
    //   title: '家庭住址',
    //   width: 200
    // },
    // {
    //   field: 'birthday',
    //   title: '出生日期',
    //   formatter: ({ cellValue }) =>
    //     dayjs(cellValue).format('YYYY-MM-DD'),
    //   width: 120
    // },
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
  exportConfig: {},
  // height: 'auto', // 如果设置为 auto，则必须确保存在父节点且不允许存在相邻元素，否则会出现高度闪动问题
  keepSource: true,
  proxyConfig: {
    ajax: {
      query: async ({ page }) => {
        try {
          debugger;
          const response = await fetchHumanList({
            current: page.currentPage,
            size: page.pageSize
          });
          return {
            items: response.data.records, // 关键字段映射
            total: response.data.total
          };
        } catch (error) {
          console.error('请求失败:', error);
          return { items: [], total: 0 };
        }
      }
    }
  },

  toolbarConfig: {
    custom: true,
    export: true,
    // import: true,
    refresh: true,
    zoom: true,
  },
};

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions,
});
</script>

<template>
  <QueryForm />
  <div class="vp-raw w-full">
    <Grid>
      <template #toolbar-tools>
        <Button class="mr-2" type="primary" @click="() => gridApi.query()">
          刷新当前页面
        </Button>
        <Button type="primary" @click="() => gridApi.reload()">
          刷新并返回第一页
        </Button>
      </template>
    </Grid>
  </div>
</template>
