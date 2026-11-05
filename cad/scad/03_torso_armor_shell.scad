// Jimmy Part 03: Sculpted Astro-Bot / EVE Curved Torso Armor Shell (140 mm height)
$fn = 64;

module sculpted_torso_solid(scale_f = 1.0) {
    scale([scale_f, scale_f, 1.0]) hull() {
        // Tapered waist ring
        translate([0, 0, 4]) scale([1.15, 0.85, 1.0]) cylinder(h = 8, d = 66);
        // Sculpted upper chest & broad shoulder carapace
        translate([0, 0, 96]) scale([1.35, 0.92, 0.85]) sphere(d = 92);
        // Neck collar pedestal
        translate([0, 0, 134]) cylinder(h = 6, d = 48);
    }
}

module torso_armor_shell() {
    difference() {
        union() {
            sculpted_torso_solid(1.0);
            // Chest Arc-Reactor / Wide-Angle CSI Camera Bezel Ring
            translate([0, -40, 86]) rotate([90, 0, 0]) cylinder(h = 6, d1 = 36, d2 = 30);
        }
        // Hollow interior cavity (2.6 mm wall thickness for rigid PETG/PLA printing)
        translate([0, 0, 3]) sculpted_torso_solid(0.93);
        // Chest camera optical aperture (d = 22 mm)
        translate([0, -30, 86]) rotate([90, 0, 0]) cylinder(h = 30, d = 22);
        // Left & Right 3-Pivot Shoulder Servo Socket Bores (d = 38 mm)
        for (sx = [-1, 1]) {
            translate([sx * 54, 0, 98]) rotate([0, 90, 0]) cylinder(h = 30, d = 38, center = true);
        }
        // Bottom waist gimbal entry & top neck servo pass-through
        translate([0, 0, -2]) cylinder(h = 16, d = 54);
        translate([0, 0, 128]) cylinder(h = 20, d = 36);
    }
}

torso_armor_shell();
