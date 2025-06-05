<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

import {
  meetingConveneOptions,
  meetingPlaceOptions,
  meetingTypeOptions,
} from '@vben/types';

import { Button } from 'ant-design-vue';
import { ElAvatar, ElCard, ElTag } from 'element-plus';

import { fetchMeetingDetail } from '#/api/meeting/meeting';

import InfoItem from './InfoItem.vue';

const router = useRouter();
const meetingInfo = ref({
  meetingId: '',
  meetingType: '',
  meetingName: '',
  meetingPlace: '',
  meetingTime: '',
  participants: '',
  recorder: '',
  meetingContent: '',
  comment: '',
  isConvene: 0,
  participantsCount: 0,
});

async function loadMeetingDetail() {
  try {
    debugger;
    const curMeetingId = router.currentRoute.value.params.meetingId;
    const response = await fetchMeetingDetail(curMeetingId);
    meetingInfo.value = response.data;
  } catch (error) {
    console.error('加载会议详情失败', error);
  }
}

// 解析与会人员数据
const participants = computed(() => {
  if (!meetingInfo.value.participants) return [];

  return meetingInfo.value.participants.split(',').map((p) => {
    // 在实际应用中，这里应该通过API获取人员详细信息
    return {
      name: p.trim(),
      department: p.trim().length > 2 ? `${p.trim()}部门` : '未知部门',
      avatar: `https://randomuser.me/api/portraits/men/${Math.floor(Math.random() * 50)}.jpg`,
    };
  });
});

// 解析决议事项（示例数据）
const resolutions = ref([
  {
    content: '完成新版本产品功能设计文档',
    owner: '张设计师',
    deadline: '2023-11-15',
    status: 'completed',
  },
  {
    content: '开发会议管理系统新功能',
    owner: '李开发',
    deadline: '2023-11-30',
    status: 'in-progress',
  },
  {
    content: '组织团队建设活动',
    owner: '王经理',
    deadline: '2023-12-10',
    status: 'not-started',
  },
]);

// 会议类型文本
const meetingTypeText = computed(() => {
  return mapEnumValue(meetingTypeOptions, meetingInfo.value.meetingType);
});

// 会议地点文本
const meetingPlaceText = computed(() => {
  return mapEnumValue(meetingPlaceOptions, meetingInfo.value.meetingPlace);
});

// 会议状态文本
const meetingStatusText = computed(() => {
  return mapEnumValue(meetingConveneOptions, meetingInfo.value.isConvene);
});

// 会议状态标签类型
const meetingStatusTagType = computed(() => {
  return meetingInfo.value.isConvene === 1 ? 'success' : 'info';
});

// 格式化会议时间
const formatMeetingTime = computed(() => {
  if (!meetingInfo.value.meetingTime) return '未设置';

  const [date, time] = meetingInfo.value.meetingTime.split(' ');
  return `${date} ${time.slice(0, 5)}`;
});

// 模拟枚举值映射函数
function mapEnumValue(options: any, value: any) {
  const option = options.find((opt: any) => opt.value === value);
  return option ? option.label : '未知';
}
// 返回会议列表
function goBack() {
  router.push('/meeting');
}

// 编辑会议
function editMeeting() {
  router.push(`/meeting/edit/${meetingId.value}`);
}

onMounted(() => {
  debugger;
  loadMeetingDetail();
});
</script>

