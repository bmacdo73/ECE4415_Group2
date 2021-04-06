//dbromle2
//bmacdo73

/*
*
*   Basic node.js & express HTTP server to handle the 3D file GET Requests
*
*/

const express = require("express");
var https = require('https');
var http = require('http');
var fs = require('fs');
const app = express();
const router = express.Router();

var options = {
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem')
};
  

// serve files in static' folder at root URL '/'
app.use('/', express.static('static'));

//load the index.html page
router.get("/", (req,res)=>{
    res.sendFile("index.html", {root: __dirname});
});

app.use('/api', router); // Set the routes at '/api'

//start the server
const port = process.env.port || 80;
const ports = process.env.port || 443;
//app.listen(port, () => console.log("Listening on port " + port + "."));

http.createServer(app).listen(port, () => console.log("Listening on port " + port + " for https"));
https.createServer(options, app).listen(ports, () => console.log("Listening on port " + ports + " for https"));