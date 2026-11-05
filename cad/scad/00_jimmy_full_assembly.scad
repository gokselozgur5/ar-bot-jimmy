// Jimmy 38 cm Full 3D-Printable Assembly & Exploded Build Plate Preview
use <01_wheeled_base_shell.scad>
use <02_waist_3pivot_gimbal.scad>
use <03_torso_armor_shell.scad>
use <04_cyber_clippy_head_visor.scad>
use <05_upper_arm_bionic_link.scad>
use <06_forearm_wrist_flange.scad>
use <07_modular_3finger_hand.scad>

// 1. Wheeled Hover-Pod Base (z = 0..54 mm)
color("#38bdf8") wheeled_base_shell();

// 2. 3-Pivot Waist Gimbal (z = 54..96 mm)
color("#475569") translate([0, 0, 52]) waist_3pivot_gimbal();

// 3. Sculpted Astro-Bot / EVE Torso Armor Shell (z = 92..232 mm)
color("#e2e8f0") translate([0, 0, 92]) torso_armor_shell();

// 4. Curved Cyber-Clippy Head Dome & Visor (z = 236..315 mm)
color("#f8fafc") translate([0, 0, 236]) cyber_clippy_head_visor();

// 5 & 6 & 7. Left and Right Bionic Arms + Forearms + 3-Finger Modular Hands
for (sx = [-1, 1]) {
    translate([sx * 72, 0, 190]) rotate([155, sx * -12, 0]) {
        color("#38bdf8") upper_arm_bionic_link();
        translate([0, 0, 85]) rotate([-45, 0, 0]) {
            color("#e2e8f0") forearm_wrist_flange();
            color("#f59e0b") translate([0, 0, 80]) modular_3finger_hand();
        }
    }
}
