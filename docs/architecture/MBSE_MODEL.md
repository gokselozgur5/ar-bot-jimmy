# Jimmy Full-Body AR Companion — MBSE System Model

## 1. Block Definition Diagram (SysML BDD)

```mermaid
classDiagram
    class JimmyRobot {
        +f64 height_m = 0.38
        +u8 base_dof = 14
        +u8 expansion_dof = 6
    }
    class WaistPivot3DoF {
        +Joint waist_yaw_id1
        +Joint waist_pitch_id2
        +Joint waist_roll_id3
    }
    class NeckVisor3DoF {
        +Joint neck_yaw_id4
        +Joint neck_pitch_id5
        +Joint neck_roll_id6
    }
    class Arm6DoF {
        +Joint shoulder_pitch
        +Joint shoulder_roll
        +Joint shoulder_yaw
        +Joint elbow_pitch
        +WristSocket2DoF modular_flange
    }
    JimmyRobot *-- WaistPivot3DoF
    JimmyRobot *-- NeckVisor3DoF
    JimmyRobot *-- "2" Arm6DoF
```

## 2. Daisy-Chain Serial Bus Interface Control (ICD)

| Subsystem | Servo IDs | DoF | Bus Protocol | Mechanical Interface |
| :--- | :--- | :--- | :--- | :--- |
| **Waist 3-Pivot** | `1..=3` | 3 | UART/RS-485 1 Mbps | Heavy Wheeled Foot Base |
| **Neck + Visor** | `4..=6` | 3 | UART/RS-485 1 Mbps | IPS Visor + Chest Wide Cam |
| **Left Arm** | `7..=10` | 4 | UART/RS-485 1 Mbps | Magnetic/4-Bolt Wrist Flange |
| **Right Arm** | `11..=14` | 4 | UART/RS-485 1 Mbps | Magnetic/4-Bolt Wrist Flange |
| **3-Finger Hands** | `15..=20` | 6 | Hot-Plug Daisy-Chain | Pass-through 3-Pin Bus Header |
