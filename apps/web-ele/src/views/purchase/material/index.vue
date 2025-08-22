<script lang="ts" setup>
import type { HumanInfo } from '@vben/types';

import type { VbenFormProps } from '#/adapter/form';
import type { VxeGridProps } from '#/adapter/vxe-table';

import { ref } from 'vue';

import { Page, useVbenDrawer, useVbenModal } from '@vben/common-ui';
import {
  departmentOptions,
  educationOptions,
  currencyOptions,
  unitOptions,
  employmentTypeOptions,
  genderOptions,
  workStatusOptions,
} from '@vben/types';
import {ElButton} from 'element-plus'
import { Button, message } from 'ant-design-vue';
import dayjs from 'dayjs';
import BatchDelete from '#/views/utils/delete/BatchDelete.vue'
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { activeEmp, fetchHumanList, inactiveEmp, batchDeleteHuman} from '#/api/human/human';
import {fetchMaterialInfo, submitMaterialInfo} from '#/api/purchase/material';
import { mapEnumValue } from '#/api/utils/format';
import ExtraDrawer from '#/views/human/info/drawer.vue';
import FileUploader from '#/views/utils/upload/FileUploader.vue';

import ExtraFormModal from './modal.vue';
import Overview from './overview.vue';

const selectedItems = ref<HumanInfo[]>([])
console.log('[HumanPage] 初始化选中项:', selectedItems.value)
const handleCheckboxChange = ({ records }: { records: HumanInfo[] }) => {
  console.log('[HumanPage] 接收到选择变化事件:')
  selectedItems.value = records
}

