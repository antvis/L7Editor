import { css } from '@emotion/css';
import { theme } from 'antd';

const useStyle = () => {
  const { useToken } = theme;
  const { token } = useToken();
  const { colorBgContainer } = token;
  return {
    mapContent: css`
      display: flex;
      height: 100%;
    `,
    mapContentRight: css`
      height: 100%;
      width: 100%;
      background-color: ${colorBgContainer};
    `,
  };
};
export default useStyle;
