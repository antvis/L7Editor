import { css } from '@emotion/css';
import { theme } from 'antd';

const useStyle = () => {
  const { useToken } = theme;
  const { token } = useToken();
  const { colorBorder } = token;

  return {
    editableCell: css`
      position: relative;
    `,
    editableCellValueWrap: css`
      padding: 3px 12px;
      cursor: pointer;
      &:hover {
        border: 1px solid ${colorBorder};
        border-radius: 2px;
        padding: 2px 11px;
        cursor: pointer;
      }
    `,
  };
};
export default useStyle;
