import { css } from '@emotion/css';
import { theme } from 'antd';

const useStyle = () => {
  const { useToken } = theme;
  const { token } = useToken();
  const { colorBgElevated } = token;
  return {
    mapTab: css`
      background-color: ${colorBgElevated};
      border-radius: 4px;
    `,
    amapInfo: css`
      display: flex;
      align-items: center;
      padding: 10px;
      .item-hover:hover + .add-map {
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
    amapInfoItemImage: css`
      width: 142px;
      height: 80px;
      object-fit: cover;
    `,
    amapInfoItem: css`
      text-align: center;
      margin-left: 10px;
      &:first-child {
        margin-left: 0px;
      }
      box-sizing: border-box;
      border-radius: 4px;
    `,
    itemBorder: css`
      border: 2px solid #fff;
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
    `,
  };
};
export default useStyle;
