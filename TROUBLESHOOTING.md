# Troubleshooting Guide

## Installation Issues

### "command not found: ree"

**Problem:** After `npm install -g ree`, the `ree` command doesn't work.

**Solutions:**

1. **Check Node.js version (most common)**
   ```bash
   node --version
   ```
   Must be 18.0.0 or higher. If older:
   ```bash
   npm install --global n  # Node version manager
   n latest
   ```

2. **Check npm installation**
   ```bash
   npm list -g ree
   ```
   Should show `ree@1.0.0`. If not installed:
   ```bash
   npm install -g ree@latest
   ```

3. **Check npm cache**
   ```bash
   npm cache clean --force
   npm install -g ree@latest
   ```

4. **Check PATH (advanced)**
   ```bash
   # Find where npm installs global packages
   npm config get prefix
   # Should show something like /usr/local or C:\Users\[username]\AppData\Roaming\npm
   # That directory should be in your PATH
   ```

5. **Try full path**
   ```bash
   # Find the binary
   which ree              # macOS/Linux
   where ree             # Windows PowerShell
   
   # Run directly
   /full/path/to/ree analyze app.apk
   ```

---

### npm ERR! code E403 Forbidden

**Problem:** Permission denied when installing globally.

**Solution 1: Use sudo** (quick fix)
```bash
sudo npm install -g ree
```

**Solution 2: Fix npm permissions** (recommended)
```bash
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
export PATH=~/.npm-global/bin:$PATH
npm install -g ree
```

---

### npm ERR! Could not resolve dependency

**Problem:** Installation fails with dependency error.

**Solution:**
```bash
npm cache clean --force
npm install -g ree@latest
```

If still failing:
```bash
npm install -g ree --legacy-peer-deps
```

---

## Build Issues

### "tsc: command not found"

**Problem:** TypeScript compiler not available.

**Solution:**
```bash
npm install typescript
npm run build
```

---

### "jest: command not found"

**Problem:** Jest test runner not available.

**Solution:**
```bash
npm install --save-dev jest
npm test
```

---

### Build fails with "Cannot find module"

**Problem:** Missing dependencies.

**Solution:**
```bash
npm install
npm run clean
npm run build
```

If still failing:
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

---

## Runtime Issues

### "ree: command recognized but fails to run"

**Problem:** CLI starts but crashes immediately.

**Solution 1: Rebuild packages**
```bash
npm run build
npm exec ree -- --help
```

**Solution 2: Check file permissions**
```bash
# Linux/macOS
chmod +x packages/core/dist/cli.js

# Then try again
ree --help
```

---

### Analysis fails: "APK Analyzer not available"

**Problem:** Command runs but analyzer module not found.

**Solution:**
```bash
npm install @ree/analyzer-apk
npm run build
ree analyze app.apk
```

---

### "Cannot read property of undefined"

**Problem:** JavaScript error during analysis.

**Likely cause:** APK file is corrupted or not a valid APK.

**Solution:**
```bash
# Verify it's a real APK (it's just a ZIP)
unzip -t your-app.apk

# If that fails, try a different APK
```

---

## APK Analysis Issues

### No findings detected

**Problem:** REE runs but finds 0 vulnerabilities.

**Possible reasons:**
1. App is actually secure
2. App is heavily obfuscated
3. Binary manifest couldn't be parsed

**Verify with a known vulnerable app:**
```bash
# Download a vulnerable test app or use a sample
ree analyze test-app.apk
```

If test app works, the issue is with your APK.

---

### Findings seem wrong

**Problem:** REE reports vulnerabilities that don't seem real.

**Remember:** REE is MVP. Some false positives are expected.

**For patterns like:**
- `api_key` detected but it's actually a string name
- `password` detected in a comment

These are pattern-based detections. Always verify findings with code review.

**Report issues:**
```
GitHub: https://github.com/Ankitajainkuniya/ReverseEngineerEverything/issues
Use the bug report template
```

---

### APK analysis hangs

**Problem:** `ree analyze app.apk` never finishes.

**Solution 1: Check APK size**
```bash
ls -lh your-app.apk
```
If >500MB, REE might be struggling. This is a known limitation.

**Solution 2: Kill and retry**
```bash
# Press Ctrl+C to stop
# Try with a smaller APK
```

