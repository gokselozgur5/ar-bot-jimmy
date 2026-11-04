//! Modular 3-Finger Articulated Hand Expansion over the Wrist Daisy-Chain Socket.
use crate::bus::{ActuatorBus, ServoGoal};

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum HandGraspPreset {
    OpenPalm,
    PrecisionPinch,
    IndexPoint,
    PowerGrip,
}

/// Scalable 3-finger hand module occupying daisy-chain servo IDs `base_id..base_id+3`.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct ThreeFingerHand {
    pub thumb_id: u8,
    pub index_id: u8,
    pub middle_id: u8,
}

impl ThreeFingerHand {
    pub const fn right_hand_default() -> Self {
        Self { thumb_id: 15, index_id: 16, middle_id: 17 }
    }

    pub fn command_grasp(&self, bus: &mut dyn ActuatorBus, preset: HandGraspPreset) -> Result<usize, &'static str> {
        let (t, i, m) = match preset {
            HandGraspPreset::OpenPalm => (0.0, 0.0, 0.0),
            HandGraspPreset::PrecisionPinch => (1.1, 1.1, 0.2),
            HandGraspPreset::IndexPoint => (1.2, 0.0, 1.4),
            HandGraspPreset::PowerGrip => (1.3, 1.4, 1.4),
        };
        let goals = [
            ServoGoal { id: self.thumb_id, position_rad: t, speed_rad_s: 4.0 },
            ServoGoal { id: self.index_id, position_rad: i, speed_rad_s: 4.0 },
            ServoGoal { id: self.middle_id, position_rad: m, speed_rad_s: 4.0 },
        ];
        bus.sync_write(&goals)
    }
}
