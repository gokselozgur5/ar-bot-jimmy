// Jimmy Part 01c: Articulated Bionic Leg Strut (Thigh / Shin Segment, Print 4x)
$fn = 64;

module bionic_leg_strut(length_mm = 42) {
    difference() {
        hull() {
            cylinder(h = 18, d = 24, center = true);
            translate([0, 0, length_mm]) cylinder(h = 18, d = 22, center = true);
        }
        // Internal 1 Mbps TTL daisy-chain wire tunnel
        translate([0, 0, -12]) cylinder(h = length_mm + 24, d = 8.5);
        // Lower and upper STS3215 horn clevis slots
        translate([-14, -7, -11]) cube([28, 14, 12]);
        translate([-14, -7, length_mm - 1]) cube([28, 14, 12]);
        // M3 cross-pin hinge bores
        rotate([90, 0, 0]) cylinder(h = 30, d = 3.2, center = true);
        translate([0, 0, length_mm]) rotate([90, 0, 0]) cylinder(h = 30, d = 3.2, center = true);
    }
}

bionic_leg_strut();
