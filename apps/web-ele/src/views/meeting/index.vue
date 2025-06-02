<script lang="ts" setup>
import type {MeetingInfo } from '@vben/types';

import type { VbenFormProps } from '#/adapter/form';
import type { VxeGridProps } from '#/adapter/vxe-table';

import { ref } from 'vue';

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

import ExtraFormModal from './modal.vue';
import Overview from './overview.vue';

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
const deptList = ref<{ cnt: number; dept: string }[]>([]);
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
    // {
    //   field: 'meetingId',
    //   title: '会议编号',
    //   width: 120,
    // },
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
      field: 'participants',
      title: '与会人员',
      width: 180,
    },
    {
      field: 'meetingContent',
      title: '会议纪要',
      width:120
    },
        {
      field: 'isConvene',
      title: '召开状态',
      width: 80,
      formatter: ({ cellValue }) => mapEnumValue(meetingConveneOptions, cellValue),
    },
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
function openModal(row: MeetingInfo) {
  formModalApi
    .setData({
      ...row,
    })
    .open();
}

// 打开编辑抽屉
function open(row: MeetingInfo) {
  drawerApi
    .setData({
      ...row, // 传递整个行数据
    })
    .open();
}

// // 启用职工
// function active(row: HumanInfo) {
//   try {
//     activeEmp(row);
//     // console.log(response);
//     message.info(`职工${row.cnName}启用成功`);
//     gridApi.reload();
//   } catch {
//     message.error(`职工${row.cnName}启用失败`);
//   }
// }

// // 停用职工
// function inactive(row: HumanInfo) {
//   try {
//     inactiveEmp(row);
//     // console.log(response);
//     message.info(`职工${row.cnName}停用成功`);
//     gridApi.reload();
//   } catch {
//     message.error(`职工${row.cnName}停用失败`);
//   }
// }

// 删除
function onDelete(row:MeetingInfo){
  message.info("删除");
}
</script>

<template>
  <Page auto-content-height>
    <Drawer />
    <Grid>
      <template #action="{ row }">
        <Button type="link" @click="open(row)"> 编辑 </Button>
        <Button type="link" @click="onDelete(row)"> 删除 </Button>
        <Button type="link" @click="openModal(row)">详情</Button>
        <FormModal />
      </template>
    </Grid>
  </Page>
</template>
