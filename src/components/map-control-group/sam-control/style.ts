import { css } from '@emotion/css';
import { theme } from 'antd';

const useStyle = () => {
  const { useToken } = theme;
  const { token } = useToken();

  const { colorBgContainer, boxShadow, colorIcon, colorText } = token;
  return {
    sam: css`
      background-color: ${colorBgContainer} !important;
      padding: 0px !important;
      color: ${colorIcon} !important;
      &:hover {
        color: ${colorText} !important;
        background: ${colorBgContainer} !important;
      }
    `,
    samSvg: css`
      font-size: 20px;
    `,
    marker: css`
      color: #fff;
      background: #ff0000;
      font-size: 12px;
      padding: 6px;
    `,
  };
};
export default useStyle;
