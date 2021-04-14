import { rotateUp, rotateDown, rotateLeft, rotateRight } from './sandbox.js';

const modelParams = {
  flipHorizontal: true,   // flip e.g for video 
  imageScaleFactor: 0.6,  // reduce input image size for gains in speed.
  maxNumBoxes: 1,        // maximum number of boxes to detect
  iouThreshold: 0.7,      // ioU threshold for non-max suppression
  scoreThreshold: 0.6,    // confidence threshold for predictions.
}

let video = document.createElement('video');
//let video = document.getElementById('video');
let canvas = document.createElement('canvas');
//let canvas = document.getElementById('canvas');
let context = canvas.getContext('2d');
let n = 0;
let model;
let xLast = 0;
let yLast = 0;
let width;
let height;
let onStart = false;
const xThreshold = 0.05;
const yThreshold = 0.05;
const timer = 250;


// Start function
const start = async function() {
  model = await handTrack.load(modelParams);
  console.log("Startup called");
  handTrack.startVideo(video).then(status => {
      console.log("Video started");
      if(status){
          if (navigator.mediaDevices.getUserMedia) {
              navigator.mediaDevices.getUserMedia({ audio: false, video: true}).then(function (stream) {
                  console.log("Stream Detected");
                  video.srcObject = stream; 
                  runTime();
                }).catch(function (err0r) {
                  console.log("Something went wrong!");
                });
            }
      }
      else{
          console.log("Error: No status");
      }
  });
}


var btnStartCapture = document.getElementById("start");
btnStartCapture.onclick = function startCapture(){
  if (!onStart){
    onStart = true;
    start();
  }
}

//Function to stop the webcam
function stop(e) {
  var stream = video.srcObject;
  var tracks = stream.getTracks();
  for (var i = 0; i < tracks.length; i++) {
    var track = tracks[i];
    track.stop();
  }
  video.srcObject = null;
}

function runTime(){
  console.log("Hand tracking will start to run");
  xLast = 0;
  yLast = 0;
  setInterval(runDetection, timer);
}

function runDetection(){
  width = video.videoWidth;
  height = video.videoHeight;
  console.log("Height, Width: " + height + ", " + width);
  let x = 0;
  let y = 0;
  let temp = [];
  model.detect(video).then(predictions => {
      temp = predictions;
      //model.renderPredictions(predictions, canvas, context, video); 
      if(temp.length > 0){
          x = temp[0].bbox[0];
          y = temp[0].bbox[1];

          let deltaX = (x - xLast)/width;
          let deltaY = (y - yLast)/height;
      
          let xAbs =  Math.floor(Math.abs(deltaX/xThreshold));
          let yAbs =  Math.floor(Math.abs(deltaY/yThreshold));

          if (deltaX > xThreshold * 2){
              console.log("Move right " + xAbs);
              for(let i = 0; i < xAbs; i++){
                rotateRight();
              }
          } else if (deltaX * -1 > xThreshold * 2){
              console.log("Move Left " + xAbs);
              for(let i = 0; i < xAbs; i++){
                rotateLeft();
              }
          }
      
          if (deltaY > yThreshold * 2){
              console.log("Move Down " + yAbs);
              for(let i = 0; i < yAbs; i++){
                rotateDown();
              }
          } else if (deltaY * -1 > yThreshold * 2){
              console.log("Move Up " + yAbs);
              for(let i = 0; i < yAbs; i++){
                rotateUp();
              }
          }
          xLast = x;
          yLast = y;   
      }
  });
}