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
    `,
    amapInfoItemImage: css`
      width: 142px;
      height: 80px;
      object-fit: cover;
    `,
    amapInfoItem: css`
      text-align: center;
      &:first-child {
        margin-right: 10px;
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
  };
};
export default useStyle;
