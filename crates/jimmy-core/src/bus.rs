//! SOLID Daisy-Chain Serial Servo Bus (Feetech STS3215 / Dynamixel XL330 style).

#[derive(Debug, Clone, Copy, PartialEq)]
pub struct ServoGoal {
    pub id: u8,
    pub position_rad: f64,
    pub speed_rad_s: f64,
}

#[derive(Debug, Clone, Copy, PartialEq)]
pub struct ServoTelemetry {
    pub id: u8,
    pub position_rad: f64,
    pub load_nm: f64,
    pub temp_c: f64,
}

/// Dependency-Inverted Serial Bus Actuator Trait for ROS 2 Control & Hardware.
pub trait ActuatorBus {
    fn sync_write(&mut self, goals: &[ServoGoal]) -> Result<usize, &'static str>;
    fn read_telemetry(&self, id: u8) -> Option<ServoTelemetry>;
    fn discovered_ids(&self) -> Vec<u8>;
}

/// In-memory / ROS 2 Simulation Daisy-Chain Bus (Base IDs 1..=14 + Hot-Plug IDs).
pub struct SimDaisyChainBus {
    servos: Vec<ServoTelemetry>,
    max_temp_c: f64,
}

impl SimDaisyChainBus {
    pub fn new_base_14dof() -> Self {
        let servos = (1..=14)
            .map(|id| ServoTelemetry { id, position_rad: 0.0, load_nm: 0.1, temp_c: 32.0 })
            .collect();
        Self { servos, max_temp_c: 70.0 }
    }

    pub fn hot_plug_servo(&mut self, id: u8) {
        if !self.servos.iter().any(|s| s.id == id) {
            self.servos.push(ServoTelemetry { id, position_rad: 0.0, load_nm: 0.05, temp_c: 30.0 });
        }
    }
}
