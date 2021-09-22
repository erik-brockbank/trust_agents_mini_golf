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

const COMPETENCE_PROB = 0.8;

const VIDEO_LOOKUP = {
    "low_competence": {
        // miss and vaguely accurate trajectory 0 (reward1 and reward2) for each goal, with associated probability
        "goal0": {
            "goal0_reward1_traj0.webm": COMPETENCE_PROB,
            "goal0_reward2_traj0.webm": 1 - COMPETENCE_PROB
        },
        "goal1": {
            "goal1_reward1_traj0.webm": COMPETENCE_PROB,
            "goal1_reward2_traj0.webm": 1 - COMPETENCE_PROB
        },
        "goal2": {
            "goal2_reward1_traj0.webm": COMPETENCE_PROB,
            "goal2_reward2_traj0.webm": 1 - COMPETENCE_PROB
        },
        "goal3": {
            "goal3_reward1_traj0.webm": COMPETENCE_PROB,
            "goal3_reward2_traj0.webm": 1 - COMPETENCE_PROB
        },
        "goal4": {
            "goal4_reward1_traj0.webm": COMPETENCE_PROB,
            "goal4_reward2_traj0.webm": 1 - COMPETENCE_PROB
        },
        "goal6": {
            "goal6_reward1_traj0.webm": COMPETENCE_PROB,
            "goal6_reward2_traj0.webm": 1 - COMPETENCE_PROB
        },
        "goal7": {
            "goal7_reward1_traj0.webm": COMPETENCE_PROB,
            "goal7_reward2_traj0.webm": 1 - COMPETENCE_PROB
        },
        "goal8": {
            "goal8_reward1_traj0.webm": COMPETENCE_PROB,
            "goal8_reward2_traj0.webm": 1 - COMPETENCE_PROB
        },
        "goal9": {
            "goal9_reward1_traj0.webm": COMPETENCE_PROB,
            "goal9_reward2_traj0.webm": 1 - COMPETENCE_PROB
        },
        "goal10": {
            "goal10_reward1_traj0.webm": COMPETENCE_PROB,
            "goal10_reward2_traj0.webm": 1 - COMPETENCE_PROB
        }
    },
    "high_competence": {
        // near-miss and direct hit trajectory 0 (reward3 and reward4) for each goal, with associated probability
        "goal0": {
            "goal0_reward3_traj0.webm": 1- COMPETENCE_PROB,
            "goal0_reward4_traj0.webm": COMPETENCE_PROB
        },
        "goal1": {
            "goal1_reward3_traj0.webm": 1- COMPETENCE_PROB,
            "goal1_reward4_traj0.webm": COMPETENCE_PROB
        },
        "goal2": {
            "goal2_reward3_traj0.webm": 1- COMPETENCE_PROB,
            "goal2_reward4_traj0.webm": COMPETENCE_PROB
        },
        "goal3": {
            "goal3_reward3_traj0.webm": 1- COMPETENCE_PROB,
            "goal3_reward4_traj0.webm": COMPETENCE_PROB
        },
        "goal4": {
            "goal4_reward3_traj0.webm": 1- COMPETENCE_PROB,
            "goal4_reward4_traj0.webm": COMPETENCE_PROB
        },
        "goal6": {
            "goal6_reward3_traj0.webm": 1- COMPETENCE_PROB,
            "goal6_reward4_traj0.webm": COMPETENCE_PROB
        },
        "goal7": {
            "goal7_reward3_traj0.webm": 1- COMPETENCE_PROB,
            "goal7_reward4_traj0.webm": COMPETENCE_PROB
        },
        "goal8": {
            "goal8_reward3_traj0.webm": 1- COMPETENCE_PROB,
            "goal8_reward4_traj0.webm": COMPETENCE_PROB
        },
        "goal9": {
            "goal9_reward3_traj0.webm": 1- COMPETENCE_PROB,
            "goal9_reward4_traj0.webm": COMPETENCE_PROB
        },
        "goal10": {
            "goal10_reward3_traj0.webm": 1- COMPETENCE_PROB,
            "goal10_reward4_traj0.webm": COMPETENCE_PROB
        }
    },
    "learning": [

    ]

};
