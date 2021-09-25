
/*
 * To run this locally:
 * 1. cd rps/
 * 2. `node app.js`
 * 3. in browser, visit http://localhost:3000/index.html
 *    -> to run a test version, visit http://localhost:3000/index.html?&mode=test
 */


// GLOBALS
const JSPATH = "/lib"; // path to static js files

// Server variables
const express = require("express"); // initialize express server
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const { v4: uuidV4} = require('uuid');; // UUID library for generating unique IDs
var expt_handler = require(__dirname + JSPATH + "/" + "expt.js"); // object for keeping track of experiment status



// Initialize server
server.listen(8857, () => {
    console.log("app.js:\t listening on *:8857");
});


// General purpose getter for js files
app.get("/*", function(req, res) {
    var file = req.params[0];
    res.sendFile(__dirname + "/" + file);
});

// socket.io will call this function when a client connects
io.on("connection", function (client) {
    console.log("app.js:\t new user connected");
    client.userid = uuidV4();
    // tell the client it connected successfully and pass along unique ID
    client.emit("on_connected", {id: client.userid});
    initializeClient(client);
});


/*
 * Function to handle subsequent socket interactions between expt_handler and clients
 */
initializeClient = function(client) {
    // extract relevant info from client request
    var istest = client.handshake.query.istest == "true";
    expt_handler.newExpt(client, istest);

    // handler for client finishing instructions
    client.on("finished_instructions", function() {
        console.log("app.js:\t client finished instructions.");
        expt_handler.startExpt(client);
    })

    // handler for player signaling that they're ready for the survey
    client.on("request_survey", function() {
        console.log("app.js:\t detected survey request.");
        expt_handler.showSurvey(client);
    });

    // handler for player signaling that they're ready for the next round
    client.on("survey_submit", function(data) {
        console.log("app.js:\t detected survey submission.");
        expt_handler.recordSurveyData(client, data);
        expt_handler.updateRound(client);
    });

    // handler for player submitting debrief data
    client.on("debrief_submit", function(data) {
        console.log("app.js:\t detected debrief submission.");
        expt_handler.recordDebriefData(client, data);
    });

    // handle disconnect
    client.on("disconnect", function() {
        console.log("app.js:\t detected client disconnect");
        expt_handler.clientDisconnect(client);
    });
};
