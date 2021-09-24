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
// streamline: write separate functions for handling video file selection/shuffling, other ops
    // consider deleting server_constants.js



/*
 * Object class for keeping track of the experiments in process
 * This is the only thing visible to app.js
 */
ExperimentHandler = function() {
    this.active_experiments = {}; // dict: mapping from client_id to experiment objects
};


/*
 * Function to create a new experiment object and add this client
 */
ExperimentHandler.prototype.newExpt = function(client, istest) {
    console.log("expt.js:\t creating new experiment for client: ", client.userid);
    // TODO move to function that makes new experiment with all relevant variables
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
 * Function to create a new experiment object and add this client
 */
ExperimentHandler.prototype.startExpt = function(client) {
    console.log("expt.js:\t starting experiment for client: ", client.userid);
    // Initialize experiment condition variables
    var curr_expt = this.active_experiments[client.userid];
    if (curr_expt) {
        // TODO write separate functions to get each of these variable values (e.g. "get_low_competence_trials")
        // or move to server_constants.js
        curr_expt.agent_order = _.shuffle([
            "low_competence_agent", "high_competence_agent", "learning_agent"
        ]);
        curr_expt.trial_order = {
            "low_competence_agent": ["goal0_reward1_traj0.webm",
                "goal1_reward1_traj0.webm", "goal2_reward1_traj0.webm", "goal3_reward1_traj0.webm",
                "goal4_reward1_traj0.webm", "goal6_reward1_traj0.webm", "goal7_reward1_traj0.webm",
                "goal8_reward1_traj0.webm", "goal9_reward1_traj0.webm", "goal10_reward1_traj0.webm"
            ],
            "high_competence_agent": ["goal0_reward1_traj1.webm",
                "goal1_reward1_traj1.webm", "goal2_reward2_traj1.webm", "goal3_reward2_traj1.webm",
                "goal4_reward2_traj1.webm", "goal6_reward3_traj1.webm", "goal7_reward3_traj1.webm",
                "goal8_reward3_traj1.webm", "goal9_reward4_traj1.webm", "goal10_reward4_traj1.webm"
            ],
            "learning_agent": ["goal0_reward4_traj0.webm",
                "goal1_reward4_traj0.webm", "goal2_reward4_traj0.webm", "goal3_reward4_traj0.webm",
                "goal4_reward4_traj0.webm", "goal6_reward4_traj0.webm", "goal7_reward4_traj0.webm",
                "goal8_reward4_traj0.webm", "goal9_reward4_traj0.webm", "goal10_reward4_traj0.webm"
            ]
        };
        curr_expt.curr_agent_index = 0;
        curr_expt.curr_agent = curr_expt.agent_order[curr_expt.curr_agent_index];
        curr_expt.curr_trial = 1;
        // Update experiment object with settings above
        this.active_experiments[client.userid] = curr_expt;
    }
    this.startNextRound(client);
};


/*
 * Function to show survey
 */
ExperimentHandler.prototype.showSurvey = function(client) {
    console.log("expt.js:\t showing survey for client: ", client.userid);
    var curr_expt = this.active_experiments[client.userid];
    if (curr_expt) {
        const curr_agent = curr_expt.curr_agent_index;
        client.emit("show_survey", {curr_agent: curr_agent + 1}); // agent index is 0-indexed
    }
};


/*
 * Function to save survey data
 */
ExperimentHandler.prototype.recordSurveyData = function(client, data) {
    console.log("expt.js:\t logging survey data for client: ", client.userid);
    // TODO fill this in...
};


/*
 * Function to update round info (increment index, etc.)
 */
ExperimentHandler.prototype.updateRound = function(client) {
    console.log("expt.js:\t updating round info for client: ", client.userid);
    var curr_expt = this.active_experiments[client.userid];
    if (curr_expt) {
        var curr_trial = curr_expt.curr_trial;
        // If this is the last trial for this agent, update agent status
        if (curr_trial >= curr_expt.trial_order[curr_expt.curr_agent].length) {
            // If this is the last agent, end experiment
            if (curr_expt.curr_agent == _.last(curr_expt.agent_order)) {
                this.endExperiment(client);
            } else {
                // Else jump to next agent
                curr_expt.curr_agent_index = curr_expt.curr_agent_index + 1;
                curr_expt.curr_agent = curr_expt.agent_order[curr_expt.curr_agent_index];
                curr_expt.curr_trial = 1;
                this.active_experiments[client.userid] = curr_expt;
                this.startNextAgent(client, curr_expt.curr_agent_index); // since these are 0-indexed, previous agent is the updated index
            }
        } else {
            // Else simply update trial index
            curr_expt.curr_trial = curr_trial + 1;
            this.active_experiments[client.userid] = curr_expt;
            this.startNextRound(client);
        }
    }
};

/*
 * Function to start next round
 */
ExperimentHandler.prototype.startNextRound = function(client) {
    console.log("expt.js:\t starting round for client: ", client.userid);
    var curr_expt = this.active_experiments[client.userid];
    if (curr_expt) {
        var index = curr_expt.curr_trial;
        var curr_trial = curr_expt.trial_order[curr_expt.curr_agent][index-1]; // round index is 1-indexed
        client.emit("next_round", {
            current_round: index,
            total_rounds: server_constants.constants.GAME_ROUNDS,
            current_agent: curr_expt.curr_agent_index,
            trial_video: curr_trial
        });
    }
};

/*
 * Function to notify client that they're beginning trials with subsequent agent
 */
ExperimentHandler.prototype.startNextAgent = function(client, prev_agent_index) {
    console.log("expt.js:\t starting next agent for client: ", client.userid);
    client.emit("next_agent", {
        prev_agent_index: prev_agent_index
    });
};


/*
 * Function to notify client that experiment has ended
 */
ExperimentHandler.prototype.endExperiment = function(client) {
    console.log("expt.js:\t end of experiment for client: ", client.userid);
    client.emit("finished_experiment");
    this.clientDisconnect(client);
};


/*
 * Function to handle disconnects
 */
ExperimentHandler.prototype.clientDisconnect = function(client) {
    // TODO write partial data?
    if (client.userid in this.active_experiments) {
        console.log("expt.js:\t removing client: ", client.userid);
        delete this.active_experiments[client.userid];
    }
};

var expt_handler = new ExperimentHandler();
module.exports = expt_handler;
