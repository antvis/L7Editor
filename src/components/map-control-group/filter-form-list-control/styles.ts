import { css } from '@emotion/css';
import { theme } from 'antd';

const useStyle = () => {
  const { useToken } = theme;
  const { token } = useToken();
  const {
    colorBgContainer,
    boxShadow,
    colorBorder,
    colorIcon,
    colorTextDescription,
    colorText,
    colorPrimary,
    colorBgElevated,
    colorFillSecondary,
    colorTextPlaceholder,
  } = token;
  return {
    l7FilterPanel: css`
      position: relative;
    `,
    l7Filter: css`
      display: flex;
      background: ${colorBgContainer};
      padding: 16px;
      margin-right: 8px;
      position: absolute;
      left: 40px;
      bottom: 0;
      box-shadow: ${boxShadow} !important;
      .ant-form-item {
        margin-bottom: 0;
      }
      .ant-btn {
        margin-left: px;
      }
    `,
    l7FilterSwitch: css`
      width: 28px;
      height: 28px;
      text-align: center;
      background: ${colorBgContainer};
      box-shadow: ${boxShadow} !important;
      font-size: 16px;
      cursor: pointer;
      .l7-draw-control__btn {
        width: 28px !important;
        height: 28px !important;
        color: ${colorIcon};
        border-right: none !important;
        &:hover {
          background: ${colorBgContainer};
          svg {
            color: ${colorText};
          }
        }
      }
    `,
  };
};
export default useStyle;
