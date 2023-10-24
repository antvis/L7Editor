import classNames from 'classnames';
import type { CSSProperties } from 'react';
import React from 'react';

interface IconFontProps {
  className?: string;
  type: string;
  style?: CSSProperties;
}

export const IconFont: React.FC<IconFontProps> = (props) => {
  return (
    <span
      role="img"
      style={props.style}
      className={classNames(['anticon', props.className])}
    >
      <svg
        width="1em"
        height="1em"
        fill="currentColor"
        aria-hidden="true"
        focusable="false"
        className=""
      >
        <use xlinkHref={`#${props.type}`} />
      </svg>
    </span>
  );
};
