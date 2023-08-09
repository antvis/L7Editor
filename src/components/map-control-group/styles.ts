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
      width: 28px;
      height: 28px;
      text-align: center;
      background: ${colorBgContainer};
      box-shadow: ${boxShadow} !important;
      font-size: 16px;
      cursor: pointer;
      .l7-draw-control__btn {
        width: 28px !important;
        height: 28px !important;
      }
    `,
    l7FilterPanel: css`
      position: relative;
    `,
    l7Filter: css`
      display: flex;
      background: ${colorBgContainer};
      padding: 16px;
      margin-right: 8px;
      position: absolute;
      right: 40px;
      box-shadow: ${boxShadow} !important;
      .ant-form-item {
        margin-bottom: 0;
      }
      .ant-btn {
        margin-left: px;
      }
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
      .larkmap-select-selector {
        height: 30px !important;
        width: 200px;
        border: 0px !important;
      }
    `,
    filterBetween: css`
      display: flex;
      justify-content: space-between;
      align-items: baseline;
    `,
    l7DrawControl: css`
      .l7-draw-control {
        box-shadow: ${boxShadow} !important;
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-right: 0 !important;
        .l7-draw-control__btn {
          border-bottom: 1px solid #e0e0e0;
        }
      }
    `,
    clear: css`
      width: 30px;
      height: 30px;
      line-height: 34px;
      text-align: center;
      border-radius: 2px;
      background-color: ${colorBgContainer};
      box-shadow: ${boxShadow} !important;
      cursor: pointer;
      &:hover {
        background-color: #dddfe0;
      }
    `,
    clearSvg: css`
      font-size: 16px;
    `,
    auto: css`
    .ant-btn{
      border-radius: 4px;
    }
    .ant-btn-default:disabled {
      background-color: #c2c2c2; !important;
    }
    `,
    l7ButtonControl: css`
      min-width: auto;
      width: 28px;
      height: 28px;
      border: none;
      box-shadow: ${boxShadow};
      cursor: pointer;
      border-radius: 2px;
      .ant-color-picker-color-block {
        border-radius: 2px;
        width: 22px;
        height: 22px;
      }
    `,
    l7LocationSearchPanel: css`
      display: flex;
      > * {
        margin-right: 8px;
      }
    `,
  };
};
export default useStyle;