---

## Claude Integration Issues

### Claude doesn't recognize REE skill

**Problem:** Trying to use REE in Claude but it's not available.

**Status:** Claude skill integration coming in v1.1.

**For now:** Manually share REE output with Claude in chat.

---

### Claude gives wrong explanations

**Problem:** Claude misinterprets findings.

**Remember:** Claude is AI, not perfect. Always verify critical findings yourself.

**Best practice:**
```
User: "Analyze app.apk"
Claude: "I found X vulnerability in Y"
You: "Let me verify this in the APK manifest..."
```

---

## Testing Issues

### "npm test" fails

**Problem:** Tests don't pass.

**Solution:**
```bash
# Install dev dependencies
npm install

# Try again
npm test

# Run specific test
npm run test:core
npm run test:apk
```

---

### Test output is confusing

**Solution:**
```bash
# Verbose output
npm test -- --verbose

# Watch mode (re-run on file change)
npm test -- --watch
```

---

## Performance Issues

### Analysis is very slow

**Possible causes:**
1. Large APK (>300MB)
2. Disk I/O bottleneck
3. System resource constrained

**Check APK size:**
```bash
ls -lh your-app.apk
```
If very large, this is normal. REE is optimized for typical APKs (20-150MB).

**Free up system resources:**
- Close other applications
- Check disk space: `df -h`
- Check memory: `free -h` (Linux) or Task Manager (Windows)

---

## Platform-Specific Issues

### macOS: "Operation not permitted"

**Problem:** Permission denied on macOS.

**Solution:**
```bash
sudo npm install -g ree
# or
chmod +x /usr/local/bin/ree
```

---

### Windows: "is not recognized as an internal or external command"

**Problem:** Windows PowerShell doesn't recognize `ree` command.

**Solution 1: Use npm directly**
```bash
npm exec ree -- analyze app.apk
```

**Solution 2: Update PATH**
1. Open System Properties (Win+Pause)
2. Advanced → Environment Variables
3. Edit PATH to include npm's global path:
   - Usually: `C:\Users\[username]\AppData\Roaming\npm`
4. Restart terminal

**Solution 3: Use cmd.exe instead of PowerShell**
```cmd
ree analyze app.apk
```

---

### Linux: Permission denied

**Problem:** Cannot execute `ree` on Linux.

**Solution:**
```bash
chmod +x ~/.npm-global/bin/ree
# or
sudo npm install -g ree
```

---

## Getting Help

### I'm still stuck

**Steps:**
1. Check FAQ.md for common questions
2. Search GitHub issues for similar problems
3. Open a new issue with:
   - What you're trying to do
   - Exact error message
   - Your system (OS, Node version, npm version)
   - Steps to reproduce

**Report issue:**
```
GitHub: https://github.com/Ankitajainkuniya/ReverseEngineerEverything/issues/new
Use the bug report template
```

---

## Debug Mode

### Enable verbose output

**For npm:**
```bash
npm --loglevel verbose install -g ree
```

**For CLI:**
```bash
# Add to see more details
ree analyze app.apk 2>&1 | tee debug.log
```

---

## Known Limitations (Not Bugs)

### APK manifest is not fully parsed
REE uses heuristic parsing of the binary AndroidManifest.xml. Full AXML parsing coming in v1.1.

### No DEX decompilation
REE doesn't decompile DEX to Java/Smali yet. That's planned for v1.1 with JADX integration.

### Only analyzes APKs (not AAB, XAPK, etc.)
Other formats coming in future versions.

### No dynamic analysis
REE is static analysis only. Dynamic analysis planned for future.

---

## Still Not Working?

1. ✅ Read this entire troubleshooting guide
2. ✅ Check FAQ.md
3. ✅ Search GitHub issues
4. ✅ Check system requirements (Node 18+)
5. 🆘 Open a GitHub issue with details

**Pro tip:** The more details you provide in your issue, the faster we can help!
```
- OS: [macOS/Linux/Windows]
- Node version: [output of `node --version`]
- npm version: [output of `npm --version`]
- Error message: [exact text]
- Steps to reproduce: [detailed steps]
- APK details: [if relevant]
```

---

**We're here to help! Don't hesitate to open an issue.** 🚀
