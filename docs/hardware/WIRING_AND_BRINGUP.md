# Jimmy Hardware Wiring Harness, Power Budget & Servo ID Provisioning

## 1. Power & Serial Bus Topology

```mermaid
flowchart LR
    BAT["3S Li-Ion 11.1V (Foot Base)"] --> BUCK1["7.4V 10A Buck Converter"]
    BAT --> BUCK2["5.1V 5A USB-C PD Buck"]
    BUCK1 --> URT["Waveshare / Feetech FE-URT-1 Bus Driver"]
    BUCK2 --> PI["Raspberry Pi 5 / Jetson Orin Nano"]
    PI <-->|UART 1 Mbps /dev/ttyAMA0| URT
    URT ==>|3-Pin Daisy-Chain| WAIST["Waist 3-Pivot (IDs 1..3)"]
    WAIST ==> NECK["Neck & Visor (IDs 4..6)"]
    WAIST ==> LARM["Left Arm (IDs 7..10)"]
    WAIST ==> RARM["Right Arm (IDs 11..14)"]
    RARM -.->|Wrist Hot-Plug Socket| RHAND["3-Finger Hand (IDs 15..17)"]
```

## 2. Electrical Current & Thermal Budget

| Rail | Voltage | Continuous Current | Peak Current | Protected Subsystem |
| :--- | :--- | :--- | :--- | :--- |
| **Actuator Bus** | `7.4 V` | `1.8 A` | `8.5 A` | 14× STS3215 Base + 6× Micro Hand Servos |
| **Compute & Vision** | `5.1 V` | `2.2 A` | `4.0 A` | Raspberry Pi 5 + Wide CSI Camera + 2.4" SPI Visor |

## 3. One-By-One Servo EEPROM ID Provisioning
Connect a single unconfigured factory servo (`ID = 1`) to the bus and transmit `encode_set_servo_id(1, target_id)` from `jimmy_core::protocol` before daisy-chaining the next joint.
