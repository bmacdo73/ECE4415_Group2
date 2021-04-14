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
//let canvas = document.createElement('canvas');
let canvas = document.getElementById('canvas');
let context = canvas.getContext('2d');
let n = 0;
let model;
let xLast = 0;
let yLast = 0;
let width;
let height;
let onStart = false;
const xThreshold = 0.1;
const yThreshold = 0.1;
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
      model.renderPredictions(predictions, canvas, context, video); 
      if(temp.length > 0){
          x = temp[0].bbox[0];
          y = temp[0].bbox[1];

          let deltaX = (x - xLast)/width;
          let deltaY = (y - yLast)/height;
      
          let xAbs =  Math.floor(Math.abs(deltaX/xThreshold));
          let yAbs =  Math.floor(Math.abs(deltaY/yThreshold));

          if (deltaX > xThreshold){
              console.log("Move right " + xAbs);
              for(let i = 0; i < xAbs; i++){
                rotateRight();
              }
          } else if (deltaX * -1 > xThreshold){
              console.log("Move Left " + xAbs);
              for(let i = 0; i < xAbs; i++){
                rotateLeft();
              }
          }
      
          if (deltaY > yThreshold){
              console.log("Move Down " + yAbs);
              for(let i = 0; i < yAbs; i++){
                rotateDown();
              }
          } else if (deltaY * -1 > yThreshold){
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

/************************************************
//OLD CODE
************************************************/

/*
//Takes two frames from the webcam and compares them
function blend() {

  //GOOD VERSION
  //console.log("Blend has started");
  
  //Create an image data to hold the difference between current frame and last frame
  diffImage = diffContext.createImageData(vidWidth, vidHeight);

  //Take the difference between a downscaled current frame and previous frame
  diffContext.globalCompositeOperation = 'difference';
  diffContext.drawImage(video, 0, 0, vidWidth, vidHeight);
  diffImage = diffContext.getImageData(0, 0, vidWidth, vidHeight);

  //Create variables to be used in the loop
  let x = 0;
  let y = 0;
  let r = 0;
  let b = 0;
  let g = 0;
  let pixelScore = 0;

  //TEST
  //Reset the array:
  for (var i = 0; i < xDivAmount; i++){
    xDiv[i] = 0;
    yDiv[i] = 0;
  }

  // Iterate through every pixel
  for (let i = 0; i < diffImage.data.length; i += 4) {

    // y value of the pixel
    y = Math.floor(i/(vidWidth * 4));
    // x value of the pixel
    x = Math.floor((i - (y * vidWidth * 4))/4);
  
    // Gather weighted r, g, and b values and take the total
    r = diffImage.data[i + 0] * rMult;  // R value
    g = diffImage.data[i + 1] * gMult;  // G value
    b = diffImage.data[i + 2] * bMult;  // B value
    pixelScore = (r + g + b)/ 255;

    //TESTING
    if (pixelScore > pixelThresh){
      //Take down red and blue, send green way up
      diffImage.data[i + 0] = 0;  // R value
      diffImage.data[i + 1] = pixelScore * 255;  // G value
      diffImage.data[i + 2] = 0;  // B value

      //TESTING
      xDiv[Math.floor((x/vidWidth)*(xDivAmount))]++;
      yDiv[Math.floor((y/vidHeight)*(yDivAmount))]++;
    }

    //TESTING
    //Set up horizontal lines
    if ((y%Math.floor(vidHeight/yDivAmount)) == 0){
      diffImage.data[i + 1] = 0;
      diffImage.data[i + 0] = 255;
    }

    //Set up vertical lines
    if( (x%Math.floor(vidWidth/xDivAmount)) == 0){
      diffImage.data[i + 1] = 0;
      diffImage.data[i + 0] = 255;
    }


  }

  //TEST
  //Find the largest divisions:
  for (var i = 0; i < xDivAmount; i++){
    if(xDiv[i] > xDiv[xDivI] * xMult){
      xDivI = i; 
    }
  }

  for (var i = 0; i < yDivAmount; i++){
    if(yDiv[i] > yDiv[yDivI] * yMult){
      yDivI = i; 
    }
  }

  //Check which direction movement has been if there has been any
  if (xDivI < xDivILast){
    xMotion = "Right";
    xP += xDivILast - xDivI;
    rotateRight();
    console.log(xMotion);
  } else if (xDivI > xDivILast){
    xMotion = "Left";
    xP += xDivI - xDivILast;
    rotateLeft();
    console.log(xMotion);
  } else {
    //console.log("Percent travelled in x direction: " + xP/xDivAmount); 
    xP = 0;
    xMotion = "None"
  }

  if (yDivI < yDivILast){
    yMotion = "Up";
    yP += yDivILast - yDivI;
    rotateUp();
    rotateUp();
    console.log(yMotion);
  } else if (yDivI > yDivILast){
    yMotion = "Down";
    yP += yDivI - yDivILast;
    rotateDown();
    rotateDown();
    console.log(yMotion);
  } else {
    yMotion = "None"
    //console.log("Percent travelled in y direction: " + yP/yDivAmount); 
    yP = 0;
  }



  //document.getElementById('xMotionLabel').innerText = xMotion;
  //document.getElementById('yMotionLabel').innerText = yMotion;
  xDivILast = xDivI;
  yDivILast = yDivI;

  //TEST
  //Print out the frame to the test canvas
  
  let testCtx = document.getElementById('testCanvas').getContext('2d');
  testCtx.putImageData(diffImage,0,0);

  // draw current capture normally over diff, ready for next time
  diffContext.globalCompositeOperation = 'source-over';
  diffContext.drawImage(video, 0, 0, vidWidth, vidHeight);

  //console.log("Blend has finished");
}
*/