'use client';
import Link from 'next/link';
import React, { useEffect, useRef } from 'react';
import { usePose } from '../app/function/postcontext';
import styles from './page.module.css';
import Image from 'next/image';

const HomePage: React.FC = () => {
  const { pose } = usePose();
  const linkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (pose === 'enter') {
      console.log('Go');
      if (linkRef.current) {
        linkRef.current.click();
      }
    }
  }, [pose]);

  return (
    <section className={styles.home}>
      <div className={styles.homeMenu} id="start_button">
        <Link href="/pages/books" style={{ textDecoration: 'none' }} ref={linkRef}>
          <Image src="/images/Home-logo.png" alt="Home-logo" width={100000} height={100000} className={styles.homeImage} />
          <p>手を握って👊</p>
        </Link>
      </div>
    </section>
  );
};

export default HomePage;
