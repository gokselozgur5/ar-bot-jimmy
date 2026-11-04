//! OpenXR / AR Spatial Anchor calculator binding TF2 frames to 3D holograms.
use crate::kinematics::{FullBodyPose, Vec3};

#[derive(Debug, Clone, PartialEq)]
pub struct SpatialHologramAnchor {
    pub parent_tf_frame: &'static str,
    pub world_position: Vec3,
    pub hologram_label: String,
    pub active: bool,
}

impl SpatialHologramAnchor {
    /// Projects a floating 3D AR hologram 6 cm above Jimmy's right open palm.
    pub fn from_palm_pose(pose: &FullBodyPose, label: impl Into<String>) -> Self {
        let wrist = pose.right_wrist_flange_position();
        Self {
            parent_tf_frame: "right_wrist_flange_link",
            world_position: Vec3 {
                x: wrist.x,
                y: wrist.y,
                z: wrist.z + 0.06,
            },
            hologram_label: label.into(),
            active: pose.right_arm.wrist_roll >= 1.0,
        }
    }
}
