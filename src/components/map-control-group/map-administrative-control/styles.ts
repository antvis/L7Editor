import { css } from '@emotion/css';
import { theme } from 'antd';

const useStyle = () => {
  const { useToken } = theme;
  const { token } = useToken();

  const { colorText, colorBgContainer, boxShadow } = token;
  return {
    mapAdministrative: css`
      background: ${colorBgContainer};
      color: ${colorText};
      padding: 2px 6px;
      box-shadow: ${boxShadow};
    `,
    regionLocation: css`
      background: ${colorBgContainer} !important;
      color: ${colorText} !important;
    `,
  };
};
export default useStyle;
