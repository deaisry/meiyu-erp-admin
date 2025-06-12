<script lang="ts" setup>
import type { CascaderProps, CascaderValue } from 'element-plus';

import type { EmployeeDeptInfo } from '@vben/types';

import { computed, onMounted, ref, watch } from 'vue';

import { departmentNameMap } from '@vben/types';

import { ElCascader } from 'element-plus';

import { selectDeptMem } from '#/api/human/human';

// 定义组件属性
const props = defineProps({
  // 新增：是否自动加载数据
  autoLoad: {
    type: Boolean,
    default: true,
  },
  // 源数据格式: { 部门ID: [员工姓名列表] }
  sourceData: {
    type: Object as () => Record<string, EmployeeDeptInfo[]>,
    required: false,
    default: () => ({}),
  },
  // 部门名称映射: { 部门ID: 部门名称 }
  departmentNames: {
    type: Object as () => Record<string, string>,
    default: () => ({}),
  },
  // 选中的值
  modelValue: {
    type: Array as () => string[],
    default: () => [],
  },
  // 占位文本
  placeholder: {
    type: String,
    default: '请选择部门/人员',
  },
  // 是否显示全路径
  showAllLevels: {
    type: Boolean,
    default: true,
  },
  // 是否可清空
  clearable: {
    type: Boolean,
    default: true,
  },
  // 是否可搜索
  filterable: {
    type: Boolean,
    default: true,
  },
  // 是否多选
  multiple: {
    type: Boolean,
    default: true,
  },
  // 是否折叠标签
  collapseTags: {
    type: Boolean,
    default: true,
  },
});
// 定义事件
const emit = defineEmits(['update:modelValue', 'change']);
// 新增：数据加载状态
const loading = ref(false);
const error = ref(false);
const errorMessage = ref('');
const departmentEmployeeData = ref<Record<string, EmployeeDeptInfo[]>>({}); // 新增数据存储

// 新增：自动加载部门人员数据
const fetchDepartmentData = async () => {
  if (!props.autoLoad) return;

  try {
    loading.value = true;
    error.value = false;
    errorMessage.value = '';
    const response = await selectDeptMem();
    if (response.state === 200 && response.data) {
      departmentEmployeeData.value = response.data;
    } else {
      throw new Error(response.message || '加载部门人员数据失败');
    }
  } catch (error_: any) {
    error.value = true;
    errorMessage.value = error_.message || '网络请求失败，请稍后再试';
    console.error('加载部门人员数据失败:', error_);
  } finally {
    loading.value = false;
  }
};

// 新增：挂载时自动加载数据
onMounted(() => {
  fetchDepartmentData();
});

// 选中的值
const selectedValue = ref<CascaderValue>(props.modelValue);

// 监听外部传入的modelValue变化
watch(
  () => props.modelValue,
  (newVal) => {
    if (Array.isArray(newVal)) {
      selectedValue.value = newVal;
    }
  },
);

// 级联选择器配置
const cascaderProps: CascaderProps = {
  // expandTrigger: 'hover',// 悬停展开
  emitPath: false,
  checkStrictly: false,
  multiple: props.multiple,
};

// 转换数据为级联选择器需要的树形结构
const cascaderOptions = computed(() => {
  const options: any[] = [];
  const sourceData = props.autoLoad
    ? departmentEmployeeData.value
    : props.sourceData;
  const deptNames = props.autoLoad ? departmentNameMap : props.departmentNames;

  try {
    if (!sourceData || typeof sourceData !== 'object') {
      console.warn('部门-员工数据源无效:', sourceData);
      return options;
    }
    for (const [deptId, employees] of Object.entries(sourceData)) {
      const deptName = deptNames[deptId] || `部门${deptId}`;
      const deptNode = {
        value: `dept_${deptId}`,
        label: deptName,
        level: 0,
        children: [] as any[],
      };
      if (Array.isArray(employees)) {
        employees.forEach((employee) => {
          // 修复点：使用employee.name作为标签
          // const employeeName = employee.cnName;
          const uniqueValue = `${deptId}_${employee.workId}`;

          deptNode.children.push({
            value: uniqueValue,
            label: employee.cnName, // 确保这里是字符串
            level: 1,
          });
        });
      }

      options.push(deptNode);
    }
  } catch (error) {
    console.error('生成级联选项时出错:', error);
  }

  return options;
});

