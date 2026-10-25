# Installation Guide

Multiple ways to install ReverseEngineerEverything, depending on your setup.

## Quick Install (Recommended)

### NPM (Easiest)

```bash
npm install -g ree
ree --help
```

**Requirements:** Node.js 18.0.0 or higher

**Verify:**
```bash
node --version  # Should be v18.0.0 or higher
npm --version   # Any recent version
```

**Time:** 30 seconds

---

## Alternative Installation Methods

### Docker (No Node.js Required)

**Advantages:**
- No Node.js installation needed
- Runs in isolated container
- Same results everywhere

**Install Docker:**
- https://www.docker.com/products/docker-desktop (macOS/Windows)
- https://docs.docker.com/install/ (Linux)

**Run REE:**
```bash
# Pull the image
docker pull ankitajainkuniya/ree:latest

# Or build locally
docker build -t ree .

# Analyze an APK
docker run -v $(pwd)/app.apk:/workspace/app.apk ree analyze /workspace/app.apk
```

**Time:** 2 minutes (first run) + 30s (subsequent)

---

### Docker Compose (Easiest Docker)

**Advantages:**
- Even simpler than docker run
- Configuration saved in file
- Perfect for batch processing

**Install Docker & Compose:**
- https://www.docker.com/products/docker-desktop (includes Compose)

**Setup:**
```bash
# Prepare directories
mkdir apks results

# Copy your APK
cp your-app.apk apks/

# Edit docker-compose.yml to change app.apk filename
# Then run:
docker-compose run ree analyze apks/your-app.apk

# Results available in ./results/
```

**Time:** 3 minutes (first run)

---

### Build from Source

**Advantages:**
- Latest unreleased features
- Contribute changes
- Full control

**Install:**
```bash
# Clone repository
git clone https://github.com/Ankitajainkuniya/ReverseEngineerEverything.git
cd ReverseEngineerEverything

# Install dependencies
npm install

# Build packages
npm run build

# Install globally
npm install -g .

# Or run directly
npm exec ree -- analyze app.apk
```

**Requirements:** Node.js 18+, git

**Time:** 2-3 minutes

---

## Installation by Platform

### macOS

**Option 1: npm** (Recommended)
```bash
# Install Node.js first (if needed)
# https://nodejs.org/ or brew install node

npm install -g ree
ree --help
```

**Option 2: Homebrew** (Coming soon)
```bash
# Will be available as:
# brew install ree
```

**Option 3: Docker**
```bash
# Install Docker Desktop from https://www.docker.com/products/docker-desktop
docker run -v $(pwd):/workspace -w /workspace ankitajainkuniya/ree:latest analyze app.apk
```

---

### Linux

**Option 1: npm** (Recommended)
```bash
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install nodejs npm

# Fedora/RHEL
sudo yum install nodejs npm

# Then install REE
npm install -g ree
```

**Option 2: Using nvm** (Node Version Manager)
```bash
# Install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Install Node.js
nvm install 20
nvm use 20

# Install REE
npm install -g ree
```

**Option 3: Docker**
```bash
# Install Docker
# https://docs.docker.com/install/

docker run -v $(pwd):/workspace -w /workspace ankitajainkuniya/ree:latest analyze app.apk
```

---

### Windows

**Option 1: npm** (Recommended)

1. Install Node.js: https://nodejs.org/
2. Open PowerShell or Command Prompt
3. Run:
   ```bash
   npm install -g ree
   ree --help
   ```

**Option 2: Windows Package Manager**
```powershell
# If you use Windows Package Manager (winget)
# Coming soon!
winget install ree
```

**Option 3: Chocolatey**
```powershell
# If you use Chocolatey
# Coming soon!
choco install ree
```

**Option 4: Docker Desktop**
```powershell
# Install Docker Desktop for Windows
# https://www.docker.com/products/docker-desktop

docker run -v C:\path\to\apk:/workspace/app.apk ree analyze /workspace/app.apk
```

