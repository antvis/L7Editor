import { css } from '@emotion/css';
import { theme } from 'antd';

const useStyle = () => {
  const { useToken } = theme;
  const { token } = useToken();

  const { colorBgContainer, boxShadow, colorIcon, colorText } = token;
  return {
    sam: css`
      width: 30px;
      height: 30px;
      line-height: 38px;
      text-align: center;
      border-radius: 2px;
      background-color: ${colorBgContainer};
      box-shadow: ${boxShadow} !important;
      cursor: pointer;
      color: ${colorIcon};
      &:hover {
        color: ${colorText};
        background: ${colorBgContainer};
      }
    `,
    samSvg: css`
      font-size: 20px;
    `,
  };
};
export default useStyle;
