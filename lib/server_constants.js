/*
 * constants library for rps server (this does *not* get loaded in the browser)
 */

const GAME_ROUNDS = 10;

const AGENT_SET = [
    "low_competence_agent", "high_competence_agent", "learning_agent"
];

const VIDEO_SETS = {
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

exports.constants = {
    "GAME_ROUNDS": GAME_ROUNDS,
    "AGENT_SET": AGENT_SET,
    "VIDEO_SETS": VIDEO_SETS
};
