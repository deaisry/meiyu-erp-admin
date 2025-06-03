<script lang="ts" setup>
import { ref } from 'vue';

import { Page } from '@vben/common-ui';

import { Button, message,Switch } from 'ant-design-vue';
import {selectDeptMem} from '#/api/human/human';
import { useVbenForm } from '#/adapter/form';
import { ElCard,ElSteps,ElStep } from 'element-plus';
import {
  meetingTypeOptions,
  meetingPlaceOptions,
  meetingConveneOptions,
  departmentOptions,
} from '@vben/types';

// 表单配置相关
const currentTab = ref(0);
const needMerge = ref(true);
const meetingContent = ref('');
function onFirstSubmit(values: Record<string, any>) {
  message.success({
    content: `form1 values: ${JSON.stringify(values)}`,
  });
  currentTab.value = 1;
}
function onSecondReset() {
  currentTab.value = 0;
}
function onSecondSubmit(values: Record<string, any>) {
  message.success({
    content: `form2 values: ${JSON.stringify(values)}`,
  });
}

const [FirstForm, firstFormApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
  },
  handleSubmit: onFirstSubmit,
  layout: 'horizontal',
  resetButtonOptions: {
    show: false,
  },
  schema: [
    {
      component: 'Select',
      componentProps: {
        options: meetingTypeOptions,
        placeholder: '请选择会议类型',
        allowClear: true,
        filterOption: true,
        showSearch: true,
      },
      fieldName: 'meetingType',
      label: '会议类型',
      // rules: 'required',
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入会议名称',
      },
      fieldName: 'meetingName',
      label: '会议名称',
      // rules: 'required',
    },
    {
      component: 'Select',
      componentProps: {
        options: meetingPlaceOptions,
      },
      fieldName: 'meetingPlace',
      label: '会议地点',
      // rules: 'required',
    },
    // {
    //   component:'Cascader',
    //   componentProps:{
    //     multiple: true,
    //     placeholder:'请选择与会人',
    //     options: departmentOptions,
    //   },
    //   fieldName:'participants',
    //   label:'与会人员',
    //   rules: 'required',
    // },   
     {
      component:'Input',
      fieldName:'participants',
      label:'与会人员',
      // rules: 'required',
    },
    {
    component: 'DatePicker',
    fieldName: 'meetingTime',
    label: '会议时间',
    componentProps: {
      showTime: true,   // 启用时间选择（分钟）
      format: 'YYYY-MM-DD HH:mm:ss',    // 显示格式（不需要秒）
      valueFormat: 'YYYY-MM-DD HH:mm:ss', // 绑定值格式（带秒）
      placeholder: '请选择会议时间',
      type:'datetime',
    },
    // rules: 'required',
    },
  ],
  submitButtonOptions: {
    content: '下一步',
  },
  wrapperClass: 'grid-cols-1 md:grid-cols-1 lg:grid-cols-1',
});

const [SecondForm, secondFormApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
  },
  handleReset: onSecondReset,
  handleSubmit: onSecondSubmit,
  layout: 'vertical',
  resetButtonOptions: {
    content: '上一步',
  },
  schema: [
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入备注信息（可选）',
        autosize: { minRows: 3, maxRows: 6 }
      },
      fieldName: 'comment',
      label: '备注',
    },
  ],
  wrapperClass: 'grid-cols-1 md:grid-cols-1 lg:grid-cols-1',
});


async function handleMergeSubmit() {
  const values = await firstFormApi
    .merge(secondFormApi)
    .submitAllForm(needMerge.value);
  message.success({
    content: `merged form values: ${JSON.stringify(values)}`,
  });
}
const textarea = ref('')
</script>

<template>
  <Page
    title="新建会议"
  >
    <ElCard title="基础示例">
      <template #extra>
        <Switch
          v-model:checked="needMerge"
          checked-children="开启字段合并"
          class="mr-4"
          un-checked-children="关闭字段合并"
        />
        <Button type="primary" @click="handleMergeSubmit">合并提交</Button>
      </template>
      <div class="mx-auto max-w-lg">
        <ElSteps :active="currentTab" class="steps mb-8">
          <ElStep title="会议基本信息" description="填写基础会议信息" />
          <ElStep title="会议纪要" description="详细记录会议内容" />
        </ElSteps>
        <div class="p-20">
          <FirstForm v-show="currentTab === 0" />
          <SecondForm v-show="currentTab === 1" />
         <!-- 表单内容区域 -->
         <div class="p-6 bg-white rounded-lg shadow">
          <!-- 议纪要 -->
          <div v-show="currentTab === 1">
            <div class="mb-6">
              <label class="block text-lg font-medium text-gray-700 mb-2">
                会议纪要
                <span class="text-red-500">*</span>
              </label>
              
              <textarea
                v-model="meetingContent"
                class="w-full p-4 text-base border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                :class="{'border-red-500': !meetingContent.trim()}"
                placeholder="请输入详细的会议内容，包括决议事项、行动计划等..."
                rows="12"
                spellcheck="true"
              ></textarea>
              
              <div class="text-sm text-gray-500 mt-2 flex justify-between">
                <div v-if="!meetingContent.trim()" class="text-red-500">
                  会议纪要不能为空
                </div>
                <div v-else>
                  已输入 {{ meetingContent.length }} 字符
                </div>
                <!-- <div>
                  <a href="#" class="text-blue-600 hover:underline" @click.prevent="meetingContent = defaultMeetingTemplate">
                    重置模板
                  </a>
                </div> -->
              </div>
            </div>
            </div>
            <SecondForm />
          </div>
        </div>
      </div>
    </ElCard>
  </Page>
</template>
