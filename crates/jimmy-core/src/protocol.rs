//! Byte-exact UART/RS-485 packet framing for Feetech STS3215 / Dynamixel bus servos.

pub const HEADER: u8 = 0xFF;
pub const INST_WRITE: u8 = 0x03;
pub const INST_SYNC_WRITE: u8 = 0x83;
pub const REG_ID: u8 = 0x05;
pub const REG_GOAL_POSITION_L: u8 = 0x2A;

/// Converts radians (`-pi..+pi`) to 12-bit magnetic encoder ticks (`0..=4095`, center `2048`).
pub fn rad_to_ticks(rad: f64) -> u16 {
    let normalized = (rad / std::f64::consts::PI).clamp(-1.0, 1.0);
    ((2048.0 + normalized * 2047.0).round() as i32).clamp(0, 4095) as u16
}

/// Computes the inverted 8-bit packet checksum: `!(id + len + inst + sum(params)) & 0xFF`.
pub fn compute_checksum(payload_without_header: &[u8]) -> u8 {
    let sum: u8 = payload_without_header.iter().fold(0u8, |acc, &b| acc.wrapping_add(b));
    !sum
}

/// Encodes a broadcast (`0xFE`) SyncWrite frame for multiple `(servo_id, angle_rad)` pairs.
pub fn encode_sync_write_positions(targets: &[(u8, f64)]) -> Vec<u8> {
    let data_len_per_servo: u8 = 2;
    let param_len = 2 + targets.len() * (1 + data_len_per_servo as usize);
    let len = (param_len + 2) as u8;
    let mut pkt = Vec::with_capacity(targets.len() * 3 + 8);
    pkt.extend_from_slice(&[HEADER, HEADER, 0xFE, len, INST_SYNC_WRITE, REG_GOAL_POSITION_L, data_len_per_servo]);
    for &(id, rad) in targets {
        let ticks = rad_to_ticks(rad);
        pkt.push(id);
        pkt.push((ticks & 0xFF) as u8);
        pkt.push(((ticks >> 8) & 0xFF) as u8);
    }
    let crc = compute_checksum(&pkt[2..]);
    pkt.push(crc);
    pkt
}

/// Validates framing headers (`0xFF 0xFF`), length field, and trailing checksum.
pub fn verify_packet(frame: &[u8]) -> bool {
    if frame.len() < 6 || frame[0] != HEADER || frame[1] != HEADER {
        return false;
    }
    let expected_len = frame[3] as usize + 4;
    frame.len() == expected_len && compute_checksum(&frame[2..frame.len() - 1]) == frame[frame.len() - 1]
}

/// Encodes an EEPROM write frame (`INST_WRITE = 0x03`, `REG_ID = 0x05`) to assign `new_id` (`1..=17`).
pub fn encode_set_servo_id(current_id: u8, new_id: u8) -> [u8; 8] {
    let mut pkt = [HEADER, HEADER, current_id, 0x04, INST_WRITE, REG_ID, new_id, 0x00];
    pkt[7] = compute_checksum(&pkt[2..7]);
    pkt
}
