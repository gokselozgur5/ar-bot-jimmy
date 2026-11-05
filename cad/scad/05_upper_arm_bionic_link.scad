// Jimmy Part 05: Tapered Bionic Upper Arm Link (85 mm shoulder-to-elbow center-to-center)
$fn = 56;

module upper_arm_bionic_link() {
    difference() {
        union() {
            // Spherical shoulder cuff housing (origin z = 0)
            sphere(d = 38);
            // Sculpted tapered bionic arm fairing between shoulder (z=0) and elbow (z=85)
            hull() {
                translate([0, 0, 8]) cylinder(h = 4, d = 34);
                translate([0, 0, 77]) cylinder(h = 4, d = 28);
            }
            // Elbow clevis yoke ears at z = 85 mm
            for (sx = [-1, 1]) {
                translate([sx * 12, 0, 85]) rotate([0, 90, 0]) cylinder(h = 5, d = 26, center = true);
            }
        }
        // Internal wire routing & weight-reduction bore (d = 18 mm)
        translate([0, 0, -2]) cylinder(h = 84, d = 18);
        // Elbow servo horn clevis slot (19 mm wide)
        translate([0, 0, 86]) cube([19, 32, 28], center = true);
        // Shoulder & Elbow pivot axle bores (d = 8.0 mm)
        rotate([0, 90, 0]) cylinder(h = 48, d = 8.0, center = true);
        translate([0, 0, 85]) rotate([0, 90, 0]) cylinder(h = 40, d = 6.2, center = true);
    }
}

upper_arm_bionic_link();
