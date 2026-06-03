# Nuestra Historia

A private, two-person relationship journal. Two partners document their shared memories — each entry holds both perspectives, written independently, building a timeline of a life together.

---

## Features

- **Private by design** — only two accounts exist, ever. No registration, no public access.
- **Dual perspectives** — every entry has two paragraph fields, one per partner. Entries are "pending" until both have written their side.
- **Image galleries** — upload multiple images per entry, pick a featured one.
- **Role-based editing** — each user can only edit their own paragraph.
- **Timeline view** — browse all entries chronologically with filters.
- **Auto-seeded users** — credentials live in `.env` and sync on every server restart.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Django 4.2 + Django REST Framework + SimpleJWT |
| Frontend | React 18 + Vite + Tailwind CSS |
| Database | SQLite (managed by Django ORM) |
| Static files | WhiteNoise (serves built React app, no extra config) |
| Auth | JWT Bearer tokens — 7-day expiry |

---

## Prerequisites

| Tool | Minimum version | Notes |
|---|---|---|
| Python | 3.10+ | 3.12 recommended |
| Node.js | 18+ | For building the frontend |
| npm | 9+ | Comes with Node.js |
| pip | any | Comes with Python |

---

## Local Development

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd nuestra-historia
```

### 2. Create the `.env` file

Copy or create `.env` in the project root:

```dotenv
SECRET_KEY=change-this-to-a-long-random-string
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Partner 1
USER1_USERNAME=joaquin
USER1_DISPLAY_NAME=Joaquin
USER1_PASSWORD=your-password-here
USER1_ROLE=hombre

# Partner 2
USER2_USERNAME=alexandra
USER2_DISPLAY_NAME=Alexandra
USER2_PASSWORD=your-password-here
USER2_ROLE=mujer
```

> `SECRET_KEY` can be any long random string. Generate one with:
> ```bash
> python -c "import secrets; print(secrets.token_urlsafe(50))"
> ```

### 3. Install Python dependencies

```bash
pip install -r requirements.txt
```

### 4. Run database migrations and seed users

```bash
python manage.py migrate
python manage.py seed_users
```

### 5. Start the Django backend

```bash
python manage.py runserver 8742
```

The API is now available at `http://localhost:8742/api/`.

### 6. Start the React frontend (new terminal)

```bash
cd frontend
npm install
npm run dev
```

Open **http://localhost:5173** in your browser.

The Vite dev server automatically proxies all `/api` requests to Django on port `8742` — no CORS setup needed.

### Stopping

- `Ctrl+C` in both terminals.

---

## PythonAnywhere Deployment

PythonAnywhere is the recommended hosting target. The free plan works if your usage is light; the cheapest paid plan ($5/month) removes the inactivity timeout and allows always-on operation.

### Step 1 — Open a Bash console

Log in to PythonAnywhere and open a **Bash** console from the **Consoles** tab.

### Step 2 — Clone the repository

```bash
cd ~
git clone <your-repo-url> nuestra_historia
cd nuestra_historia
```

> If the repo is private, use an HTTPS URL with a personal access token, or set up SSH keys first.

### Step 3 — Create a virtual environment

```bash
mkvirtualenv --python=python3.10 nuestra_historia
```

The virtualenv activates automatically. Your prompt will show `(nuestra_historia)`.

### Step 4 — Install Python dependencies

```bash
pip install -r requirements.txt
```

### Step 5 — Build the React frontend

PythonAnywhere includes Node.js. Run:

```bash
cd frontend
npm install
npm run build
cd ..
```

This creates `frontend/dist/` — the compiled React app that Django will serve via WhiteNoise. You only need to redo this step when you change frontend code.

### Step 6 — Create the `.env` file

```bash
nano .env
```

Paste this content, replacing the placeholder values:

```dotenv
SECRET_KEY=<generate-a-long-random-string>
DEBUG=False
ALLOWED_HOSTS=yourusername.pythonanywhere.com

USER1_USERNAME=joaquin
USER1_DISPLAY_NAME=Joaquin
USER1_PASSWORD=<strong-password>
USER1_ROLE=hombre

USER2_USERNAME=alexandra
USER2_DISPLAY_NAME=Alexandra
USER2_PASSWORD=<strong-password>
USER2_ROLE=mujer
```

Replace `yourusername` with your actual PythonAnywhere username. Save with `Ctrl+O`, exit with `Ctrl+X`.

Generate a secret key right from the console:
```bash
python -c "import secrets; print(secrets.token_urlsafe(50))"
```

### Step 7 — Initialize the database

```bash
python manage.py migrate
python manage.py seed_users
python manage.py collectstatic --noinput
```

