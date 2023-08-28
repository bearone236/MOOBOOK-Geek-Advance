'use client';

import React, { useEffect, useRef } from 'react';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-webgl';
import * as handpose from '@tensorflow-models/handpose';
import { usePose } from '../function/postcontext';

const Camera: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const { setPose } = usePose();

  useEffect(() => {
    let prevX: number | null = null;
    let prevY: number | null = null;
    const threshold = 100;
    const distThreshold = 100;

    async function setupCamera() {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      return new Promise<HTMLVideoElement>((resolve) => {
        if (videoRef.current) {
          videoRef.current.onloadedmetadata = () => {
            resolve(videoRef.current!);
          };
        }
      });
    }

    async function main() {
      await tf.ready(); // TensorFlow.jsを初期化

      const video = await setupCamera();
      video.play();

      const model = await handpose.load();

      setInterval(async () => {
        const predictions = await model.estimateHands(video, true);

        predictions.forEach((prediction) => {
          const landmarks = prediction.landmarks;
          const tip0 = landmarks[5];
          const tip1 = landmarks[6];
          const tip2 = landmarks[7];

          const angle =
            (((tip0[0] - tip1[0]) * (tip2[0] - tip1[0]) + (tip0[1] - tip1[1]) * (tip2[1] - tip1[1]) + (tip0[2] - tip1[2]) * (tip2[2] - tip1[2])) /
              (Math.sqrt((tip0[0] - tip1[0]) ** 2 + (tip0[1] - tip1[1]) ** 2 + (tip0[2] - tip1[2]) ** 2) *
                Math.sqrt((tip2[0] - tip1[0]) ** 2 + (tip2[1] - tip1[1]) ** 2 + (tip2[2] - tip1[2]) ** 2))) *
            -1;
          const radian = Math.acos(angle);
          const degree = radian * (180 / Math.PI);

          if (degree > 60) {
            prevX = null;
            prevY = null;
            setPose('back');
          } else {
            console.log('手が空いています');
            const data = Date();
            console.log(data);
            if (prevX && prevY) {
              const x_dist = landmarks[0][0] - prevX;
              const y_dist = landmarks[0][1] - prevY;
              if (x_dist < -1 * threshold) {
                console.log('手が左に移動しました');
                setPose('toright');
              } else if (x_dist > threshold) {
                console.log('手が右に移動しました');
                setPose('toleft');
              }

              console.log(y_dist);

              if (y_dist < -1 * distThreshold) {
                console.log('手が上に移動しました');
                setPose('enter');
              } else if (y_dist > distThreshold) {
                console.log('手が下に移動しました');
              }
            }

            prevX = landmarks[0][0];
            prevY = landmarks[0][1];
          }
        });
      }, 1000);
    }

    main();
  }, [setPose]);

  return (
    <div>
      <video ref={videoRef} id="video" width="200" height="160" autoPlay playsInline muted style={{ transform: 'scaleX(-1)' }} className="camera"></video>
    </div>
  );
};

export default Camera;
