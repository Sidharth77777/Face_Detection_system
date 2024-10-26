import React, { useEffect, useState, useRef } from "react";
import "./../styles.css";
import { Link } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import * as faceapi from "face-api.js";

export default function VideoChecker() {
  const videoRef = useRef();
  const canvasRef = useRef();
  const [count,setCount] = useState(0);
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    startVideo();
    videoRef && loadModels();
  }, []);
  

  const startVideo = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((currentStream) => {
        videoRef.current.srcObject = currentStream;
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const loadModels = () => {
    Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
      faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
      faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
      faceapi.nets.faceExpressionNet.loadFromUri("/models"),
    ]).then(() => {
      faceMyDetect();
    });
  };

  const faceMyDetect = () => {
    setInterval(async () => {
      const detections = await faceapi
        .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceExpressions();
      
      setCount(detections.length);

      canvasRef.current.innerHtml = faceapi.createCanvasFromMedia(
        videoRef.current
      );
      faceapi.matchDimensions(canvasRef.current, {
        width: 940,
        height: 650,
      });

      const resized = faceapi.resizeResults(detections, {
        width: 940,
        height: 650,
      });

      faceapi.draw.drawDetections(canvasRef.current, resized);
      faceapi.draw.drawFaceLandmarks(canvasRef.current, resized);
      faceapi.draw.drawFaceExpressions(canvasRef.current, resized);
    }, 1000);
  };

  return (
    <div id="Main">
      <div id="VideoChecker">
        <header className="image_header">
          <Link to="/">
            <img src={require("./../images/back2.png")} className="back" />
          </Link>
          <h1 className="heading aloshi">VIDEO DETECTION</h1>
        </header>

        <div id="videoContainer">
          <div id="Video_Area">
            <video
              crossOrigin="anonymous"
              ref={videoRef}
              autoPlay
              muted
            ></video>
            <canvas
              ref={canvasRef}
              width="940"
              height="650"
              className="appcanvas"
            />
          </div>

          <div className="details">
            {!count ? (<h1>Move towards Camera!!</h1>) : (<h1>Total Persons :{count} </h1>)}
          </div>
        </div>
      </div>
    </div>
  );
}
