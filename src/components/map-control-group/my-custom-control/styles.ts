// src/components/map-control-group/my-custom-control/styles.ts
import { css } from '@emotion/css';

const useStyle = () => {
  return {
    container: css`
      display: flex;
      align-items: center;
      padding: 4px;
    `,
    button: css`
      background: #fff;
      border: 1px solid #ccc;
      padding: 6px 8px;
      border-radius: 4px;
      cursor: pointer;
      &:hover {
        background: #f5f5f5;
      }
    `,
  };
};

export default useStyle;