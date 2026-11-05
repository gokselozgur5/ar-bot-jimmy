//! Analytical 3-Pivot Shoulder + Elbow Inverse Kinematics (IK) Solver for Jimmy.
use crate::kinematics::{ArmPose, Pivot3DoF, Vec3};

const L_UPPER: f64 = 0.085;
const L_FORE: f64 = 0.080;
const SHOULDER_Y_RIGHT: f64 = -0.095;
const BASE_SHOULDER_Z: f64 = 0.26;
const TORSO_LEN: f64 = 0.12;

/// Solves 3-pivot right arm joint angles (`ArmPose`) to reach `target` in `base_footprint`.
pub fn solve_right_arm_ik(target: Vec3, waist_pitch: f64) -> ArmPose {
    let sh_x = TORSO_LEN * waist_pitch.sin();
    let sh_z = BASE_SHOULDER_Z + TORSO_LEN * waist_pitch.cos();
    let dx = target.x - sh_x;
    let dy = target.y - SHOULDER_Y_RIGHT;
    let dz = sh_z - target.z;

    let roll = (-dy / L_UPPER).clamp(-0.9, 0.9).asin();
    let planar_r = (dx * dx + dz * dz).sqrt().clamp(0.015, L_UPPER + L_FORE - 1e-4);
    let cos_elbow = ((planar_r * planar_r - L_UPPER * L_UPPER - L_FORE * L_FORE)
        / (2.0 * L_UPPER * L_FORE))
        .clamp(-1.0, 1.0);
    let elbow_pitch = cos_elbow.acos().clamp(0.0, 2.3);

    let k1 = L_UPPER + L_FORE * elbow_pitch.cos();
    let k2 = L_FORE * elbow_pitch.sin();
    let shoulder_pitch = dx.atan2(dz) - k2.atan2(k1);

    ArmPose {
        shoulder: Pivot3DoF {
            roll,
            pitch: shoulder_pitch.clamp(-2.4, 2.4),
            yaw: dy.atan2(dx.max(0.05)).clamp(-1.2, 1.2),
        },
        elbow_pitch,
        wrist_pitch: -(shoulder_pitch + elbow_pitch) * 0.5,
        wrist_roll: 1.57,
    }
}
