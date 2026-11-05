//! ROS 2 `sensor_msgs/msg/JointState` & `rosbridge_suite` v2 JSON serializer for Jimmy.
use crate::kinematics::FullBodyPose;

pub const JOINT_NAMES_17DOF: [&str; 17] = [
    "waist_yaw_joint", "waist_pitch_joint", "waist_roll_joint",
    "neck_yaw_joint", "neck_pitch_joint", "neck_roll_joint",
    "left_shoulder_pitch_joint", "left_shoulder_roll_joint", "left_elbow_pitch_joint", "left_wrist_roll_joint",
    "right_shoulder_pitch_joint", "right_shoulder_roll_joint", "right_elbow_pitch_joint", "right_wrist_roll_joint",
    "right_thumb_joint", "right_index_joint", "right_middle_joint",
];

#[derive(Debug, Clone, PartialEq)]
pub struct Ros2JointState17 {
    pub positions: [f64; 17],
}

impl Ros2JointState17 {
    pub fn from_pose_and_fingers(pose: &FullBodyPose, fingers_rad: [f64; 3]) -> Self {
        Self {
            positions: [
                pose.waist.yaw, pose.waist.pitch, pose.waist.roll,
                pose.neck.yaw, pose.neck.pitch, pose.neck.roll,
                pose.left_arm.shoulder.pitch, pose.left_arm.shoulder.roll, pose.left_arm.elbow_pitch, pose.left_arm.wrist_roll,
                pose.right_arm.shoulder.pitch, pose.right_arm.shoulder.roll, pose.right_arm.elbow_pitch, pose.right_arm.wrist_roll,
                fingers_rad[0], fingers_rad[1], fingers_rad[2],
            ],
        }
    }

    /// Formats a `rosbridge_suite` v2 publish JSON payload for `/joint_states`.
    pub fn to_rosbridge_json(&self) -> String {
        let names = JOINT_NAMES_17DOF.map(|n| format!("\"{}\"", n)).join(",");
        let pos = self.positions.map(|v| format!("{:.4}", v)).join(",");
        format!(
            "{{\"op\":\"publish\",\"topic\":\"/joint_states\",\"msg\":{{\"name\":[{}],\"position\":[{}]}}}}",
            names, pos
        )
    }
}
