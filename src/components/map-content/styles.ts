import { css } from '@emotion/css';
import { theme } from 'antd';

const useStyle = () => {
  const { useToken } = theme;
  const { token } = useToken();

  const { colorBorder } = token;
  return {
    mapContent: css`
      display: flex;
      height: 100%;
    `,
    mapContentRight: css`
      height: 100%;
      width: calc(100% - 33px);
    `,
    mapContentLeft: css`
      height: 100%;
      width: 33px;
      border-right: 1px solid ${colorBorder};
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .ant-btn {
        border: 0;
      }
    `,
  };
};
export default useStyle;
