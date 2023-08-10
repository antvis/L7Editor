import { css } from '@emotion/css';
import { theme } from 'antd';

const useStyle = () => {
  const { useToken } = theme;
  const { token } = useToken();

  const {
    colorBgContainer,
    boxShadow,
    colorBorderSecondary,
    colorFillContentHover,
    colorInfoHover,
    colorIcon,
  } = token;
  return {
    resizePanel: css`
      width: 100%;
      height: calc(100% - 50px);
      display: flex;
      position: absolute;
    `,
    resizePanelLeft: css`
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      overflow: hidden;
    `,
    resizePanelRight: css`
      position: relative;
      border-left: 1px solid ${colorBorderSecondary};
      box-shadow: ${boxShadow};
    `,
    resizePanelDragLine: css`
      transition: all 0.5s;

      &:hover,
      &:focus {
        background-color: ${colorInfoHover};
      }
    `,
    resizePanelToggleBtn: css`
      height: 60px;
      width: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: ${colorBgContainer};
      box-shadow: -2px 0 3px ${colorFillContentHover};
      position: absolute;
      top: calc(50% - 30px);
      left: -20px;
      border-top-left-radius: 4px;
      border-bottom-left-radius: 4px;
      cursor: pointer;
      z-index: 2;
      .anticon {
        transition: all 0.2s;
      }
      color: ${colorIcon};
    `,
  };
};
export default useStyle;
