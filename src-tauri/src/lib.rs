#![feature(os_string_pathbuf_leak)]
use std::path::{Path, PathBuf};
use tauri::{Manager, State};

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
struct DataPath(&'static Path);

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
            app.manage(DataPath(path));

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![load_book])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[tauri::command]
fn load_book(state: State<'_, DataPath>) -> String {
    let mut file_to_load = PathBuf::from(state.0);
    file_to_load.push("default.rcpbk");

    match std::fs::read_to_string(&file_to_load) {
        Ok(s) => s,
        Err(_) => {
            eprintln!("unable to open file at {file_to_load:?}");
            String::from("{}")
        }
    }
}
