import { css } from '@emotion/css';

const useStyle = () => {
  return {
    layerPopup: css``,
    layerPopupInfo: css`
      margin-bottom: 16px;
      .ant-descriptions {
        max-height: 200px;
        overflow: auto;
      }
      .ant-typography {
        margin-bottom: 0;
        .ant-typography-copy {
          opacity: 0;
        }
        &:hover {
          .ant-typography-copy {
            opacity: 1;
          }
        }
      }
    `,
    layerPopupBtnGroup: css`
      display: flex;
      justify-content: space-between;
    `,
  };
};
export default useStyle;
