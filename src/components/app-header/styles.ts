import { css } from '@emotion/css';
import { theme } from 'antd';

const useStyle = () => {
  const { useToken } = theme;
  const { token } = useToken();
  const { colorBorder, colorBgContainer, colorText } = token;

  return {
    mapHeader: css`
      padding: 0 16px;
      height: 50px;
      border-bottom: 1px solid ${colorBorder};
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      background: ${colorBgContainer};
      z-index: 1;
      .ant-btn {
        margin-right: 8px;
        border: 0;
      }
    `,
    mapHeaderLogo: css`
      display: flex;
      align-items: center;
      img {
        width: auto;
        height: 24px;
        margin-right: 4px;
      }
    `,
    mapHeaderTitle: css`
      font-size: 16px;
      font-weight: bold;
      margin-left: 4px;
      margin-right: 16px;
      color: ${colorText};
    `,
    mapHeaderLeft: css`
      display: flex;
      align-items: center;
    `,
    mapHeaderRight: css`
      display: flex;
      align-items: center;
    `,
  };
};
export default useStyle;
