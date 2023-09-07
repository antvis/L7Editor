import { message } from 'antd';
import Clipboard from 'clipboard';
import React, { useEffect } from 'react';

interface Props {
  copyType: string;
  text: string;
}

export default function CodeBlock({ copyType, text }: Props) {
  useEffect(() => {
    const clipboard = new Clipboard(`#${copyType}copy_btn`, {
      text: () => text,
    });

    clipboard.on('success', () => {
      message.success('复制成功');
    });

    // 销毁 clipboard 实例
    return () => {
      clipboard.destroy();
    };
  }, []);

  return (
    <div>
      <div id={copyType} style={{ display: 'none' }}>
        {text}
      </div>
      <div id={`${copyType}copy_btn`} data-clipboard-target={`#${copyType}`}>
        复制 {copyType}
      </div>
    </div>
  );
}
