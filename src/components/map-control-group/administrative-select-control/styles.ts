import { css } from '@emotion/css';
import { theme } from 'antd';

export const useStyle = () => {
  const { useToken } = theme;
  const { token } = useToken();
  const {
    colorBgElevated,
    colorFillSecondary,
    colorBgContainer,
    colorBorder,
    colorText,
  } = token;
  return {
    cascader: css`
      .ant-select-selector {
        border-radius: 0;
        border-radius: 6px 0 0 6px;
      }
    `,
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
    history: css`
      background: ${colorBgContainer};
      border-right: none;
      border-radius: 0 6px  6px 0;
      border: 1px solid ${colorBorder};
      border-bottom: 1px solid ${colorBorder} !important;
      :hover {
        color: ${colorText};
        background: ${colorBgContainer};
      }
    `,
    historyIcon: css`
      font-size: 20px;
    `,
  };
};
