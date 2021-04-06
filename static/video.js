import { rotateUp, rotateDown, rotateLeft, rotateRight } from './sandbox.js';

//FINAL VARIABLES
let video = null; //Holds the video feed from the webcam
let vidHeight = 0; //Video height
let vidWidth = 0; //Video width

var diffCanvas = null; // canvas to hold the difference
var diffContext = null; //context for diffCanvas
var diffImage = null; //image data from diffCanvas

let xMotion = "None"; //The current detected motion in the x axis
let yMotion = "None"; //The current detected motion in the y axis

let yDiv = []; //The divisions for the y axis
let xDiv = []; //The divisions for the x axis

let xDivI = 0; //Index of biggest division in the x axis
let yDivI = 0; //Index of biggest division in the y axis
let xDivILast = 0; //Last index of the biggest division in the x axis
let yDivILast = 0; //Last index of the biggest division in the y axis

let xP = 0; //Percentage of distance in x axis travelled
let yP = 0; //Percentage of distance in y axis travelled

let onStart = false; //Check if the recording has started already

const pixelThresh = 0.4; //Threshold at which pixels have enough movement to be counted
const idealWidth = 310; //The ideal value for width the program will seek from the webcam
const idealHeight = 240; //The ideal value for height the program will seek from the webcam
const frameTime = 50; //Time in ms between frames
const rMult = 0.299; //Multiplier for red values of pixels for weighted average
const gMult = 0.587; //Multiplier for green values of pixels for weighted average
const bMult = 0.114; //Multiplier for blue values of pixels for weighted average
const xDivAmount = 4; //Amount of divisions in the x axis
const yDivAmount = 4; //Amount of divisions in the y axis
const xMult = 1.00; //How much more motion must be in new x division to count
const yMult = 1.00; //How much more motion must be in new y division to count

console.log("Script starting up!");
  video = document.createElement('video');
  video.height = idealHeight;
  video.width = idealWidth;
  video.autoplay = true;

  try{
    if (navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ audio: false,video: {width: {ideal:idealWidth},height: {ideal:idealHeight} }})
        .then(function (stream) {
          console.log("Gets this far!");
          video.srcObject = stream; 
        }).catch(function (error) {
          console.log("Something went wrong!");
        });
    }
  }catch(err){
    console.log("error: " + err);
  }


function startup() {
  console.log("Script starting up!");
  video = document.createElement('video');
  video.height = idealHeight;
  video.width = idealWidth;
  video.autoplay = true;

  //TEST
  //Initialise the array:
  for (var i = 0; i < xDivAmount; i++){
    xDiv.push(0);
    yDiv.push(0);
  }
}

var btnStartCapture = document.getElementById("start");
btnStartCapture.onclick = function startCapture(){
  if (!onStart){
  onStart = true;
  console.log("start capture runs!");
  //TEST
  vidHeight = video.videoHeight;
  vidWidth = video.videoWidth;
  console.log(vidHeight + ", " + vidWidth);
  //Setup canvases
  diffCanvas = document.createElement('canvas');
  diffCanvas.height = vidHeight;
  diffCanvas.width = vidWidth;
  diffContext = diffCanvas.getContext('2d');

  setInterval(blend, frameTime);  
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
  } else if (xDivI > xDivILast){
    xMotion = "Left";
    xP += xDivI - xDivILast;
    rotateLeft();
  } else {
    //console.log("Percent travelled in x direction: " + xP/xDivAmount); 
    xP = 0;
    xMotion = "None"
  }

  if (yDivI < yDivILast){
    yMotion = "Up";
    yP += yDivILast - yDivI;
    rotateUp();
  } else if (yDivI > yDivILast){
    yMotion = "Down";
    yP += yDivI - yDivILast;
    rotateDown();
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
  /*
  let testCtx = document.getElementById('testCanvas').getContext('2d');
  testCtx.putImageData(diffImage,0,0);*/

  // draw current capture normally over diff, ready for next time
  diffContext.globalCompositeOperation = 'source-over';
  diffContext.drawImage(video, 0, 0, vidWidth, vidHeight);

  //console.log("Blend has finished");
}


 