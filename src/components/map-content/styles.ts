import { css } from '@emotion/css';
import { theme } from 'antd';

const useStyle = () => {
  const { useToken } = theme;
  const { token } = useToken();
  const { colorBgContainer, colorPrimary, colorTextTertiary } = token;
  return {
    mapContent: css`
      display: flex;
      width: 100%;
      height: 100%;
      .ant-tabs {
        width: 100%;
        .ant-tabs-nav {
          margin: 0 !important;
        }

        .ant-tabs-content-holder {
          height: calc(100% - 46px);
        }

        .ant-tabs-tabpane,
        .ant-tabs-content {
          height: 100%;
        }
        .ant-tabs-tab-active .ant-tabs-tab-btn .anticon {
          color: ${colorPrimary};
        }

        .ant-tabs-nav-list {
          margin-left: 12px;
        }
      }
    `,
    mapContentSelect: css`
      position: absolute;
      right: 0;
      z-index: 1;
      margin: 7px 12px;
      .ant-select-selector {
        border-width: 0px !important;
      }
    `,
    mapContentSelectLabel: css`
      color: ${colorTextTertiary};
      font-size: 13px;
    `,
    mapContentRight: css`
      height: 100%;
      width: calc(100% - 50px);
      background-color: ${colorBgContainer};
    `,
  };
};
export default useStyle;
