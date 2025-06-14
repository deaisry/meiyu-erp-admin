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
    type: [Array, String] as () => CascaderValue | string,
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
  // 新增：是否使用工号模式（输入输出为纯工号）
  useWorkIdMode: {
    type: Boolean,
    default: false,
  },
  // 新增：是否禁用组件
  disabled: {
    type: Boolean,
    default: false,
  },
});
// 定义事件
const emit = defineEmits(['update:modelValue', 'change']);
// 新增：数据加载状态
const loading = ref(false);
const error = ref(false);
const errorMessage = ref('');
const departmentEmployeeData = ref<Record<string, EmployeeDeptInfo[]>>({}); // 新增数据存储

// 新增：工号到组合键的映射表
const workIdToFullIdMap = ref<Record<string, string>>({});

// 新增：组合键到工号的映射表
const fullIdToWorkIdMap = ref<Record<string, string>>({});

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
      
      // 构建工号映射表
      Object.entries(response.data).forEach(([deptId, employees]) => {
        employees.forEach(employee => {
          const fullId = `${deptId}_${employee.workId}`;
          workIdToFullIdMap.value[employee.workId] = fullId;
          fullIdToWorkIdMap.value[fullId] = employee.workId;
        });
      });
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
  fetchDepartmentData().then(() => {
    // 数据加载完成后初始化值
    initializeSelectedValue();
  });
});

// 选中的值
const selectedValue = ref<CascaderValue>([]);

// 新增：初始化选中的值
const initializeSelectedValue = () => {
  // 如果传入的值是空，直接返回
  if (!props.modelValue || (Array.isArray(props.modelValue) && props.modelValue.length === 0)) {
    selectedValue.value = [];
    return;
  }
  
  // 处理字符串输入
  if (typeof props.modelValue === 'string') {
    const values = props.modelValue.split(',').filter(Boolean);
    selectedValue.value = props.useWorkIdMode
      ? values.map(workId => workIdToFullIdMap.value[workId] || workId)
      : values;
    return;
  }
  
  // 处理数组输入
  if (Array.isArray(props.modelValue)) {
    selectedValue.value = props.useWorkIdMode
      ? props.modelValue.map(workId => workIdToFullIdMap.value[workId] || workId)
      : props.modelValue;
  }
};

// 监听外部传入的modelValue变化
watch(
  () => props.modelValue,
  (newVal) => {
    // 如果新值未定义或为空，清空选择
    if (!newVal || (Array.isArray(newVal) && newVal.length === 0)) {
      selectedValue.value = [];
      return;
    }
    
    // 处理字符串输入
    if (typeof newVal === 'string') {
      const values = newVal.split(',').filter(Boolean);
      selectedValue.value = props.useWorkIdMode
        ? values.map(workId => workIdToFullIdMap.value[workId] || workId)
        : values;
      return;
    }
    
    // 处理数组输入
    if (Array.isArray(newVal)) {
      selectedValue.value = props.useWorkIdMode
        ? newVal.map(workId => workIdToFullIdMap.value[workId] || workId)
        : newVal;
    }
  },
  { deep: true }
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
        value: `dept_${deptId}`, // 部门节点使用特殊前缀
        label: deptName,
        level: 0,
        children: [] as any[],
      };
      
      if (Array.isArray(employees)) {
        employees.forEach((employee) => {
          // 使用组合键作为值：部门ID_工号
          const uniqueValue = `${deptId}_${employee.workId}`;
          
          deptNode.children.push({
            value: uniqueValue,
            label: employee.cnName, // 显示中文名
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

    // 准备输出值
    let outputValue: CascaderValue = safeValue;
    
    // 如果使用工号模式，转换为纯工号
    if (props.useWorkIdMode) {
      outputValue = safeValue.map(item => {
        // 尝试从映射表获取工号
        const workId = fullIdToWorkIdMap.value[item];
        if (workId) return workId;
        
        // 如果是组合键格式，提取工号部分
        const parts = String(item).split('_');
        return parts.length > 1 ? parts[1] : item;
      });
    }
    
    // 触发事件
    emit('update:modelValue', outputValue);
    emit('change', outputValue);
  } catch (error) {
    console.error('处理选择变化时出错:', error);
  }
}

// 获取选中的员工姓名
function getSelectedEmployees() {
  try {
    if (!Array.isArray(selectedValue.value)) return [];
    
    // 获取纯工号列表
    const workIds = props.useWorkIdMode
      ? selectedValue.value // 在工号模式下，selectedValue已经包含工号
      : selectedValue.value.map(id => {
          const parts = String(id).split('_');
          return parts.length > 1 ? parts[1] : id;
        });
    
    return workIds;
  } catch (error) {
    console.error('获取选中员工时出错:', error);
    return [];
  }
}

// 获取选中的部门ID
function getSelectedDepartments() {
  try {
    if (!Array.isArray(selectedValue.value)) return [];
    
    const departments = selectedValue.value
      .map((item) => {
        const itemStr = String(item);
        
        // 提取部门ID (格式: dept_部门ID 或 部门ID_工号)
        if (itemStr.startsWith('dept_')) {
          return itemStr.replace('dept_', '');
        }
        
        if (itemStr.includes('_')) {
          return itemStr.split('_')[0];
        }
        
        return null;
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
  refreshData: fetchDepartmentData,
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
      :collapse-tags="collapseTags"
      :disabled="disabled"
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
    
    <!-- 加载状态 -->
    <div v-if="loading" class="loading-overlay">
      <span>加载中...</span>
    </div>
    
    <!-- 错误状态 -->
    <div v-if="error" class="error-message text-red-500 mt-1 text-sm">
      {{ errorMessage }}
    </div>
  </div>
</template>

<style scoped>
.department-employee-select {
  width: 100%;
  position: relative;
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

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.error-message {
  position: absolute;
  bottom: -20px;
  left: 0;
}
</style>
