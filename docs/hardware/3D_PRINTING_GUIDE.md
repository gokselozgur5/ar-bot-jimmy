# Jimmy (`ar-bot-jimmy`) — 3D Printing (PrusaSlicer) & Blender Customization Guide

![Jimmy 3D-Printable CAD Parts Preview](../media/cad_parts_preview.png)

## 1. 7-Part 2-Manifold Printable STL Library (`cad/stl/`)

All 7 modular parts are compiled from parametric OpenSCAD (`cad/scad/*.scad`) into verified **2-manifold (`Simple: yes`)** millimeter-scale `.stl` files ready to drop directly into **PrusaSlicer / Bambu Studio** or **Blender**:

| Part File (`cad/stl/`) | Dimensions (mm) | Material | Layer / Infill | Notes & Fasteners |
| :--- | :--- | :--- | :--- | :--- |
| `01_wheeled_base_shell.stl` | `Ø 180 x 54 mm` | PETG / PLA | `0.20 mm` / `25%` Gyroid | 3S 18650 battery bay + Waist Yaw (`ID 1`) pocket + 4x M3 inserts |
| `02_waist_3pivot_gimbal.stl` | `56 x 56 x 52 mm` | PETG | `0.16 mm` / `35%` Gyroid | High-load 3-pivot Roll/Pitch yoke (`IDs 2, 3`) + 25T horn circle |
| `03_torso_armor_shell.stl` | `124 x 85 x 140 mm`| PLA+ / ASA | `0.20 mm` / `15%` Gyroid | Astro-Bot/EVE hourglass carapace + `Ø 22 mm` CSI camera bezel |
| `04_cyber_clippy_head_visor.stl`| `106 x 62 x 74 mm`| PLA+ / ASA | `0.16 mm` / `15%` Gyroid | Recessed `76 x 42 mm` 2.4" IPS/OLED visor pocket + ear LED pods |
| `05_upper_arm_bionic_link.stl` | `Ø 38 x 98 mm` (x2)| PETG / PLA | `0.20 mm` / `25%` Gyroid | `85 mm` shoulder-to-elbow center distance + internal cable tunnel |
| `06_forearm_wrist_flange.stl` | `Ø 30 x 80 mm` (x2)| PETG / PLA | `0.20 mm` / `20%` Gyroid | `80 mm` forearm + 3-pin UART pass-through + M2.5 quick flange |
| `07_modular_3finger_hand.stl` | `38 x 26 x 50 mm` | PETG / TPU | `0.16 mm` / `25%` Gyroid | Rounded palm + thumb/index/middle phalanges (`IDs 15..17`) |

## 2. Recompiling OpenSCAD or Customizing in Blender

```bash
# Recompile any modified .scad part into cad/stl/
/opt/homebrew/bin/openscad -o cad/stl/03_torso_armor_shell.stl cad/scad/03_torso_armor_shell.scad
```

- **Blender Sculpting Workflow:** Open Blender -> `File -> Import -> Stl (.stl)` -> select any part from `cad/stl/` -> sculpt custom outer details while preserving the inner servo mounting pockets -> `File -> Export -> Stl (.stl)` to slice in PrusaSlicer!
