/*
 * Core game logic
 * Note: exports new ExperimentHandler() for use by app.js when clients connect
 */


// var fs = require("fs");
// var weighted = require("weighted");
var _ = require("lodash");
var server_constants = require("./server_constants.js"); // constants


// ExperimentHandler TODO
// send proper set/order of video files to client
// update game object state with slider returns, timestamp returns, video file names
    // write game state to file(s)



/*
 * Object class for keeping track of the experiments in process
 * This is the only thing visible to app.js
 */
ExperimentHandler = function() {
    this.active_experiments = {}; // dict: mapping from client_id to experiment objects
};


/*
 * Create a new experiment object and add this client
 */
ExperimentHandler.prototype.newExpt = function(client, istest) {
    console.log("expt.js:\t creating new experiment for client: ", client.userid);
    var new_expt = {
        "client_id": client.userid,
        "instruction_start_ts": new Date(),
        "istest": istest
    };
    // Add game to game server directory of games in play
    this.active_experiments[new_expt.client_id] = new_expt;
    // Update client to start instructions
    client.emit("start_instructions");
};


/*
 * Create a new experiment object and add this client
 */
ExperimentHandler.prototype.startExpt = function(client) {
    console.log("expt.js:\t starting experiment for client: ", client.userid);
    // Initialize experiment condition variables
    var curr_expt = this.active_experiments[client.userid];
    if (curr_expt) {
        curr_expt.current_agent = _.sample(server_constants.constants.AGENT_SET);
        curr_expt.trial_order = server_constants.constants.VIDEO_SETS[curr_expt.current_agent];
        curr_expt.curr_trial = 1;
        // Update experiment object with settings above
        this.active_experiments[client.userid] = curr_expt;
    }
    this.startNextRound(client);
};


/*
 * Show survey
 */
ExperimentHandler.prototype.showSurvey = function(client) {
    console.log("expt.js:\t showing survey for client: ", client.userid);
    var curr_expt = this.active_experiments[client.userid];
    if (curr_expt) {
        client.emit("show_survey", {
            curr_trial: curr_expt.curr_trial,
            trial_order: curr_expt.trial_order
        });
    }
};


/*
 * Save survey data
 */
ExperimentHandler.prototype.recordSurveyData = function(client, data) {
    console.log("expt.js:\t logging survey data for client: ", client.userid);
    // TODO fill this in...
};


/*
 * Update round info (increment index, etc.)
 */
ExperimentHandler.prototype.updateRound = function(client) {
    console.log("expt.js:\t updating round info for client: ", client.userid);
    var curr_expt = this.active_experiments[client.userid];
    if (curr_expt) {
        // If this is the last trial for this agent move on to debrief
        if (curr_expt.curr_trial >= curr_expt.trial_order.length) {
            this.finishAgent(client);
        } else {
            // Else simply update trial index
            curr_expt.curr_trial = curr_expt.curr_trial + 1;
            this.active_experiments[client.userid] = curr_expt;
            this.startNextRound(client);
        }
    }
};


/*
 * Start next round
 */
ExperimentHandler.prototype.startNextRound = function(client) {
    console.log("expt.js:\t starting round for client: ", client.userid);
    var curr_expt = this.active_experiments[client.userid];
    if (curr_expt) {
        client.emit("next_round", {
            current_round: curr_expt.curr_trial, // NB: curr_expt.curr_trial is 1-indexed
            total_rounds: server_constants.constants.GAME_ROUNDS,
            trial_video: curr_expt.trial_order[curr_expt.curr_trial-1] // NB: curr_expt.curr_trial is 1-indexed
        });
    }
};


/*
 * Notify client that they're beginning trials with subsequent agent
 */
ExperimentHandler.prototype.finishAgent = function(client) {
    console.log("expt.js:\t finishing agent evaluation for client: ", client.userid);
    client.emit("finish_agent");
};


/*
 * Record debrief data and end experiment
 */
ExperimentHandler.prototype.recordDebriefData = function(client, data) {
    console.log("expt.js:\t recording debrief data for client: ", client.userid);
    // TODO fill this in...
    this.endExperiment(client);
};


/*
 * Notify client that experiment has ended
 */
ExperimentHandler.prototype.endExperiment = function(client) {
    console.log("expt.js:\t end of experiment for client: ", client.userid);
    client.emit("finished_experiment");
    this.clientDisconnect(client);
};


/*
 * Handle disconnects
 */
ExperimentHandler.prototype.clientDisconnect = function(client) {
    if (client.userid in this.active_experiments) {
        console.log("expt.js:\t removing client: ", client.userid);
        delete this.active_experiments[client.userid];
    }
};



var expt_handler = new ExperimentHandler();
module.exports = expt_handler;
