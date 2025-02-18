#![feature(os_string_pathbuf_leak)]
use std::path::{Path, PathBuf};
use std::sync::OnceLock;
use tauri::Manager;

static DATA_PATH: OnceLock<&'static Path> = OnceLock::new();

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .setup(|app| {
            let resolver = app.path();
            let path = resolver
                .parse(tauri::path::BaseDirectory::AppData.variable())
                .expect("unable to determine the data directory")
                .leak();
            println!("Data path identified as {:?}", path);
            DATA_PATH.set(path).unwrap();

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![load_book, save_book])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[tauri::command]
fn save_book(book_str: String) {
    let mut file_to_write = PathBuf::from(DATA_PATH.get().unwrap());
    file_to_write.push("default.rcpbk");

    std::fs::write(file_to_write, book_str).unwrap();
}

#[tauri::command]
fn load_book() -> String {
    let mut file_to_load = PathBuf::from(DATA_PATH.get().unwrap());
    file_to_load.push("default.rcpbk");

    match std::fs::read_to_string(&file_to_load) {
        Ok(s) => s,
        Err(_) => {
            eprintln!("unable to open file at {file_to_load:?}");
            String::from("{}")
        }
    }
}
