// Jimmy Part 01b: Right Split D-Shaped Half-Platform Foot (18650 Bay + Ankle Socket)
$fn = 64;

module right_foot_half_platform() {
    difference() {
        union() {
            // Right half-cylinder sole (X > +3 mm, radius 68 mm, height 16 mm)
            intersection() {
                cylinder(h = 16, r = 68);
                translate([3, -75, 0]) cube([72, 150, 20]);
            }
            // Ankle STS3215 clevis boss
            translate([36, 0, 16]) cylinder(h = 14, r = 14);
        }
        // Bottom 18650 single-cell battery pocket (19x66 mm)
        translate([26, -33, -0.1]) cube([20, 66, 11]);
        // M3 ankle servo horn bore + wire routing channel
        translate([36, 0, -0.1]) cylinder(h = 32, d = 6.2);
        // 3x bottom silicone pad recesses
        for (y = [-42, 0, 42])
            translate([42, y, -0.1]) cylinder(h = 2.2, d = 12);
    }
}

right_foot_half_platform();
