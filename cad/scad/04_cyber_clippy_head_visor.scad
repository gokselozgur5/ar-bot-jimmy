// Jimmy Part 04: Curved Cyber-Clippy Head Dome, Recessed Visor Bezel & Ear LED Pods
$fn = 64;

module rounded_head_outer() {
    hull() {
        for (sx = [-26, 26], sz = [22, 52]) {
            translate([sx, 0, sz]) scale([1.0, 1.05, 1.0]) sphere(d = 44);
        }
    }
}

module cyber_clippy_head_visor() {
    difference() {
        union() {
            rounded_head_outer();
            // Left & Right Sci-Fi Comms Ear Pods
            for (sx = [-1, 1]) {
                translate([sx * 48, 0, 37]) rotate([0, 90, 0])
                    cylinder(h = 10, d1 = 30, d2 = 24, center = true);
            }
        }
        // Hollow interior shell (2.5 mm wall thickness)
        translate([0, 0, 2]) scale([0.92, 0.92, 0.92]) rounded_head_outer();
        // Front 2.4-inch IPS/OLED Visor Display Window Recess (76 x 46 mm curved pocket)
        translate([0, -34, 37]) cube([76, 24, 42], center = true);
        // Ear LED ring grooves
        for (sx = [-1, 1]) {
            translate([sx * 53, 0, 37]) rotate([0, 90, 0]) cylinder(h = 4, d = 16, center = true);
        }
        // Bottom 3-Pivot Neck Gimbal Socket Bore (d = 34 mm)
        translate([0, 0, -2]) cylinder(h = 22, d = 34);
    }
}

cyber_clippy_head_visor();
