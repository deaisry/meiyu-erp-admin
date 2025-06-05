<script lang="ts" setup>
import type {MeetingInfo } from '@vben/types';

import type { VbenFormProps } from '#/adapter/form';
import type { VxeGridProps } from '#/adapter/vxe-table';

import { ref } from 'vue';
import { useRouter } from 'vue-router'
import { Page, useVbenDrawer, useVbenModal } from '@vben/common-ui';
import {
  meetingTypeOptions,
  meetingPlaceOptions,
  meetingConveneOptions,
} from '@vben/types';

import { Button, message } from 'ant-design-vue';
import dayjs from 'dayjs';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { fetchMeetingList} from '#/api/meeting/meeting';
import { mapEnumValue } from '#/api/utils/format';
import ExtraDrawer from '#/views/meeting/drawer.vue';

import ExtraFormModal from './detail.vue';
// import ExtraAddFormModal from './add.vue';
// import Overview from './overview.vue';

const router = useRouter()
const formOptions: VbenFormProps = {
  // 默认收起
  collapsed: true,
  fieldMappingTime: [['date', ['start', 'end']]],
  schema: [
    {
      component: 'Input',
      defaultValue: '',
      fieldName: 'meetingName',
      label: '会议名称',
    },
    {
      component: 'Select',
      componentProps: {
        allowClear: true,
        options: meetingTypeOptions,
        placeholder: '请选择',
      },
      fieldName: 'meetingType',
      label: '会议类型',
    },
    {
      component: 'Select',
      fieldName: 'meetingPlace',
      label: '会议地点',
      componentProps: {
        allowClear: true,
        options: meetingPlaceOptions,
        placeholder: '请选择',
      },
    },
    // {
    //   component: 'DatePicker',
    //   defaultValue: [dayjs().subtract(7, 'days'), dayjs()],
    //   fieldName: 'meetingTime',
    //   label: '会议时间',
    // },
  ],
  // 控制表单是否显示折叠按钮
  showCollapseButton: true,
  // 是否在字段值改变时提交表单
  submitOnChange: false,
  // 按下回车时是否提交表单
  submitOnEnter: true,
};
const gridOptions: VxeGridProps<MeetingInfo> = {
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
      field: 'meetingType',
      title: '会议类型',
      sortable: true,
      width: 180,
      formatter: ({ cellValue }) => mapEnumValue(meetingTypeOptions, cellValue),
    },
    {
      field: 'meetingName',
      title: '会议名称',
      width: 100,
    },
    {
      field: 'meetingPlace',
      title: '会议地点',
      formatter: ({ cellValue }) => mapEnumValue(meetingPlaceOptions, cellValue),
      width: 80,
    },
    {
      field:'meetingTime',
      title:'会议时间',
      width:180,
    },
    {
      field: 'participants',
      title: '与会人员',
      width: 180,
    },
    {
      field: 'meetingContent',
      title: '会议纪要',
      width:120
    },
    // {
    //   field: 'isConvene',
    //   title: '召开状态',
    //   width: 80,
    //   formatter: ({ cellValue }) => mapEnumValue(meetingConveneOptions, cellValue),
    // },
    {
      field: 'comment',
      title: '备注',
      width: 120,
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
          const response = await fetchMeetingList({
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
// 会议列表
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

// 详情弹窗
const [FormModal, formModalApi] = useVbenModal({
  connectedComponent: ExtraFormModal,
});

// 打开详情弹窗
function openDetail(row: MeetingInfo) {
    router.push({
    name: 'MeetingDetail',
    params: {
      meetingId: row.meetingId
    }
  });
}

// 打开编辑抽屉
function open(row: MeetingInfo) {
  drawerApi
    .setData({
      ...row, // 传递整个行数据
    })
    .open();
}

// 跳转至新增页面
function openAdd(){
  router.push('/meeting/add')
}

// 删除
function onDelete(row:MeetingInfo){
  message.info("删除");
}
</script>

<template>
  <Page auto-content-height>
    <Drawer />
    <Grid>
      <template #toolbar-actions>
        <Button class="mr-2" type="primary" @click="() => openAdd()">
          新建会议
        </Button>
      </template>
      <template #action="{ row }">
        <Button type="link" @click="open(row)"> 编辑 </Button>
        <Button type="link" @click="onDelete(row)"> 删除 </Button>
        <Button type="link" @click="openDetail(row)">详情</Button>
      </template>
    </Grid>
  </Page>
</template>
