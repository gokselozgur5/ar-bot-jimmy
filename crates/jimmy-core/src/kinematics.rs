//! 3-Pivot Full-Body Kinematics for Jimmy (Waist, Neck, and Dual Arms).

#[derive(Debug, Clone, Copy, PartialEq, Default)]
pub struct Pivot3DoF {
    pub roll: f64,
    pub pitch: f64,
    pub yaw: f64,
}

#[derive(Debug, Clone, Copy, PartialEq, Default)]
pub struct ArmPose {
    pub shoulder: Pivot3DoF,
    pub elbow_pitch: f64,
    pub wrist_pitch: f64,
    pub wrist_roll: f64,
}

#[derive(Debug, Clone, Copy, PartialEq, Default)]
pub struct FullBodyPose {
    pub waist: Pivot3DoF,
    pub neck: Pivot3DoF,
    pub left_arm: ArmPose,
    pub right_arm: ArmPose,
}

#[derive(Debug, Clone, Copy, PartialEq, Default)]
pub struct Vec3 {
    pub x: f64,
    pub y: f64,
    pub z: f64,
}

impl FullBodyPose {
    /// Computes forward kinematics of the right wrist flange in `base_footprint` (meters).
    pub fn right_wrist_flange_position(&self) -> Vec3 {
        let shoulder_z = 0.26 + 0.12 * self.waist.pitch.cos();
        let shoulder_x = 0.12 * self.waist.pitch.sin();
        let arm_reach = 0.085 * self.right_arm.shoulder.pitch.sin()
            + 0.080 * (self.right_arm.shoulder.pitch + self.right_arm.elbow_pitch).sin();
        let arm_drop = 0.085 * self.right_arm.shoulder.pitch.cos()
            + 0.080 * (self.right_arm.shoulder.pitch + self.right_arm.elbow_pitch).cos();
        Vec3 {
            x: shoulder_x + arm_reach,
            y: -0.095 - 0.085 * self.right_arm.shoulder.roll.sin(),
            z: shoulder_z - arm_drop,
        }
    }
}
