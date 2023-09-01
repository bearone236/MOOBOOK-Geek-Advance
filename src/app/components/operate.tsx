'use client';

import React, { useState } from 'react';
import '../styles/operate.css';

// ジェスチャーコンポーネントのPropsの型
interface GestureProps {
  alt: string;
  src: string;
}

// ジェスチャーコンポーネント
const Gesture: React.FC<GestureProps> = ({ alt, src }) => {
  return (
    <div id="gesture">
      <div>
        <p>ページ進める</p>
        <img id="ges-1" src={src} alt={alt} />
      </div>
      <div>
        <p>ページ戻り</p>
        <img id="ges-2" src="images/gesture/asset0002.png" alt="ページ戻り" />
      </div>
      <div>
        <p>決定</p>
        <img id="ges-3" src="images/gesture/asset0003.png" alt="決定ジェスチャー" />
      </div>
      <div>
        <p>ホーム画面に戻る</p>
        <img id="ges-4" src="images/gesture/asset0004.png" alt="ホーム画面に戻る" />
      </div>
      {/* 他のジェスチャーの定義も同様に追加 */}
    </div>
  );
};

interface ModalProps {
  content: string;
  closeModal: () => void;
}

const Modal: React.FC<ModalProps> = ({ content, closeModal }) => {
  return (
    <div id="overlay" onClick={closeModal}>
      <div id="content" onClick={(e) => e.stopPropagation()}>
        <h2>{content}</h2>
        <Gesture alt="ページを進める" src="images/gesture/asset0001.png" />
        {/* 他のジェスチャーの定義も同様に追加 */}
        <button id="closeButton" className="purpleButton" onClick={closeModal}>
          閉じる
        </button>
      </div>
    </div>
  );
};

// 操作コンポーネント
const Operate: React.FC = () => {
  const [show, setShow] = useState(false);

  const openModal = () => {
    setShow(true);
  };

  const closeModal = () => {
    setShow(false);
  };

  return (
    <div id="operateButton">
      <button className="purpleButton" onClick={openModal}>
        操作説明
      </button>

      {show && <Modal content="MOOBOOK　操作説明" closeModal={closeModal} />}
    </div>
  );
};

export default Operate;
