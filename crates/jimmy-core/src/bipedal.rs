//! Split D-shaped half-platform bipedal leg kinematics and level-foot walking gait.

/// Pitch angles (radians) for a single 3-DOF sagittal leg chain (hip, knee, ankle).
#[derive(Debug, Clone, Copy, Default, PartialEq)]
pub struct LegJoints {
    pub hip_pitch: f64,
    pub knee_pitch: f64,
    pub ankle_pitch: f64,
}

impl LegJoints {
    /// Net world pitch of the split D-shaped foot sole (`0.0` means strictly level on the desk).
    pub fn sole_pitch_world(&self) -> f64 {
        self.hip_pitch + self.knee_pitch + self.ankle_pitch
    }
}

/// Instantaneous bipedal gait frame for left and right split-platform legs.
#[derive(Debug, Clone, Copy, Default, PartialEq)]
pub struct BipedalGaitFrame {
    pub left: LegJoints,
    pub right: LegJoints,
    pub zmp_offset_x_m: f64,
}

/// Samples a level-foot walking cycle at `phase_rad` where each foot sole stays parallel to the desk.
pub fn sample_bipedal_walk_cycle(phase_rad: f64) -> BipedalGaitFrame {
    let s = phase_rad.sin();
    let l_hip = s * 0.38;
    let l_knee = (-s).max(0.0) * 0.52;
    let r_hip = -s * 0.38;
    let r_knee = s.max(0.0) * 0.52;
    BipedalGaitFrame {
        left: LegJoints { hip_pitch: l_hip, knee_pitch: l_knee, ankle_pitch: -(l_hip + l_knee) },
        right: LegJoints { hip_pitch: r_hip, knee_pitch: r_knee, ankle_pitch: -(r_hip + r_knee) },
        zmp_offset_x_m: -s * 0.032,
    }
}

/// Verifies whether the lateral ZMP offset lies inside the 68 mm split-foot half-platform polygon.
pub fn is_within_split_foot_support(zmp_offset_x_m: f64) -> bool {
    zmp_offset_x_m.abs() <= 0.068
}
