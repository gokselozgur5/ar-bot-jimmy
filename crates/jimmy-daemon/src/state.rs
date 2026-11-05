//! Runtime state container for the Jimmy control & telemetry daemon.
use jimmy_core::ar_anchor::SpatialHologramAnchor;
use jimmy_core::bus::{ActuatorBus, SimDaisyChainBus};
use jimmy_core::hand::{HandGraspPreset, ThreeFingerHand};
use jimmy_core::ik::solve_right_arm_ik;
use jimmy_core::kinematics::{FullBodyPose, Vec3};
use jimmy_core::puppeteer::{GestureIntent, LlmPuppeteerCommand};
use jimmy_core::ros2_bridge::Ros2JointState17;

pub struct DaemonState {
    pub bus: SimDaisyChainBus,
    pub hand: ThreeFingerHand,
    pub pose: FullBodyPose,
    pub active_gesture: &'static str,
}

impl DaemonState {
    pub fn new() -> Self {
        let mut bus = SimDaisyChainBus::new_base_14dof();
        let hand = ThreeFingerHand::right_hand_default();
        for id in [hand.thumb_id, hand.index_id, hand.middle_id] {
            bus.hot_plug_servo(id);
        }
        let _ = hand.command_grasp(&mut bus, HandGraspPreset::OpenPalm);
        Self { bus, hand, pose: FullBodyPose::default(), active_gesture: "PresentPalmHologram" }
    }

    pub fn apply_gesture(&mut self, gesture: GestureIntent, name: &'static str) {
        let gaze_target = Vec3 { x: 0.40, y: 0.0, z: 0.34 };
        let cmd = LlmPuppeteerCommand { speech_reply: name.into(), visor_expression: name, gesture, gaze_target };
        self.pose = cmd.to_full_body_pose();
        self.active_gesture = name;
    }

    pub fn apply_ik_target(&mut self, target: Vec3) {
        self.pose.right_arm = solve_right_arm_ik(target, self.pose.waist.pitch);
        self.active_gesture = "LiveDeskIK";
    }

    pub fn to_json_snapshot(&self) -> String {
        let anchor = SpatialHologramAnchor::from_palm_pose(&self.pose, self.active_gesture);
        let js = Ros2JointState17::from_pose_and_fingers(&self.pose, [0.0, 0.0, 0.0]);
        format!(
            "{{\"gesture\":\"{}\",\"servos\":{},\"hologram_active\":{},\"palm_z\":{:.4},\"ros2\":{}}}",
            self.active_gesture, self.bus.discovered_ids().len(), anchor.active, anchor.world_position.z, js.to_rosbridge_json()
        )
    }
}
