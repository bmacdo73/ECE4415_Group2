/*
*----------------------------------------------------------------------------------------------------------------
*
*    three.js setup
*
*----------------------------------------------------------------------------------------------------------------
*/
//import GLTFLoader files from the CDN
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three/examples/jsm/loaders/GLTFLoader.js';
//import OrbitControls files from the CDN
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three/examples/jsm/controls/OrbitControls.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xE0E0E0);
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
//camera defaults to facing (0,0,0) along the negative z-axis
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
const controls = new OrbitControls(camera, renderer.domElement);
//controls.update() must be called after any manual changes to the camera's transform


/*
*----------------------------------------------------------------------------------------------------------------
*
*    GLTFLoader() - .glb file imports
*
*----------------------------------------------------------------------------------------------------------------
*/
//add 3dbenchy
const loader = new GLTFLoader();
loader.load("./3d/3dbenchy.glb", function (gltf) {
    //define the material
    gltf.scene.traverse((child) => {
        if (child.isMesh) {
            child.material = new THREE.MeshPhongMaterial({ color: 0xff3f00, flatShading: true });
        }
    })
    scene.add(gltf.scene);
    console.log("3dbenchy.glb loaded successfully.");
}, undefined, function (error) {
    console.error(error);
});

//add Vancouver Thunderbird Totem Pole
loader.load("./3d/vancouverTotemPole.glb", function (gltf) {
    //define the material
    gltf.scene.traverse((child) => {
        if (child.isMesh) {
            child.material = new THREE.MeshStandardMaterial({ color: 0x2c2017, flatShading: true });
        }
    })
    gltf.scene.position.set(-0.075, 0, -0.1);
    scene.add(gltf.scene);
    console.log("vancouverTotemPole.glb loaded successfully.");
}, undefined, function (error) {
    console.error(error);
});

//---------------------------------------------------------------------------------------------------------------

//add lighting
var ambientLight = new THREE.AmbientLight(0xffffff, 0.25)
scene.add(ambientLight)
var rightPointLight = new THREE.PointLight(0xffffdd, 1);
rightPointLight.position.set(25, 50, 25);
scene.add(rightPointLight);
var leftPointLight = new THREE.PointLight(0xffffdd, 1);
leftPointLight.position.set(-25, 50, 25);
scene.add(leftPointLight);

//set camera back a bit and elevated a bit to see the object without it clipping
camera.position.y = 0.067;
camera.position.z = 0.2;
//controls.update() must be called after any manual changes to the camera's transform
controls.update();


/*
*----------------------------------------------------------------------------------------------------------------
*
*    Camera Manipulation - Functions to rotate along x- and y-axis in 30* increments
*
*----------------------------------------------------------------------------------------------------------------
*/

/*
* REMEBER!
* Camera defaults to facing (0,0,0) along the negative z-axis
* (x,y,z) ==> positive values move (right,up,backwards) to camera default position
* Angles measured in rad
* Maximum range for Azimuth angle is (-inf,+inf)
* Maximum range for Polar is [0,pi] ==> cannot flip camera upside down. This is a feature not a bug!
*/

//declarations
var btnTestLeft = document.getElementById("rotateTestLeft");
var btnTestRight = document.getElementById("rotateTestRight");
var btnTestUp = document.getElementById("rotateTestUp");
var btnTestDown = document.getElementById("rotateTestDown");
const x = new THREE.Vector3(1, 0, 0);
const y = new THREE.Vector3(0, 1, 0);

//Negative rotation along the x-axis
//"Rotate Up"
/*btnTestUp.onclick = function rotateUp(){*/
var rotateUp = function () {
    console.log("\n" + "Negative rotation along the x-axis!");
    console.log("Old angle: azimuth=" + controls.getAzimuthalAngle() + "  polar=" + controls.getPolarAngle());
    camera.position.applyAxisAngle(x, (-30 * Math.PI / 180));
    controls.update();
    console.log("New angle: azimuth=" + controls.getAzimuthalAngle() + "  polar=" + controls.getPolarAngle() + "\n" + " ");
}
//Positive rotation along the x-axis
//"Rotate Down"
/*btnTestDown.onclick = function rotateDown(){*/
var rotateDown = function () {
    console.log("\n" + "Positive rotation along the x-axis!");
    console.log("Old angle: azimuth=" + controls.getAzimuthalAngle() + "  polar=" + controls.getPolarAngle());
    camera.position.applyAxisAngle(x, (30 * Math.PI / 180));
    controls.update();
    console.log("New angle: azimuth=" + controls.getAzimuthalAngle() + "  polar=" + controls.getPolarAngle() + "\n" + " ");
}
//Negative rotation along the y-axis
//"Rotate Left"
/*btnTestLeft.onclick = function rotateLeft(){*/
function rotateLeft() {
    console.log("\n" + "Negative rotation along the y-axis!");
    console.log("Old angle: azimuth=" + controls.getAzimuthalAngle() + "  polar=" + controls.getPolarAngle());
    camera.position.applyAxisAngle(y, (-30 * Math.PI / 180));
    controls.update();
    console.log("New angle: azimuth=" + controls.getAzimuthalAngle() + "  polar=" + controls.getPolarAngle());
}
//Positive rotation along the y-axis
//"Rotate Right"
/*btnTestRight.onclick = function rotateRight(){*/
var rotateRight = function () {
    console.log("\n" + "Positive rotation along the y-axis!");
    console.log("Old angle: azimuth=" + controls.getAzimuthalAngle() + "  polar=" + controls.getPolarAngle());
    camera.position.applyAxisAngle(y, (30 * Math.PI / 180));
    controls.update();
    console.log("New angle: azimuth=" + controls.getAzimuthalAngle() + "  polar=" + controls.getPolarAngle() + "\n" + " ");
}


/*
*----------------------------------------------------------------------------------------------------------------
*
*    Animation and rendering calls - this is where the magic happens
*
*----------------------------------------------------------------------------------------------------------------
*/
animate();

function animate() {
    requestAnimationFrame(animate);

    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.render(scene, camera);
};