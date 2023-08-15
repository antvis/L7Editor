import { css } from '@emotion/css';
import { theme } from 'antd';

const useStyle = () => {
  const { useToken } = theme;
  const { token } = useToken();

  const { boxShadow } = token;
  return {
    l7ButtonControl: css`
      min-width: auto;
      width: 28px;
      height: 28px;
      border: none;
      box-shadow: ${boxShadow};
      cursor: pointer;
      border-radius: 2px;
      .ant-color-picker-color-block {
        width: 22px;
        height: 22px;
        border-radius: 2px;
      }
    `,
  };
};
export default useStyle;
