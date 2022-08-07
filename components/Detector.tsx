import React, {useEffect, useRef, useState} from 'react';


interface props {
  duration: number,
  onCapture: BlobCallback,
  onError: Function
}

export default function Detector({duration, onCapture, onError}: props) {
  const videoPlayer = useRef<HTMLVideoElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);

  async function getCameraStream() {
    const cameras = await navigator.mediaDevices.enumerateDevices();
    if (cameras.length > 0) {
      const {deviceId} = cameras[0];
      return await navigator.mediaDevices.getUserMedia({audio: false, video: {deviceId}});
    } else {
      throw new Error('no camera!');
    }
  }

  const takePhoto = () => {
    if (canvas && canvas.current && videoPlayer && videoPlayer.current) {
      if (!mediaStream?.active)
        onError('camera turned off');
      const context = canvas.current.getContext('2d');
      context?.drawImage(videoPlayer.current, 0, 0, 680, 480);
      canvas.current?.toBlob(onCapture);
    }
  };

  const stopCameraStreams = () => {
    if (mediaStream) {
      mediaStream.getTracks().forEach(track => {
        track.stop();
      });
    }

    if (videoPlayer && videoPlayer.current) {
      videoPlayer.current.pause();
      videoPlayer.current.srcObject = null;
    }
  }

  useEffect(() => {
    getCameraStream()
      .then(setMediaStream)
      .catch(e => onError(e));
    return () => {
      stopCameraStreams();
    }
  }, []);

  useEffect(() => {
    if (mediaStream && videoPlayer && videoPlayer.current) {
      videoPlayer.current.srcObject = mediaStream;
      // noinspection JSIgnoredPromiseFromCall
      videoPlayer.current.play();
    }

    const timer = setInterval(() => {
      takePhoto()
    }, duration);
    return () => {
      clearInterval(timer);
      stopCameraStreams();
    }
  }, [mediaStream, videoPlayer, duration]);

  return (
    <>
      <div className='hidden'>
        <video ref={videoPlayer} autoPlay playsInline width="640" height="480"></video>
        <canvas ref={canvas} height={480} width={640}/>
      </div>
    </>
  );
}
