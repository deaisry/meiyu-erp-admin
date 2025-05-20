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
import { onMounted } from 'vue'
import type { VxeGridListeners, VxeGridProps } from '#/adapter/vxe-table';

import { Button, message } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import type { HumanInfo } from '@vben/types';
import type{ HumanApi} from '#/api/human/human.ts';
import {getHumanInfo} from '#/api/human/human';


const gridOptions: VxeGridProps<HumanInfo> = {
  columns : [
  {
    title: '序号',
    type: 'seq',
    width: 50
  },
  {
    field: 'id',
    title: '工号',
    width: 120
  },
  // {
  //   field: 'attendanceId',
  //   title: '考勤号',
  //   width: 120
  // },
  {
    field: 'dept',
    title: '部门',
    width: 120
  },
  {
    field: 'cnName',
    title: '姓名',
    width: 100
  },
  {
    field: 'sex',
    title: '性别',
    formatter: ({ cellValue }) =>
      cellValue === '1' ? '是' : '否',
    width: 80
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
    width: 120
  },
  {
    field: 'ethnicGroup',
    title: '民族',
    width: 100
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
    width: 120
  },
  {
    field: 'employeeType',
    title: '用工性质',
    width: 120
  },
  {
    field: 'enterDate',
    title: '入厂日期',
    // formatter: ({ cellValue }) =>
    //   dayjs(cellValue).format('YYYY-MM-DD'),
    width: 120
  },
  {
    field: 'phone',
    title: '联系方式',
    width: 120
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
  data: [],
  pagerConfig: {
    enabled: true,
    currentPage: 1,
    pageSize: 10,
    total: 0
  },
  sortConfig: {
    multiple: true,
  },
};

const gridEvents: VxeGridListeners<HumanInfo> = {
  cellClick: ({ row }) => {
    message.info(`cell-click: ${row.cnName}`);
  },
};

const [Grid, gridApi] = useVbenVxeGrid({ gridEvents, gridOptions });

const showBorder = gridApi.useStore((state) => state.gridOptions?.border);
const showStripe = gridApi.useStore((state) => state.gridOptions?.stripe);

function changeBorder() {
  gridApi.setGridOptions({
    border: !showBorder.value,
  });
}

function changeStripe() {
  gridApi.setGridOptions({
    stripe: !showStripe.value,
  });
}

function changeLoading() {
  gridApi.setLoading(true);
}


// 加载数据方法
const loadData = async () => {
  try {
    // 1. 开启加载状态
    gridOptions.loading = true;

    // 2. 构造符合接口规范的请求参数
    const params: HumanApi.HumanParam = {
      pageNo: gridOptions.pagerConfig?.currentPage || 1, // 对应接口的current字段
      pageSize: gridOptions.pagerConfig?.pageSize || 10,     // 对应接口的size字段
      // 可扩展其他查询条件
      // dept: selectedDept,
      // cnName: searchName
    };

    // 3. 调用接口（需确认getHumanInfo是否已正确处理接口路径）
    const response = await getHumanInfo(params);
    console.log('接口响应数据:', response);

    // 4. 处理响应数据（适配接口返回结构）
    if (response.state === 200 && response.success) {
      // 解构核心数据
      const {
        records = [],
        total = 0,
        current = 1,
        size = 10
      } = response.page || {};

      // 5. 更新表格数据
      gridOptions.data = records.map(item => ({
        ...item,
        // 可在此处进行数据转换（如sex字段转义）
        sex: item.sex === '1' ? '男' : '女'
      }));

      // 6. 更新分页状态
      if (gridOptions.pagerConfig) {
        gridOptions.pagerConfig.total = total;
        gridOptions.pagerConfig.currentPage = current;
        gridOptions.pagerConfig.pageSize = size;
      }
    } else {
      console.error('接口返回异常:', response.message);
      // 显示错误提示（以Element Plus为例）
      ElMessage.error(response.message || '数据加载失败');
    }
  } catch (error) {
    console.error('请求异常:', error);
    // 显示网络错误提示
    ElMessage.error('网络连接异常，请检查网络后重试');
  } finally {
    // 7. 关闭加载状态
    gridOptions.loading = false;
  }
};

// 分页变更事件
const handlePageChange = ({
  currentPage,
  pageSize
}: {
  currentPage: number;
  pageSize: number
}) => {
  if (gridOptions.pagerConfig) {
    gridOptions.pagerConfig.currentPage = currentPage
    gridOptions.pagerConfig.pageSize = pageSize
  }
  loadData()
}

// 初始化加载
onMounted(() => {
  loadData()
})

</script>

<template>
  <div class="w-full">
    <vxe-grid v-bind="gridOptions" @page-change="handlePageChange"></vxe-grid>
    <!-- <Grid>
      <template #toolbar-tools>
        <Button class="mr-2" type="primary" @click="changeBorder">
          {{ showBorder ? '隐藏' : '显示' }}边框
        </Button>
        <Button class="mr-2" type="primary" @click="changeLoading">
          显示loading
        </Button>
        <Button class="mr-2" type="primary" @click="changeStripe">
          {{ showStripe ? '隐藏' : '显示' }}斑马纹
        </Button>
      </template>
    </Grid> -->
  </div>
</template>
