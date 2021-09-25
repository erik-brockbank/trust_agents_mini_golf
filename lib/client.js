/*
 * Core client-side functionality
 */


// client.js TODO
// video viewing
// slider response
    // send actual slider data to server, plus timestamps (from client side)
// general logic / misc
    // code cleanup, move to client_view.js
    // time execution, add prolific handling


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
    expt.socket.on("on_connected", client_on_connected);
    expt.socket.on("start_instructions", client_start_instructions.bind(expt));
    expt.socket.on("next_round", client_start_round.bind(expt));
    expt.socket.on("finish_agent", client_finish_agent.bind(expt));
    expt.socket.on("show_survey", client_show_survey.bind(expt));
    expt.socket.on("finished_experiment", client_finished_experiment.bind(expt));
};


// Initialization for experiment object: parses html, assigns attributes, and loads stub html for experiment
initialize_experiment = function(expt) {
    // URL parsing
    // ex. http://localhost:3000/index.html?&mode=test
    var urlParams = new URLSearchParams(window.location.href);
    expt.istest = (urlParams.has("mode") && urlParams.get("mode").includes("test"));
    console.log("client.js:\t initializing experiment: ", expt);
    return expt;
};



client_on_connected = function(data) {
    // this.client_id = data.id;
};


client_start_instructions = function() {
    var callback = function() {
        this.socket.emit("finished_instructions");
    }
    var inst = new Instructions(HTML_LOOKUP["instructions"], INSTRUCTION_ARRAY, callback.bind(this));
    inst.run();
};


client_start_round = function(data) {
    console.log("client.js:\t starting round: ", data.current_round);
    $("body").load(HTML_LOOKUP["video_round"], function() {
        update_round(data.current_round, data.total_rounds);
        display_message(VIDEO_MESSAGE);
        // TODO move this to client_view.js
        $('.video-elem').html(
            `<source src='/${VIDEO_PATH}/${data.trial_video}' type='video/webm'>`
        );
        // prevent clicking ahead on video (pauses and re-starts video)
        $('.video-elem').on('seeked', function() {
            this.pause();
            this.currentTime = 0;
            this.load();
        });
        // show next button but only clickable once video has played
        show_next_button(client_request_survey.bind(this), "Continue");
        disable_button();
        $('.video-elem').on('ended', function() {
            enable_button();
        });
    }.bind(this));
};


client_request_survey = function() {
    this.round_results_end_ts = new Date();
    // this.socket.emit("next_round", {"round_results_begin_ts": this.round_results_begin_ts, "round_results_end_ts": this.round_results_end_ts})
    this.socket.emit("request_survey");
};


client_show_survey = function(data) {
    var callback = client_submit_survey_responses.bind(this);
    $("body").load(HTML_LOOKUP["survey_round"], function() {
        console.log("CURRENT TRIAL: ", data.curr_trial);
        console.log("TRIAL ORDER: ", data.trial_order);
        display_message(SURVEY_SLIDER_HEADER);
        set_slider_message(SURVEY_SLIDER_MESSAGE);
        var nextGoal = 0;
        var sliderVal = $('input[type="range"][id="eval-slider"]').val();
        $("#survey-eval").html(
            `<img class='slider-img' src='${IMG_PATH}/goal${nextGoal}_circle${sliderVal-1}.png'/>`
        );
        // Show "Continue" button but only make it clickable once people have chosen a slider value
        show_next_button(callback, "Submit and Continue to Next Round");
        disable_button();
        $('input[type="range"][id="eval-slider"]').on('mousedown', function() {
            enable_button();
        });
        // Dynamically show updated target rings based on slider selection
        $('input[type="range"][id="eval-slider"]').on('input', function() {
            var sliderVal = $('input[type="range"][id="eval-slider"]').val();
            var sliderMax = document.getElementById("eval-slider").max;
            $(".slider-img").attr(
                "src", `${IMG_PATH}/goal${nextGoal}_circle${sliderMax-sliderVal}.png`
            );
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


client_finish_agent = function() {
    console.log("client.js:\t agent trials complete.");
    // TODO move this to client_view.js
    display_message(FINISHED_GAME_HEADER);
    $("#survey-banner").css({display: "none"});
    $("#survey-eval").css({display: "none"});
    $(".survey-slider-container").html("<h2>" + FINISHED_GAME_SUBHEADER + "</h2>");
    show_next_button(client_show_debrief.bind(this), "Continue");
};


client_show_debrief = function() {
    console.log("client.js:\t showing debrief questions");
    var callback = function() {
        this.socket.emit("debrief_submit");
    };
    var that = this; // TODO this is a bit janky, is there a cleaner solution?
    $("body").load(HTML_LOOKUP["survey_round"], function() {
        // TODO fill this in...
        show_next_button(callback.bind(that), "Continue");
    });
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
show_next_button = function(callback, text) {
    $("#exp-button-container").css({visibility: "visible"});
    $(".next-button").text(text);
    $(".next-button").unbind().click(callback);
};

// TODO move this to client_view.js
update_round = function(current_round_index, game_rounds) {
    $("#round-index").text(current_round_index + "/" + game_rounds);
};

// TODO move this to client_view.js
display_message = function(msg) {
    $("#message-container").text(msg);
};

// TODO move this to client_view.js
set_slider_message = function(msg) {
    // $("#eval-slider-1-text").text(msg);
    $("#survey-banner").text(msg);
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
