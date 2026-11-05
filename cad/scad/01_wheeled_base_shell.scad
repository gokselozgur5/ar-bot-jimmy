// Jimmy Part 01: Split-Platform Bipedal Feet & Articulated Leg Struts (Left & Right Independent Halves)
$fn = 56;

module half_platform_foot(side = 1) {
    difference() {
        union() {
            // D-shaped semi-circular stabilizer foot platform (one half per foot, 14 mm center gap)
            intersection() {
                cylinder(h = 14, d1 = 156, d2 = 144);
                translate([side * 45, 0, 7]) cube([76, 170, 20], center = true);
            }
            // Ankle ball-socket cuff & lower/upper bionic leg struts
            translate([side * 36, 0, 14]) {
                sphere(d = 26);
                cylinder(h = 44, d1 = 24, d2 = 22);
                translate([0, 0, 44]) sphere(d = 26);
                translate([0, 0, 44]) cylinder(h = 44, d1 = 24, d2 = 26);
                translate([0, 0, 88]) sphere(d = 28);
            }
        }
        // Bottom 18650 Li-Ion battery cell pocket inside each foot half (68 x 22 x 10 mm)
        translate([side * 38, 0, 4]) cube([24, 68, 10], center = true);
        // Internal leg servo wire channel (d = 10 mm)
        translate([side * 36, 0, -1]) cylinder(h = 105, d = 10);
    }
}

module wheeled_base_shell() {
    // Independent Left (+1) and Right (-1) Split-Platform Bipedal Feet & Legs
    half_platform_foot(1);
    half_platform_foot(-1);
    // Pelvis bridge connecting left/right hip joints (z = 102 mm) to 3-Pivot Waist Gimbal
    difference() {
        hull() {
            for (sx = [-36, 36]) translate([sx, 0, 102]) sphere(d = 28);
            translate([0, 0, 106]) cylinder(h = 8, d = 56);
        }
        translate([0, 0, 90]) cylinder(h = 30, d = 14);
    }
}

wheeled_base_shell();
