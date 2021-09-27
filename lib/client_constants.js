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
const FINISHED_GAME_HEADER = "Robot trials complete!";
const FINISHED_GAME_SUBHEADER = "Click Continue to answer several questions about the robot's overall performance"
const SURVEY_SLIDER_HEADER = "Now make a prediction about how the robot will do on the next trial";
const SURVEY_SLIDER_MESSAGE = "How close do you think the robot will be to hitting the target on their next shot?";
const VIDEO_MESSAGE_FIRST = "Press play to watch the robot's first shot";
const VIDEO_MESSAGE_N = "Press play to see how close your prediction was!";


// Array of instruction elements (with embedded html formatting) used to present instructions in instructions.js
const INSTRUCTION_ARRAY = [
    {
        top_text: "<p>Welcome to the robot PGA tour!</p>",
        canvas_img: "img/tp.jpeg",
        bottom_text: "<p>This experiment is best run with the Chrome browser. <br>" +
            "Please do not refresh the browser at any point during the experiment or " +
            "the task will restart. <br>Please complete the task in one sitting.</p>"
    },
    {
        top_text: "<p>In this experiment, you will be evaluating a robot that is trying to " +
            "hit a golf ball <br> toward a series of targets as accurately as possible.</p>",
        canvas_img: "img/overview.png",
        bottom_text: "<p>You'll watch the robot complete 20 consecutive shots on video. <br>" +
            "Your job is to pay close attention to how well the robot is doing.</p>"
    },
    {
        top_text: "<p>After every round, you'll be asked to make a prediction about how close <br> " +
            "the robot's next shot is likely to be to the next target.</p>",
        canvas_img: "img/survey.png",
        bottom_text: "<p>Then in the next round, you'll see how close your prediction was!</p>"
    },
    {
        top_text: "<p>At the end, you'll be asked several questions about the robot's overall performance.</p>",
        canvas_img: "",
        bottom_text: "<p>Ready? Click the button below to get started!</p>"
    }
];
