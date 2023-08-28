'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import axios from 'axios';
import SampleNextArrow from '../../components/sampleNextArrow';
import SamplePrevArrow from '../../components/samplePrevArrow';
import { usePose } from '../../function/postcontext';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Image from 'next/image';
import '../../styles/pages.css';

interface Book {
  id: number;
  bookId: string;
  title: string;
}

const baseURL = 'https://sheets.googleapis.com/v4/spreadsheets/1Bcc9S-zQJeEirqOIvml2C3AMziyVFGvf4sMtVa3Ch6s/values/haka?key=AIzaSyA4PLe6OiOkD82M-dB9gyVaV3myLE0CBkg';
const data_number = 7;

const BooksPage: React.FC<Book> = () => {
  const [booksData, setBooksData] = useState<Book[]>([]);
  const { pose } = usePose();
  const linkRef = useRef<HTMLAnchorElement>(null);
  const sliderRef = useRef<Slider | null>(null);
  const backRef = useRef<HTMLAnchorElement>(null);
  useEffect(() => {
    if (pose === 'enter') {
      console.log('Go');
      if (linkRef.current) {
        linkRef.current.click();
      }
    } else if (pose === 'toright') {
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

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(baseURL);
      const data = response.data.values;
      const data_values = data.slice(1, data_number);

      const h_data = response.data.values[0];

      const arrayToMap = (function () {
        function mapfn(this: any, data_values: any) {
          for (var i = 0, l = this.length, obj = Object.create(null); i < l; ++i) {
            if (data_values.hasOwnProperty(i)) {
              obj[this[i]] = data_values[i];
            }
          }
          return obj;
        }

        return function arrayToMap(s_data: any, h_data: any) {
          return s_data.map(mapfn, h_data);
        };
      })();

      const about = arrayToMap(data_values, h_data);
      const array_value = JSON.stringify(about);
      const abc = JSON.parse(array_value);

      for (var i = 0; i < abc.length; i++) {
        var obj = abc[i];
        for (var prop in obj) {
          if (obj.hasOwnProperty(prop) && obj[prop] !== null && !isNaN(obj[prop])) {
            obj[prop] = +obj[prop];
          }
        }
      }
      const result = JSON.stringify(abc, null, 2);
      const data_result = JSON.parse(result);

      setBooksData(data_result);
    };

    fetchData();
  }, []);

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
    <div className="books">
      <Slider {...settings} ref={sliderRef}>
        {booksData.map((book) => (
          <div key={book.id} className="slider-item">
            <Link href={`/pages/book/${book.bookId}?bookId=${book.bookId}`} ref={linkRef}>
              <Image src={`/images/${book.bookId}.png`} alt={book.title} width={200} height={200} className="slider-item-image" priority />
            </Link>
          </div>
        ))}
      </Slider>
      <Link href="/" style={{ display: 'none' }} ref={backRef}></Link>
    </div>
  );
};

export default BooksPage;
