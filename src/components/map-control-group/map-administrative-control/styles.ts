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
      box-shadow: ${boxShadow};
    `,
    regionLocation: css`
      background: ${colorBgContainer} !important;
      color: ${colorText} !important;
      padding: 2px 4px !important;
    `,
  };
};
export default useStyle;
