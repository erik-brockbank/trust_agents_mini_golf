
/*
 * To run this locally:
 * 1. cd rps/
 * 2. `node app.js`
 * 3. in browser, visit http://localhost:3000/index.html
 *    -> to run a test version, visit http://localhost:3000/index.html?&mode=test
 *    -> append the same &mode=test to the bot version for testing
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

const UUID = require("uuid"); // UUID library for generating unique IDs
var expt_handler = require(__dirname + JSPATH + "/" + "expt.js"); // object for keeping track of experiment status




server.listen(3000, () => {
    console.log("app.js:\t listening on *:3000");
});

// Initializing server
// General purpose getter for js files
app.get("/*", function(req, res) {
    var file = req.params[0];
    res.sendFile(__dirname + "/" + file);
});

// socket.io will call this function when a client connects
io.on("connection", function (client) {
    console.log("app.js:\t new user connected");
    // client.userid = UUID();
    client.userid = 'a1'; // TODO why does uuid call above fail?
    // tell the client it connected successfully and pass along unique ID
    client.emit("on_connected", {id: client.userid});
    initializeClient(client);
});


// Function to handle socket interactions between game_server and clients
initializeClient = function(client) {
    // extract relevant info from client request
    var istest = client.handshake.query.istest == "true";

    expt_handler.newExpt(client, istest);

    // handle subsequent client interactions
    client.on("finished_instructions", function() {
        // game_handler.createGame(client, versions, istest, index=1);
        console.log("app.js:\t client finished instructions.");
        expt_handler.startExpt(client);
    })

    // handle player signal that they're ready for the next round
    client.on("request_survey", function() {
        console.log("app.js:\t detected survey request.");
        // game_handler.logTimes(client, data)
        expt_handler.showSurvey(client);
    });

    // handle player signal that they're ready for the next round
    client.on("survey_submit", function(data) {
        console.log("app.js:\t detected survey submission.");
        expt_handler.recordSurveyData(client, data);
        expt_handler.updateRound(client);
    });

    // // handle player signal that they're ready for the next game
    // client.on("next_game", function(data) {
    //     console.log("app.js:\t detected next game");
    //     game_handler.nextGame(client, data);
    // });

    // // handle player submitting exit survey slider data
    // client.on("slider_submit", function(data) {
    //     console.log("app.js:\t detected player Likert slider submission");
    //     game_handler.recordSliderData(data);
    // });

    // // handle disconnect
    // client.on("disconnect", function() {
    //     console.log("app.js:\t detected client disconnect");
    //     game_handler.clientDisconnect(client);
    // });
};
