import React, { useEffect, useState } from "react";
import "./../styles.css";
import { Link } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import * as faceapi from "face-api.js";

export default function ImageChecker() {
  const [loading, setLoading] = useState(true);
  const [modelLoaded, setModelLoaded] = useState(false);
  const loadingTime = 500;
  const [submitted,setSubmitted] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), loadingTime);
    return () => clearTimeout(timer);
  }, []);

  const [file, setFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [detectedName, setDetectedName] = useState("");

  
  useEffect(() => {
    const loadModels = async () => {
      try {
        await faceapi.nets.ssdMobilenetv1.loadFromUri('/models');
        await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
        await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
        setModelLoaded(true);
        console.log("Models loaded successfully.");
      } catch (error) {
        console.error("Error loading face-api models:", error);
      }
    };
    loadModels();
  }, []);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
    setImagePreview(URL.createObjectURL(selectedFile));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitted(true)
    if (file && modelLoaded) {
      const img = document.getElementById("uploadedImage"); 
      const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();

      if (detections) {
        const labeledFaceDescriptors = await loadLabeledImages();
        const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.6);
        const bestMatch = faceMatcher.findBestMatch(detections.descriptor);
        setDetectedName(bestMatch.label);
      } else {
        setDetectedName("No face detected");
      }
    } else {
      console.log("No file selected or models not loaded.");
    }
  };

  
  const loadLabeledImages = () => {
    const labels = ["Adithyan","Ajay","alan","Aloshius","Fahad","John","Nandu"];
    return Promise.all(
      labels.map(async (label) => {
        const descriptions = [];
        for (let i = 1; i <= 3; i++) {
          try {
            const img = await faceapi.fetchImage(`${process.env.PUBLIC_URL}/models/friends/${label}/${i}.jpg`);
            const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();
            if (detections) {
              descriptions.push(detections.descriptor);
            }
          } catch (error) {
            console.error(`Error fetching image /images/${label}/${i}.jpg:`, error);
          }
        }
        return new faceapi.LabeledFaceDescriptors(label, descriptions);
      })
    );
  };

  return (
    <div id="Main">
      {loading ? (
        <div id="Loading">
          <ClipLoader color="#1452ff" id="Clipload" size={100} />
        </div>
      ) : (
        <div id="ImageChecker">
          <header className="image_header">
            <Link to="/">
              <img src={require("./../images/back2.png")} className="back" alt="back" />
            </Link>
            <h1 className="heading aloshi">IMAGE DETECTION</h1>
          </header>

          <div id="Image_Container">
            {submitted && !detectedName ? (<ClipLoader color="#1452ff" id="Clipload" size={50} />) : (<h1 className="detectedName">{detectedName}</h1>)}

            <div className="img-container">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  id="uploadedImage"
                  className="image-main"
                  alt="Uploaded Preview"
                />
              ) : (
                <img
                  src={require('./../images/upload.png')}
                  className="image-main"
                  alt="Placeholder"
                />
              )}
            </div>

            <form onSubmit={handleSubmit}>
              <input type="file" onChange={handleFileChange} className="file-input" />
              <button type="submit" className="submit">Detect Image</button>
            </form>

          </div>
        </div>
      )}
    </div>
  );
}