### Step 8 — Create the web app in the dashboard

1. Go to the **Web** tab in the PythonAnywhere dashboard.
2. Click **Add a new web app**.
3. Choose **Manual configuration** (not Django — you want manual).
4. Select **Python 3.10** (must match your virtualenv).

### Step 9 — Configure source code and virtualenv

In the **Web** tab, fill in:

| Field | Value |
|---|---|
| Source code | `/home/yourusername/nuestra_historia` |
| Working directory | `/home/yourusername/nuestra_historia` |
| Virtualenv | `/home/yourusername/.virtualenvs/nuestra_historia` |

### Step 10 — Edit the WSGI configuration file

Click the link to your WSGI file (looks like `/var/www/yourusername_pythonanywhere_com_wsgi.py`). Delete everything and replace with:

```python
import os
import sys

path = '/home/yourusername/nuestra_historia'
if path not in sys.path:
    sys.path.insert(0, path)

os.environ['DJANGO_SETTINGS_MODULE'] = 'nuestra_historia.settings'

from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()
```

Replace `yourusername` with your actual username. Save the file.

### Step 11 — Map the uploads directory

In the **Web** tab → **Static files** section, add one entry:

| URL | Directory |
|---|---|
| `/api/images/` | `/home/yourusername/nuestra_historia/uploads` |

> React assets (`/assets/`) are handled automatically by WhiteNoise — no entry needed.

### Step 12 — Go live

Click the **Reload** button at the top of the Web tab. Your app is live at:

```
https://yourusername.pythonanywhere.com
```

Log in with the credentials you set in `.env`.

---

## Updating the App (PythonAnywhere)

### Pull latest code

```bash
cd ~/nuestra_historia
git pull
```

### Rebuild frontend (only when frontend code changed)

```bash
cd frontend
npm install
npm run build
cd ..
```

### Apply database migrations (only when models changed)

```bash
python manage.py migrate
```

### Reload the web app

Always reload after pulling changes:

1. Go to the **Web** tab.
2. Click **Reload**.

### Change credentials or display names

Edit `.env`, then from the Bash console:

```bash
cd ~/nuestra_historia
python manage.py seed_users
```

Then reload the web app. Users are updated immediately.

---

## Running with Docker (local)

If you prefer Docker for local development or a self-hosted VPS:

### 1. Create your `.env` file

Same as the local dev setup above (`DEBUG=True` for local).

### 2. Build and start

```bash
docker compose up --build
```

This starts:
- **Backend** (FastAPI variant) on port `8742`
- **Frontend** (Nginx serving built React) on port `3742`

> Note: the Docker setup uses the FastAPI implementation in `backend/`. The Django implementation (active branch) is designed for PythonAnywhere and direct `runserver` / WSGI deployment.

### 3. Access

- Frontend: `http://localhost:3742`
- API: `http://localhost:8742`

### 4. Stop

```bash
docker compose down
```

Data persists in the `db_data` and `uploads` Docker volumes.

---

## Environment Variables Reference

| Variable | Required | Description |
|---|---|---|
| `SECRET_KEY` | Yes | Django secret key — any long random string, never share it |
| `DEBUG` | Yes | `True` for local dev, `False` for production |
| `ALLOWED_HOSTS` | Yes | Comma-separated hostnames (e.g. `yourusername.pythonanywhere.com`) |
| `USER1_USERNAME` | Yes | Login username for partner 1 |
| `USER1_DISPLAY_NAME` | Yes | Friendly display name for partner 1 |
| `USER1_PASSWORD` | Yes | Password for partner 1 |
| `USER1_ROLE` | Yes | `hombre` or `mujer` |
| `USER2_USERNAME` | Yes | Login username for partner 2 |
| `USER2_DISPLAY_NAME` | Yes | Friendly display name for partner 2 |
| `USER2_PASSWORD` | Yes | Password for partner 2 |
| `USER2_ROLE` | Yes | `hombre` or `mujer` (opposite of USER1) |

---

## API Reference

All authenticated endpoints require the header:

```
Authorization: Bearer <access_token>
```

Get an `access_token` via `POST /api/auth/token`.

### Authentication

