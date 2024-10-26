import React from 'react'
import './../index.css'
import Videocheck from './VideoCheck'

export default function main() {
  return (
    <div id="Main">
      <div id='Canvas'>
        <h1 id='face'>FACE DETECTOR</h1>
        <Videocheck /> 
      </div>
    </div>
  )
}
