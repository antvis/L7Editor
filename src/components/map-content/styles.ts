import { css } from '@emotion/css';

const useStyle = () => {
  return {
    mapContent: css`
      display: flex;
      height: 100%;
    `,
    mapContentRight: css`
      height: 100%;
      width: 100%;
    `,
  };
};
export default useStyle;