// const formOptions: VbenFormProps = {
//   // 默认收起
//   collapsed: true,
//   fieldMappingTime: [['date', ['start', 'end']]],
//   schema: [
//     {
//       component: 'Input',
//       defaultValue: '',
//       fieldName: 'cnName',
//       label: '姓名',
//     },
//     {
//       component: 'Select',
//       componentProps: {
//         allowClear: true,
//         options: departmentOptions,
//         placeholder: '请选择',
//       },
//       fieldName: 'dept',
//       label: '部门',
//     },
//     {
//       component: 'Select',
//       fieldName: 'sex',
//       label: '性别',
//       componentProps: {
//         allowClear: true,
//         options: genderOptions,
//         placeholder: '请选择',
//       },
//     },
//     {
//       component: 'Select',
//       fieldName: 'employeeType',
//       label: '用工性质',
//       componentProps: {
//         allowClear: true,
//         options: employmentTypeOptions,
//         placeholder: '请选择',
//       },
//     },
//     {
//       component: 'Select',
//       fieldName: 'isWork',
//       label: '在职状态',
//       componentProps: {
//         allowClear: true,
//         options: workStatusOptions,
//         placeholder: '请选择',
//       },
//     },
//   ],
//   // 控制表单是否显示折叠按钮
//   showCollapseButton: true,
//   // 是否在字段值改变时提交表单
//   submitOnChange: false,
//   // 按下回车时是否提交表单
//   submitOnEnter: true,
// };
const deptList = ref<{ cnt: number; dept: string }[]>([]);
const gridOptions: VxeGridProps<HumanInfo> = {
  checkboxConfig: {
    highlight: true,
    labelField: 'name',
    checkField: 'selected'
  },
  columns: [
  { type: 'checkbox', width: 30 },
  {
    title: '序号',
    type: 'seq',
    width: 50,
  },
  {
    field: 'materialId',
    title: '物料编号',
    width: 120,
    sortable: true
  },
  {
    field: 'materialName',
    title: '品名规格',
    width: 200,
  },
  {
    field: 'priceConfirmDate',
    title: '单价确定时间',
    formatter: ({ cellValue }) => dayjs(cellValue).format('YYYY-MM-DD HH:mm:ss'),
    width: 150,
    sortable: true
  },
  {
    field: 'unit',
    title: '单位',
    formatter: ({ cellValue }) => mapEnumValue(unitOptions, cellValue),
    width: 80,
  },
  {
    field: 'unitPriceFree',
    title: '单价(不含税)',
    width: 120,
    formatter: ({ cellValue }) => cellValue ? `¥${Number(cellValue).toFixed(4)}` : '-'
  },
  {
    field: 'unitPriceDuty',
    title: '单价(含税)',
    width: 120,
    formatter: ({ cellValue }) => cellValue ? `¥${Number(cellValue).toFixed(4)}` : '-'
  },
  {
    field: 'unitPrice',
    title: '原币单价',
    width: 120,
    formatter: ({ cellValue }) => cellValue ? Number(cellValue).toFixed(4) : '-'
  },
  {
    field: 'currency',
    title: '币种',
    formatter: ({ cellValue }) => mapEnumValue(currencyOptions, cellValue),
    width: 80,
  },
  {
    field: 'supplier',
    title: '供应商',
    width: 120,
  },
  {
    field: 'customer',
    title: '客户',
    width: 120,
  },
  {
    field: 'materialType',
    title: '原料类型',
    width: 120,
  },
  {
    field: 'rawType',
    title: '原料类型',
    width: 120,
  },
  {
    field: 'unitWeightCustoms',
    title: '海关单重',
    width: 100,
    formatter: ({ cellValue }) => cellValue ? Number(cellValue).toFixed(4) : '-'
  },
  {
    field: 'remark',
    title: '备注',
    width: 150,
  },
  {
    field: 'createBy',
    title: '创建人',
    width: 100,
  },
  {
    field: 'updateBy',
    title: '更新人',
    width: 100,
  },
  {
    field: 'createTime',
    title: '创建时间',
    formatter: ({ cellValue }) => dayjs(cellValue).format('YYYY-MM-DD HH:mm:ss'),
    width: 150,
    sortable: true
  },
  {
    field: 'updateTime',
    title: '更新时间',
    formatter: ({ cellValue }) => dayjs(cellValue).format('YYYY-MM-DD HH:mm:ss'),
    width: 150,
    sortable: true
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
          const response = await fetchHumanList({
            pageNo: page.currentPage,
            pageSize: page.pageSize,
            ...formValues,
          });
          deptList.value = response.list.map((item) => ({
            ...item,
            dept: mapEnumValue(departmentOptions, item.dept) || item.dept,
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
// 人事信息列表
const [Grid, gridApi] = useVbenVxeGrid({
  // formOptions,
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

// const handleSuccess = (file, response) => {
//   debugger;
//   message.info('上传成功');
//   console.log('上传成功:', file.name, response);
// };

// const handleError = (file, error) => {
//   message.error('上传失败');
//   console.error('上传失败:', file.name, error);
// };

const deleteHuman = async (ids: Array<string | number>) => {
  try {
    debugger;
    await batchDeleteHuman(ids);
    message.success(`成功删除 ${ids.length} 条记录`)
    gridApi.reload()
    return true
  } catch (error) {
    message.error('删除操作失败')
    console.error('删除错误:', error)
    throw error
  }
}

</script>

<template>
  <Page auto-content-height>
    <Drawer />
    <!-- <Overview :dept-list="deptList" /> -->
    <Grid
      @checkbox-change="handleCheckboxChange"
      @select-change="handleCheckboxChange"
      @check-change="handleCheckboxChange"
      @selection-change="handleCheckboxChange"
    >
      <template #toolbar-actions>
        <div style="display: flex;width:100%;">
        <FileUploader
          upload-url="/material/import"
          button-text="批量上传物料信息"
          :multiple="true"
        />
        <ElButton type = "primary"
          style="margin-left:auto"
          >
          新增
        </ElButton>
          <BatchDelete
            :selected-items="selectedItems"
            :api-function="batchDeleteHuman"
            success-message="删除成功"
            error-message="删除失败"
            @delete-success="gridApi.reload()"
          />
        </div>
      </template>
      <template #action="{ row }">
        <Button type="link" @click="open(row)"> 编辑 </Button>
        <Button type="link" :disabled="row.isWork === '1'" @click="active(row)">
          启用
        </Button>
        <Button
          type="link"
          :disabled="row.isWork === '0'"
          @click="inactive(row)"
        >
          停用
        </Button>
        <Button type="link" @click="openModal(row)">详情</Button>
        <FormModal />
      </template>
    </Grid>
  </Page>
</template>
