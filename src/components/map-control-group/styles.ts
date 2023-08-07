import { css } from '@emotion/css';
import { theme } from 'antd';

const useStyle = () => {
  const { useToken } = theme;
  const { token } = useToken();

  const { colorBgContainer, boxShadow } = token;
  return {
    l7amap: css`
      width: 28px;
      height: 28px;
      line-height: 28px;
      text-align: center;
      border-radius: 2px;
      background-color: ${colorBgContainer};
      box-shadow: ${boxShadow} !important;
    `,
    amapInfo: css`
      margin-top: 10px;
      .ant-checkbox-group {
        width: 370px;
        display: flex;
        flex-wrap: wrap;

        .ant-checkbox-wrapper {
          position: relative;
          margin-left: 8px;

          .ant-checkbox {
            position: absolute;
            left: 10px;
            top: 4px;
          }
        }
      }
    `,
    amapInfoItemImage: css`
      width: 142px;
      height: 80px;
      margin-bottom: 8px;
      object-fit: cover;
    `,
    amapInfoItem: css`
      text-align: center;
      margin-bottom: 10px;
    `,
    l7FilterSwitch: css`
      width: 30px;
      height: 30px;
      text-align: center;
      background: ${colorBgContainer};
      box-shadow: ${boxShadow} !important;
      font-size: 16px;
      cursor: pointer;
    `,
    l7Filter: css`
      display: flex;
      background: ${colorBgContainer};
      padding: 16px;
      margin-right: 8px;
      box-shadow: ${boxShadow} !important;
    `,
    l7DrawSwitch: css`
      height: 30px;
      width: 30px;
      display: flex;
      overflow: hidden;
      background: ${colorBgContainer};
      border-radius: 2px;
      box-shadow: ${boxShadow} !important;
    `,
    l7AmapControl: css`
      font-size: 16px;
      border: none;
      cursor: pointer;
    `,
    l7LocationSearch: css`
      box-shadow: ${boxShadow} !important;
    `,
    filterBetween: css`
      display: flex;
      justify-content: space-between;
      align-items: baseline;
    `,
    l7DrawControl: css`
      .l7-draw-control {
        box-shadow: ${boxShadow} !important;
      }
    `,
    l7ButtonControl: css`
      min-width: 28px;
      height: 28px;
      border: none;
      box-shadow: ${boxShadow};
      cursor: pointer;
    `,
  };
};
export default useStyle;
