import { css } from '@emotion/css';
import { theme } from 'antd';

const useStyle = () => {
  const { useToken } = theme;
  const { token } = useToken();
  const { colorBorder } = token;
  const { colorBgElevated, colorFillSecondary } = token;

  return {
    tableContent: css`
      *::-webkit-scrollbar {
        width: 5px;
        background-color: ${colorBgElevated};
      }
      *::-webkit-scrollbar-thumb {
        background-color: ${colorFillSecondary};
        border-radius: 6px;
      }
    `,
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
