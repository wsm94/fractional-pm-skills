# Diagram Workflow: Mermaid as Source of Truth

> **Status**: Draft (updated with tested implementation)
> **Created**: January 2026
> **Last Updated**: January 2026
> **Purpose**: Define how diagrams are authored, workshopped, and version-controlled

---

## Principle

**Mermaid code in markdown is the source of truth.** Diagrams live alongside the documentation they describe, render on GitHub automatically, and are diffable in pull requests. When collaborative visual editing is needed (workshops, design sessions), diagrams are exported to a visual tool, edited there, then imported back to Mermaid.

---

## The Round-Trip Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    REPO (Source of Truth)                        │
│                                                                  │
│   documentation/                                                 │
│     ├── SPEC-001.md          ← contains ```mermaid blocks       │
│     ├── THRIFT-PRICING.md    ← contains ```mermaid blocks       │
│     └── ...                                                      │
└──────────────┬──────────────────────────────┬────────────────────┘
               │                              ▲
               │ EXPORT                       │ IMPORT
               │ /diagram export              │ /diagram import
               ▼                              │
┌──────────────────────────────────────────────┴────────────────────┐
│                     WORKSHOP TOOL                                 │
│                                                                    │
│   ┌────────────────────────────────────────────┐                   │
│   │              Excalidraw                    │                   │
│   │   VS Code extension or excalidraw.com      │                   │
│   │   Drag, drop, restructure, add notes       │                   │
│   └────────────────────────────────────────────┘                   │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

---

## Tool Chain

### Export: Mermaid → Workshop Tool

| Target | Method | Tooling | Fidelity |
|--------|--------|---------|----------|
| **Excalidraw** | Mermaid → `.excalidraw` file | **Playwright automation of [playground](https://mermaid-to-excalidraw.vercel.app/)** (see Tested Implementation below) | Good for flowcharts, other types render as image |
| **Image (PNG/SVG)** | Mermaid → rendered image | `mermaid-mcp-server` or Mermaid CLI (`mmdc`) | View-only, for presentations |

> **Important**: The `@excalidraw/mermaid-to-excalidraw` npm package **cannot run in Node.js** — it requires a real browser DOM with SVG support (`getBBox`). Even with jsdom, it fails. The only reliable automated path is Playwright browser automation of the official playground.

### Import: Workshop Tool → Mermaid

| Source | Method | Tooling | Fidelity |
|--------|--------|---------|----------|
| **Excalidraw** | `.excalidraw` → Mermaid code | **`@excalidraw-to-mermaid/core`** (npm, direct library import) | Preserves nodes, connections, labels. Loses subgraphs, styles, node IDs. |

> **Important**: The `@excalidraw-to-mermaid/cli` npm package has an oclif bug ("command flowchart not found") and does not work. Use the **`/core`** library directly instead.

---

## Recommended Workflow by Scenario

### Scenario 1: Solo editing (most common)

```
1. Edit Mermaid directly in markdown
2. Preview in VS Code (Mermaid preview extension) or GitHub
3. Commit
```

No export/import needed.

### Scenario 2: Workshop with visual editing (tested)

```
1. /diagram export  →  Extracts Mermaid from doc
2. Playwright launches browser, automates mermaid-to-excalidraw playground
3. Clipboard extraction produces .excalidraw file
4. Open .excalidraw in VS Code (Excalidraw extension) or excalidraw.com
5. Workshop: drag, drop, restructure, add notes
6. /diagram import  →  @excalidraw-to-mermaid/core converts back to Mermaid
7. Review diff (subgraphs/styles will be lost), manually restore if needed
8. Commit updated markdown
```

### Scenario 3: Cleanup after workshop

```
1. /diagram cleanup  →  Finds .excalidraw files that have been imported back to Mermaid
2. Lists candidates for deletion with their source markdown file
3. Confirm deletion
4. Commit removal of workshop artifacts
```

Workshop `.excalidraw` files are temporary artifacts. Once the edited diagram has been imported back into the markdown source of truth, the `.excalidraw` file should be deleted to avoid stale duplicates.

---

## Skill Design: `/diagram`

### Commands

```
/diagram export [options]
  --file <path>         Source markdown file (or auto-detect from context)
  --diagram <index>     Which diagram if file has multiple (default: all)
  --output <path>       Output file path (default: alongside source file)

/diagram import [options]
  --file <path>         Source .excalidraw file
  --target <path>       Target markdown file to update
  --diagram <index>     Which diagram to replace (default: append)
  --diff                Show diff before applying (default: true)

/diagram cleanup [options]
  --dry-run             List .excalidraw files without deleting (default: true)
  --path <dir>          Directory to scan (default: documentation/)
  Finds .excalidraw workshop artifacts and deletes them after confirmation
```

### Skill Implementation Approach

```
Phase 1: Export/import/cleanup (Excalidraw path) — TESTED
  - Extract Mermaid blocks from markdown files (regex on ```mermaid fences)
  - EXPORT: Playwright automates mermaid-to-excalidraw playground
    - Load playground URL
    - Fill textarea with Mermaid code
    - Click #render-excalidraw-btn
    - Click interactive canvas (canvas.excalidraw__canvas.interactive)
    - Ctrl+A, Ctrl+C to copy all elements
    - Read clipboard via navigator.clipboard.readText()
    - Parse JSON, wrap in .excalidraw format, save
  - IMPORT: Use @excalidraw-to-mermaid/core directly
    - excalidrawV2ToMermaidFlowChart("TB", excalidrawData)
    - Post-process: restore subgraphs, node IDs, and styles from original
    - Diff original vs imported Mermaid, present for review
  - CLEANUP: Find and delete .excalidraw files after successful import
    - Glob for *.excalidraw in documentation/
    - List candidates with confirmation prompt
    - Delete confirmed files

