//dbromle2
//bmacdo73

/*
*
*   Basic node.js & express HTTP server to handle the 3D file GET Requests
*
*/

const express = require("express");
const app = express();
const router = express.Router();

// serve files in static' folder at root URL '/'
app.use('/', express.static('static'));

//load the index.html page
router.get("/", (req,res)=>{
    res.sendFile("index.html", {root: __dirname});
});

app.use('/api', router); // Set the routes at '/api'

//start the server
const port = process.env.port || 3000;
app.listen(port, () => console.log("Listening on port " + port + "."));