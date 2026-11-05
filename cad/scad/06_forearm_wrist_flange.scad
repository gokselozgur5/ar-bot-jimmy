// Jimmy Part 06: Sculpted Bionic Forearm & Hot-Plug Wrist Flange (80 mm length, Omni-HUD anchor)
$fn = 56;

module forearm_wrist_flange() {
    difference() {
        union() {
            // Rounded elbow joint hub at z = 0
            sphere(d = 30);
            // Aerodynamic forearm armor tapering toward wrist socket at z = 80 mm
            hull() {
                translate([0, 0, 6]) scale([1.0, 1.12, 1.0]) cylinder(h = 6, d = 28);
                translate([0, 0, 70]) cylinder(h = 6, d = 22);
            }
            // Magnetic / M2.5 Quick-Release Wrist Flange Collar (`right_wrist_flange_link` at z = 80)
            translate([0, 0, 74]) cylinder(h = 6, d1 = 24, d2 = 26);
        }
        // Hollow internal daisy-chain UART cable conduit (d = 12 mm)
        translate([0, 0, -4]) cylinder(h = 90, d = 12);
        // Elbow axle bore at z = 0
        rotate([0, 90, 0]) cylinder(h = 38, d = 6.2, center = true);
        // 3-Pin UART/Power Pogo/JST Pass-Through Header Slot at z = 80 mm
        translate([0, 6, 76]) cube([8.4, 3.8, 10], center = true);
        // 4x M2.5 Wrist Flange Mounting Holes (radius 9 mm)
        for (a = [45, 135, 225, 315]) {
            rotate([0, 0, a]) translate([9, 0, 70]) cylinder(h = 14, d = 2.6);
        }
    }
}

forearm_wrist_flange();