Phase 2: MCP integration
  - Use mermaid-mcp-server for rendering
  - Build custom MCP wrapping the Playwright export flow
```

### Required Dependencies (Tested)

```json
{
  "playwright": "^1.58.0",
  "@excalidraw-to-mermaid/core": "^0.1.0"
}
```

Additionally, Playwright's Chromium browser must be installed:

```bash
npx playwright install chromium
```

> **Do NOT use** these packages (they don't work as expected):
> - `@excalidraw/mermaid-to-excalidraw` — requires real browser DOM, fails in Node.js
> - `@excalidraw-to-mermaid/cli` — oclif command resolution bug, use `/core` instead
> - `mermaid-to-excalidraw-cli` — 404 errors on bundled assets

---

## MCP Servers to Install

For immediate use with Claude Code:

### 1. Mermaid Renderer

Renders Mermaid to PNG/SVG for preview and sharing.

```json
{
  "mcpServers": {
    "mermaid": {
      "command": "npx",
      "args": ["-y", "@peng-shawn/mermaid-mcp-server"]
    }
  }
}
```

### 2. Mermaid Validator

Validates syntax before committing.

```json
{
  "mcpServers": {
    "mermaid-validator": {
      "command": "npx",
      "args": ["-y", "mermaid-mcp-validator"]
    }
  }
}
```

---

## File Conventions

| File Type | Location | Purpose |
|-----------|----------|---------|
| `*.md` with mermaid blocks | `documentation/` | Source of truth |
| `*.excalidraw` | `documentation/workshops/` | Workshop artifacts (temporary) |
| `*.png` / `*.svg` | `documentation/diagrams/` | Rendered exports for presentations |

### Gitignore Recommendations

```gitignore
# Workshop artifacts (not source of truth)
# Uncomment if you don't want to track these
# documentation/workshops/*.excalidraw
```

---

## Tested Implementation Details

This section documents the actual tested round-trip flow (January 2026) to inform future skill development.

### Export: Mermaid → Excalidraw (via Playwright)

**Why Playwright?** The `@excalidraw/mermaid-to-excalidraw` library internally uses Mermaid to render SVG, then parses the SVG geometry (positions, sizes via `getBBox()`). This requires a real browser — jsdom does not implement SVG layout. Attempts to polyfill failed at multiple levels (DOMPurify, navigator setter, getBBox). The only reliable path is automating a real browser.

**Working script** (`convert-pw.mjs`):

```javascript
import { chromium } from "playwright";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const mermaidCode = fs.readFileSync(path.join(__dirname, "input.mmd"), "utf-8");
const outputPath = path.join(__dirname, "output.excalidraw");

