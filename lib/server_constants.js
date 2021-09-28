/*
 * constants library for rps server (this does *not* get loaded in the browser)
 */

const DATA_PATH = "data";
const GAME_ROUNDS = 20;

const AGENT_SET = [
    "low_competence_agent", "high_competence_agent", "learning_agent"
];

const VIDEO_WEIGHTS = {
    // sigma = 30
    "low_competence_agent": [[.55, .33, .12, 0]],
    // sigma = 6
    "high_competence_agent": [[0, .05, .82, .13]],
    // sigma = [30, 22, 14, 6]
    "learning_agent": [[.55, .33, .12, 0], [.35, .45, .19, .01], [.08, .5, .4, .02], [0, .05, .82, .13]]
};

const REWARD_VALS = ["reward1", "reward2", "reward3", "reward4"];

const VIDEO_SETS = {
    "reward1": [
        "goal0_reward1_traj0.webm", "goal1_reward1_traj0.webm", "goal2_reward1_traj0.webm",
        "goal3_reward1_traj0.webm", "goal4_reward1_traj0.webm", "goal6_reward1_traj0.webm",
        "goal7_reward1_traj0.webm", "goal8_reward1_traj0.webm", "goal9_reward1_traj0.webm",
        "goal10_reward1_traj0.webm",
        "goal0_reward1_traj1.webm", "goal1_reward1_traj1.webm", "goal2_reward1_traj1.webm",
        "goal3_reward1_traj1.webm", "goal4_reward1_traj1.webm", "goal6_reward1_traj1.webm",
        "goal7_reward1_traj1.webm", "goal8_reward1_traj1.webm", "goal9_reward1_traj1.webm",
        "goal10_reward1_traj1.webm"
    ],
    "reward2": [
        "goal0_reward2_traj0.webm", "goal1_reward2_traj0.webm", "goal2_reward2_traj0.webm",
        "goal3_reward2_traj0.webm", "goal4_reward2_traj0.webm", "goal6_reward2_traj0.webm",
        "goal7_reward2_traj0.webm", "goal8_reward2_traj0.webm", "goal9_reward2_traj0.webm",
        "goal10_reward2_traj0.webm",
        "goal0_reward2_traj1.webm", "goal1_reward2_traj1.webm", "goal2_reward2_traj1.webm",
        "goal3_reward2_traj1.webm", "goal4_reward2_traj1.webm", "goal6_reward2_traj1.webm",
        "goal7_reward2_traj1.webm", "goal8_reward2_traj1.webm", "goal9_reward2_traj1.webm",
        "goal10_reward2_traj1.webm"
    ],
    "reward3": [
        "goal0_reward3_traj0.webm", "goal1_reward3_traj0.webm", "goal2_reward3_traj0.webm",
        "goal3_reward3_traj0.webm", "goal4_reward3_traj0.webm", "goal6_reward3_traj0.webm",
        "goal7_reward3_traj0.webm", "goal8_reward3_traj0.webm", "goal9_reward3_traj0.webm",
        "goal10_reward3_traj0.webm",
        "goal0_reward3_traj1.webm", "goal1_reward3_traj1.webm", "goal2_reward3_traj1.webm",
        "goal3_reward3_traj1.webm", "goal4_reward3_traj1.webm", "goal6_reward3_traj1.webm",
        "goal7_reward3_traj1.webm", "goal8_reward3_traj1.webm", "goal9_reward3_traj1.webm",
        "goal10_reward3_traj1.webm"
    ],
    "reward4": [
        "goal0_reward4_traj0.webm", "goal1_reward4_traj0.webm", "goal2_reward4_traj0.webm",
        "goal3_reward4_traj0.webm", "goal4_reward4_traj0.webm", "goal6_reward4_traj0.webm",
        "goal7_reward4_traj0.webm", "goal8_reward4_traj0.webm", "goal9_reward4_traj0.webm",
        "goal10_reward4_traj0.webm",
        "goal0_reward4_traj1.webm", "goal1_reward4_traj1.webm", "goal2_reward4_traj1.webm",
        "goal3_reward4_traj1.webm", "goal4_reward4_traj1.webm", "goal6_reward4_traj1.webm",
        "goal7_reward4_traj1.webm", "goal8_reward4_traj1.webm", "goal9_reward4_traj1.webm",
        "goal10_reward4_traj1.webm"
    ]
};


exports.constants = {
    "GAME_ROUNDS": GAME_ROUNDS,
    "AGENT_SET": AGENT_SET,
    "VIDEO_WEIGHTS": VIDEO_WEIGHTS,
    "REWARD_VALS": REWARD_VALS,
    "VIDEO_SETS": VIDEO_SETS,
    "DATA_PATH": DATA_PATH
};
