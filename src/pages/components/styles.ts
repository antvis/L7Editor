import { css } from '@emotion/css';
import { theme } from 'antd';

const { useToken } = theme;

const useStyle = () => {
  const { token } = useToken();
  const { colorBgContainer } = token;

  return {
    l7Editor: css`
      width: 100%;
      height: 100%;
      position: relative;
      overflow: hidden;
      background: ${colorBgContainer};
    `,
  };
};
export default useStyle;
