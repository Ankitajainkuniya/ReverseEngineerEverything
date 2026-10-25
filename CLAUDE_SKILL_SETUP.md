# Using REE as a Claude Skill

Guide to integrate ReverseEngineerEverything with Claude Code, Cursor, or Claude.ai.

## Quick Setup for Cursor

### Step 1: Install REE

```bash
npm install -g ree
```

Verify:
```bash
ree --help
```

### Step 2: Create Custom Instruction in Cursor

In Cursor settings, add this to your system prompt:

```
You have access to a reverse engineering tool called "ree" (ReverseEngineerEverything).

When a user asks you to analyze an Android APK:
1. Tell them to provide the APK file or path
2. Run: ree analyze [path]
3. Explain the findings to them

Skill details:
- Name: ReverseEngineerEverything (REE)
- Commands:
  - ree analyze <file>    # Analyze APK for vulnerabilities
  - ree list             # List available analyzers
  - ree --help           # Show help

When explaining findings, translate technical details into clear security implications.
```

### Step 3: Use It

Ask Claude in Cursor:
```
Analyze /path/to/app.apk and explain the security issues
```

Claude will:
1. ✅ Call `ree analyze /path/to/app.apk`
2. ✅ Get the findings
3. ✅ Explain them in plain English

---

## Setup for Claude Code

### Step 1: Install REE

```bash
npm install -g ree
```

### Step 2: Create a Helper Script

Create `analyze-apk.sh`:
```bash
#!/bin/bash
# Helper script to analyze APK with REE

APK_PATH=$1

if [ -z "$APK_PATH" ]; then
  echo "Usage: analyze-apk.sh <path-to-apk>"
  exit 1
fi

if [ ! -f "$APK_PATH" ]; then
  echo "Error: File not found: $APK_PATH"
  exit 1
fi

echo "🔍 Analyzing $APK_PATH..."
ree analyze "$APK_PATH"
```

Make it executable:
```bash
chmod +x analyze-apk.sh
```

### Step 3: Use in Claude Code

Ask Claude:
```
Can you analyze this APK for me? Here's the path: /path/to/app.apk
```

Claude can then:
1. Run the helper script
2. Parse the output
3. Explain findings

---

## Setup for Claude.ai (Web)

### Manual Integration (Current)

Since Claude.ai doesn't yet have local tool execution, use this workflow:

**Step 1: Analyze locally**
```bash
ree analyze app.apk > analysis-results.txt
```

**Step 2: Share with Claude**
```
In Claude.ai:
I have an Android app security analysis. Can you explain these findings?

[paste contents of analysis-results.txt]
```

**Step 3: Claude explains**
Claude will interpret the findings and explain security implications.

---

## Example: Full Workflow

### Your Terminal
```bash
$ ree analyze Instagram.apk
🔍 Analyzing Instagram.apk...

============================================================
📊 Analysis Complete
============================================================

File: Instagram.apk
Analyzer: apk-analyzer
Timestamp: 2024-10-25T12:34:56.789Z

📈 Summary:
   Total findings: 5
   🔴 Critical: 1
   🟠 High: 2
   🟡 Medium: 2

1. App is Debuggable
   Severity: CRITICAL
   ...

[save to file]
$ cat analysis-results.txt > clipboard
```

### In Cursor/Claude Code
```
User: Analyze these findings from Instagram.apk

[paste analysis output]

Claude:
"I can see several security concerns here:

1. **Debuggable Build (CRITICAL)** - This allows attackers to use Android 
   Debug Bridge to inspect memory and intercept calls...
   
2. **Dangerous Permissions (HIGH)** - The app requests access to..."
```

---

## Future: Official Claude Skill

When REE becomes an official Claude skill, you'll be able to:

```
In Claude.ai:
/install-skill ree

Then simply:
User: Analyze app.apk
Claude: [automatically calls REE, explains results]
```

---

## How to Request Official Skill Support

Once Claude publishes their skill registry, we'll submit REE officially. Steps:

1. **Format**: We have `manifest.yaml` ✅
2. **Documentation**: In this file ✅
3. **Submit to**: Claude's skill registry (process TBD)
4. **Wait for approval**: Usually 1-2 weeks
5. **Published**: Available in Claude.ai

---

## Troubleshooting

### "ree: command not found"

Make sure REE is installed globally:
```bash
npm install -g ree
which ree  # Should show path
```

### Claude doesn't call the tool

In Cursor, make sure your system prompt mentions REE as an available tool.

### Want to try right now?

1. ✅ Install: `npm install -g ree`
2. ✅ Run: `ree analyze app.apk`
3. ✅ Share: Paste output in Claude
4. ✅ Get explanations: Claude explains findings

---

## API for Custom Integration

If you want to build your own Claude integration:

```typescript
// Import REE functions directly
import { analyzeTarget, listSupportedFormats } from '@ree/skill-claude';

// Use in your own Claude skill
const result = await analyzeTarget('/path/to/app.apk');
console.log(result);  // Formatted findings

// List available analyzers
const formats = listSupportedFormats();
console.log(formats);
```

---

## Next Steps

### Short term (Now)
- ✅ Use REE locally with manual Claude sharing
- ✅ Set up as custom instruction in Cursor
- ✅ Integrate with your workflow

### Medium term (v1.1)
- 🔜 Create Claude skill package
- 🔜 Submit to Claude for official registration
- 🔜 Formal skill integration

### Long term (v2.0)
- 🔜 Official skill in Claude.ai
- 🔜 One-click installation
- 🔜 Seamless tool calling

---

## Questions?

**How to integrate REE with your tools:**
1. Local CLI: `npm install -g ree`
2. Cursor: Add to system prompt
3. Claude.ai: Share output in chat
4. Custom: Use SDK functions

**Want official skill support?**
- Will be available when Claude opens skill registry
- REE is prepared and ready to submit
