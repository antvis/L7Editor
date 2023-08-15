import { css } from '@emotion/css';
import { theme } from 'antd';

const useStyle = () => {
  const { useToken } = theme;
  const { token } = useToken();

  const { colorBgContainer, colorBorder, colorTextDescription, colorText } =
    token;
  return {
    zoom: css`
      .l7-button-control {
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
export default useStyle;
