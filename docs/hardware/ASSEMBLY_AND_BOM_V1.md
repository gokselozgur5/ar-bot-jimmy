# Jimmy `v1.0.0` — Full Hardware Assembly Manual & Bill of Materials (BOM)

## 1. Complete 11-Part 3D-Printable STL Manifest (`cad/stl/`)

| STL File | Part Description | Qty | Filament |
| :--- | :--- | :---: | :--- |
| `01a_left_foot_half_platform.stl` | Left D-Shaped Half-Platform Foot (18650 Bay + Ankle Socket) | 1 | PETG / PLA+ |
| `01b_right_foot_half_platform.stl` | Right D-Shaped Half-Platform Foot (18650 Bay + Ankle Socket) | 1 | PETG / PLA+ |
| `01c_bionic_leg_strut.stl` | Articulated Bionic Thigh / Shin Strut (Internal Wire Tunnel) | 4 | PETG |
| `01d_pelvis_hip_bridge.stl` | Pelvis Hip Bridge (Couples Left/Right Hip Servos to Waist) | 1 | PETG |
| `01_wheeled_base_shell.stl` | Optional Stationary Weighted Desk Base Shell (136 mm) | 1 | PETG |
| `02_waist_3pivot_gimbal.stl` | 3-Pivot Waist Yaw/Pitch/Roll STS3215 Gimbal Cage | 1 | PETG |
| `03_torso_armor_shell.stl` | Curved Astro-Bot / EVE Torso Armor Shell + Arc Reactor | 1 | White PLA+ |
| `04_cyber_clippy_head_visor.stl` | Rounded Head Pod + 2.4" OLED Visor Bezel + Side Ears | 1 | White PLA+ |
| `05_upper_arm_bionic_link.stl` | Tapered Bionic Upper Arm Link (Print Left & Right) | 2 | White PLA+ |
| `06_forearm_wrist_flange.stl` | Forearm Link + Hot-Plug 3-Pin TTL Wrist Flange | 2 | White PLA+ |
| `07_modular_3finger_hand.stl` | Modular 3-Finger Hand Palm + Articulated Phalanges | 2 | White PLA+ |

## 2. Production Bill of Materials (BOM)

| Subsystem | Part Number / Spec | Qty | Est. Cost |
| :--- | :--- | :---: | :---: |
| **Core Bus Servos** | Feetech `STS3215` (7.4V–12V, 30 kg·cm, 1 Mbps TTL) | 14 | $238 |
| **Hand Micro Servos** | Feetech `SCS0009` / `STS3032` (`IDs 15..=20`) | 6 | $54 |
| **Bus Driver Board** | Waveshare Bus Servo Adapter (USB / UART to TTL) | 1 | $12 |
| **Compute Node** | Raspberry Pi 5 (8 GB) or Desktop USB-TTL Tether | 1 | $80 |
| **Foot Power Cells** | 2x 18650 Li-Ion 3500 mAh (1 per Split Half-Foot Bay) | 2 | $16 |
| **Fasteners & Pads** | M3x8 / M3x12 BHCS Assortment + 6x 12 mm Silicone Pads | 1 | $14 |
| **Total (`v1.0.0`)** | **Complete 38 cm Full-Body ROS 2 + Quest 3 Companion** | — | **~$414** |

## 3. Step-by-Step Assembly Sequence

1. **Provision Servo IDs (`1..=17`):** Connect one servo at a time to the USB-TTL bus adapter and flash its EEPROM ID using `jimmy_core::protocol::encode_set_servo_id`.
2. **Assemble Split-Platform Bipedal Base (`01a..01d`):** Press one 18650 cell into `01a` (Left Foot) and one into `01b` (Right Foot), mount the ankle/knee/hip servos with `01c` struts, and join at `01d_pelvis_hip_bridge`.
3. **Mount 3-Pivot Waist, Torso & Head (`02..04`):** Bolt `02_waist_3pivot_gimbal` onto the pelvis turret, route the single 3-wire TTL daisy-chain up through `03_torso_armor_shell`, and attach `04_cyber_clippy_head_visor`.
4. **Attach Dual Arms & Hot-Plug 3-Finger Hands (`05..07`):** Mount `05` and `06` to the shoulder turrets and plug `07_modular_3finger_hand` into the 3-pin wrist header (`right_wrist_flange_link`).
