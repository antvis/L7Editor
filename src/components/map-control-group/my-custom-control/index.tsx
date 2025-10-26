// src/components/map-control-group/my-custom-control/index.tsx
import React from 'react';
import { CustomControl } from '@antv/larkmap';
import useStyle from './styles';
import { useGlobal } from '../../../recoil';

const MyCustomControl: React.FC = () => {
  const styles = useStyle();
  const { baseMap } = useGlobal(); // 示例：读取全局状态

  const onClick = () => {
    // 在这里做控制器的动作，例如切换图层 / 触发 recoil action
    // 示例：console.log('My control clicked', baseMap);
    // 或者触发全局状态变化（通过 recoil 的 setter）
  };

  return (
    <CustomControl position="topright">
      <div className={styles.container}>
        <button className={styles.button} onClick={onClick}>
          自定义控制
        </button>
      </div>
    </CustomControl>
  );
};

export default MyCustomControl;