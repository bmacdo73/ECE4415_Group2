import { rotateUp, rotateDown, rotateLeft, rotateRight } from './sandbox.js';

let video = document.createElement('video');  
let canvas = document.getElementById('canvas'); 
let context = canvas.getContext('2d');  
let model;  //Holds the handtracking model
let xLast = 0;  //The x position of the tracked hand from the last screen capture
let yLast = 0;  //The y position of the tracked hand from the last screen capture
let width;  //The width of the webcam video feed
let height; //The height of the webcam video feed
let onStart = false;  //Set to true after the start recording has been triggered
let onEnd = false;  //Set to true after the end button has been pressed
let testing = false;  //Set to true after the start test button has been pressed
let interval; //The interval that will repeatedly call the screen capture

const xThreshold = 0.0556;  //Threshold that determines how much x motion should count as one move
const yThreshold = 0.1; //Threshold that determines how much y motion should count as one move
const timer = 250;  //How long in ms between calls to take a screen capture

//Parameters for the hand tracking model
const modelParams = {
  flipHorizontal: true,   // flip e.g for video 
  imageScaleFactor: 0.6,  // reduce input image size for gains in speed.
  maxNumBoxes: 1,        // maximum number of boxes to detect
  iouThreshold: 0.7,      // ioU threshold for non-max suppression
  scoreThreshold: 0.6,    // confidence threshold for predictions.
}


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

//Start recording button
let btnStartCapture = document.getElementById("start");
btnStartCapture.onclick = function startCapture(){
  if (!onStart){
    onStart = true;
    start();
  }
}

//End button, if pressed safely exit the program and kill scripts
let end = document.getElementById("end");
end.onclick = function end(){
  if (!onEnd){
    onEnd = true;
  }
}

//Test button, If pressed on display the test video feed
let testBtn = document.getElementById("testButton");
testBtn.onclick = function test(){
  if(testing){
    testing = false;
    canvas.hidden = true;
  } else {
    testing = true;
    canvas.hidden = false;
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
  interval = setInterval(() =>{
    runDetection();
  }, timer);
}


//Takes a screen capture
function runDetection(){
  //Checks to see if program is supposed to end safely
  if(onEnd){
    clearInterval(interval);
    handTrack.stopVideo(video); 
    model.dispose();
    console.log("Interval over, program ending");
  } else {
  //Grab the height and width from the webcam feed
  width = video.videoWidth;
  height = video.videoHeight;
  let x = 0;
  let y = 0;
  let temp = [];
  //Using handtrackjs send a screen capture from the video and make a call to detect a hand
  model.detect(video).then(predictions => {
      temp = predictions;
      //If testing mode is enabled, display a screen of the video feed with any hands detected
      if(testing){
        model.renderPredictions(temp, canvas, context, video); 
      }
      //If there is a hand detected:
      if(temp.length > 0){
          //Grab the x and y dimensions of it
          x = temp[0].bbox[0];
          y = temp[0].bbox[1];

          //Take the difference between this screen capture and the previous one
          let deltaX = (x - xLast)/width;
          let deltaY = (y - yLast)/height;
      
          //Using the thresholds determine how much movement has occured
          let xAbs =  Math.floor(Math.abs(deltaX/xThreshold));
          let yAbs =  Math.floor(Math.abs(deltaY/yThreshold));

          //Check to see if enough motion has occured in the x or y axis. If so, rotate the correct amount
          if ((deltaX > xThreshold * 2) && (xAbs <  9)){
              for(let i = 0; i < xAbs; i++){
                rotateRight();
              }
          } else if ((deltaX * -1 > xThreshold * 2) && (xAbs < 9)){
              for(let i = 0; i < xAbs; i++){
                rotateLeft();
              }
          }
      
          if ((deltaY > yThreshold * 2) && (yAbs < 6)){
              for(let i = 0; i < yAbs; i++){
                rotateDown();
              }
          } else if ((deltaY * -1 > yThreshold * 2) && (yAbs < 6)){
              for(let i = 0; i < yAbs; i++){
                rotateUp();
              }
          }
          //Reset the variables that hold the previous x and y values
          xLast = x;
          yLast = y;   
      }
  });
}
}