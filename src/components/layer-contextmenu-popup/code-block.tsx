import { Button } from 'antd';
import Clipboard from 'clipboard';
import React, { useEffect, useState } from 'react';
import useStyle from './styles';

interface Props {
  copyType: string;
  text: string;
  onClick: (e: any) => void;
}

export default function CodeBlock({ copyType, text, onClick }: Props) {
  const [copied, setCopied] = useState(false);
  const styles = useStyle();

  useEffect(() => {
    const clipboard = new Clipboard(`#${copyType}copy_btn`, {
      text: () => text,
    });

    clipboard.on('success', () => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });

    // 销毁 clipboard 实例
    return () => {
      clipboard.destroy();
    };
  }, [copyType, text]);

  return (
    <div>
      <div id={copyType} style={{ display: 'none' }}>
        {text}
      </div>
      <Button
        type="link"
        id={`${copyType}copy_btn`}
        className={styles.layerPopupCopyButton}
        data-clipboard-target={`#${copyType}`}
        disabled={copied}
        onClick={onClick}
      >
        {copied ? '已复制' : '复制'}
      </Button>
    </div>
  );
}
