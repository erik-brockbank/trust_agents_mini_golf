/*
 * constants library for trust agent client (this gets loaded in the browser)
 */

const VIDEO_PATH = "vid";

const HTML_LOOKUP = { // lookup table with human-understandable html file keys and the path to those files as vals
    "consent": "/static/consent.html",
    "instructions": "/static/instructions.html",
    "video_round": "/static/trust_video_disp.html",
    "survey_round": "/static/trust_survey.html"
};


// Messages for client display
const STUDY_DURATION = 30;
const CREDIT_INFO = "";

const THANK_YOU = "All done. Thank you for playing! <br> You may now close this widow.";
const FINISHED_GAME_HEADER = "Agent * Trials Complete!";
const FINISHED_GAME_SUBHEADER = "Press Continue to proceed to the next agent's trials.";
const SURVEY_SLIDER_HEADER = "Predict the next trial!";
const SURVEY_SLIDER_MESSAGE = "How close do you think Agent * will be to hitting the target on their next shot?";
const VIDEO_MESSAGE = "Press play to watch Agent * take a shot.";


// constants for drawing animated target box
const SANDPAD = 10;
const BIN_STARTX = 25;
const BIN_STARTY = 25;
const BINWIDTH = 400;
const BINHEIGHT = 150;
const TARGETRAD = 5;
const TARGETSLOPE = 10;

// NB: this is defined in experiment.css as well
// TODO probably a better way to handle this...
const AGENT_COLOR_LOOKUP = {1: "rgb(111, 160, 233)", 2: "rgb(167, 125, 216)", 3: "rgb(3, 171, 180)"};

// Array of instruction elements (with embedded html formatting) used to present instructions in instructions.js
const INSTRUCTION_ARRAY = [
    {
        top_text: "<p>In today’s experiment, ...</p>",
        canvas_img: "",
        bottom_text: "<p>Please do not refresh the browser at any point during the experiment or " +
            "the task will restart. Please complete the task in one sitting.</p>"
    },
    {
        top_text: "<p>Ready? Click the button below to get started!</p>",
        canvas_img: "",
        bottom_text: ""
    }
];
