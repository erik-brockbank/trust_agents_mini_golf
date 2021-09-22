/*
 * constants library for trust agent client (this gets loaded in the browser)
 */


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
