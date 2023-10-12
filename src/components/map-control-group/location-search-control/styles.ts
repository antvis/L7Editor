import { css } from '@emotion/css';

const useStyle = () => {
  return {
    locationSearch: css`
      min-width: 200px;
      .ant-select-selector {
        .ant-select-selection-item {
          .option-tip {
            display: none;
          }
        }
      }
    `,
    locationSearchName: css`
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    `,
    locationSearchTip: css`
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      color: #818181;
      font-size: 12px;
    `,
  };
};

export default useStyle;
