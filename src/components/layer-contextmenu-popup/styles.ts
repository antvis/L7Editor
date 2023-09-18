import { css } from '@emotion/css';
import { theme } from 'antd';

const { useToken } = theme;

const useStyle = () => {
  const { token } = useToken();
  const { colorBgContainer, colorText, colorFillSecondary } = token;
  return {
    layerPopupContent: css`
      background: ${colorBgContainer} !important;
      .l7-popup-tip {
        border-top-color: ${colorBgContainer} !important;
      }
      .l7-popup-content {
        background: ${colorBgContainer} !important;
      }
      padding: 4px;
      border-radius: 8px;
    `,
    layerPopupCopyRow: css`
      color: ${colorText};
      font-size: 13px;
      border-radius: 4px;
      padding: 8px;
      &:last-child {
        margin-bottom: 0;
      }
      &:hover {
        background: ${colorFillSecondary};
      }
    `,
    layerPopupCopyButton: css`
      padding: 0;
      height: auto;
    `,
  };
};
export default useStyle;
