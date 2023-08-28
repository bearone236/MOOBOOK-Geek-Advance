'use client';
import React, { useEffect, useRef } from 'react';

import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import SampleNextArrow from './sampleNextArrow';
import SamplePrevArrow from './samplePrevArrow';
import Image from 'next/image';
import Link from 'next/link';
import { usePose } from '../function/postcontext';
import '../styles/pages.css';

interface ImageFile {
  id: number;
  bookId: string;
  title: string;
}

// interface BookIdPageProps {
//   imageFiles: ImageFile;
// }

export const BookIdPage: React.FC<ImageFile> = ({ bookId, id, title }) => {
  const sliderRef = useRef<Slider | null>(null);
  const { pose } = usePose();
  const backRef = useRef<HTMLAnchorElement | null>(null);

  useEffect(() => {
    if (pose === 'toright') {
      if (sliderRef.current) {
        sliderRef.current.slickNext();
      }
    } else if (pose === 'toleft') {
      if (sliderRef.current) {
        sliderRef.current.slickPrev();
      }
    } else if (pose === 'back') {
      console.log('Back');
      if (backRef.current) {
        backRef.current.click();
      }
    }
  }, [pose]);

  const images = Array.from({ length: 4 }, (_, index) => ({
    id: index + 1,
    title: `book${index + 1}`,
    img: `/public/pdfImages/${bookId}/${bookId}-${index + 1}.png`,
  }));

  // console.log(bookId, id, title);

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    centerMode: true,
    centerPadding: '100px',
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
  };

  return (
    <div className="Book">
      <div>
        <Slider {...settings} ref={sliderRef}>
          {images.map((item) => (
            <div key={item.id} className="pdf-images">
              <Image src={item.img} width={680} height={680} className="pdf-image" alt="items-images" />
            </div>
          ))}
        </Slider>
      </div>
      <Link href="/" passHref style={{ display: 'none' }} ref={backRef}></Link>
    </div>
  );
};
