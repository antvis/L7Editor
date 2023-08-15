import { css } from '@emotion/css';
import { theme } from 'antd';

const useStyle = () => {
  const { useToken } = theme;
  const { token } = useToken();

  const { colorBgContainer, boxShadow, colorIcon, colorText } = token;
  return {
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
    l7AmapControl: css`
      font-size: 16px;
      border: none;
      cursor: pointer;
      color: ${colorIcon};
    `,
  };
};
export default useStyle;
