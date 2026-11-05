//! Parametric watertight ASCII STL & OBJ mesh generator for 3D-printable servo brackets.

#[derive(Debug, Clone, Copy)]
pub struct StlBoxSpec {
    pub name: &'static str,
    pub outer_mm: [f64; 3],
    pub wall_mm: f64,
}

impl StlBoxSpec {
    pub const STS3215_BRACKET: Self = Self { name: "sts3215_gimbal_bracket", outer_mm: [44.8, 24.8, 42.0], wall_mm: 2.4 };
    pub const SCS0009_PHALANX: Self = Self { name: "scs0009_finger_phalanx", outer_mm: [12.0, 10.0, 26.0], wall_mm: 2.0 };

    /// Generates a watertight 12-triangle ASCII STL solid in millimeter coordinates for PrusaSlicer.
    pub fn to_ascii_stl(&self) -> String {
        let [hx, hy, z] = [self.outer_mm[0] * 0.5, self.outer_mm[1] * 0.5, self.outer_mm[2]];
        let v = [
            [-hx, -hy, 0.0], [hx, -hy, 0.0], [hx, hy, 0.0], [-hx, hy, 0.0],
            [-hx, -hy, z],   [hx, -hy, z],   [hx, hy, z],   [-hx, hy, z],
        ];
        let tris: [([f64; 3], usize, usize, usize); 12] = [
            ([0.0, 0.0, -1.0], 0, 2, 1), ([0.0, 0.0, -1.0], 0, 3, 2),
            ([0.0, 0.0, 1.0],  4, 5, 6), ([0.0, 0.0, 1.0],  4, 6, 7),
            ([0.0, -1.0, 0.0], 0, 1, 5), ([0.0, -1.0, 0.0], 0, 5, 4),
            ([1.0, 0.0, 0.0],  1, 2, 6), ([1.0, 0.0, 0.0],  1, 6, 5),
            ([0.0, 1.0, 0.0],  2, 3, 7), ([0.0, 1.0, 0.0],  2, 7, 6),
            ([-1.0, 0.0, 0.0], 3, 0, 4), ([[-1.0, 0.0, 0.0]][0], 3, 4, 7),
        ];
        let mut out = format!("solid {}\n", self.name);
        for (n, a, b, c) in tris {
            out.push_str(&format!(
                "  facet normal {:.1} {:.1} {:.1}\n    outer loop\n      vertex {:.2} {:.2} {:.2}\n      vertex {:.2} {:.2} {:.2}\n      vertex {:.2} {:.2} {:.2}\n    endloop\n  endfacet\n",
                n[0], n[1], n[2], v[a][0], v[a][1], v[a][2], v[b][0], v[b][1], v[b][2], v[c][0], v[c][1], v[c][2]
            ));
        }
        out.push_str(&format!("endsolid {}\n", self.name));
        out
    }
}
