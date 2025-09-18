// Prevents additional console window on Windows, DO NOT REMOVE!!
#![cfg_attr(windows, windows_subsystem = "windows")]

fn main() {
    api_key_manager_lib::run()
}
