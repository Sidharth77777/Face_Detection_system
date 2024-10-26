import React from 'react'
import { useRef, useEffect,useState } from 'react'
import * as faceapi from 'face-api.js'

export default function Videocheck() {

    const videoRef = useRef();
    const canvasRef = useRef();
    const [me,setMe] = useState('');
    const [name,setName] = useState('Unknown');

    useEffect(() =>{
        startVideo()
        videoRef && loadModels()
    },[])

    const startVideo = () => {
        navigator.mediaDevices.getUserMedia({video:true}).then((currentStream) => {
            videoRef.current.srcObject = currentStream
            console.log("Done")
        }).catch((error) => {
            console.log(error)
        })
    }

    const loadModels = () => {
        Promise.all([
            faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
            faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
            faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
            faceapi.nets.faceExpressionNet.loadFromUri('/models')
        ]).then(() => {
            faceMyDetect()
        })
    }

    const faceMyDetect = () => {
        setInterval(async() => {
            const detections = await faceapi.detectAllFaces(videoRef.current,
                new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
                
            
            canvasRef.current.innerHtml = faceapi.createCanvasFromMedia(videoRef.current)
            faceapi.matchDimensions(canvasRef.current,{
                width : 940,
                height : 650
            })
            const resized = faceapi.resizeResults(detections,{
                width : 940,
                height : 650
            })
            faceapi.draw.drawDetections(canvasRef.current,resized)
            faceapi.draw.drawFaceLandmarks(canvasRef.current,resized)
            faceapi.draw.drawFaceExpressions(canvasRef.current,resized)  
    
        },1000)
    }

  return (
    <div className='myApp'>
    <div className='video'>
        <video crossOrigin='anonymous' ref={videoRef} autoPlay muted></video>
        <h1 className='message'>{me}</h1>
    </div>
    <canvas ref={canvasRef} width="940" height="650" className='canvas'></canvas>
    </div>
  )
}
