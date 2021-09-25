/*
 * constants library for trust agent client (this gets loaded in the browser)
 */

const VIDEO_PATH = "vid";
const IMG_PATH = "img";

const HTML_LOOKUP = { // lookup table with human-understandable html file keys and the path to those files as vals
    "consent": "/static/consent.html",
    "instructions": "/static/instructions.html",
    "video_round": "/static/trust_video_disp.html",
    "survey_round": "/static/trust_survey.html",
    "debrief_page": "/static/trust_debrief.html"
};


// Messages for client display
const STUDY_DURATION = 30;
const CREDIT_INFO = "";

const THANK_YOU = "All done. Thank you for playing! <br> You may now close this widow.";
const FINISHED_GAME_HEADER = "Bot Agent Trials Complete!";
const FINISHED_GAME_SUBHEADER = "Click Continue to answer several questions about this agent's overall performance."
const SURVEY_SLIDER_HEADER = "Predict the next trial!";
const SURVEY_SLIDER_MESSAGE = "How close do you think Bot Agent will be to hitting the target on their next shot?";
const VIDEO_MESSAGE = "Press play to watch Bot Agent take a shot.";


// Array of instruction elements (with embedded html formatting) used to present instructions in instructions.js
const INSTRUCTION_ARRAY = [
    {
        top_text: "<p>Welcome to the robot PGA tour!</p>",
        canvas_img: "",
        bottom_text: "<p>This experiment is best run with the Chrome browser. " +
            "Please do not refresh the browser at any point during the experiment or " +
            "the task will restart. Please complete the task in one sitting.</p>"
    },
    {
        top_text: "<p>In this experiment, you will be evaluating a robot whose goal is to " +
            "hit a golf ball towards a target as accurately as possible.</p>",
        canvas_img: "",
        bottom_text: "<p>The robot will complete XX shots towards a range of different targets. " +
            "Your job is to watch their performance, paying attention to how well they are doing.</p>"
    },
    {
        top_text: "<p>After every round, you will be asked to make a prediction about how close " +
            "the robot's next shot is likely to be to the next target.</p>",
        canvas_img: "",
        bottom_text: "<p>Ready? Click the button below to get started!</p>"
    }
];
