import { css } from '@emotion/css';
import { theme } from 'antd';

const useStyle = () => {
  const { useToken } = theme;
  const { token } = useToken();
  const { colorBgElevated, colorBgContainer, colorText } = token;
  return {
    mapTab: css`
      background-color: ${colorBgElevated};
      border-radius: 4px;
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
