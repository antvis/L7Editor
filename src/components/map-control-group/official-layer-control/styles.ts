import { css } from '@emotion/css';
import { theme } from 'antd';

const useStyle = () => {
  const { useToken } = theme;
  const { token } = useToken();

  const { colorIcon, colorBgContainer, colorText, boxShadow } = token;
  return {
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
    l7amap: css`
      width: 28px;
      height: 28px;
      line-height: 28px;
      text-align: center;
      border-radius: 2px;
      background-color: ${colorBgContainer};
      box-shadow: ${boxShadow} !important;
      &:hover {
        svg {
          color: ${colorText};
        }
      }
    `,
    l7AmapControl: css`
      font-size: 16px;
      border: none;
      cursor: pointer;
      color: ${colorIcon};
    `,
  };
};
export default useStyle;
