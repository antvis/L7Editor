import { css } from '@emotion/css';
import { theme } from 'antd';

const useStyle = () => {
  const { useToken } = theme;
  const { token } = useToken();
  const {
    colorBgContainer,
    boxShadow,
  } = token;
  return {
    l7FilterPanel: css`
      position: relative;
    `,
    l7Filter: css`
      display: flex;
      background: ${colorBgContainer};
      padding: 16px;
      margin-right: 8px;
      position: absolute;
      right: 35px;
      bottom: 0;
      box-shadow: ${boxShadow} !important;
      .ant-form-item {
        margin-bottom: 0;
      }
      .ant-btn {
        margin-left: px;
      }
    `,
  };
};
export default useStyle;
