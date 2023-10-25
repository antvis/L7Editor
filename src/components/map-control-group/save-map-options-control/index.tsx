import { CustomControl, useScene } from '@antv/larkmap';
import { Tooltip, message } from 'antd';
import classNames from 'classnames';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useGlobal } from '../../../recoil';
import { IconFont } from '../../iconfont';
import useStyle from './styles';

const SaveMapOptionsControl: React.FC = () => {
  const scene = useScene();
  const styles = useStyle();
  const { setMapOptions } = useGlobal();
  const { t } = useTranslation();

  const onSave = () => {
    const { lng, lat } = scene.getCenter();
    setMapOptions((oldMapOptions) => {
      return {
        ...oldMapOptions,
        center: [lng, lat],
        zoom: scene.getZoom(),
      };
    });
    message.success(t('save_map_options_control.index.diTuZhuangTaiBao'));
  };

  return (
    <CustomControl position="bottomright">
      <Tooltip
        overlay={t('save_map_options_control.index.baoCunDiTuZhuang')}
        placement="right"
      >
        <button
          className={classNames([styles.l7ButtonControl, 'l7-button-control'])}
          onClick={onSave}
          type="button"
        >
          <IconFont type="icon-ditu " />
        </button>
      </Tooltip>
    </CustomControl>
  );
};

export default SaveMapOptionsControl;
