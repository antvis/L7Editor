import { css } from '@emotion/css';
import { theme } from 'antd';

const { useToken } = theme;

const useStyle = () => {
  const { token } = useToken();
  const { colorBgContainer, colorBgElevated, colorFillSecondary } = token;
  return {
    layerPopupContent: css`
      width: 300px !important;
      z-index: 1000;
      .l7-popup-tip {
        border-top-color: ${colorBgContainer} !important;
      }
      .l7-popup-content {
        background: ${colorBgContainer} !important;
      }
    `,
    layerPopup: css`
      background: ${colorBgContainer} !important;
    `,
    layerPopupInfo: css`
      *::-webkit-scrollbar {
        width: 8px;
        background-color: ${colorBgElevated};
      }
      *::-webkit-scrollbar-thumb {
        background-color: ${colorFillSecondary};
        border-radius: 10px;
      }
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
    form: css`
      .ant-form-item {
        margin-bottom: 0px !important;
      }
    `,
    layerPopupBtnGroup: css`
      display: flex;
      justify-content: space-between;
      align-items: center;
    `,
    addField: css`
      display: flex;
      align-items: center;
    `,
    addBut: css`
      padding: 4px;
      margin-left: 4px;
    `,
    addItem: css``,
  };
};
export default useStyle;
