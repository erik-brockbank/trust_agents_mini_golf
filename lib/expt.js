/*
 * Core game logic
 * Note: exports new ExperimentHandler() for use by app.js when clients connect
 */


var fs = require("fs");
var weighted = require("weighted");
var _ = require("lodash");
var server_constants = require("./server_constants.js"); // constants


// ExperimentHandler TODO
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
ExperimentHandler.prototype.newExpt = function(client) {
    console.log("expt.js:\t creating new experiment for client: ", client.userid);
    var new_expt = {
        "client_id": client.userid,
        "instruction_start_ts": new Date(),
        "istest": client.istest
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
        curr_expt.agent = _.sample(server_constants.constants.AGENT_SET);
        curr_expt.trial_order = this.getAgentVideos(curr_expt.agent);
        curr_expt.trial_index = 0;
        curr_expt.trials = [];
        curr_expt.experiment_start_ts = new Date();
        // Update experiment object with settings above
        this.active_experiments[client.userid] = curr_expt;
    }
    console.log("expt.js:\t new experiment: ", curr_expt);
    this.startNextRound(client);
};


/*
 * Sample videos for experiment agent
 */
ExperimentHandler.prototype.getAgentVideos = function(agent_type) {
    var videoSet = [];
    const weights = server_constants.constants.VIDEO_WEIGHTS[agent_type];
    const rewardSet = server_constants.constants.REWARD_VALS;
    if (weights.length == 1) { // low and high competence agents
        var rewardList = _.times(server_constants.constants.GAME_ROUNDS, function() {
            return weighted.select(rewardSet, weights[0]);
        });
        for (idx in server_constants.constants.REWARD_VALS) {
            var rwd = server_constants.constants.REWARD_VALS[idx];
            videoSet.push.apply(videoSet,
                _.sampleSize(
                    server_constants.constants.VIDEO_SETS[rwd],
                    _.filter(rewardList, function(elem) {return elem == rwd;}).length
            ));
        };
        videoSet = _.shuffle(videoSet);
    } else { // learning agent
        for (trialSet in weights) {
            var rewardList = _.times(server_constants.constants.GAME_ROUNDS / weights.length, function() {
                return weighted.select(rewardSet, weights[trialSet]);
            });
            var newVids = [];
            for (idx in server_constants.constants.REWARD_VALS) {
                var rwd = server_constants.constants.REWARD_VALS[idx];
                newVids.push.apply(videoSet,
                    _.sampleSize(
                        server_constants.constants.VIDEO_SETS[rwd],
                        _.filter(rewardList, function(elem) {return elem == rwd;}).length
                ));
            };
            newVids = _.shuffle(newVids);
            videoSet.push.apply(videoSet, newVids);
        }
    }
    return videoSet;
};


/*
 * Show survey
 */
ExperimentHandler.prototype.showSurvey = function(client, data) {
    console.log("expt.js:\t showing survey for client: ", client.userid);
    var curr_expt = this.active_experiments[client.userid];
    if (curr_expt) {
        if (curr_expt.trial_index < curr_expt.trial_order.length - 1) {
            var surveyTrial = curr_expt.trial_order[curr_expt.trial_index + 1];
        } else {
            var surveyTrial = curr_expt.trial_order[0];
        }
        // update internal data object
        curr_expt.trials[curr_expt.trial_index]["round_start_ts"] = data.round_start_ts;
        curr_expt.trials[curr_expt.trial_index]["round_end_ts"] = data.round_end_ts;
        curr_expt.trials[curr_expt.trial_index]["video_views"] = data.video_views;
        curr_expt.trials[curr_expt.trial_index]["video_prediction"] = surveyTrial;
        this.active_experiments[client.userid] = curr_expt;
        // notify client
        client.emit("show_survey", {
            curr_trial: curr_expt.trial_index + 1, // trial index is 0-indexed
            survey_trial: surveyTrial
        });
    }
};


/*
 * Save survey data
 */
