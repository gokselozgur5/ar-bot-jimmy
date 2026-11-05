// Jimmy Part 01: Wheeled Hover-Pod Base Shell (180 mm diameter, 3S battery bay & wheel wells)
$fn = 64;

module wheeled_base_shell() {
    difference() {
        union() {
            // Chamfered aerodynamic hover-pod base skirt
            cylinder(h = 12, d1 = 180, d2 = 168);
            translate([0, 0, 12]) cylinder(h = 28, d1 = 168, d2 = 132);
            // Center pedestal collar for 3-Pivot Waist Yaw Servo (ID 1)
            translate([0, 0, 40]) cylinder(h = 14, d1 = 86, d2 = 68);
            // Left and right wheel fender arches
            for (sx = [-1, 1]) {
                translate([sx * 72, 0, 18]) rotate([0, 90, 0])
                    cylinder(h = 18, d = 44, center = true);
            }
        }
        // Bottom 3S 18650 Li-Ion battery + buck converter cavity (110 x 72 x 32 mm)
        translate([0, 0, 15]) cube([110, 72, 32], center = true);
        // STS3215 Waist Yaw Servo (ID 1) pocket (40.4 x 20.4 x 36 mm)
        translate([0, 0, 42]) cube([20.4, 40.4, 36], center = true);
        // 4x M3 heat-set insert mounting bores (d = 3.2 mm)
        for (dx = [-14, 14], dy = [-24, 24]) {
            translate([dx, dy, 25]) cylinder(h = 35, d = 3.2);
        }
        // Center 6 mm daisy-chain wire pass-through bore
        translate([0, 0, -1]) cylinder(h = 60, d = 10);
    }
}

wheeled_base_shell();
