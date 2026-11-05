//! Standalone HTTP/JSON Control & ROS 2 Telemetry Daemon for Jimmy (`127.0.0.1:9090`).
pub mod router;
pub mod state;

use router::route_request;
use state::DaemonState;
use std::io::{BufRead, BufReader, Write};
use std::net::TcpListener;

fn main() -> std::io::Result<()> {
    let bind_addr = std::env::var("JIMMY_BIND").unwrap_or_else(|_| "0.0.0.0:9090".into());
    let listener = TcpListener::bind(&bind_addr)?;
    let mut state = DaemonState::new();
    for stream in listener.incoming().flatten() {
        let mut reader = BufReader::new(&stream);
        let mut req_line = String::new();
        if reader.read_line(&mut req_line).is_ok() {
            let (code, body) = route_request(&mut state, &req_line);
            let status = if code == 200 { "200 OK" } else { "404 Not Found" };
            let resp = format!(
                "HTTP/1.1 {}\r\nContent-Type: application/json\r\nAccess-Control-Allow-Origin: *\r\nContent-Length: {}\r\n\r\n{}",
                status, body.len(), body
            );
            let _ = (&stream).write_all(resp.as_bytes());
        }
    }
    Ok(())
}

#[cfg(test)]
mod tests {
    use super::router::route_request;
    use super::state::DaemonState;

    #[test]
    fn daemon_routes_gesture_and_ik_requests() {
        let mut state = DaemonState::new();
        let (code, body) = route_request(&mut state, "GET /api/gesture/clippy HTTP/1.1");
        assert_eq!(code, 200);
        assert!(body.contains("\"gesture\":\"CyberClippyLean\""));
        let (code2, body2) = route_request(&mut state, "GET /api/ik/desk-center HTTP/1.1");
        assert_eq!(code2, 200);
        assert!(body2.contains("\"gesture\":\"LiveDeskIK\""));
    }
}