| Method | URL | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/token` | — | Login. Body: `{ username, password }`. Returns `{ access_token, token_type, user }` |
| `GET` | `/api/auth/me` | ✓ | Current user info |

### Users

| Method | URL | Auth | Description |
|---|---|---|---|
| `GET` | `/api/users/` | — | Both users' display names and roles |

### Entries

| Method | URL | Auth | Description |
|---|---|---|---|
| `GET` | `/api/entries/` | — | All entries, newest first |
| `POST` | `/api/entries/` | ✓ | Create entry. Body: `{ title, description, date, categories }` |
| `GET` | `/api/entries/<id>` | — | Single entry with images |
| `PUT` | `/api/entries/<id>` | ✓ | Update entry (title, description, or your paragraph) |
| `DELETE` | `/api/entries/<id>` | ✓ | Delete entry and its images |
| `GET` | `/api/entries/pending/me` | ✓ | Entries where your paragraph is still missing |

### Images

| Method | URL | Auth | Description |
|---|---|---|---|
| `POST` | `/api/images/upload/<entry_id>` | ✓ | Upload image (multipart form: `file`, optional `caption`) |
| `PUT` | `/api/images/<id>/featured?entry_id=<id>` | ✓ | Set this image as featured for the entry |
| `DELETE` | `/api/images/<id>` | ✓ | Delete image |
| `GET` | `/api/images/<filename>` | — | Serve uploaded image file |

---

## Project Structure

```
nuestra-historia/
├── manage.py                    # Django CLI entry point
├── requirements.txt             # Python dependencies
├── pyproject.toml               # Poetry manifest
├── docker-compose.yml           # Docker (FastAPI variant)
├── .env                         # Secrets — not committed
├── db.sqlite3                   # Database — not committed, auto-created
├── uploads/                     # Uploaded images — not committed, auto-created
│
├── nuestra_historia/            # Django project package
│   ├── settings.py              # All Django configuration
│   ├── urls.py                  # Routes: /api/ → DRF, everything else → React SPA
│   └── wsgi.py                  # WSGI entry point for PythonAnywhere
│
├── api/                         # Django application
│   ├── models.py                # User, BlogEntry, EntryImage
│   ├── serializers.py           # DRF serializers
│   ├── views.py                 # All API views
│   ├── urls.py                  # /api/ URL patterns
│   ├── apps.py                  # App config — auto-seeds users on startup
│   ├── migrations/              # Database migrations
│   └── management/commands/
│       └── seed_users.py        # python manage.py seed_users
│
├── frontend/                    # React application
│   ├── src/
│   │   ├── App.jsx              # Router (Home, BlogEntry, Login)
│   │   ├── context/             # AuthContext — global login state
│   │   ├── api/                 # Axios client + per-resource helpers
│   │   ├── components/          # Navbar, modals, entry forms
│   │   └── pages/               # Home, BlogEntry, Login
│   ├── dist/                    # Built output — served by WhiteNoise
│   └── package.json
│
└── backend/                     # FastAPI implementation (Docker variant)
    └── app/
        ├── main.py
        ├── models.py
        ├── routers/
        └── ...
```

---

## Troubleshooting

### "DisallowedHost" error on PythonAnywhere

Your domain is not in `ALLOWED_HOSTS`. Edit `.env` and make sure the value matches exactly:

```dotenv
ALLOWED_HOSTS=yourusername.pythonanywhere.com
```

Then reload the web app.

### Images not loading after deployment

Check the **Static files** mapping in the PythonAnywhere Web tab. The URL `/api/images/` must map to the absolute path of your `uploads/` directory:

```
/home/yourusername/nuestra_historia/uploads
```

If the `uploads/` directory doesn't exist yet, create it:

```bash
mkdir -p ~/nuestra_historia/uploads
```

Then reload.

### Login fails / "user not found"

The users may not have been seeded. Run:

```bash
cd ~/nuestra_historia
python manage.py seed_users
```

Check that your `.env` variables are set correctly (no stray spaces around `=`).

### Frontend shows blank page or 404 on refresh

The SPA catch-all route may not be configured. This is handled by `nuestra_historia/urls.py` — make sure you haven't modified the catch-all pattern that serves `index.html` for all non-API routes.

### "Static files not found" in production

Run:

```bash
python manage.py collectstatic --noinput
```

Then reload the web app.

### Frontend build fails on PythonAnywhere

PythonAnywhere's free plan has limited memory. If `npm run build` runs out of memory:

```bash
cd frontend
node --max-old-space-size=512 node_modules/.bin/vite build
```

---

## How It Works

1. **One partner creates an entry** — gives it a title, description, date, and optional categories.
2. **Both partners see it as "pending"** — listed in each person's pending view until they've written their paragraph.
3. **Each writes their side independently** — the entry stores `paragraph_hombre` and `paragraph_mujer` separately.
4. **Images are uploaded** — multiple per entry; one can be marked as featured for the timeline view.
5. **The timeline grows** — a permanent record of shared moments, told from both sides.
