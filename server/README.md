# PHP API (server)

This folder contains a minimal PHP API skeleton to support the frontend during development.

Files:

- `index.php` — basic router and health endpoint
- `api/users.php` — example users endpoint (GET/POST)
- `db/schema.sql` — suggested SQL schema for MySQL

To run a quick local PHP server (development) from this folder:

PowerShell:

```powershell
cd server
php -S localhost:8000
```

You will then be able to access `http://localhost:8000/index.php`.
