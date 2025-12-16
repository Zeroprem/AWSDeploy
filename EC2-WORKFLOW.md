# EC2 Deployment Workflow

## 📖 EC2 Deploy Script Explained (`ec2-deploy.sh`)

This document explains the deployment script step-by-step with reasons for each section.

---

## 🔧 Script Breakdown

### 1. Script Header (Lines 1-5)
```bash
#!/bin/bash
echo "=========================================="
echo "  Employee Management System - EC2 Setup"
echo "=========================================="
```

**Reason:**
- `#!/bin/bash` - Shebang line tells Linux to use Bash shell interpreter
- Echo statements display a welcome banner for visual feedback

---

### 2. Install Dependencies (Lines 7-21)
```bash
sudo yum update -y
sudo yum install java-17-amazon-corretto -y
sudo yum install maven -y
sudo yum install nginx -y
```

**Reason:**
| Package | Purpose |
|---------|---------|
| `yum update` | Updates all system packages for security patches |
| `java-17-amazon-corretto` | Required to run Spring Boot JAR file |
| `maven` | Required to build the Spring Boot project |
| `nginx` | Web server to serve frontend & proxy API requests |

---

### 3. Set Working Directory (Lines 23-25)
```bash
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"
```

**Reason:**
- Gets the absolute path of where the script is located
- Ensures all relative paths work correctly regardless of where you run the script from
- `$0` = script name, `dirname` = directory part, `pwd` = full path

---

### 4. Build Backend (Lines 27-31)
```bash
cd backend
mvn clean package -DskipTests
cd ..
```

**Reason:**
| Command | Purpose |
|---------|---------|
| `mvn clean` | Removes old build files from `target/` folder |
| `package` | Compiles Java code and creates executable JAR file |
| `-DskipTests` | Skips running tests for faster build |

**Output:** `backend/target/management-1.0.0.jar`

---

### 5. Deploy Frontend (Lines 33-39)
```bash
sudo mkdir -p /var/www/html
sudo rm -rf /var/www/html/*
sudo cp -r frontend/dist/employee-management/browser/* /var/www/html/
sudo chmod -R 755 /var/www/html
sudo chown -R nginx:nginx /var/www/html
```

**Reason:**
| Command | Purpose |
|---------|---------|
| `mkdir -p` | Creates web directory if it doesn't exist |
| `rm -rf` | Clears old frontend files |
| `cp -r` | Copies pre-built Angular files to web root |
| `chmod 755` | Sets read/execute permissions for web access |
| `chown nginx:nginx` | Sets ownership so nginx can read files |

---

### 6. Nginx Configuration (Lines 41-60)
```nginx
server {
    listen 80;
    server_name _;

    location / {
        root /var/www/html;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://localhost:8080/api/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

**Reason:**
| Directive | Purpose |
|-----------|---------|
| `listen 80` | Serves HTTP traffic on port 80 |
| `location /` | Serves Angular frontend static files |
| `try_files ... /index.html` | Enables Angular SPA routing (all routes go to index.html) |
| `location /api/` | Proxies `/api/*` requests to Spring Boot on port 8080 |
| `proxy_set_header` | Forwards client IP and host info to backend |

---

### 7. Backend Systemd Service (Lines 71-88)
```ini
[Unit]
Description=Employee Management App
After=network.target

[Service]
Type=simple
User=ec2-user
WorkingDirectory=/home/ec2-user/AWSDeploy/backend
ExecStart=/usr/bin/java -jar /home/ec2-user/AWSDeploy/backend/target/management-1.0.0.jar
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

**Reason:**
| Directive | Purpose |
|-----------|---------|
| `After=network.target` | Starts after network is available |
| `User=ec2-user` | Runs as ec2-user (not root for security) |
| `ExecStart` | Command to start the Java application |
| `Restart=always` | Auto-restart if application crashes |
| `RestartSec=10` | Wait 10 seconds before restart |
| `WantedBy=multi-user.target` | Start on system boot |

---

### 8. Start Services (Lines 90-94)
```bash
sudo systemctl daemon-reload
sudo systemctl stop employee-app 2>/dev/null
sudo systemctl start employee-app
sudo systemctl enable employee-app
```

**Reason:**
| Command | Purpose |
|---------|---------|
| `daemon-reload` | Reloads systemd to recognize new/changed service files |
| `stop` | Stops existing instance (if running) |
| `start` | Starts the backend application |
| `enable` | Enables auto-start on system boot |

---

## 📊 Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        EC2 Instance                          │
│                                                              │
│  ┌──────────────┐         ┌──────────────────────────────┐  │
│  │   Browser    │ ──80──► │         NGINX                │  │
│  │   Request    │         │                              │  │
│  └──────────────┘         │  /        → /var/www/html    │  │
│                           │  /api/*   → localhost:8080   │  │
│                           └──────────────────────────────┘  │
│                                          │                   │
│                                          ▼                   │
│                           ┌──────────────────────────────┐  │
│                           │     Spring Boot (Port 8080)  │  │
│                           │     management-1.0.0.jar     │  │
│                           └──────────────────────────────┘  │
│                                          │                   │
│                                          ▼                   │
│                           ┌──────────────────────────────┐  │
│                           │      AWS RDS MySQL           │  │
│                           │      (Port 3306)             │  │
│                           └──────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## 🚀 Deployment Flow

```
1. Install Dependencies
   └── Java 17 + Maven + Nginx

2. Build Backend
   └── mvn package → management-1.0.0.jar

3. Deploy Frontend
   └── Copy dist/* → /var/www/html/

4. Configure Nginx
   └── Serve frontend + Proxy API

5. Create Backend Service
   └── systemd service for auto-restart

6. Start Everything
   └── nginx + employee-app running
```

---

## 🔧 Useful Commands

```bash
# Check backend status
sudo systemctl status employee-app

# View backend logs
sudo journalctl -u employee-app -f

# Restart backend
sudo systemctl restart employee-app

# Check nginx status
sudo systemctl status nginx

# Test nginx config
sudo nginx -t

# Restart nginx
sudo systemctl restart nginx
```

---

## 🌐 Access URLs

| Service | URL |
|---------|-----|
| Frontend | `http://<EC2-PUBLIC-IP>` |
| Backend API | `http://<EC2-PUBLIC-IP>:8080/api/employees` |

---

## 📁 File Locations on EC2

| Component | Location |
|-----------|----------|
| Frontend Files | `/var/www/html/` |
| Backend JAR | `/home/ec2-user/AWSDeploy/backend/target/management-1.0.0.jar` |
| Nginx Config | `/etc/nginx/conf.d/employee.conf` |
| Backend Service | `/etc/systemd/system/employee-app.service` |
| Application Logs | `journalctl -u employee-app` |

---

*Created by Premchand Tarange*

