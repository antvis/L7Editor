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
        border-radius: 4px;
      }
      *::-webkit-scrollbar-corner {
        background-color: ${colorBgElevated};
      }
    `,
    editableCell: css`
      position: relative;
    `,
    editableCellValueWrap: css`
      padding: 3px 12px;
      cursor: pointer;
      &:hover {
        padding: 2px 11px;
        border: 1px solid ${colorBorder};
        border-radius: 2px;
        cursor: pointer;
      }
    `,
  };
};
export default useStyle;
