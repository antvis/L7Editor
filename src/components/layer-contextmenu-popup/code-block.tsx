import { message } from 'antd';
import Clipboard from 'clipboard';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
  copyType: string;
  text: string;
}

export default function CodeBlock({ copyType, text }: Props) {
  const { t } = useTranslation();

  useEffect(() => {
    const clipboard = new Clipboard(`#${copyType}copy_btn`, {
      text: () => text,
    });

    clipboard.on('success', () => {
      message.success(t('layer_contextmenu_popup.fuZhiChengGong'));
    });

    // 销毁 clipboard 实例
    return () => {
      clipboard.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <div id={copyType} style={{ display: 'none' }}>
        {text}
      </div>
      <div id={`${copyType}copy_btn`} data-clipboard-target={`#${copyType}`}>
        {t('layer_contextmenu_popup.fuZhi')} {copyType}
      </div>
    </div>
  );
}
