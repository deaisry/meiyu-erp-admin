import { h } from 'vue';

import { setupVbenVxeTable, useVbenVxeGrid } from '@vben/plugins/vxe-table';

import { Progress } from 'ant-design-vue';
import { dayjs, ElButton, ElImage } from 'element-plus';

import { useVbenForm } from './form';

setupVbenVxeTable({
  configVxeTable: (vxeUI) => {
    vxeUI.setConfig({
      grid: {
        align: 'center',
        border: false,
        columnConfig: {
          resizable: true,
        },
        minHeight: 180,
        formConfig: {
          // 全局禁用vxe-table的表单配置，使用formOptions
          enabled: false,
        },
        proxyConfig: {
          autoLoad: true,
          response: {
            result: 'items',
            total: 'total',
            list: 'items',
          },
          showActiveMsg: true,
          showResponseMsg: false,
        },
        round: true,
        showOverflow: true,
        size: 'small',
      },
    });

    // 表格配置项可以用 cellRender: { name: 'CellImage' },
    vxeUI.renderer.add('CellImage', {
      renderTableDefault(_renderOpts, params) {
        const { column, row } = params;
        const src = row[column.field];
        return h(ElImage, { src, previewSrcList: [src] });
      },
    });

    // 表格配置项可以用 cellRender: { name: 'CellLink' },
    vxeUI.renderer.add('CellLink', {
      renderTableDefault(renderOpts) {
        const { props } = renderOpts;
        return h(
          ElButton,
          { size: 'small', link: true },
          { default: () => props?.text },
        );
      },
    });

    vxeUI.renderer.add('CellProgress', {
      renderTableDefault(renderOpts, params) {
        const { row, column } = params;
        const progressValue: any = row[column.field];

        // 处理进度值
        let progress: number;
        if (typeof progressValue === 'number') {
          progress = progressValue;
        } else if (typeof progressValue === 'string') {
          progress = Number.parseFloat(progressValue) || 0;
        } else {
          progress = 0;
        }

        // 确保在有效范围内
        progress = Math.max(0, Math.min(100, progress));

        // 获取时间字段
        const planCompleteTime = row.planCompleteTime;
        const completeTime = row.completeTime;
        // 计算状态（添加超时检测）
        let status: 'active' | 'exception' | 'normal' | 'success';

        if (progress >= 100) {
          status = 'success';
        } else {
          // 检查是否超时
          let isTimeout = false;

          if (planCompleteTime) {
            const planTime = dayjs(planCompleteTime);
            const completeTimeObj = completeTime ? dayjs(completeTime) : null;

            // 如果有实际完成时间且晚于计划时间
            if (completeTimeObj && completeTimeObj.isAfter(planTime)) {
              isTimeout = true;
            }
            // 如果没有完成时间且当前时间晚于计划时间
            else if (!completeTime && dayjs().isAfter(planTime)) {
              isTimeout = true;
            }
          }

          // eslint-disable-next-line prettier/prettier
          status = isTimeout ? 'exception' : (progress > 0 ? 'active' : 'normal');
        }
        return h(Progress, {
          percent: progress,
          status,
          size: 'small',
          strokeWidth: 15,
          class: 'cell-progress',
          // format: (percent) => `${percent}%`,
        });
      },
    });
  },
  useVbenForm,
});

export { useVbenVxeGrid };

export type * from '@vben/plugins/vxe-table';
