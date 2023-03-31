import { QuestionCircleOutlined } from '@ant-design/icons';
import { Button } from 'antd';

export default () => {
  const onHandback = () => {
    window.open('https://www.yuque.com/antv/l7/fwwdndml8e0gllp2', '_blank');
  };
  return (
    <Button icon={<QuestionCircleOutlined />} onClick={onHandback}></Button>
  );
};
