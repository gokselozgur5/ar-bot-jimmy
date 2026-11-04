# 3D-Printable Armor Shell & 3-Pivot Mechanical Specification

## 1. Dimensional Envelope (380 mm Total Height)

| Subassembly | Dimensions (X × Y × Z mm) | Material | Actuator Mount |
| :--- | :--- | :--- | :--- |
| **Wheeled Foot Base** | `190 × 170 × 35 mm` | PETG-CF + 3S Li-Ion Bay | Dual Hidden Omni-Wheels |
| **Lower Legs (2x)** | `55 × 42 × 110 mm` | ASA / Matte White PLA+ | Rigid Cable Conduit |
| **3-Pivot Waist Gimbal** | `78 × 78 × 52 mm` | Aluminum / Nylon-CF | 3× STS3215 (`IDs 1..=3`) |
| **Chest Sensor Torso** | `95 × 110 × 130 mm` | Matte White + Blue Trim | Wide CSI Cam + Pi 5 Bay |
| **3-Pivot Neck & Visor** | `75 × 85 × 75 mm` | Smoked Acrylic + White | 3× STS3215 (`IDs 4..=6`) + 2.4" IPS |
| **6-DoF Arms (2x)** | `Ø36 × 165 mm` | Matte White Shell | 4× STS3215 (`IDs 7..=14`) |
| **Wrist Hot-Plug Flange** | `Ø32 × 12 mm` | 4× M2.5 + 3-Pin UART | Pass-Through Bus (`IDs 15..=20`) |

## 2. Print & Assembly Tolerances
- **Bearing Clearance:** `0.15 mm` radial interference fit for `6700ZZ` (`10×15×4 mm`) thin-section bearings on all 3-pivot axes.
- **Internal Daisy-Chain Routing:** `6.5 mm` central hollow channel through waist and shoulder pivots prevents cable pinch at `±90°` articulation.
