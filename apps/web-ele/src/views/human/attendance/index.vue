<script lang="ts" setup>
import type { HumanInfo } from '@vben/types';

import type { VbenFormProps } from '#/adapter/form';
import type { VxeGridProps } from '#/adapter/vxe-table';

import { ref } from 'vue';

import { Page, useVbenDrawer, useVbenModal } from '@vben/common-ui';
import {
  departmentOptions,
  employmentTypeOptions,
  genderOptions,
  weekdayOptions,
  workStatusOptions,
} from '@vben/types';

import { Button, message } from 'ant-design-vue';
import dayjs from 'dayjs';
import { ElButton } from 'element-plus';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { fetchAttendanceList } from '#/api/human/attendance';
import { activeEmp, inactiveEmp } from '#/api/human/human';
import { mapEnumValue } from '#/api/utils/format';
import ExtraDrawer from '#/views/human/info/drawer.vue';
import FileUploader from '#/views/utils/upload/FileUploader.vue';

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
const deptList = ref<{ cnt: number; dept: string }[]>([]);
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
      width: 80,
    },
    {
      field: 'attendanceId',
      title: '考勤号',
      width: 80,
    },
    {
      field: 'dept',
      title: '部门',
      sortable: true,
      width: 80,
      formatter: ({ cellValue }) => mapEnumValue(departmentOptions, cellValue),
    },
    {
      field: 'cnName',
      title: '姓名',
      width: 100,
    },
    {
      field: 'isException',
      title: '是否异常',
      width: 80,
      formatter: ({ cellValue }) => (cellValue === '1' ? '是' : '否'),
    },
    {
      field: 'dateTime',
      title: '日期',
      width: '140',
      formatter: ({ cellValue }) => dayjs(cellValue).format('YYYY-MM-DD'),
    },
    {
      field: 'dayTime',
      title: '星期',
      width: 80,
      formatter: ({ cellValue }) => mapEnumValue(weekdayOptions, cellValue),
    },
    {
      field: 'classType',
      title: '班别',
      width: 80,
    },
    {
      field: 'checkTimes',
      title: '打卡次数',
      width: 80,
    },
    {
      field: 'checkOne',
      title: '第一次打卡时间',
      width: 160,
    },
    {
      field: 'checkTwo',
      title: '第二次打卡时间',
      width: 160,
    },
    {
      field: 'checkThree',
      title: '第三次打卡时间',
      width: 160,
    },
    {
      field: 'checkFour',
      title: '第四次打卡时间',
      width: 160,
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
          const response = await fetchAttendanceList({
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
// 人事信息列表
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
function openModal(row: HumanInfo) {
  formModalApi
    .setData({
      ...row,
    })
    .open();
}

// 打开编辑抽屉
function open(row: HumanInfo) {
  drawerApi
    .setData({
      ...row, // 传递整个行数据
    })
    .open();
}

// 启用职工
function active(row: HumanInfo) {
  try {
    activeEmp(row);
    // console.log(response);
    message.info(`职工${row.cnName}启用成功`);
    gridApi.reload();
  } catch {
    message.error(`职工${row.cnName}启用失败`);
  }
}

// 停用职工
function inactive(row: HumanInfo) {
  try {
    inactiveEmp(row);
    // console.log(response);
    message.info(`职工${row.cnName}停用成功`);
    gridApi.reload();
  } catch {
    message.error(`职工${row.cnName}停用失败`);
  }
}

const handleSuccess = (file, response) => {
  debugger;
  message.info('上传成功');
  console.log('上传成功:', file.name, response);
};

const handleError = (file, error) => {
  message.error('上传失败');
  console.error('上传失败:', file.name, error);
};
</script>

<template>
  <Page auto-content-height>
    <Drawer />
    <Overview :dept-list="deptList" />
    <Grid>
      <template #toolbar-actions>
        <FileUploader
          upload-url="/human/import"
          button-text="上传考勤信息"
          :multiple="true"
        />
        <ElButton>批量删除</ElButton>
      </template>
      <template #action="{ row }">
        <Button type="link" @click="open(row)"> 编辑 </Button>
        <Button type="link" @click="openModal(row)">删除</Button>
        <FormModal />
      </template>
    </Grid>
  </Page>
</template>
