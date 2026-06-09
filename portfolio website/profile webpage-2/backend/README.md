# Contact Form Backend

A simple Flask backend with SQLite database to store contact form submissions.

## Setup

1. **Install dependencies:**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

2. **Run the server:**
   ```bash
   python app.py
   ```

The server will start at `http://0.0.0.0:5000` (reachable locally as `http://127.0.0.1:5000`).

You can override defaults with environment variables:
- `PORT` — port to listen on (default `5000`)
- `HOST` — bind address (default `0.0.0.0`)
- `DEBUG` — set to `true` only for local debugging (default `false`)

## Hosting via VS Code port forwarding

The frontend auto-detects the backend URL, so no code edits are needed when forwarding.

1. Run the backend (`python app.py`) and serve the frontend (e.g. Live Server on port 5500).
2. Open the **Ports** tab in VS Code (`Ctrl+Shift+P` → "Ports: Focus on Ports View").
3. Forward **both** ports: `5500` (frontend) and `5000` (backend).
4. Right-click each forwarded port → **Port Visibility → Public** so visitors don't hit a login wall.
5. Open the forwarded `5500` URL. The form posts to the matching `5000` tunnel automatically
   (`<id>-5500.devtunnels.ms` → `<id>-5000.devtunnels.ms`).

> Note: SQLite stores data in `contacts.db` on your machine. Submissions only persist
> while your local server is running.

## API Endpoints

- `POST /api/contact` - Submit contact form
- `GET /api/health` - Health check

## Database

SQLite database (`contacts.db`) is created automatically in the backend folder.

## Features

- Input validation and sanitization
- Duplicate submission prevention (5-minute window)
- CORS enabled for frontend requests
- Automatic fallback to localStorage if backend is unavailable
