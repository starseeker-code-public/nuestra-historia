# Nuestra Historia — Deploy Guide

## Stack

- **Backend**: Django 4.2 + Django REST Framework + SimpleJWT
- **Frontend**: React 18 + Vite + Tailwind CSS
- **Database**: SQLite (managed by Django ORM)
- **Static files**: WhiteNoise (serves built React app with no extra config)

---

## Local development

### 1. Install Python dependencies

```bash
pip install -r requirements.txt
```

### 2. Configure environment

Edit `.env` at the project root. For local development set `DEBUG=True`:

```
SECRET_KEY=nH7xK2pL9mQ4rT8vW1yZ6bA3cD5eF0jGsU2kI8pRq
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

USER1_USERNAME=joaquin
USER1_DISPLAY_NAME=Joaquin
USER1_PASSWORD=Starseeker_14
USER1_ROLE=hombre

USER2_USERNAME=alexandra
USER2_DISPLAY_NAME=Damarys Alexandra
USER2_PASSWORD=25-04@EdSheeran
USER2_ROLE=mujer
```

### 3. Create the database and seed users

```bash
python manage.py migrate
python manage.py seed_users
```

> Users are also seeded automatically on every server startup from `.env` values,
> so changing a password or display name just requires restarting the server.

### 4. Start the Django API server

```bash
python manage.py runserver 8742
```

### 5. Start the React dev server (separate terminal)

```bash
cd frontend
npm install
npm run dev
```

Open **http://localhost:5173** in your browser.

The Vite dev server proxies all `/api` requests to Django on port `8742` — no CORS issues,
no extra config needed.

---

## PythonAnywhere deployment

### 1. Upload the project

Clone or upload the repo to your PythonAnywhere home directory, e.g. `/home/yourusername/nuestra_historia`.

### 2. Create a virtual environment

```bash
mkvirtualenv --python=python3.10 nuestra_historia
pip install -r requirements.txt
```

### 3. Build the frontend

```bash
cd frontend
npm install
npm run build
cd ..
```

This creates `frontend/dist/` which Django will serve automatically via WhiteNoise.

### 4. Configure `.env`

Edit `.env` and set your real domain and turn off debug:

```
SECRET_KEY=<your-secret-key>
DEBUG=False
ALLOWED_HOSTS=yourusername.pythonanywhere.com

USER1_USERNAME=joaquin
USER1_DISPLAY_NAME=Joaquin
USER1_PASSWORD=<your-password>

USER2_USERNAME=alexandra
USER2_DISPLAY_NAME=Damarys Alexandra
USER2_PASSWORD=<your-password>
```

### 5. Set up the database

```bash
python manage.py migrate
python manage.py seed_users
```

### 6. Collect static files

```bash
python manage.py collectstatic --noinput
```

### 7. Configure the PythonAnywhere web app

In the PythonAnywhere dashboard → **Web** tab:

| Field | Value |
|---|---|
| **Source code** | `/home/yourusername/nuestra_historia` |
| **Working directory** | `/home/yourusername/nuestra_historia` |
| **WSGI file** | edit it (see below) |
| **Virtualenv** | `/home/yourusername/.virtualenvs/nuestra_historia` |

**Edit the WSGI configuration file** (the link is on the Web tab). Replace its contents with:

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

### 8. Static files mapping (uploaded images only)

In the PythonAnywhere Web tab → **Static files** section, add:

| URL | Directory |
|---|---|
| `/api/images/` | `/home/yourusername/nuestra_historia/uploads` |

> React assets (`/assets/`) are handled by WhiteNoise automatically — no mapping needed.

### 9. Reload and open

Click **Reload** in the PythonAnywhere Web tab. Your app is live at:

```
https://yourusername.pythonanywhere.com
```

---

## Updating credentials or display names

Edit `.env`, then on PythonAnywhere:

```bash
python manage.py seed_users
```

And reload the web app. Locally, just restart the dev server.

---

## Project structure

```
nuestra_historia/
├── manage.py                        # Django entry point
├── requirements.txt                 # Python dependencies
├── .env                             # Secrets and user config (not committed)
├── db.sqlite3                       # Database (auto-created, not committed)
├── uploads/                         # User-uploaded images (not committed)
│
├── nuestra_historia/                # Django project package
│   ├── settings.py
│   ├── urls.py                      # Routes: /api/ + SPA catch-all
│   └── wsgi.py
│
├── api/                             # Django app
│   ├── models.py                    # User, BlogEntry, EntryImage
│   ├── serializers.py
│   ├── views.py                     # All API views
│   ├── urls.py                      # API URL patterns
│   ├── apps.py                      # Auto-seeds users on startup
│   ├── migrations/
│   └── management/commands/
│       └── seed_users.py            # python manage.py seed_users
│
└── frontend/                        # React app
    ├── src/                         # Source (edit this)
    ├── dist/                        # Built output (served by Django)
    └── package.json
```

## API endpoints

| Method | URL | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/token` | — | Login, returns `access_token` |
| GET | `/api/auth/me` | ✓ | Current user info |
| GET | `/api/users/` | — | Public list of users (names + roles) |
| GET | `/api/entries/` | — | All entries |
| POST | `/api/entries/` | ✓ | Create entry |
| GET | `/api/entries/pending/me` | ✓ | Entries where your paragraph is missing |
| GET | `/api/entries/<id>` | — | Single entry |
| PUT | `/api/entries/<id>` | ✓ | Update entry |
| DELETE | `/api/entries/<id>` | ✓ | Delete entry |
| POST | `/api/images/upload/<entry_id>` | ✓ | Upload image |
| PUT | `/api/images/<id>/featured?entry_id=<id>` | ✓ | Set featured image |
| DELETE | `/api/images/<id>` | ✓ | Delete image |
| GET | `/api/images/<filename>` | — | Serve uploaded image |
