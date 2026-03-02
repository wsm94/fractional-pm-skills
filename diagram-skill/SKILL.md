---
name: diagram
description: "Manage Mermaid diagrams in markdown files: export to Excalidraw for visual workshop editing, import back to Mermaid, and clean up temporary .excalidraw artifacts. This skill should be used when the user wants to convert diagrams between Mermaid and Excalidraw formats, run a visual editing workshop on existing diagrams, or clean up .excalidraw files after re-importing to Mermaid. Triggers include '/diagram export', '/diagram import', '/diagram cleanup', or requests like 'export this diagram to excalidraw', 'convert this excalidraw back to mermaid', 'clean up workshop files'."
---

# Diagram

Mermaid code in markdown is the source of truth for all diagrams. This skill provides a round-trip workflow for exporting Mermaid diagrams to Excalidraw for visual editing, importing them back, and cleaning up temporary artifacts.

## Commands

### `/diagram export`

Export Mermaid diagrams from a markdown file to `.excalidraw` format for visual editing.

**Arguments (parsed from user request):**
- `file` — Source markdown file path (or auto-detect from current context)
- `diagram` — Which diagram if file has multiple (1-indexed, default: all)
- `output` — Output file path (default: alongside source file, same name with `.excalidraw` extension)

**Workflow:**

1. Read the source markdown file
2. Extract Mermaid code blocks using regex: ` ```mermaid\n([\s\S]*?)``` `
3. If multiple diagrams exist and no index specified, ask the user which to export
4. Write the extracted Mermaid code to a temporary `.mmd` file
5. Run the export script: `node <skill-path>/scripts/export-to-excalidraw.mjs <input.mmd> <output.excalidraw>`
6. Delete the temporary `.mmd` file
7. Report the output path and element count to the user

**Critical implementation notes:**
- The export script requires `playwright` and Chromium to be installed. If not present, run: `npm install playwright && npx playwright install chromium` (install in the skill's `scripts/` directory or a shared location)
- The script automates the mermaid-to-excalidraw playground at `https://mermaid-to-excalidraw.vercel.app/` — it needs network access
- Do NOT attempt to use `@excalidraw/mermaid-to-excalidraw` as a Node.js library — it requires a real browser DOM and fails with jsdom
- Do NOT use `mermaid-to-excalidraw-cli` — it has 404 errors on bundled assets
- On macOS, the script automatically uses `Meta` instead of `Control` for keyboard shortcuts

### `/diagram import`

Import an `.excalidraw` file back to Mermaid code and update the source markdown.

**Arguments (parsed from user request):**
- `file` — Source `.excalidraw` file path
- `target` — Target markdown file to update
- `diagram` — Which diagram to replace (1-indexed, default: append)
- `diff` — Show diff before applying (default: true)

**Workflow:**

1. Read the `.excalidraw` file
2. Run the import script: `node <skill-path>/scripts/import-from-excalidraw.mjs <input.excalidraw> <output.mmd> [direction]`
   - Direction is typically `TB` (top-to-bottom) — infer from the original diagram if possible
3. Read the generated `.mmd` output
4. **Post-processing — restore lost structure from original:**
   - Read the original Mermaid block from the target markdown
   - Match imported nodes to original nodes by label text (IDs will have changed)
   - Re-wrap matched nodes in their original `subgraph` blocks
   - Re-append any `style` directives from the original
   - Preserve any new nodes/connections added during the workshop
5. Show a diff between the original and imported Mermaid
6. Ask the user to confirm before replacing
7. Update the markdown file with the new Mermaid block
8. Delete the temporary `.mmd` file

**Critical implementation notes:**
- Do NOT use `@excalidraw-to-mermaid/cli` — it has an oclif command resolution bug. The import script uses `@excalidraw-to-mermaid/core` directly
- The import is lossy: subgraphs are flattened, node IDs are randomized, and style directives are dropped. The post-processing step is essential
- The function name is `excalidrawV2ToMermaidFlowChart` (not `toMermaid` or other names)
- Import runs in pure Node.js with no browser — it is fast (< 1 second)
- Only flowchart/graph diagrams produce editable results; sequence diagrams and others render as images in Excalidraw

### `/diagram cleanup`

Find and delete `.excalidraw` workshop artifacts that are no longer needed.

**Arguments (parsed from user request):**
- `path` — Directory to scan (default: `documentation/`)
- `dry-run` — List files without deleting (default: true)

**Workflow:**

1. Glob for `**/*.excalidraw` in the target directory
2. For each `.excalidraw` file found, check if a corresponding markdown file exists nearby
3. List all candidates with their file sizes and last modified dates
4. Ask the user to confirm which files to delete
5. Delete confirmed files
6. Report what was deleted

## Round-Trip Fidelity

When communicating results to the user, note these known fidelity characteristics:

| Aspect | Preserved? | Notes |
|--------|-----------|-------|
| Nodes (boxes) | Yes | All nodes survive |
| Connections (arrows) | Yes | All connections preserved |
| Labels | Yes | Text on nodes and edges preserved |
| Shape types | Yes | Rectangles, diamonds maintained |
| Subgraphs | **No** | Flattened — post-processing restores from original |
| Node IDs | **No** | Randomized — post-processing matches by label text |
| Style directives | **No** | Dropped — post-processing restores from original |
| Multiline text | Partial | `\n` in labels may not survive cleanly |

## Dependencies

The scripts in `scripts/` require these npm packages:

```json
{
  "playwright": "^1.58.0",
  "@excalidraw-to-mermaid/core": "^0.1.0"
}
```

Additionally, Playwright Chromium must be installed:

```bash
npx playwright install chromium
```

If dependencies are missing when a command is invoked, install them in the skill's `scripts/` directory:

```bash
cd <skill-path>/scripts && npm init -y && npm install playwright @excalidraw-to-mermaid/core && npx playwright install chromium
```

## Do Not Use These Packages

These were tested and confirmed broken. Do not retry them:

| Package | Problem |
|---------|---------|
| `@excalidraw/mermaid-to-excalidraw` (in Node.js) | Requires real browser DOM — `getBBox` not available in jsdom |
| `@excalidraw-to-mermaid/cli` | oclif bug: "command flowchart not found" |
| `mermaid-to-excalidraw-cli` | 404 errors on bundled React/Excalidraw assets |

## Resources

### scripts/

- `export-to-excalidraw.mjs` — Playwright-based Mermaid → Excalidraw converter. Run with `node export-to-excalidraw.mjs <input.mmd> <output.excalidraw>`
- `import-from-excalidraw.mjs` — Excalidraw → Mermaid converter using `@excalidraw-to-mermaid/core`. Run with `node import-from-excalidraw.mjs <input.excalidraw> <output.mmd> [TB|LR|BT|RL]`

### references/

- `diagram-workflow.md` — Full workflow documentation including tested implementation details, failed approaches, and architectural decisions. Consult when debugging conversion issues or understanding design rationale.