**Option 5: WSL2** (Windows Subsystem for Linux)
```bash
# Install WSL2: https://docs.microsoft.com/en-us/windows/wsl/

# Then use Linux instructions above
npm install -g ree
```

---

## Verify Installation

After installing, verify REE works:

```bash
# Check version
ree --help

# Should output:
# ReverseEngineerEverything (REE) v1.0.0
# ...

# List available analyzers
ree list

# Should show:
# 📦 Available Analyzers:
#   apk-analyzer (v1.0.0)
```

---

## Upgrade

### npm

```bash
npm install -g ree@latest
```

### Docker

```bash
# Pull latest image
docker pull ankitajainkuniya/ree:latest

# Or rebuild
docker build --no-cache -t ree .
```

### From Source

```bash
git pull origin main
npm install
npm run build
npm install -g .
```

---

## Uninstall

### npm

```bash
npm uninstall -g ree
```

### Docker

```bash
# Remove image
docker rmi ree:latest
```

### From Source

```bash
npm uninstall -g /path/to/ReverseEngineerEverything
```

---

## Troubleshooting Installation

### "npm: command not found"

**Problem:** npm not installed or not in PATH

**Solution:**
```bash
# Install Node.js from https://nodejs.org/
# Then verify:
node --version
npm --version

# Should show versions, not "command not found"
```

### "ree: command not found"

**Problem:** npm installed REE but command not found

**Solution:** See TROUBLESHOOTING.md - "command not found: ree"

### Permission denied

**Problem:** Cannot install globally due to permissions

**Solution:**
```bash
# Option 1: Use sudo
sudo npm install -g ree

# Option 2: Fix npm permissions
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
export PATH=~/.npm-global/bin:$PATH
npm install -g ree
```

### Node version too old

**Problem:** Have Node 16 or older, but need 18+

**Solution:**
```bash
# Update Node.js
# macOS: brew install node
# Linux: Use nvm (see above)
# Windows: Download from https://nodejs.org/

# Verify:
node --version  # Should be v18.0.0 or higher
```

---

## What Gets Installed

### npm
- Binary: `~/.npm-global/bin/ree` (macOS/Linux) or `%APPDATA%\npm\ree.cmd` (Windows)
- Modules: `~/.npm-global/lib/node_modules/ree` or equivalent

### Docker
- Image: `ankitajainkuniya/ree:latest` (~500MB)
- Container: Optional, created on-demand

### From Source
- Everything in: `/path/to/ReverseEngineerEverything`
- Installed globally via npm link

---

## Choosing Installation Method

| Method | Time | Requirements | Best For |
|--------|------|--------------|----------|
| **npm** | 30s | Node 18+ | Most people |
| **Docker** | 2min | Docker | Isolated/CI/CD |
| **Docker Compose** | 3min | Docker Compose | Batch analysis |
| **From Source** | 3min | Node 18+, git | Contributors |

**Recommendation:** Use **npm** unless you have Docker already installed.

---

## System Requirements

### Minimum

- **OS:** macOS, Linux, or Windows
- **RAM:** 512MB (1GB recommended)
- **Disk:** 500MB free

### Recommended

- **OS:** Latest version of your platform
- **RAM:** 4GB+
- **Disk:** 2GB+ free SSD
- **Internet:** For initial npm install

### Node.js

- **Minimum:** 18.0.0
- **Recommended:** 20.x or higher

---

## Getting Help

If installation fails:

1. ✅ Verify Node.js: `node --version`
2. ✅ Clear cache: `npm cache clean --force`
3. ✅ Try again: `npm install -g ree@latest`
4. ✅ Check TROUBLESHOOTING.md
5. 🆘 Open GitHub issue with:
   - OS (macOS/Linux/Windows)
   - Node version: `node --version`
   - Error message: exact text
   - Installation method used

---

**Installation complete!** Now proceed to QUICK_START.md to analyze your first APK.
