import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ClipLoader } from "react-spinners";

export default function First() {
  const [loading, setLoading] = useState(true);
  const loadingTime = 1000;

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), loadingTime);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div id="Main">
      {loading ? (
        <div id="Loading">
        <ClipLoader color="#1452ff" id='Clipload' size={100} />
      </div>
      ) : (
        <div id="FirstPage">
          <div id="left">
            <div id="box">
              <Link to='/image' id="Link">
                <div className="top">
                    <h1 className="aloshi">IMAGE</h1>
                    <img src={require('./../images/camera.png')} className="cam" />
                </div>
              </Link>

              <Link to='/video' id="Link">
                <div className="top">
                <h1 className="aloshi">VIDEO (BETA)</h1>
                <img src={require('./../images/video.png')} className="cam" />
                </div>
              </Link>  

            </div>
          </div>
          <div id="right"></div>
        </div>
      )}
    </div>
  );
}
