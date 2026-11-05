//! Zero-dependency HTTP request router for `jimmy-daemon`.
use crate::state::DaemonState;
use jimmy_core::kinematics::Vec3;
use jimmy_core::puppeteer::GestureIntent;
use jimmy_core::ros2_bridge::Ros2JointState17;

pub fn route_request(state: &mut DaemonState, request_line: &str) -> (u16, String) {
    let parts: Vec<&str> = request_line.split_whitespace().collect();
    let path = parts.get(1).copied().unwrap_or("/");

    match path {
        "/api/state" => (200, state.to_json_snapshot()),
        "/api/rosbridge" => {
            let js = Ros2JointState17::from_pose_and_fingers(&state.pose, [0.0, 0.0, 0.0]);
            (200, js.to_rosbridge_json())
        }
        "/api/gesture/clippy" => {
            state.apply_gesture(GestureIntent::CyberClippyLean, "CyberClippyLean");
            (200, state.to_json_snapshot())
        }
        "/api/gesture/hologram" => {
            state.apply_gesture(GestureIntent::PresentPalmHologram, "PresentPalmHologram");
            (200, state.to_json_snapshot())
        }
        "/api/gesture/shrug" => {
            state.apply_gesture(GestureIntent::ItalianShrug, "ItalianShrug");
            (200, state.to_json_snapshot())
        }
        "/api/gesture/wave" => {
            state.apply_gesture(GestureIntent::FriendlyWave, "FriendlyWave");
            (200, state.to_json_snapshot())
        }
        "/api/ik/desk-center" => {
            state.apply_ik_target(Vec3 { x: 0.11, y: -0.10, z: 0.28 });
            (200, state.to_json_snapshot())
        }
        _ => (404, "{\"error\":\"not_found\"}".into()),
    }
}
