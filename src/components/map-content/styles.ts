import { css } from '@emotion/css';
import { theme } from 'antd';

const useStyle = () => {
  const { useToken } = theme;
  const { token } = useToken();
  const { colorBgContainer, colorPrimary } = token;
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
    mapContentRight: css`
      height: 100%;
      width: calc(100% - 50px);
      background-color: ${colorBgContainer};
    `,
  };
};
export default useStyle;
