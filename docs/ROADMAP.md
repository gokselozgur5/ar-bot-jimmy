# Jimmy (`ar-bot-jimmy`) — Engineering Roadmap & Phase Exit Criteria

## Phase Overview & Milestones

| Milestone | Scope | Foundation Status | Next Engineering Gate (Open Issues) |
| :--- | :--- | :--- | :--- |
| **Phase 1: MBSE & 3-Pivot URDF** | 38 cm mini-humanoid skeleton, 3-DoF waist/neck/shoulder pivots | Merged (`#1`, `#6`) | CAD shell meshes, BOM & RViz2 launch (`#12`) |
| **Phase 2: Serial Servo Bus** | `ActuatorBus` trait, daisy-chain IDs `1..=14`, thermal guard | Merged (`#2`, `#7`) | Hardware UART/RS-485 Feetech STS3215 driver (`#13`) |
| **Phase 3: LLM Puppeteer** | Conversational intent to 3-pivot full-body pose synthesis | Merged (`#3`, `#8`) | Live voice/vision stream & cubic spline interpolator (`#14`) |
| **Phase 4: OpenXR / AR Link** | `right_wrist_flange_link` to palm hologram spatial anchor | Merged (`#4`, `#9`) | Interactive 3D Three.js / WebXR skeleton + hologram (`#15`) |
| **Phase 5: 3-Finger Hand** | Hot-plug wrist socket expansion (`IDs 15..=20`) | Merged (`#5`, `#10`, `#11`) | Compliant grasp torque cutoff merged (`#16`, `#26`) |
| **Phase 6: Visor Eyes & 3D Fingers** | Dynamic Cyber-Clippy blinking visor & 3-finger 3D meshes | Merged (`#31`, `#36`) | Verified in WebXR scene |
| **Phase 7: 3-Pivot Analytical IK** | Closed-form shoulder/elbow Inverse Kinematics (`ik.rs`) | Merged (`#32`, `#34`, `#35`) | Verified `< 0.1 mm` FK round-trip |
| **Phase 8: 3D Laser & Holo-Menu** | Quest 3 3D controller laser raycaster & floating holo-buttons | Merged (`#33`, `#37`, `#38`) | Live on GitHub Pages HTTPS |
| **Phase 9: Live LLM Chat & ROS 2** | TR/EN voice/text LLM chat, `Ros2JointState17` `/joint_states`, Quest 3 GIF | Merged (`#39`, `#40`, `#41`, `#42`) | Field-tested on Meta Quest 3 |
| **Phase 10: `jimmy-daemon` Server** | Standalone Rust HTTP/JSON telemetry & IK daemon (`127.0.0.1:8765`) | Merged (`#43`, `#48`) | Verified (`daemon_routes_gesture_and_ik_requests`) |
| **Phase 11: Spatial Grab & Place** | Quest 3 `squeezestart`/`squeezeend` desk placement & Anchor Ring | Merged (`#44`, `#49`) | Live in WebXR Passthrough |
| **Phase 12: 3D IK Target Orb** | Interactive 3D Desk Holo-Orb driving real-time 3-pivot arm & gaze | Merged (`#45`, `#50`) | Live in WebXR Passthrough |
| **Phase 13: Wiring & ID Provisioner**| `encode_set_servo_id` EEPROM writer & 12V/7.4V wiring harness guide | Merged (`#46`, `#51`) | Verified (`sts3215_set_servo_id_encodes_valid_eeprom_frame`) |
| **Phase 14: GitHub Actions CI** | Automated `cargo test --workspace` (`12/12`) & asset verification | Merged (`#47`, `#52`) | Enforced on `main` & PRs |

## Hardware Bill of Materials (BOM) Target

| Component | Target Part | Qty | Notes |
| :--- | :--- | :--- | :--- |
| **Base Body Actuators** | Feetech STS3215 / Dynamixel XL330 | 14 | 3 Waist + 3 Neck + 2x4 Arms (1 Mbps Serial Bus) |
| **Modular Hand Actuators** | Feetech SCS0009 / XL330 Micro | 6 | 3 per hand (`IDs 15..=20`) via wrist pass-through |
| **Compute & Vision** | Raspberry Pi 5 / Jetson Orin Nano + Wide CSI Cam | 1 | Chest-mounted camera + 2-mic array |
| **Head Visor Display** | 2.4" IPS / OLED Round-Rect SPI Display | 1 | Animated Cyber-Clippy eyes & status HUD |
| **Power & Base** | 3S Li-Ion Pack inside Wide Wheeled Foot Base | 1 | Low center of gravity prevents tipping |

## Exit Criteria Rule

No phase is complete merely because types or prototypes exist; every phase requires deterministic unit/integration tests in `jimmy-core` and reproducible ROS 2 / WebXR verification.
