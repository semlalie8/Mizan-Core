# 🐳 Mizan Core Docker Guide

This project provides one-click commands to start and stop the entire infrastructure (PostgreSQL, FastAPI Backend, and React Dashboard).

## 🚀 Quick Start (All Platforms)

Choose the command corresponding to your terminal:

### 🐧 WSL / Linux / macOS (Bash)
```bash
# Start the platform
./start-docker.sh

# Stop the platform
./stop-docker.sh
```
*Note: Run `chmod +x *.sh` once to make the scripts executable.*

### 💻 Windows CMD (Command Prompt)
```cmd
# Start the platform
start-docker

# Stop the platform
stop-docker
```

### 🟦 Windows PowerShell
```powershell
# Start the platform
.\start-docker.ps1

# Stop the platform
.\stop-docker.ps1
```

### 📦 npm (Any Terminal)
```bash
# Start the platform
npm run docker:start

# Stop the platform
npm run docker:stop
```

---

## 📍 Access Points

| Service | URL | Description |
| :--- | :--- | :--- |
| **Frontend** | [http://localhost:5173](http://localhost:5173) | Mizan Core Dashboard |
| **Backend API** | [http://localhost:8000/docs](http://localhost:8000/docs) | Interactive Swagger UI |
| **Postgres DB** | `localhost:5432` | Raw Database Access |

---

## 🛠️ Manual Docker Commands

If you prefer to use standard Docker commands:

*   **Build & Start:** `docker-compose up --build -d`
*   **Stop:** `docker-compose down`
*   **View Logs:** `docker-compose logs -f`

---

## 🛠️ Troubleshooting

### 🌐 DNS Resolution Issue (`no such host`)
If you see an error like `dial tcp: lookup registry-1.docker.io: no such host`, it's likely a DNS issue in WSL2.

**Solution 1: Restart Docker Desktop**
1. Right-click the Docker icon in your system tray.
2. Select **Restart Docker Desktop**.

**Solution 2: Restart WSL**
Run this in PowerShell:
```powershell
wsl --shutdown
```
Then restart your terminal and run the start command again.

**Solution 3: Manual DNS (WSL only)**
If the above fails, run this in your WSL terminal:
```bash
sudo sh -c "echo 'nameserver 8.8.8.8' > /etc/resolv.conf"
```
