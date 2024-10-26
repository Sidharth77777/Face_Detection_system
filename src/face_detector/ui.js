import React from 'react'
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './../styles.css'
import First from './First'
import ImageChecker from './ImageChecker'
import VideoChecker from './VideoChecker'

export default function Ui() {
  return (
    <div id='Ui'>
      <Router>
      <Routes>
        <Route path="/" element={<First />} />
        <Route path="/image" element={<ImageChecker />} />
        <Route path="/video" element={<VideoChecker />} />
      </Routes>
    </Router>
    
      {/*<First />*/}
      {/*<ImageChecker />*/}
      {/*<VideoChecker />*/}
    </div>
  )
}
