<script lang="ts" setup>
import { computed, ref } from 'vue';
import { useVbenModal } from '@vben/common-ui';
import { unitOptions, currencyOptions, materialTypeOptions } from '@vben/types';

// 定义字段配置
const fieldConfig = [
  { key: 'materialId', label: '物料编号' },
  { key: 'materialName', label: '品名规格' },
  { key: 'priceConfirmDate', label: '单价确定时间' },
  { key: 'unit', label: '单位', options: unitOptions },
  { key: 'unitPriceFree', label: '单价(不含税)' },
  { key: 'unitPriceDuty', label: '单价(含税)' },
  { key: 'unitPrice', label: '原币单价' },
  { key: 'currency', label: '币种', options: currencyOptions },
  { key: 'supplier', label: '供应商' },
  { key: 'customer', label: '客户' },
  { key: 'materialType', label: '原料类型', options: materialTypeOptions },
  { key: 'rawType', label: '原料类型' },
  { key: 'unitWeightCustoms', label: '海关单重' },
  { key: 'remark', label: '备注' },
  { key: 'createBy', label: '创建人' },
  { key: 'updateBy', label: '更新人' },
  { key: 'createTime', label: '创建时间' },
  { key: 'updateTime', label: '更新时间' }
];

const data = ref<Record<string, any>>({});

// 计算显示数据（分组为两列）
const groupedDisplayData = computed(() => {
  const items = fieldConfig.map((item) => {
    const value = data.value?.[item.key] ?? '';
    let displayValue = value;

    if (item.options && value !== undefined && value !== null) {
      const option = item.options.find(
        (opt) => String(opt.value) === String(value),
      );
      displayValue = option ? option.label : value;
    }

    return {
      ...item,
      value: displayValue || '未填写',
    };
  });

  // 将数据分成两列
  const midIndex = Math.ceil(items.length / 2);
  return [items.slice(0, midIndex), items.slice(midIndex)];
});

const [Modal, modalApi] = useVbenModal({
  showCancelButton: false,
  showConfirmButton: false,
  onCancel() {
    modalApi.close();
  },
  onConfirm() {
    console.info('onConfirm');
  },
  onOpenChange(isOpen: boolean) {
    if (isOpen) {
      data.value = modalApi.getData<Record<string, any>>();
    }
  },
});
</script>

<template>
  <Modal title="物料价格信息详情" class="detail-modal">
    <div class="modal-content">
      <div class="two-column-grid">
        <!-- 第一列 -->
        <div class="info-column">
          <div v-for="(item, index) in groupedDisplayData[0]" :key="item.key" class="info-item">
            <span class="info-label">{{ item.label }}：</span>
            <span class="info-value">{{ item.value }}</span>
          </div>
        </div>

        <!-- 第二列 -->
        <div class="info-column">
          <div v-for="(item, index) in groupedDisplayData[1]" :key="item.key" class="info-item">
            <span class="info-label">{{ item.label }}：</span>
            <span class="info-value">{{ item.value }}</span>
          </div>
        </div>
      </div>
    </div>
  </Modal>
</template>

<style scoped>

.modal-content {
  padding: 20px;
}

.two-column-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px; /* 两列之间的间距 */
}

.info-column {
  display: flex;
  flex-direction: column;
  gap: 12px; /* 行之间的间距 */
}

.info-item {
  display: grid;
  grid-template-columns: 110px 1fr; /* 固定标签宽度，确保value对齐 */
  align-items: flex-start; /* 顶部对齐 */
  line-height: 1.5;
}

.info-label {
  font-weight: 500;
  text-align: left; /* 标签右对齐，增强对齐感 */
  padding-right: 12px;
  white-space: nowrap; /* 防止标签换行 */
}

.info-value {
  word-break: break-word; /* 长内容自动换行 */
}

/* 响应式调整 - 在小屏幕上自动切换为单列 */
/* @media (max-width: 600px) {
  .two-column-grid {
    grid-template-columns: 1fr;
  }

  .info-item {
    grid-template-columns: 100px 1fr;
  }
} */
</style>
