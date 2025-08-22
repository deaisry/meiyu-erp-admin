<!-- BatchDelete.vue -->
<template>
  <ElButton type="danger" :disabled="disabled" @click="showConfirm">
    <slot>{{ defaultText }}</slot>
  </ElButton>
</template>

<script lang="ts" setup generic="T extends { id: string | number }">
import { ElButton, ElMessage, ElMessageBox } from 'element-plus'
import type { Action } from 'element-plus'
import { ref, watch } from 'vue'

const props = withDefaults(defineProps<{
  selectedItems: T[] // 选中的行数据
  apiFunction: (ids: Array<string | number>) => Promise<unknown> // 删除API函数
  successMessage?: string
  errorMessage?: string
  disabled?: boolean
  confirmText?: string
}>(), {
  disabled: false,
  confirmText: '确定要删除选中的记录吗？此操作不可恢复！',
  successMessage: '删除成功',
  errorMessage: '删除失败'
})

const emit = defineEmits(['before-delete', 'delete-success', 'delete-error', 'after-delete'])
const defaultText = ref('批量删除')

// 执行删除操作
const executeDelete = async () => {
  const ids = props.selectedItems.map(item => item.id)
  
  try {
    emit('before-delete', ids)
    
    // 调用传入的API函数
    await props.apiFunction(ids)
    
    ElMessage.success(props.successMessage)
    emit('delete-success', ids)
  } catch (error) {
    ElMessage.error(props.errorMessage)
    emit('delete-error', error)
  } finally {
    emit('after-delete', ids)
  }
}

// 显示确认对话框
const showConfirm = async () => {
  if (props.selectedItems.length === 0) return
  
  try {
    await ElMessageBox.confirm(
      `${props.confirmText}（共 ${props.selectedItems.length} 条）`,
      '危险操作',
      {
        confirmButtonText: '确认删除',
        cancelButtonText: '取消',
        type: 'error',
        center: true,
        beforeClose: async (action: Action, _, done: () => void) => {
          if (action === 'confirm') {
            await executeDelete()
          }
          done()
        }
      }
    )
  } catch (cancel) {
    // 用户取消了操作
  }
}

// 根据选中项数量更新按钮文本
watch(() => props.selectedItems.length, (count) => {
  defaultText.value = count > 0 ? `批量删除(${count})` : '批量删除'
})
</script>
