<script lang="ts" setup>
import { ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import DragFileUploader from './DragFileUploader.vue';

const data = ref();

const props = defineProps<{
  buttonText?: string;
  limit?: number;
  multiple?: boolean;
  templateType: string;
  uploadButtonText?: string;
  uploadUrl: string;
}>();

const [Modal, modalApi] = useVbenModal({
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
  <Modal>
    <DragFileUploader />
  </Modal>
</template>
