<script lang="ts" setup>
import type { ItemInfo } from '@vben/types';

import type { VbenFormProps } from '#/adapter/form';
import type { VxeGridProps } from '#/adapter/vxe-table';

import { ref } from 'vue';
import { useRouter } from 'vue-router';

import { Page, useVbenDrawer, useVbenModal } from '@vben/common-ui';
import {
  departmentOptions,
  followStatusOptions,
  itemRelaTypeOptions,
  itemTypeOptions,
} from '@vben/types';

import { Button } from 'ant-design-vue';
import dayjs from 'dayjs';

import {processFormParams} from '#/api/human/human';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { deleteItemInfo, fetchItemList } from '#/api/item/item';
import { mapEnumValue } from '#/api/utils/format';
import ExtraDrawer from './drawer.vue';
import DepartmentEmployeeSelect from '#/views/utils/DepartmentEmployeeSelect.vue';

import AddFormModal from './addModal.vue';
import AssignFormModal from './modal.vue';
import Overview from './overview.vue';

const router = useRouter();
const participantsProps = ref({
  autoLoad: true, // 启用自动加载数据
  placeholder: '请选择人员',
  multiple: true,
  filterable: true,
  clearable: true,
});

const formOptions: VbenFormProps = {
  // 默认收起
  collapsed: true,
  fieldMappingTime: [['date', ['start', 'end']]],
  schema: [
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
        ...participantsProps,
      },
      // rules: 'required',
    },
    {
      component: DepartmentEmployeeSelect,
      fieldName: 'follower',
      label: '跟进人',
      componentProps: {
        ...participantsProps,
      },
      // rules: 'required',
    },
    {
      component: 'Select',
      componentProps: {
        allowClear: true,
        options: followStatusOptions,
        placeholder: '请选择',
      },
      fieldName: 'followStatus',
      label: '跟进状态',
    },
  ],
  // 控制表单是否显示折叠按钮
  showCollapseButton: true,
  // 是否在字段值改变时提交表单
  submitOnChange: false,
  // 按下回车时是否提交表单
  submitOnEnter: true,
};
const followList = ref<{ cnt: number; status: string }[]>([]);
const typeList = ref<{ cnt: number; type: string }[]>([]);
const gridOptions: VxeGridProps<ItemInfo> = {
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
      field: 'itemId',
      title: '事项编号',
      width: 120,
    },
    {
      field: 'itemName',
      title: '事项名称',
      width: 180,
    },
    {
      field: 'relaId',
      title: '关联编号',
      width: 120,
      formatter: ({ cellValue }) => {
        // 如果值为空或 null 或 undefined，显示短横线
        return cellValue || '-';
      },
    },
    {
      field: 'relaType',
      title: '关联类型',
      width: 120,
      formatter: ({ cellValue }) =>
        mapEnumValue(itemRelaTypeOptions, cellValue),
    },
    {
      field: 'itemType',
      title: '事项类型',
      width: 100,
      formatter: ({ cellValue }) => mapEnumValue(itemTypeOptions, cellValue),
    },
    {
      field: 'dept',
      title: '责任部门',
      width: 100,
      formatter: ({ cellValue }) => mapEnumValue(departmentOptions, cellValue),
    },
    {
      field: 'responsibleP',
      title: '负责人',
      width: 120,
      cellRender: {
        name: 'EmployeeNameRenderer',
      },
    },
    {
      field: 'follower',
      title: '跟进人',
      width: 120,
      cellRender: {
        name: 'EmployeeNameRenderer',
      },
    },
    {
      field: 'progress',
      title: '事项进度',
      width: 260,
      cellRender: {
        name: 'CellProgress',
      },
    },
    {
      field: 'planCompleteTime',
      title: '计划完成时间',
      width: 160,
      formatter: ({ cellValue }) => dayjs(cellValue).format('YYYY-MM-DD HH:mm'),
    },
    {
      field: 'completeTime',
      title: '实际完成时间',
      width: 160,
      formatter: ({ cellValue }) => dayjs(cellValue).format('YYYY-MM-DD HH:mm'),
    },
    {
      field: 'comment',
      title: '备注',
      width: 200,
    },
    {
      field: 'createBy',
      title: '创建人',
      width: 120,
    },
    {
      field: 'updateBy',
      title: '更新人',
      width: 120,
    },
    {
      field: 'createTime',
      title: '创建时间',
      width: 160,
      formatter: ({ cellValue }) => dayjs(cellValue).format('YYYY-MM-DD HH:mm'),
    },
    {
      field: 'updateTime',
      title: '更新时间',
      width: 160,
      formatter: ({ cellValue }) => dayjs(cellValue).format('YYYY-MM-DD HH:mm'),
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
          // 定义处理函数
          const submitParams = processFormParams(formValues,['follower', 'responsibleP'] as const);
          const response = await fetchItemList({
            pageNo: page.currentPage,
            pageSize: page.pageSize,
            ...submitParams, // 使用处理后的参数
          });
          // 处理状态统计列表
          followList.value = response.statusList.map((item) => ({
            ...item,
            status:
              mapEnumValue(followStatusOptions, item.status) || item.status,
          }));

          // 处理类型统计列表
          typeList.value = response.typeList.map((item) => ({
            ...item,
            type: mapEnumValue(itemTypeOptions, item.type) || item.type,
          }));
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
// 事项列表
const [Grid, gridApi] = useVbenVxeGrid({
  formOptions,
  gridOptions,
});

// 编辑抽屉
const [Drawer, drawerApi] = useVbenDrawer({
  // 连接抽离的组件
  connectedComponent: ExtraDrawer,
  onClosed() {
    gridApi.reload();
  },
});

// 分配弹窗
const [AssignModal, assignFormModalApi] = useVbenModal({
  connectedComponent: AssignFormModal,
});

const [AddModal, addFormModalApi] = useVbenModal({
  connectedComponent: AddFormModal,
});

// 打开详情页面
function openDetail(row: ItemInfo) {
  router.push({
    name: 'ItemDetail',
    params: {
      itemId: row.itemId,
    },
  });
}

// 打开编辑抽屉
function open(row: ItemInfo) {
  drawerApi
    .setData({
      ...row, // 传递整个行数据
    })
    .open();
}

// 分配事项
function assign(row: ItemInfo) {
  assignFormModalApi
    .setData({
      ...row,
    })
    .open();
}

// 删除
function onDelete(row: ItemInfo) {
  deleteItemInfo(row.itemId);
}

// 新增事项弹窗
function openAdd() {
  console.info('whaaaat?');
  addFormModalApi.open();
}
</script>

<template>
  <Page auto-content-height>
    <Drawer />
    <Overview :follow-list="followList" :type-list="typeList" />
    <Grid>
      <template #toolbar-actions>
        <Button class="mr-2" type="primary" @click="() => openAdd()">
          新增事项
        </Button>
      </template>
      <template #action="{ row }">
        <Button type="link" @click="open(row)"> 编辑 </Button>
        <Button type="link" @click="assign(row)"> 分配 </Button>
        <Button type="link" @click="openDetail(row)">详情</Button>
        <AssignModal />
        <AddModal />
      </template>
    </Grid>
  </Page>
</template>
