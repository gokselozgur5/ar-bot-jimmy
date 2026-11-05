// Jimmy Part 02: 3-Pivot Waist Gimbal Bracket (Servos ID 2 Roll & ID 3 Pitch, STS3215)
$fn = 56;

module waist_3pivot_gimbal() {
    difference() {
        union() {
            // Bottom flange bolting onto Waist Yaw Servo (ID 1) horn (25T spline d=20 mm)
            cylinder(h = 6, d = 56);
            // U-shaped dual-ear gimbal yoke holding Roll/Pitch servos
            for (sx = [-1, 1]) {
                hull() {
                    translate([sx * 22, 0, 4]) cube([6, 28, 8], center = true);
                    translate([sx * 22, 0, 38]) rotate([0, 90, 0]) cylinder(h = 6, d = 28, center = true);
                }
            }
            // Central cross-bridge with internal cable pass-through ring
            translate([0, 0, 4]) cylinder(h = 10, d = 48);
        }
        // Central STS3215 servo clearance bay (38 x 22 x 44 mm)
        translate([0, 0, 30]) cube([38, 22, 44], center = true);
        // Horizontal pitch/roll pivot axle bores (d = 8.2 mm for M8 bearing / horn)
        translate([0, 0, 38]) rotate([0, 90, 0]) cylinder(h = 64, d = 8.2, center = true);
        // Bottom 4x M2.5 horn screw circle (radius 7 mm) + center M3 bore
        cylinder(h = 20, d = 6.2, center = true);
        for (a = [0, 90, 180, 270]) {
            rotate([0, 0, a]) translate([7, 0, -1]) cylinder(h = 10, d = 2.7);
        }
    }
}

waist_3pivot_gimbal();
