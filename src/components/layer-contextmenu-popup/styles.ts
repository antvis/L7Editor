import { css } from '@emotion/css';
import { theme } from 'antd';

const { useToken } = theme;

const useStyle = () => {
  const { token } = useToken();
  const { colorBgContainer } = token;
  return {
    layerPopupContent: css`
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
    layerPopupCopyRow: css`
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
      &:last-child {
        margin-bottom: 0;
      }
    `,
    layerPopupCopyText: css`
      margin-right: 16px;
    `,
    layerPopupCopyButton: css`
      padding: 0;
      height: auto;
    `,
  };
};
export default useStyle;
