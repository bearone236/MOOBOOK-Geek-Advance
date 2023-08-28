import React, { CSSProperties } from 'react';

interface ArrowProps {
  className?: string;
  style?: CSSProperties;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}

const SampleNextArrow: React.FC<ArrowProps> = ({ className, style, onClick }) => {
  return <div className={className} style={{ ...style, display: 'block', background: 'black', right: '0px' }} onClick={onClick}></div>;
};

export default SampleNextArrow;
