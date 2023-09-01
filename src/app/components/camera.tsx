'use client';
import React, { useEffect, useRef } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as handpose from '@tensorflow-models/handpose';
import { usePose } from '../function/postcontext';

const Camera: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  // const outputRef = useRef<HTMLParagraphElement>(null);
  // const debugRef = useRef<HTMLParagraphElement>(null);
  const { setPose, resetPose } = usePose();
  // const [gesture, setGesture] = useState<boolean>(false);

  useEffect(() => {
    let prevX: number | null = null;
    let prevY: number | null = null;
    // let timeout: number | timeout = 3000;
    const threshold = 25;
    const distThreshold = 75;

    const setupCamera = async (): Promise<HTMLVideoElement> => {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      return new Promise((resolve) => {
        if (videoRef.current) {
          videoRef.current.onloadedmetadata = () => {
            resolve(videoRef.current as HTMLVideoElement);
          };
        }
      });
    };

    const main = async () => {
      await tf.ready();

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
          // console.log(landmarks[0][2]);

          //   const dist = Math.hypot(tip0[0] - tip1[0], tip0[1] - tip1[1]);
          //   debug.textContent = `dist: ${dist}`;
          const angle =
            (((tip0[0] - tip1[0]) * (tip2[0] - tip1[0]) + (tip0[1] - tip1[1]) * (tip2[1] - tip1[1]) + (tip0[2] - tip1[2]) * (tip2[2] - tip1[2])) /
              (Math.sqrt((tip0[0] - tip1[0]) ** 2 + (tip0[1] - tip1[1]) ** 2 + (tip0[2] - tip1[2]) ** 2) *
                Math.sqrt((tip2[0] - tip1[0]) ** 2 + (tip2[1] - tip1[1]) ** 2 + (tip2[2] - tip1[2]) ** 2))) *
            -1;
          const radian = Math.acos(angle);
          const degree = radian * (180 / Math.PI);

          // console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
          // console.log(prevX);
          // console.log(prevY);
          // console.log('---------------------------');

          if (degree > 60) {
            if (prevX == null) {
              prevX = 0;
            }
            if (prevY == null) {
              prevY = 0;
            }
            const x_dist = landmarks[0][0] - prevX;
            const y_dist = landmarks[0][1] - prevY;
            prevX = null;
            prevY = null;
            // setGesture(true);
            if (x_dist > threshold) {
              // Flip}< prevX) { // Flip x-axis detection
              // outputRef.current.textContent += `, 手が右に移動しました`;
              // console.log('手が右に移動しました');
              prevX = null;
              prevY = null;
              resetPose();
              setPose('back');

              // setTimeout(timeout);
            } else {
              prevX = null;
              prevY = null;
              resetPose();
              setPose('enter');
            }
          } else {
            // outputRef.current.textContent = '手が開いています';
            // console.log('手が空いています');
            const data = Date();
            // console.log(data);
            // setGesture(false);
            if (prevX && prevY) {
              // console.log('---------------------------');
              const x_dist = landmarks[0][0] - prevX;
              const y_dist = landmarks[0][1] - prevY;
              if (x_dist < -1 * threshold) {
                // Flip x-axis detection
                // outputRef.current.textContent += `, 手が左に移動しました`;
                // console.log('手が左に移動しました');
                // setPose('toright');
                prevX = null;
                // prevY = null;
                // setTimeout(timeout);
                resetPose();
              } else if (x_dist > threshold) {
                // Flip}< prevX) { // Flip x-axis detection
                // outputRef.current.textContent += `, 手が右に移動しました`;
                console.log('手が右に移動しました');
                resetPose();
                setPose('toleft');
                prevX = null;
                // prevY = null;

                // setTimeout(timeout);
              } else {
                // outputRef.current.textContent += ', 手は左右には動いていません';
                // console.log('手は左右には動いていません');
                prevX = null;
                prevY = null;
                resetPose();
              }

              // console.log(y_dist);

              if (y_dist < -1 * distThreshold) {
                // outputRef.current.textContent += ', 手が上に移動しました';
                // console.log('手が上に移動しました');
                // setPose('enter');
                prevX = null;
                prevY = null;
                // setTimeout(timeout);
                // setGesture(true);
                resetPose();
              } else if (y_dist > distThreshold) {
                // outputRef.current.textContent += ', 手が下に移動しました';
                // console.log('手が下に移動しました');
                resetPose();
                setPose('toright');
                prevX = null;
                prevY = null;
                // setTimeout(timeout);
              } else {
                // outputRef.current.textContent += ', 手は上下には動いていません';
                // console.log('手は上下に動いていません');
                // prevX = null;
                // prevY = null;
              }
            }

            prevX = landmarks[0][0];
            prevY = landmarks[0][1];
            // prevX = null;
            // prevY = null;
          }
          // console.log(prevX);
          // console.log(prevY);
        });
      }, 500);
    };

    main();
  }, []);

  return (
    <div>
      <video ref={videoRef} id="video" width="370" height="230" autoPlay playsInline muted style={{ transform: 'scaleX(-1)' }}></video>
      {/* <p ref={outputRef} id="output" className="hidden"></p> */}
      {/* <p ref={debugRef} id="debug" className="hidden"></p> */}
    </div>
  );
};

export default Camera;