// 处理选择变化
function handleChange(value: CascaderValue) {
  try {
    // 确保值是一个数组
    const safeValue = Array.isArray(value) ? value : [];

    // 更新绑定值
    selectedValue.value = safeValue;

    // 触发事件
    emit('update:modelValue', safeValue);
    emit('change', safeValue);
  } catch (error) {
    console.error('处理选择变化时出错:', error);
  }
}

// 获取选中的员工姓名
function getSelectedEmployees() {
  console.log('getSelectedEmployees');
  try {
    if (!Array.isArray(selectedValue.value)) return [];
    return selectedValue.value.map((item) => {
      // 提取员工姓名 (格式: 部门ID_员工姓名)
      const parts = String(item).split('_');
      return parts.length > 1 ? parts.slice(1).join('_') : item;
    });
  } catch (error) {
    console.error('获取选中员工时出错:', error);
    return [];
  }
}

// 获取选中的部门ID
function getSelectedDepartments() {
  console.log('getSelectedDepartments');
  try {
    if (!Array.isArray(selectedValue.value)) return [];
    const departments = selectedValue.value
      .map((item) => {
        // 提取部门ID (格式: dept_部门ID)
        const deptItem = cascaderOptions.value.find((option) =>
          option.children?.some((child) => child.value === item),
        );
        return deptItem ? deptItem.value.replace('dept_', '') : null;
      })
      .filter(Boolean) as string[];

    return [...new Set(departments)];
  } catch (error) {
    console.error('获取选中部门时出错:', error);
    return [];
  }
}

// 暴露方法给父组件
defineExpose({
  getSelectedEmployees,
  getSelectedDepartments,
});
</script>

<template>
  <div class="department-employee-select">
    <ElCascader
      v-model="selectedValue"
      :options="cascaderOptions"
      :props="cascaderProps"
      :placeholder="placeholder"
      :clearable="clearable"
      :filterable="filterable"
      :show-all-levels="showAllLevels"
      :multiple="multiple"
      @change="handleChange"
      class="w-full"
    >
      <!-- 安全的作用域插槽处理 -->
      <template #default="{ data }">
        <div v-if="data" class="cascader-node">
          <!-- 部门节点 -->
          <div v-if="data.level === 0" class="department-node">
            <i class="el-icon-office-building mr-2 text-blue-500"></i>
            <span class="font-medium">{{ data.label }}</span>
            <span class="employee-count ml-2 text-sm text-gray-500">
              ({{ data.children?.length || 0 }})
            </span>
          </div>

          <!-- 员工节点 -->
          <div v-else class="employee-node">
            <i class="el-icon-user mr-2 text-green-500"></i>
            <span>{{ data.label }}</span>
          </div>
        </div>

        <!-- 回退显示 -->
        <div v-else class="fallback-node">
          <i class="el-icon-warning mr-2 text-yellow-500"></i>
          <span>无法加载节点数据</span>
        </div>
      </template>
    </ElCascader>
  </div>
</template>

<style scoped>
.department-employee-select {
  width: 100%;
}

.cascader-node {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  min-height: 40px;
}

/* 优化标签显示 */
:deep(.el-cascader__tags) {
  flex-wrap: wrap;
  gap: 6px;
}

:deep(.el-cascader__tag .el-icon-close) {
  background-color: transparent;
}

:deep(.el-cascader__tag .el-icon-close:hover) {
  color: #fff;
}
</style>
