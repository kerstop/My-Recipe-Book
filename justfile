
set shell := ["powershell"]

tauri-dev: frontend
  npm run tauri dev

frontend:
  npm run dev
