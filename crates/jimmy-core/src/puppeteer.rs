//! Embodied LLM Puppeteer translating conversational intent into 3-pivot poses.
use crate::kinematics::{FullBodyPose, Pivot3DoF, Vec3};

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum GestureIntent {
    CyberClippyLean,
    PresentPalmHologram,
    ItalianShrug,
    FriendlyWave,
}

#[derive(Debug, Clone, PartialEq)]
pub struct LlmPuppeteerCommand {
    pub speech_reply: String,
    pub visor_expression: &'static str,
    pub gesture: GestureIntent,
    pub gaze_target: Vec3,
}

impl LlmPuppeteerCommand {
    pub fn to_full_body_pose(&self) -> FullBodyPose {
        let mut pose = FullBodyPose::default();
        pose.neck = Pivot3DoF {
            roll: if self.gesture == GestureIntent::CyberClippyLean { 0.32 } else { 0.0 },
            pitch: (self.gaze_target.z - 0.34).clamp(-0.6, 0.6),
            yaw: self.gaze_target.y.atan2(self.gaze_target.x.max(0.1)),
        };
        match self.gesture {
            GestureIntent::CyberClippyLean => {
                pose.waist.pitch = 0.28;
                pose.right_arm.shoulder.pitch = 0.65;
                pose.right_arm.elbow_pitch = 1.10;
            }
            GestureIntent::PresentPalmHologram => {
                pose.right_arm.shoulder.pitch = 1.15;
                pose.right_arm.elbow_pitch = 0.45;
                pose.right_arm.wrist_roll = 1.57;
            }
            GestureIntent::ItalianShrug => {
                pose.left_arm.shoulder.roll = 0.65;
                pose.right_arm.shoulder.roll = -0.65;
                pose.left_arm.elbow_pitch = 1.35;
                pose.right_arm.elbow_pitch = 1.35;
            }
            GestureIntent::FriendlyWave => {
                pose.right_arm.shoulder.pitch = 1.45;
                pose.right_arm.elbow_pitch = 1.20;
            }
        }
        pose
    }
}
