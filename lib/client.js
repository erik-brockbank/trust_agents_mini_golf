/*
 * Core client-side functionality
 * Some of this is borrowed from https://github.com/hawkrobe/MWERT/blob/master/game.client.js
 */


// global for keeping track of the player object for this client
var THIS_PLAYER = {
    experiment_id: "",
    credit_token: "",
    survey_code: ""
};

// Start up: load consent page with callback to start instructions
$(window).ready(function() {
    $("body").load(HTML_LOOKUP["consent"], function() {
        $("#credit").text(CREDIT_INFO);
        $("#duration").text(STUDY_DURATION);
        $("#consent-button").click(connect_to_server);
    });
});



// Callback after completion of instructions
connect_to_server = function() {
    var expt = {};
    expt = initialize_experiment(expt); // set game attributes, loads html
    // pass in relevant features on connection
    expt.socket = io.connect("", {query: {istest: true}});
    // map out function bindings for various messages from the server
    expt.socket.on("on_connected", client_on_connected.bind(THIS_PLAYER));
    expt.socket.on("start_instructions", client_start_instructions.bind(expt));
    expt.socket.on("next_round", client_start_round.bind(expt));
    expt.socket.on("show_survey", client_show_survey.bind(expt));
    expt.socket.on("finished_experiment", client_finished_experiment.bind(expt));
};


// Initialization for experiment object: parses html, assigns attributes, and loads stub html for experiment
initialize_experiment = function(expt) {
    // URL parsing
    // ex. http://localhost:3000/index.html?&mode=test&ver=2
    // game.istest = false; // whether this is a test round (mostly used for debugging)
    // game.version = 1; // whether this is a paired game (1) or against a bot (2): default = 1
    // var urlParams = new URLSearchParams(window.location.href);
    // if (urlParams.has("mode") && urlParams.get("mode").includes("test")) {
    //     game.istest = true;
    // }
    // if (urlParams.has("ver") && urlParams.get("ver").includes("2")) {
    //     game.version = 2;
    // }
    // if (urlParams.has("ver") && urlParams.get("ver").includes("3")) {
    //     game.version = 3;
    // }
    // if (urlParams.has("sona") && urlParams.get("sona").includes("1")) {
    //     // Note this should only occur in version 2 above
    //     THIS_PLAYER.sona = 1;
    //     THIS_PLAYER.experiment_id = EXPERIMENT_ID;
    //     THIS_PLAYER.credit_token = CREDIT_TOKEN;
    //     if (urlParams.has("survey_code")) {
    //         THIS_PLAYER.survey_code = urlParams.get("survey_code");
    //     }
    // }
    // console.log("client.js:\t initializing game. \n\tTEST: ", game.istest, "\n\tVERSION: ", game.version);
    // console.log("client.js:\t Participant SONA info: \n\tSONA = ", THIS_PLAYER.sona,
    //             "; \n\texperiment id = ", THIS_PLAYER.experiment_id, "; \n\tcredit token = ", THIS_PLAYER.credit_token,
    //             "; \n\tsurvey code = ", THIS_PLAYER.survey_code);
    // Load game html
    // $("body").load(HTML_LOOKUP["experiment"]);

    console.log("client.js:\t initializing experiment.");
    return expt;
};



client_on_connected = function(data) {
    this.client_id = data.id;
};


client_start_instructions = function() {
    var urlParams = (new URL(document.location)).searchParams;
    if (urlParams.has("mode") && urlParams.get("mode").includes("noinstructions")) {
        this.socket.emit("finished_instructions");
    }
    else {
        var callback = function() {
            this.socket.emit("finished_instructions");
        }
        var inst = new Instructions(HTML_LOOKUP["instructions"], INSTRUCTION_ARRAY, callback.bind(this));
        inst.run();
    }
};


client_start_round = function(data) {
    console.log("client.js:\t starting round.");
    $("body").load(HTML_LOOKUP["video_round"], function() {
        // set_agent_header(index, opponent_ability)
        // display_message(NEWGAME_READY, hideall = false);
        // TODO move this to client_view.js
        update_round(data.current_round, data.total_rounds);
        console.log("PLAYING VIDEO: ", data.trial_video);
        $("#video-container").html(
            "<video controls width='600'>" +
            "<source src='vid/goal0_reward1_traj0.webm' type='video/webm'>" +
            "</video>"
        );
        show_next_button(request_survey.bind(this), "Continue");
    }.bind(this));
};


// TODO move this to client_view.js
show_next_button = function(callback, text="Play Next Round") {
    $("#exp-button-container").css({visibility: "visible"});
    $(".next-button").text(text);
    $(".next-button").unbind().click(callback);
};

// TODO move this to client_view.js
update_round = function(current_round_index, game_rounds) {
    $("#round-index").text(current_round_index + "/" + game_rounds);
}

request_survey = function() {
    this.round_results_end_ts = new Date();
    // this.socket.emit("next_round", {"round_results_begin_ts": this.round_results_begin_ts, "round_results_end_ts": this.round_results_end_ts})
    this.socket.emit("request_survey");
};

client_show_survey = function() {
    var callback = submit_survey_responses.bind(this);
    $("body").load(HTML_LOOKUP["survey_round"], function() {
        // set_agent_header(index, opponent_ability)
        // display_message(NEWGAME_READY, hideall = false);
        // TODO move this to client_view.js
        show_next_button(callback, "Submit and Continue to Next Round");
    }.bind(this));

};

submit_survey_responses = function(data) {
    // callback = load_and_request_next_round.bind(this);
    // slider_data = {
    //     game_id: THIS_PLAYER.game_id,
    //     slider_1: parseInt($("input[type='radio'][name='radio-1']:checked").val()),
    //     slider_2: parseInt($("input[type='radio'][name='radio-2']:checked").val()),
    // };
    var slider_data = {};
    this.socket.emit("survey_submit", slider_data);
    // callback();
};


/*
 * Replace all experiment html with end-of-experiment header message
 */
client_finished_experiment = function() {
    console.log("client.js:\t completed experiment.");
    $("#experiment-container").html("<h2 style='text-align:center'>" + THANK_YOU + "</h2>");
    // post_completion();
};
