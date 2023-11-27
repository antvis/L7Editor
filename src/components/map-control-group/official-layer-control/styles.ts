import { css } from '@emotion/css';
import { theme } from 'antd';

const useStyle = () => {
  const { useToken } = theme;
  const { token } = useToken();
  const { colorBgElevated, colorBgContainer, colorText, colorIcon } = token;
  return {
    mapTab: css`
      background-color: ${colorBgElevated};
      border-radius: 4px;
      display: flex;
      align-items: center;
      &:hover .add-map {
        display: block;
      }
      .add-map {
        display: none;
        text-align: center;
        &:hover {
          display: block;
          color: #1677ff;
        }
      }
    `,
    hideOfficeLayerBtn: css`
      height: 127px;
      width: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: ${colorBgElevated};
      border-radius: 4px;
      // border-bottom-left-radius: 4px;
      cursor: pointer;
      font-size: 16px;
      z-index: 2;
      .anticon {
        transition: all 0.2s;
      }
      color: ${colorIcon};
    `,
    amapInfo: css`
      display: flex;
      align-items: center;
      padding: 10px;
      cursor: pointer;
    `,
    amapInfoItemImage: css`
      width: 142px;
      height: 80px;
    `,
    amapInfoItem: css`
      text-align: center;
      margin-left: 10px;
      object-fit: cover;
      &:first-child {
        margin-left: 0px;
      }
      box-sizing: border-box;
      border-radius: 4px;
      position: relative;

      &: hover .item-clear {
        display: block;
      }

      &: hover .item-edit {
        display: block;
      }

      .item-edit {
        position: absolute;
        right: 41px;
        bottom: 30px;
        display: none;
        width: 25px;
        height: 25px;
        line-height: 25px;
        text-align: center;
        background: #fff;
        border-radius: 4px;
        cursor: pointer;

        &:hover {
          color: #1677ff;
        }
      }

      .item-clear {
        position: absolute;
        right: 8px;
        bottom: 30px;
        display: none;
        width: 25px;
        height: 25px;
        line-height: 25px;
        text-align: center;
        background: #fff;
        border-radius: 4px;
        cursor: pointer;

        &:hover {
          color: #1677ff;
        }
      }
    `,
    amapInfoItemTitle: css`
      color: ${colorText};
    `,
    itemBorder: css`
      border: 2px solid ${colorBgContainer};
    `,
    itemBorderActive: css`
      border: solid 2px #1677ff;
    `,
    addMapIcon: css`
      border: dashed 1px rgb(217, 217, 217);
      height: 103px;
      width: 142px;
      object-fit: cover;
      border-radius: 4px;
      line-height: 103px;
      margin-left: 10px;
      cursor: pointer;
      &:hover {
        border: dashed 1px #1677ff;
      }
    `,
  };
};
export default useStyle;
