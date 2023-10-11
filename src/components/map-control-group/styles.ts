import { css } from '@emotion/css';
import { theme } from 'antd';

const useStyles = () => {
  const { useToken } = theme;
  const { token } = useToken();

  const {
    colorBgContainer,
    colorBorder,
    colorTextDescription,
    colorText,
    boxShadow,
    colorIcon,
  } = token;
  return {
    L7EditorControl: css`
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 2px;
      width: 28px;
      height: 28px;
      padding: 0;
      text-align: center;
      background: ${colorBgContainer};
      box-shadow: ${boxShadow} !important;
      border-width: 0;
      color: ${colorIcon};
      outline: 0;
      cursor: pointer;
      &:hover {
        background: ${colorBgContainer};
        svg {
          color: ${colorText};
        }
      }
    `,
    l7EditorIcon: css`
      font-size: 16px;
      border: none;
      cursor: pointer;
      color: ${colorIcon};
    `,
    zoom: css`
      .l7-button-control {
        color: ${colorTextDescription};
        font-size: 14px;
        background: ${colorBgContainer} !important;
        border-color: ${colorBorder};

        svg {
          fill: ${colorTextDescription} !important;
        }

        &:hover {
          svg {
            fill: ${colorText} !important;
          }
        }
      }
      .l7-button-control:first-child {
        border-bottom: 1px solid ${colorBorder};
      }
    `,
    scalesControl: css`
      .l7-control-scale-line {
        color: ${colorTextDescription};
        background: ${colorBgContainer} !important;
        border-color: ${colorBorder};
      }
    `,
    fullScreen: css`
      color: ${colorTextDescription};
      background: ${colorBgContainer} !important;
      border-color: ${colorBorder};

      svg {
        fill: ${colorTextDescription} !important;
      }

      &:hover {
        svg {
          fill: ${colorText} !important;
        }
      }
    `,
  };
};
export default useStyles;
