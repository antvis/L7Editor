import { css } from '@emotion/css';
import { theme } from 'antd';

const useStyle = () => {
  const { useToken } = theme;
  const { token } = useToken();

  const { colorBgContainer, boxShadow, colorBorder, colorIcon, colorText } =
    token;
  return {
    l7DrawControl: css`
      .l7-draw-control {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-right: 0 !important;
        box-shadow: ${boxShadow} !important;
        .l7-draw-control__btn {
          color: ${colorIcon};
          background-color: ${colorBgContainer};
          border-right: none;
          border-bottom: 1px solid ${colorBorder};
          &:hover {
            color: ${colorText};
          }
        }
      }
    `,
  };
};
export default useStyle;
