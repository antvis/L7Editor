import { css } from '@emotion/css';
import { theme } from 'antd';

const { useToken } = theme;

const useStyle = () => {
  const { token } = useToken();
  const { colorBgContainer, colorBgElevated, colorFillSecondary } = token;
  return {
    layerPopupContent: css`
      // .l7-popup-tip {
      //   border-top-color: ${colorBgContainer};
      // }
      // .l7-popup-content {
      //   background: ${colorBgContainer};
      // }
    `,
    layerPopup: css`
      // background: ${colorBgContainer};
    `,
    layerPopupInfo: css`
      margin-bottom: 16px;
      .ant-descriptions {
        max-height: 200px;
        overflow: auto;
      }
      .ant-typography {
        margin-bottom: 0;
        .ant-typography-copy {
          opacity: 0;
        }
        &:hover {
          .ant-typography-copy {
            opacity: 1;
          }
        }
      }
    `,
    layerPopupBtnGroup: css`
      display: flex;
      justify-content: space-between;
    `,
  };
};
export default useStyle;
