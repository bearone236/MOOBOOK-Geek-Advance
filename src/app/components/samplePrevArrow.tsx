import React, { CSSProperties } from 'react';

interface ArrowProps {
  className?: string;
  style?: CSSProperties;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}

const SamplePrevArrow: React.FC<ArrowProps> = ({ className, style, onClick }) => {
  return <div className={className} style={{ ...style, display: 'block', background: 'black', left: '0px' }} onClick={onClick}></div>;
};

export default SamplePrevArrow;
