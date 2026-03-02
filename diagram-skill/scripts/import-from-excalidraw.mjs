#!/usr/bin/env node
/**
 * Import Excalidraw → Mermaid
 *
 * Converts an Excalidraw file (.excalidraw) back to Mermaid code (.mmd).
 * Uses @excalidraw-to-mermaid/core library (pure Node.js, no browser needed).
 *
 * Prerequisites:
 *   npm install @excalidraw-to-mermaid/core
 *
 * Usage:
 *   node import-from-excalidraw.mjs <input.excalidraw> <output.mmd> [direction]
 *
 * Direction: TB (top-bottom, default), LR (left-right), BT, RL
 *
 * Known fidelity losses:
 *   - Subgraphs are flattened (all nodes become top-level)
 *   - Node IDs are randomized (A, B, C → SURE, FAIR, ZOO)
 *   - Style directives are dropped
 *   - Multiline text may not survive cleanly
 */

import { excalidrawV2ToMermaidFlowChart } from "@excalidraw-to-mermaid/core";
import fs from "fs";
import process from "process";

const VALID_DIRECTIONS = ["TB", "LR", "BT", "RL"];

function importFromExcalidraw(inputPath, outputPath, direction = "TB") {
  if (!VALID_DIRECTIONS.includes(direction)) {
    throw new Error(
      `Invalid direction "${direction}". Must be one of: ${VALID_DIRECTIONS.join(", ")}`
    );
  }

  const excalidrawData = JSON.parse(fs.readFileSync(inputPath, "utf-8"));
  const elementCount = excalidrawData.elements
    ? excalidrawData.elements.length
    : 0;
  console.log(`Input: ${inputPath} (${elementCount} elements)`);

  const mermaidCode = excalidrawV2ToMermaidFlowChart(direction, excalidrawData);

  fs.writeFileSync(outputPath, mermaidCode);
  console.log(`SUCCESS: → ${outputPath} (direction: ${direction})`);
  console.log("---");
  console.log(mermaidCode);
}

// CLI entry point
const args = process.argv.slice(2);
if (args.length < 2) {
  console.error(
    "Usage: node import-from-excalidraw.mjs <input.excalidraw> <output.mmd> [TB|LR|BT|RL]"
  );
  process.exit(1);
}

try {
  importFromExcalidraw(args[0], args[1], args[2] || "TB");
} catch (err) {
  console.error("Import failed:", err.message);
  process.exit(1);
}
