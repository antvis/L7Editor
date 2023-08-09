import { css } from '@emotion/css';

const useStyle = () => {
  return {
    appEditor: css`
      width: 100%;
      height: 100%;
      position: relative;
      .react-monaco-editor-container {
        width: 100%;
        height: 100%;
      }
    `,
  };
};
export default useStyle;
