import { RightPanelWidthRange } from '@/constants';
import { useGlobal, useFeature } from '@/recoil';
import { CaretRightOutlined } from '@ant-design/icons';
import { useSize } from 'ahooks';
import { Resizable } from 're-resizable';
import React, { ReactNode, useEffect, useMemo, useState } from 'react';
import { IFeature } from '@/types'
import useStyle from './styles';

export interface ResizePanelProps {
  left: ReactNode;
  right: ReactNode;
  onFeatureChange: (features: IFeature) => void
}

export const ResizePanel: React.FC<ResizePanelProps> = ({ left, right, onFeatureChange }) => {
  const { hideEditor, setHideEditor, rightWidth, setRightWidth } = useGlobal();
  const [resizePanel, setResizePanel] = useState<HTMLDivElement | null>(null);
  const [minRightWidth, maxRightWidth] = RightPanelWidthRange;
  const { width: containerWidth = 0 } = useSize(resizePanel) ?? {};
  const { features } = useFeature()
  const styles = useStyle();

  const onResize = (event: Event) => {
    const { left = 0 } = resizePanel?.getBoundingClientRect() ?? {};

    let rightWidth =
      100 * (1 - ((event as MouseEvent).clientX - left) / containerWidth);
    if (rightWidth < minRightWidth) {
      rightWidth = minRightWidth;
    }
    if (rightWidth > maxRightWidth) {
      rightWidth = maxRightWidth;
    }
    setRightWidth(rightWidth);
  };

  const calcRightWidth = useMemo(() => {
    return hideEditor ? 0 : rightWidth;
  }, [hideEditor, rightWidth]);

  useEffect(() => {
    onFeatureChange(features)
  }, [features])

  return (
    <div
      className={styles.resizePanel}
      ref={(ref: HTMLDivElement) => {
        setResizePanel(ref);
      }}
    >
      <div
        className={styles.resizePanelLeft}
        style={{ width: `${100 - calcRightWidth}%` }}
      >
        {left}
      </div>
      <Resizable
        enable={{
          left: true,
        }}
        style={{
          marginLeft: `${100 - calcRightWidth}%`,
        }}
        size={{
          width: `${calcRightWidth}%`,
          height: '100%',
        }}
        minWidth={`${(minRightWidth / 100) * containerWidth}px`}
        maxWidth={`${(maxRightWidth / 100) * containerWidth}px`}
        className={styles.resizePanelRight}
        handleClasses={{
          left: styles.resizePanelDragLine,
        }}
        handleStyles={{
          left: { width: 6, left: -3 },
        }}
        defaultSize={{
          width: `${calcRightWidth}%`,
          height: '100%',
        }}
        onResize={onResize}
      >
        {right}
        <div
          className={styles.resizePanelToggleBtn}
          onClick={() => {
            setHideEditor(!hideEditor);
          }}
        >
          <CaretRightOutlined
            style={{
              transform: hideEditor ? 'rotate(-180deg)' : undefined,
            }}
          />
        </div>
      </Resizable>
    </div>
  );
};