const browser = await chromium.launch();
const context = await browser.newContext();
await context.grantPermissions(["clipboard-read", "clipboard-write"]);
const page = await context.newPage();

// Load the official mermaid-to-excalidraw playground
await page.goto("https://mermaid-to-excalidraw.vercel.app/", {
  waitUntil: "networkidle",
  timeout: 30000,
});

// Enter Mermaid code into the textarea
await page.locator("textarea").first().fill(mermaidCode);
await page.waitForTimeout(2000);

// Click render button (specific ID, not generic button selector)
await page.locator("#render-excalidraw-btn").click();
await page.waitForTimeout(5000);

// Click the INTERACTIVE canvas (not the static one beneath it)
const interactiveCanvas = page.locator("canvas.excalidraw__canvas.interactive");
await interactiveCanvas.click({ force: true });
await page.waitForTimeout(500);

// Select all elements and copy to clipboard
await page.keyboard.press("Control+a");
await page.waitForTimeout(500);
await page.keyboard.press("Control+c");
await page.waitForTimeout(1000);

// Read clipboard — Excalidraw copies elements as JSON
const clipboardText = await page.evaluate(async () => {
  try {
    return await navigator.clipboard.readText();
  } catch (e) {
    return "CLIPBOARD_ERROR: " + e.message;
  }
});

// Parse and save as .excalidraw file
const parsed = JSON.parse(clipboardText);
const excalidrawData = {
  type: "excalidraw",
  version: 2,
  source: "mermaid-to-excalidraw",
  elements: parsed.elements || [],
  appState: { viewBackgroundColor: "#ffffff", gridSize: null },
  files: parsed.files || {},
};
fs.writeFileSync(outputPath, JSON.stringify(excalidrawData, null, 2));
await browser.close();
```

**Key implementation notes for the skill:**
- `context.grantPermissions(["clipboard-read", "clipboard-write"])` is required for clipboard access
- Target `#render-excalidraw-btn` specifically — generic button selectors match 95+ example buttons on the page
- Target `canvas.excalidraw__canvas.interactive` — there are two canvases stacked; the static one blocks clicks
- Use `{ force: true }` on the canvas click
- Allow generous `waitForTimeout` between steps (the playground needs time to render)
- The clipboard JSON contains an `elements` array and optionally `files` — wrap in standard `.excalidraw` format
- Test produced 144 elements / ~102KB from a moderately complex flowchart

### Import: Excalidraw → Mermaid (via core library)

**Working script** (`convert-back.mjs`):

```javascript
import { excalidrawV2ToMermaidFlowChart } from "@excalidraw-to-mermaid/core";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const excalidrawData = JSON.parse(
  fs.readFileSync(path.join(__dirname, "input.excalidraw"), "utf-8")
);

const mermaidCode = excalidrawV2ToMermaidFlowChart("TB", excalidrawData);
fs.writeFileSync(path.join(__dirname, "output.mmd"), mermaidCode);
```

**Key implementation notes for the skill:**
- The function is `excalidrawV2ToMermaidFlowChart` (not `toMermaid` or other names)
- First argument is direction: `"TB"`, `"LR"`, `"BT"`, `"RL"`
- Second argument is the parsed `.excalidraw` JSON object
- This runs in pure Node.js with no browser needed
- Fast execution (< 1 second)

### Round-Trip Fidelity Analysis

