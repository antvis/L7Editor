import { css } from '@emotion/css';
import { theme } from 'antd';

export const useStyle = () => {
  const { useToken } = theme;
  const { token } = useToken();
  const { colorBgElevated, colorFillSecondary } = token;
  return {
    cascaderPopup: css`
      .ant-cascader-dropdown .ant-cascader-menu {
        height: 260px !important;
      }
      *::-webkit-scrollbar {
        width: 8px;
        background-color: ${colorBgElevated};
      }
      *::-webkit-scrollbar-thumb {
        background-color: ${colorFillSecondary};
        border-radius: 10px;
      }
    `,
  };
};