<template>
  <Page title="会议详情">
    <div class="meeting-detail-container">
      <!-- 头部操作区 -->
      <div class="header-actions">
        <Button type="primary" @click="goBack">返回会议列表</Button>
        <Button type="primary" @click="editMeeting">编辑会议</Button>
      </div>

      <!-- 基础信息卡片 -->
      <ElCard class="info-card">
        <template #header>
          <div class="card-header">
            <h2 class="meeting-title">{{ meetingInfo.meetingName }}</h2>
            <ElTag :type="meetingStatusTagType" size="large">
              {{ meetingStatusText }}
            </ElTag>
          </div>
        </template>

        <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <InfoItem label="会议类型" :value="meetingTypeText" icon="calendar" />
          <InfoItem
            label="会议地点"
            :value="meetingPlaceText"
            icon="location"
          />
          <InfoItem label="会议时间" :value="formatMeetingTime" icon="clock" />
          <InfoItem
            label="记录人"
            :value="meetingInfo.recorder || '未指定'"
            icon="user"
          />
        </div>
      </ElCard>

      <!-- 与会人员卡片 -->
      <ElCard class="info-card">
        <template #header>
          <div class="card-header">
            <h3>与会人员</h3>
            <span class="participant-count"
              >{{ meetingInfo.participantsCount || 0 }}人</span
            >
          </div>
        </template>

        <div class="participants-container">
          <div
            v-for="(participant, index) in participants"
            :key="index"
            class="participant-item"
          >
            <ElAvatar :size="40" :src="participant.avatar" class="mr-3">
              {{ participant.name.charAt(0) }}
            </ElAvatar>
            <div>
              <div class="participant-name">{{ participant.name }}</div>
              <div class="participant-department">
                {{ participant.department }}
              </div>
            </div>
          </div>
        </div>
      </ElCard>

      <!-- 会议纪要卡片 -->
      <ElCard class="info-card">
        <template #header>
          <div class="card-header">
            <h3>会议纪要</h3>
          </div>
        </template>

        <div class="meeting-content">
          <pre>{{ meetingInfo.meetingContent }}</pre>
        </div>
      </ElCard>

      <!-- 决议事项卡片 -->
      <ElCard class="info-card">
        <template #header>
          <div class="card-header">
            <h3>决议事项</h3>
          </div>
        </template>

        <div class="resolutions-container">
          <div
            v-for="(resolution, index) in resolutions"
            :key="index"
            class="resolution-item"
          >
            <div class="resolution-header">
              <div class="resolution-index">决议{{ index + 1 }}</div>
              <ElTag v-if="resolution.status === 'completed'" type="success">
                已完成
              </ElTag>
              <ElTag
                v-else-if="resolution.status === 'in-progress'"
                type="warning"
              >
                进行中
              </ElTag>
              <ElTag v-else type="info">未开始</ElTag>
            </div>
            <div class="resolution-content">{{ resolution.content }}</div>
            <div class="resolution-footer">
              <div>
                <span class="label">负责人：</span>{{ resolution.owner }}
              </div>
              <div>
                <span class="label">截止日期：</span>{{ resolution.deadline }}
              </div>
            </div>
          </div>
        </div>
      </ElCard>

      <!-- 备注信息卡片 -->
      <ElCard v-if="meetingInfo.comment" class="info-card">
        <template #header>
          <div class="card-header">
            <h3>备注信息</h3>
          </div>
        </template>

        <div class="comment-content">
          {{ meetingInfo.comment }}
        </div>
      </ElCard>
    </div>
  </Page>
</template>

<style scoped>
.meeting-detail-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.header-actions {
  display: flex;
  justify-content: space-between;
  margin-bottom: 24px;
}

.info-card {
  margin-bottom: 24px;
  border-radius: 8px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
}

.meeting-title {
  margin: 0;
  font-size: 1.5rem;
  font-weight: bold;
}

.participants-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}

.participant-item {
  display: flex;
  align-items: center;
  padding: 12px;
  border-radius: 6px;
  transition: all 0.3s;
}

.participant-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.participant-name {
  font-weight: 500;
}

.participant-department {
  font-size: 0.85rem;
  color: #718096;
}

.participant-count {
  font-size: 0.9rem;
  color: #4a5568;
  padding: 2px 10px;
  border-radius: 12px;
}

.meeting-content {
  padding: 16px;
  border-radius: 6px;
  font-family: 'Source Sans Pro', 'Helvetica Neue', Arial, sans-serif;
  line-height: 1.6;
  white-space: pre-wrap;
}

.resolutions-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.resolution-item {
  padding: 16px;
  border-left: 4px solid #4299e1;
  border-radius: 0 6px 6px 0;
}

.resolution-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding-bottom: 8px;
}

.resolution-index {
  font-weight: bold;
  color: #2b6cb0;
}

.resolution-content {
  margin-bottom: 12px;
  font-size: 0.95rem;
  line-height: 1.5;
}

.resolution-footer {
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  color: #4a5568;
}

.resolution-footer .label {
  color: #718096;
}

.comment-content {
  padding: 16px;
  border-radius: 6px;
  border-left: 4px solid #ed8936;
  font-style: italic;
  line-height: 1.6;
}

@media (max-width: 768px) {
  .meeting-detail-container {
    padding: 10px;
  }

  .header-actions {
    flex-direction: column;
    gap: 10px;
  }

  .card-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .participants-container,
  .resolutions-container {
    grid-template-columns: 1fr;
  }
}
</style>
