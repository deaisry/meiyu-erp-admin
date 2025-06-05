  <script lang="ts" setup>
  import { ref, onMounted, watch } from 'vue';

  import { Page } from '@vben/common-ui';
  // import type {MeetingInfo} from '@vben/types'
  // import {selectDeptMem} from '#/api/human/human'
  import { submitMeetingInfo } from '#/api/meeting/meeting'
  import {message} from 'ant-design-vue';
  import { useVbenForm } from '#/adapter/form';
  import { ElCard, ElSteps, ElStep } from 'element-plus';
  import {
    meetingTypeOptions,
    meetingPlaceOptions,
    // departmentNameMap,

  } from '@vben/types';

  const currentTab = ref(0);
  // 引入部门员工层级下拉菜单组件
  import DepartmentEmployeeSelect from '#/views/utils/DepartmentEmployeeSelect.vue';
  const participantsProps = ref({
    autoLoad: true, // 启用自动加载数据
    placeholder: '请选择部门/人员',
    multiple: true,
    filterable: true,
    clearable: true
  })


  
  // 表单数据
  const meetingContent = ref('');
  const meetingFormData = ref({
    firstForm: {} as Record<string, any>,
    comment: ''
  });

  // 第一步提交函数
  async function onFirstSubmit(values: Record<string, any>) {
    debugger;
    meetingFormData.value.firstForm = values;
    const response = await submitMeetingInfo(values);
    if(response.state == 200){
      message.success('会议基础信息已保存');
      meetingFormData.value.firstForm.meetingId = response.data;
      currentTab.value = 1;
    }else{
      message.error('保存失败');
    }
  }

  // 第二步重置函数
  function onSecondReset() {
    currentTab.value = 0;
  }

  // 第二步提交函数
  async function onSecondSubmit(values: Record<string, any>) {
    meetingFormData.value.comment = values.comment;

    const finalData = {
      ...meetingFormData.value.firstForm,
      meetingContent: meetingContent.value,
      comment: meetingFormData.value.comment
    };
    const response = await submitMeetingInfo(finalData);
    if(response.state == 200){
      message.info("会议纪要提交成功");
    }
    else{
      message.error("会议纪要提交失败");
    }
  }

  // 第一步表单配置
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
    {
      component: DepartmentEmployeeSelect,
      fieldName: 'participants',
      label: '与会人员',
      componentProps: {
        ...participantsProps,
      },
      rules: 'required',
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

  // 第二步表单配置（只包含备注字段）
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
          placeholder: '请输入额外备注信息',
          autosize: { minRows: 3, maxRows: 6 }
        },
        fieldName: 'comment',
        label: '备注（可选）',
      },
    ],
    wrapperClass: 'grid-cols-1',
  });

  // 提供默认会议纪要模板
  const defaultTemplate = `会议主题:
  主持人:
  记录人:

  会议议程:
  1.
  2.

  讨论要点:
  •
  •

  决议事项:
  1.
  2.

  行动计划:
  - 任务1 负责人:  截止日期:
  - 任务2 负责人:  截止日期:

  下次会议时间:`;
  meetingContent.value = defaultTemplate;
  </script>

  <template>
    <Page>
      <ElCard title="创建会议流程">
        <div class="mx-auto max-w-4xl">
          <!-- 步骤指示器 -->
          <ElSteps :active="currentTab" class="steps mb-6" align-center>
            <ElStep title="基本信息" description="填写会议基础信息" />
            <ElStep title="会议纪要" description="记录详细会议内容" />
          </ElSteps>

          <!-- 第一步：会议基础信息 -->
          <div v-show="currentTab === 0" class="p-6">
            <FirstForm />
          </div>

          <!-- 第二步：会议纪要 -->
          <div v-show="currentTab === 1">
            <div class="p-6 bg-gray-50 rounded-lg">
              <div class="mb-4">
                <label class="block text-lg font-semibold text-gray-700 mb-2">
                  会议纪要内容
                  <span class="text-red-500 ml-1">*</span>
                </label>

                <textarea
                  v-model="meetingContent"
                  class="w-full p-4 text-base border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  :class="{'border-red-500': !meetingContent.trim()}"
                  placeholder="请输入详细的会议内容，包括决议事项、行动计划等..."
                  rows="18"
                  spellcheck="true"
                ></textarea>

                <div class="flex justify-between mt-2">
                  <div>
                    <span class="text-sm text-red-500" v-if="!meetingContent.trim()">
                      会议纪要不能为空
                    </span>
                    <span class="text-sm text-gray-500" v-else>
                      已输入 {{ meetingContent.length }} 字符
                    </span>
                  </div>
                  <div>
                    <button
                      type="button"
                      class="text-sm text-blue-600 hover:text-blue-800"
                      @click="meetingContent = defaultTemplate"
                    >
                      使用默认模板
                    </button>
                  </div>
                </div>
              </div>

              <div class="mt-6">
                <SecondForm />
              </div>
            </div>
          </div>
        </div>
      </ElCard>
    </Page>
  </template>

  <style scoped>
  .steps {
    margin: 20px auto;
  }

  textarea {
    font-size: 15px;
    line-height: 1.7;
    transition: all 0.3s ease;
  }

  textarea:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
    outline: none;
  }

  .el-card {
    border-radius: 10px;
    overflow: hidden;
  }

  .el-card__header {
    background: #f7f9fc;
    border-bottom: 1px solid #eaeaea;
  }
  </style>
