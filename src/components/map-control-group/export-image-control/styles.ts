import { css } from '@emotion/css';
import { theme } from 'antd';

const useStyle = () => {
  const { useToken } = theme;
  const { token } = useToken();

  const { colorBgContainer, colorIcon, colorText } =
    token;
  return {
    l7ExportImg: css`
      background: ${colorBgContainer};
      color: ${colorIcon};
      svg {
        fill: ${colorIcon} !important;
      }

      :hover {
        background: ${colorBgContainer} !important;
        svg {
          color: ${colorText} !important;
          fill: ${colorText} !important;
        }
      }
    `,
  };
};
export default useStyle;
