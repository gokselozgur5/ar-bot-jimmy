// Jimmy Part 07: Modular 3-Finger Hand Palm Housing & Curved Finger Phalanges (IDs 15..17)
$fn = 48;

module curved_finger_phalanx() {
    difference() {
        hull() {
            sphere(d = 9);
            translate([0, -3, 24]) sphere(d = 7.5);
        }
        rotate([0, 90, 0]) cylinder(h = 14, d = 2.6, center = true);
    }
}

module modular_3finger_hand() {
    difference() {
        union() {
            // Rounded ergonomic palm housing bolting to `right_wrist_flange_link`
            hull() {
                cylinder(h = 4, d = 26);
                translate([-8, 0, 22]) sphere(d = 12);
                translate([8, 0, 22]) sphere(d = 12);
            }
            // Opposable thumb + index + middle finger phalanges in open print layout
            translate([-13, -4, 14]) rotate([20, -25, 0]) curved_finger_phalanx();
            translate([-5, 0, 26]) curved_finger_phalanx();
            translate([6, 0, 26]) curved_finger_phalanx();
        }
        // Internal micro-servo bay & cable channel
        translate([0, 0, -1]) cylinder(h = 18, d = 14);
        // 4x M2.5 wrist flange bolt pattern (radius 9 mm)
        for (a = [45, 135, 225, 315]) {
            rotate([0, 0, a]) translate([9, 0, -1]) cylinder(h = 10, d = 2.6);
        }
    }
}

modular_3finger_hand();
