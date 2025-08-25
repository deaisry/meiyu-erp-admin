<script setup lang="ts">
import { ElButton, ElMessage, ElPopconfirm } from 'element-plus';

interface Props {
  /** 单条删除模式：传入行对象 */
  rowItem?: Record<string, any>;
  /** 批量删除模式：传入选中项数组 */
  selectedItems?: any[];
  /** 删除接口函数 */
  apiFunction: (ids: number[] | string[]) => Promise<any>;
  /** 主键字段名 */
  idKey?: string;
  /** 按钮文字 */
  buttonText?: string;
  /** 删除成功提示 */
  successMessage?: string;
  /** 删除失败提示 */
  errorMessage?: string;
  /** 按钮类型 */
  type?: 'danger' | 'default' | 'primary';
  /** 是否显示二次确认弹窗 */
  confirm?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  idKey: 'id',
  buttonText: '删除',
  successMessage: '删除成功',
  errorMessage: '删除失败',
  type: 'danger',
  confirm: true,
});

const emit = defineEmits<{
  (e: 'delete-success'): void;
}>();

async function handleDelete() {
  let ids: (number | string)[] = [];

  if (props.rowItem) {
    // 单条删除
    ids = [props.rowItem[props.idKey]];
  } else if (props.selectedItems && props.selectedItems.length > 0) {
    // 批量删除
    ids = props.selectedItems.map((item) => item[props.idKey]);
  } else {
    ElMessage.warning('请选择要删除的记录');
    return;
  }

  try {
    await props.apiFunction(ids);
    ElMessage.success(props.successMessage);
    emit('delete-success');
  } catch (error) {
    console.error('删除失败:', error);
    ElMessage.error(props.errorMessage);
  }
}
</script>

<template>
  <ElPopconfirm
    v-if="confirm"
    title="确认删除所选记录？"
    confirm-button-text="确认"
    cancel-button-text="取消"
    @confirm="handleDelete"
  >
    <template #reference>
      <ElButton
        :type="type"
        :disabled="!rowItem && (!selectedItems || selectedItems.length === 0)"
      >
        {{ buttonText }}
      </ElButton>
    </template>
  </ElPopconfirm>

  <ElButton
    v-else
    :type="type"
    @click="handleDelete"
    :disabled="!rowItem && (!selectedItems || selectedItems.length === 0)"
  >
    {{ buttonText }}
  </ElButton>
</template>