| Aspect | Preserved? | Notes |
|--------|-----------|-------|
| **Nodes (boxes)** | Yes | All nodes survive the round-trip |
| **Connections (arrows)** | Yes | All arrow connections preserved |
| **Labels (text)** | Yes | Node and edge labels preserved |
| **Shape types** | Yes | Rectangles, diamonds (decisions) maintained |
| **Subgraphs** | **No** | Groupings are flattened — all nodes become top-level |
| **Node IDs** | **No** | Original IDs (A, B, C) are replaced with random words (SURE, FAIR, ZOO) |
| **Style directives** | **No** | `style FilterPipeline fill:#f9f` etc. are lost |
| **Multiline text** | Partial | `\n` in labels may not survive cleanly |

**Recommendation for the skill**: After importing back to Mermaid, the skill should offer to restore subgraphs and styles from the original Mermaid source. This can be done by:
1. Keeping the original `.mmd` as reference
2. Matching nodes by label text (since IDs change)
3. Re-wrapping matched nodes in their original subgraph blocks
4. Re-appending style directives

### Failed Approaches (for reference)

These approaches were tested and **do not work**. Do not retry them.

| Approach | Error | Why |
|----------|-------|-----|
| `@excalidraw/mermaid-to-excalidraw` in Node.js | `DOMPurify.addHook is not a function` | Requires browser DOM |
| Above + jsdom polyfill | `text2.getBBox is not a function` | jsdom doesn't implement SVG layout |
| `mermaid-to-excalidraw-cli` (npx) | 404 errors on React/Excalidraw assets | CLI's bundled server can't find its own resources |
| `@excalidraw-to-mermaid/cli` | `command flowchart not found` | oclif command resolution bug |
| React fiber tree extraction | Could not locate Excalidraw state | Unreliable internal API |

---

## Known Limitations

1. **Excalidraw round-trip is lossy** (confirmed by testing): Subgraphs are flattened, node IDs are randomized, and style directives are dropped. The skill must implement post-import restoration from the original source. Always diff before committing.

2. **Export requires a real browser**: The Mermaid → Excalidraw conversion cannot run headlessly in Node.js. Playwright with Chromium is required (~300MB install). This adds latency and a network dependency (the playground is hosted at vercel.app).

3. **Flowcharts only**: The Excalidraw converters primarily support flowchart/graph diagrams. Sequence diagrams, Gantt charts, etc. may render as images in Excalidraw rather than editable shapes.

4. **No real-time sync**: This is a batch workflow. There's no live sync between the markdown source and a visual editor.

5. **Playground dependency**: The export relies on `mermaid-to-excalidraw.vercel.app` being available. If the playground goes down or changes its DOM structure, the Playwright script will break. A future improvement would be to self-host the playground or find a way to use the library in a minimal browser context.

6. **macOS/Linux keyboard shortcuts**: The tested scripts use `Control+a` / `Control+c`. On macOS, these should be `Meta+a` / `Meta+c`. The skill should detect the platform and adjust accordingly.

---

## References

### Tested and Working
- [mermaid-to-excalidraw playground](https://mermaid-to-excalidraw.vercel.app/) - Web playground automated via Playwright for export
- [@excalidraw-to-mermaid/core](https://www.npmjs.com/package/@excalidraw-to-mermaid/core) - Node.js library for import (use this, not the CLI)
- [Playwright](https://playwright.dev/) - Browser automation for the export step
- [Excalidraw VS Code Extension](https://marketplace.visualstudio.com/items?itemName=pomdtr.excalidraw-editor) - Edit .excalidraw files in VS Code

### Reference (not directly used in automation)
- [mermaid-to-excalidraw](https://github.com/excalidraw/mermaid-to-excalidraw) - Official library (browser-only, cannot run in Node.js)
- [Mermaid MCP Server](https://github.com/peng-shawn/mermaid-mcp-server) - MCP server for rendering
- [Mermaid Live Editor](https://mermaid.live) - Browser-based Mermaid editing

### Do Not Use
- `@excalidraw-to-mermaid/cli` - oclif command resolution bug, use `/core` instead
- `mermaid-to-excalidraw-cli` - 404 errors on bundled assets
- `excalidraw-converter` (Go CLI) - untested, may work but npm `/core` is simpler
