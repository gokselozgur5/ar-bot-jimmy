//! 50 Hz Minimum-Jerk / Cubic Spline Trajectory Interpolator for 3-Pivot Joints.
use crate::kinematics::{ArmPose, FullBodyPose, Pivot3DoF};

/// Smoothstep cubic polynomial `s(t) = 3t^2 - 2t^3` with zero endpoint velocity.
#[inline]
pub fn cubic_smoothstep(t: f64) -> f64 {
    let u = t.clamp(0.0, 1.0);
    u * u * (3.0 - 2.0 * u)
}

#[inline]
fn lerp(a: f64, b: f64, s: f64) -> f64 {
    a + (b - a) * s
}

fn lerp_pivot(a: Pivot3DoF, b: Pivot3DoF, s: f64) -> Pivot3DoF {
    Pivot3DoF {
        roll: lerp(a.roll, b.roll, s),
        pitch: lerp(a.pitch, b.pitch, s),
        yaw: lerp(a.yaw, b.yaw, s),
    }
}

fn lerp_arm(a: ArmPose, b: ArmPose, s: f64) -> ArmPose {
    ArmPose {
        shoulder: lerp_pivot(a.shoulder, b.shoulder, s),
        elbow_pitch: lerp(a.elbow_pitch, b.elbow_pitch, s),
        wrist_pitch: lerp(a.wrist_pitch, b.wrist_pitch, s),
        wrist_roll: lerp(a.wrist_roll, b.wrist_roll, s),
    }
}

/// Interpolates smoothly between two 14-DoF `FullBodyPose` keyframes at normalized `t in 0.0..=1.0`.
pub fn interpolate_full_body_cubic(start: &FullBodyPose, goal: &FullBodyPose, t: f64) -> FullBodyPose {
    let s = cubic_smoothstep(t);
    FullBodyPose {
        waist: lerp_pivot(start.waist, goal.waist, s),
        neck: lerp_pivot(start.neck, goal.neck, s),
        left_arm: lerp_arm(start.left_arm, goal.left_arm, s),
        right_arm: lerp_arm(start.right_arm, goal.right_arm, s),
    }
}
