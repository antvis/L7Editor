import { css } from '@emotion/css';
import { theme } from 'antd';

const useStyle = () => {
  const { useToken } = theme;
  const { token } = useToken();

  const {
    colorBgContainer,
    boxShadow,
    colorBorder,
    colorIcon,
    colorTextDescription,
    colorText,
    colorPrimary,
    colorBgElevated,
    colorFillSecondary,
    colorTextPlaceholder,
  } = token;
  return {
    control: css`
      .l7-button-control {
        background: ${colorBgContainer} !important;
      }
    `,
    l7amap: css`
      width: 28px;
      height: 28px;
      line-height: 28px;
      text-align: center;
      border-radius: 2px;
      background-color: ${colorBgContainer};
      box-shadow: ${boxShadow} !important;
      &:hover {
        color: ${colorText};
      }
    `,
    amapInfo: css`
      margin-top: 10px;
      .ant-checkbox-group {
        display: flex;
        flex-wrap: wrap;
        width: 370px;

        .ant-checkbox-wrapper {
          position: relative;
          margin-left: 8px;

          .ant-checkbox {
            position: absolute;
            top: 4px;
            left: 10px;
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
        color: ${colorIcon};
        border-right: none !important;
        &:hover {
          color: ${colorText};
          background: ${colorBgContainer};
        }
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
      left: 40px;
      bottom: 0;
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
      color: ${colorIcon};
    `,
    l7LocationSearch: css`
      .larkmap-location-search {
        border-radius: 2px;
        overflow: hidden;
      }
      .larkmap-select-selector {
        width: 200px;
        height: 30px !important;
        background: ${colorBgContainer} !important;
        border: 0px !important;
        .larkmap-select-selection-placeholder {
          color: ${colorTextPlaceholder} !important;
        }
        .larkmap-location-search__option-name {
          color: ${colorText};
        }
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
          border-bottom: 1px solid ${colorBorder};
          background-color: ${colorBgContainer};
          border-right: none;
          color: ${colorIcon};

          &
        }
      }
    `,
    clear: css`
      width: 30px;
      height: 30px;
      line-height: 41px;
      text-align: center;
      border-radius: 2px;
      background-color: ${colorBgContainer};
      box-shadow: ${boxShadow} !important;
      cursor: pointer;
      color: ${colorIcon};
      &:hover {
        color: ${colorText};
        background: ${colorBgContainer};
      }
    `,
    clearSvg: css`
      font-size: 24px;
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
        width: 22px;
        height: 22px;
        border-radius: 2px;
      }
    `,
    l7LocationSearchPanel: css`
      display: flex;
      > * {
        margin-right: 8px;
      }
    `,
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
    mapTheme: css`
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
    mapThemePopper: css`
      *::-webkit-scrollbar {
        width: 8px;
        background-color: ${colorBgElevated};
      }
      *::-webkit-scrollbar-thumb {
        background-color: ${colorFillSecondary};
        border-radius: 10px;
      }
      .l7-popper-content {
        color: ${colorText};
        background: ${colorBgContainer};

        .l7-select-control-item:hover {
          box-shadow: 0 5px 12px 4px rgba(0, 0, 0, 0.09),
            0 3px 6px 0 rgba(0, 0, 0, 0.12), 0 1px 2px -2px rgba(0, 0, 0, 0.16);
        }

        .l7-select-control-item {
          border: 1px solid ${colorBorder};
          border-radius: 4px;
        }

        .l7-select-control-item-active {
          border: 1px solid ${colorPrimary};
        }
      }

      &.l7-popper-right .l7-popper-arrow  {
        border-right-color: ${colorBgElevated};
      }

      &.l7-popper-left .l7-popper-arrow  {
        border-left-color: ${colorBgElevated};
      }

      &.l7-popper-bottom .l7-popper-arrow  {
        border-bottom-color: ${colorBgElevated};
      }

      &.l7-popper-top .l7-popper-arrow  {
        border-top-color: ${colorBgElevated};
      }
    `,
    locationSearcheContainer: css`
      .larkmap-location-search {
        background-color: ${colorBgContainer};
      }

      .larkmap-select-selection-search {
        color: ${colorText};

        .larkmap-select-selection-search-input {
          color: ${colorText};
        }
      }

      .larkmap-select-clear {
        display: none !important;
      }
    `,

    locationSearche: css`
      width: 200px;
      background-color: ${colorBgContainer};

      .larkmap-select-item-empty,
      .larkmap-location-search__option-name {
        color: ${colorText};
      }

      .larkmap-select-item-option-active {
        background: ${colorBgElevated};
      }
    `,
  };
};
export default useStyle;
