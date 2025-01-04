#![feature(os_string_pathbuf_leak)]
use scraper::selectable::Selectable;
use scraper::{Html, Selector};
use serde::Serialize;
use std::path::{Path, PathBuf};
use std::sync::OnceLock;
use tauri::Manager;
use uuid::Uuid;

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
        .invoke_handler(tauri::generate_handler![
            load_book,
            save_book,
            import_recipe
        ])
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

#[derive(Serialize)]
struct Recipe {
    id: Uuid,
    title: String,
    ingredients: Vec<Ingredient>,
    instructions: String,
    last_modified: chrono::DateTime<chrono::Utc>,
}

#[derive(Serialize)]
struct Ingredient {
    id: Uuid,
    name: String,
    unit: Option<String>,
    amount: Option<f32>,
    order_by: i32,
}

#[tauri::command]
fn import_recipe(url: String) -> Result<String, String> {
    if !url.contains("allrecipes.com") {
        return Err("Currently only imports from allrecipes.com are supported".into());
    }
    let html = match reqwest::blocking::get(url) {
        Ok(r) => match r.text() {
            Ok(t) => t,
            Err(e) => return Err(format!("{e}")),
        },
        Err(e) => return Err(format!("{e}")),
    };

    let page = Html::parse_document(&html);

    let ingredient_selector =
        Selector::parse(".mm-recipes-structured-ingredients__list-item").unwrap();
    let amount_selector = Selector::parse("[data-ingredient-quantity]").unwrap();
    let name_selector = Selector::parse("[data-ingredient-name]").unwrap();
    let unit_selector = Selector::parse("[data-ingredient-unit]").unwrap();

    let ingredients: Vec<Ingredient> = page
        .select(&ingredient_selector)
        .enumerate()
        .map(|(i, ingredient)| {
            let amount = ingredient
                .select(&amount_selector)
                .next()
                .and_then(|e| e.text().next())
                .unwrap_or("");
            let name = ingredient
                .select(&name_selector)
                .next()
                .and_then(|e| e.text().next())
                .unwrap_or("");
            let unit = ingredient
                .select(&unit_selector)
                .next()
                .and_then(|e| e.text().next())
                .unwrap_or("");
            Ingredient {
                id: Uuid::new_v4(),
                name: name.into(),
                unit: Some(unit.into()),
                amount: amount.parse().ok(),
                order_by: i.try_into().unwrap(),
            }
        })
        .collect();

    let title = page
        .select(&Selector::parse("title").unwrap())
        .next()
        .and_then(|e| e.text().next())
        .unwrap_or("Title not found")
        .to_string();

    let instructions: String = page
        .select(&Selector::parse(".mm-recipes-steps").unwrap())
        .next()
        .ok_or("unable to find recipe steps".to_string())?
        .select(&Selector::parse("p").unwrap())
        .map(|i| {
            i.text().fold(String::new(), |mut step, paragraph| {
                step.push_str(paragraph);
                step.push('\n');
                step
            })
        })
        .fold(String::new(), |mut steps, step| {
            steps.push_str(&step);
            steps.push('\n');
            step
        });

    let recipe = Recipe {
        id: Uuid::new_v4(),
        title,
        ingredients,
        instructions,
        last_modified: chrono::Utc::now(),
    };

    serde_json::to_string(&recipe).map_err(|e| e.to_string())
}
