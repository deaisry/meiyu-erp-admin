<!--
 * @Author: deaisry
 * @Date: 2025-05-20 11:19:03
 * @LastEditors: e deaisry@163.com
 * @LastEditTime: 2025-05-20 17:37:41
 * @FilePath: \vue-vben-admin\apps\web-ele\src\views\human\info\index.vue
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
-->
<script lang="ts" setup>
import type { VxeGridProps } from '#/adapter/vxe-table';

import { Button } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { fetchHumanList } from '#/api/human/human';

interface RowType {
  category: string;
  color: string;
  id: string;
  price: string;
  productName: string;
  releaseDate: string;
}

/**
 * 获取表格数据
 */
// async function getExampleTableApi(params: DemoTableApi.PageFetchParams) {
//   return new Promise<{ items: any; total: number }>((resolve) => {
//     const { page, pageSize } = params;
//     const items = MOCK_API_DATA.slice((page - 1) * pageSize, page * pageSize);

//     sleep(1000).then(() => {
//       resolve({
//         total: items.length,
//         items,
//       });
//     });
//   });
// }

const gridOptions: VxeGridProps<RowType> = {
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
        debugger;
        return await fetchHumanList({
          current: page.currentPage,
          size: page.pageSize,
        });
      },
    },
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