ExperimentHandler.prototype.recordSurveyData = function(client, data) {
    var curr_expt = this.active_experiments[client.userid];
    if (curr_expt) {
        console.log("expt.js:\t logging survey data for client: ", client.userid);
        // curr_expt.trials[curr_expt.trial_index]["video_prediction"] = curr_expt.trial_order[curr_expt.trial_index + 1];
        curr_expt.trials[curr_expt.trial_index]["response"] = data.sliderVal;
        curr_expt.trials[curr_expt.trial_index]["survey_start_ts"] = data.survey_start_ts;
        curr_expt.trials[curr_expt.trial_index]["survey_end_ts"] = data.survey_end_ts;
        this.active_experiments[client.userid] = curr_expt;
    }
};


/*
 * Update round info (increment index, etc.)
 */
ExperimentHandler.prototype.updateRound = function(client) {
    console.log("expt.js:\t updating round info for client: ", client.userid);
    var curr_expt = this.active_experiments[client.userid];
    if (curr_expt) {
        // If this is the last trial for this agent move on to debrief
        if (curr_expt.trial_index >= curr_expt.trial_order.length - 1) {
            this.finishAgent(client);
        } else {
            // Else simply update trial index
            curr_expt.trial_index = curr_expt.trial_index + 1;
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
        // update internal data object
        curr_expt.trials.push({
            client_id: curr_expt.client_id,
            agent_type: curr_expt.agent,
            trial_number: curr_expt.trial_index + 1, // 1-indexed
            video_file_shown: curr_expt.trial_order[curr_expt.trial_index]
        });
        // notify client
        this.active_experiments[client.userid] = curr_expt;
        client.emit("next_round", {
            current_round: curr_expt.trial_index + 1, // NB: curr_expt.trial_index is 0-indexed
            total_rounds: server_constants.constants.GAME_ROUNDS,
            trial_video: curr_expt.trial_order[curr_expt.trial_index] // NB: curr_expt.trial_index is 0-indexed
        });
    }
};


/*
 * Notify client that they're beginning trials with subsequent agent
 */
ExperimentHandler.prototype.finishAgent = function(client) {
    console.log("expt.js:\t finishing agent evaluation for client: ", client.userid);
    this.writeTrialData(client);
    client.emit("finish_agent");
};


/*
 * Record debrief data and end experiment
 */
ExperimentHandler.prototype.recordDebriefData = function(client, data) {
    console.log("expt.js:\t recording debrief data for client: ", client.userid);
    this.writeDebriefData(client, data);
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


/*
 * Write trial data to json
 */
ExperimentHandler.prototype.writeTrialData = function(client) {
    console.log("expt.js:\t writing trial data for client: ", client.userid);
    var curr_expt = this.active_experiments[client.userid];
    if (curr_expt) {
        var trials = curr_expt.trials;
        data_str = JSON.stringify(trials, null, 2);
        // console.log("game.js:\t results string: ", data_str);
        const filename = `${server_constants.constants.DATA_PATH}/${curr_expt.client_id}_trials.json`;
        fs.writeFile(filename, data_str, (err) => {
            if (err) throw err;
            console.log("expt.js:\t trial data successfully written to file.");
        });
    }
};


/*
 * Write debrief data to json
 */
ExperimentHandler.prototype.writeDebriefData = function(client, debrief_data) {
    var curr_expt = this.active_experiments[client.userid];
    if (curr_expt) {
        debrief_data["client_id"] = curr_expt.client_id;
        debrief_data["agent_type"] = curr_expt.agent;
        data_str = JSON.stringify(debrief_data, null, 2);
        // console.log("game.js:\t results string: ", data_str);
        const filename = `${server_constants.constants.DATA_PATH}/${curr_expt.client_id}_debrief.json`;
        fs.writeFile(filename, data_str, (err) => {
            if (err) throw err;
            console.log("expt.js:\t trial data successfully written to file.");
        });
    }
}



var expt_handler = new ExperimentHandler();
module.exports = expt_handler;
