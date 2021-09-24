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


// client.js TODO
// video viewing
// slider response
    // send actual slider data to server, plus timestamps (from client side)
// general logic / misc
    // write full instruction set: NB should make very explicit differentiation between "agents" here
    // add'l url parsing as needed
    // code cleanup, move to client_view.js
    // time execution, add prolific handling



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
    expt.socket.on("next_agent", client_next_agent.bind(expt));
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
        update_round(data.current_round, data.total_rounds);
        set_agent_header(data.current_agent + 1);
        display_message(VIDEO_MESSAGE.replace("*", data.current_agent+1));
        console.log(`client.js:\t loading video /${VIDEO_PATH}/${data.trial_video}`);
        // TODO move this to client_view.js
        $('#video-elem').html(
            `<source src='/${VIDEO_PATH}/${data.trial_video}' type='video/webm'>`
        );
        // prevent clicking ahead on video (pauses and re-starts video)
        $('#video-elem').on('seeked', function() {
            this.pause();
            this.currentTime = 0;
            this.load();
        });
        // show next button but only clickable once video has played
        show_next_button(client_request_survey.bind(this), "Continue");
        disable_button();
        $('#video-elem').on('ended', function() {
            enable_button();
        });
    }.bind(this));
};


client_next_agent = function(data) {
    console.log("client.js:\t starting with new agent");
    var callback = function() {
        this.socket.emit("start_next_agent");
    }
    // TODO move this to client_view.js
    display_message(FINISHED_GAME_HEADER.replace("*", data.prev_agent_index));
    $("#survey-banner").css({display: "none"});
    $("#survey-eval").css({display: "none"});
    $(".survey-slider-container").html("<h2>" + FINISHED_GAME_SUBHEADER + "</h2>");
    show_next_button(callback.bind(this), "Continue");
};


client_request_survey = function() {
    this.round_results_end_ts = new Date();
    // this.socket.emit("next_round", {"round_results_begin_ts": this.round_results_begin_ts, "round_results_end_ts": this.round_results_end_ts})
    this.socket.emit("request_survey");
};


client_show_survey = function(data) {
    var callback = client_submit_survey_responses.bind(this);
    $("body").load(HTML_LOOKUP["survey_round"], function() {
        display_message(SURVEY_SLIDER_HEADER);
        set_slider_message(SURVEY_SLIDER_MESSAGE.replace("*", data.curr_agent));
        draw_slider_context();
        show_next_button(callback, "Submit and Continue to Next Round");
        disable_button();
        // TODO move to separate function like "add slider response", then to client_view.js
        var sliderClicked = false;
        // $('input[type="range"][id="eval-slider"]').on('click', function(e) {
        $('input[type="range"][id="eval-slider"]').on('mousedown', function(e) {
            // make button available
            sliderClicked = true;
            if (sliderClicked) {
                enable_button();
            }
        });
        // Handle canvas updates
        $('input[type="range"][id="eval-slider"]').on('input', function(e) {
            // update canvas
            var sliderVal = $('input[type="range"][id="eval-slider"]').val();
            var canvas = document.getElementById("slider-canvas");
            if (canvas.getContext) {
                var ctx = canvas.getContext('2d');
                // get rid of existing content (i.e. previous circle)
                ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
                // re-draw sandbox
                draw_slider_context();
                // draw new circle
                var newRad = BINHEIGHT/2 - sliderVal*TARGETSLOPE; // set max, then subtract for higher slider values
                ctx.strokeStyle = "rgb(255, 0, 0, 0.75)";
                ctx.lineWidth = 5;
                ctx.beginPath(); // NB: this is necessary to avoid lines across radius of circles
                ctx.arc(BIN_STARTX + BINWIDTH/2, BIN_STARTY + BINHEIGHT/2, newRad, 0, Math.PI * 2, false); // center x, center y, radius, starting angle (rads), ending angle
                ctx.stroke();
                ctx.closePath();
            }
        });
    }.bind(this));

};


client_submit_survey_responses = function(data) {
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


// TODO move this to client_view.js
show_next_button = function(callback, text="Play Next Round") {
    $("#exp-button-container").css({visibility: "visible"});
    $(".next-button").text(text);
    $(".next-button").unbind().click(callback);
};

// TODO move this to client_view.js
update_round = function(current_round_index, game_rounds) {
    $("#round-index").text(current_round_index + "/" + game_rounds);
};

// TODO move this to client_view.js
display_message = function(msg, hideall=false) {
    if (hideall) {
        hide_next_button();
        $("#game-container").css({visibility: "hidden"});
    }
    $("#message-container").text(msg);
};

// TODO move this to client_view.js
set_slider_message = function(msg) {
    // $("#eval-slider-1-text").text(msg);
    $("#survey-banner").text(msg);
};

// TODO move this to client_view.js
draw_slider_context = function() {
    var canvas = document.getElementById("slider-canvas");
    if (canvas.getContext) {
        var ctx = canvas.getContext('2d');
        ctx.beginPath();
        // outer bin
        ctx.fillStyle = "black";
        ctx.fillRect(BIN_STARTX, BIN_STARTY, BINWIDTH, BINHEIGHT); // x, y, width, height
        // inner sand TODO draw this with fuzzy edges
        ctx.fillStyle = "lightgray";
        ctx.fillRect(25 + SANDPAD, 25 + SANDPAD, BINWIDTH - 2*SANDPAD, BINHEIGHT - 2*SANDPAD);
        // target
        ctx.fillStyle = "red";
        ctx.arc(BIN_STARTX + BINWIDTH/2, BIN_STARTY + BINHEIGHT/2, TARGETRAD, 0, Math.PI * 2); // center x, center y, radius, starting angle (rads), ending angle
        ctx.fill();
    }
};

// TODO move this to client_view.js
set_agent_header = function(agent_index) {
    // Highlight appropriate agent header, dim coloring on others
    for (var i = 1; i <= 3; i++) {
        if (agent_index === i) {
            $("#agent-" + i + "-label").addClass("agent-label-current");
            $("#agent-" + i + "-label").removeClass("agent-label");
        }
        else {
            $("#agent-" + i + "-label").removeClass("agent-label-current");
            $("#agent-" + i + "-label").addClass("agent-label");
        }
    }
    // Add coloring around video box that matches agent
    var outline_color = AGENT_COLOR_LOOKUP[agent_index];
    $("#video-elem").css({border: `25px solid ${outline_color}`});
};

// TODO move this to client_view.js
enable_button = function() {
    $("#next-round").css({opacity: "1.0"});
    $('#next-round').attr("disabled", false);
};

// TODO move this to client_view.js
disable_button = function() {
    $("#next-round").css({opacity: "0.2"});
    $('#next-round').attr("disabled", true);
};
