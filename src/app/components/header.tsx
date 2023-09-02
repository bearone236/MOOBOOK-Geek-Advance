import React from 'react';
import '../styles/components.css';
import Camera from './camera';
import Image from 'next/image';
import Operate from './operate';

const Header: React.FC = () => {
  return (
    <div>
      <header className="header">
        <section>
          <div className="title-logo">
            <Image src="/images/MOOBOOK.png" alt="MOOBOOK" width={100000} height={100000} className="headerImage" priority />
          </div>
          <Operate />
          <div className="camera">
            <Camera />
          </div>
        </section>
      </header>
    </div>
  );
};

export default Header;
