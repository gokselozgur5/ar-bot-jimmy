// Jimmy Part 01d: Pelvis Hip Bridge (Couples Left/Right Hip Servos to Waist Gimbal)
$fn = 64;

module pelvis_hip_bridge() {
    difference() {
        union() {
            // Curved pelvis bridge span (width 96 mm, depth 36 mm, height 22 mm)
            hull() {
                translate([-36, 0, 0]) cylinder(h = 22, d = 34);
                translate([36, 0, 0]) cylinder(h = 22, d = 34);
            }
            // Center 3-pivot waist yaw turret boss
            translate([0, 0, 22]) cylinder(h = 10, d = 38);
        }
        // Left and right STS3215 hip servo pockets
        translate([-36, 0, -0.1]) cylinder(h = 16, d = 24.4);
        translate([36, 0, -0.1]) cylinder(h = 16, d = 24.4);
        // Center waist cable pass-through bore + 4x M3 horn holes
        translate([0, 0, -0.1]) cylinder(h = 35, d = 12);
        for (a = [0, 90, 180, 270])
            rotate([0, 0, a]) translate([13, 0, -0.1]) cylinder(h = 35, d = 3.2);
    }
}

pelvis_hip_bridge();
