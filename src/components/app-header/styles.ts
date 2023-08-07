import { css } from '@emotion/css';
import { theme } from 'antd';

const useStyle = () => {
  const { useToken } = theme;
  const { token } = useToken();

  const { colorBorder, colorBgBase } = token;
  return {
    mapContentLeft: css`
      height: 33px;
      border-bottom: 1px solid ${colorBorder};
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      background: ${colorBgBase};
      .ant-btn {
        border: 0;
      }
      padding: 0 10px;
    `,
    mapContentRight: css`
      display: flex;
    `,
  };
};
export default useStyle;
