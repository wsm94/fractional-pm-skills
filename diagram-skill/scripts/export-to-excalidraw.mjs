#!/usr/bin/env node
/**
 * Export Mermaid → Excalidraw
 *
 * Converts a Mermaid diagram file (.mmd) to an Excalidraw file (.excalidraw)
 * by automating the official mermaid-to-excalidraw playground via Playwright.
 *
 * Why Playwright? The @excalidraw/mermaid-to-excalidraw library requires a real
 * browser DOM with SVG support (getBBox). It cannot run in Node.js even with jsdom.
 *
 * Prerequisites:
 *   npm install playwright
 *   npx playwright install chromium
 *
 * Usage:
 *   node export-to-excalidraw.mjs <input.mmd> <output.excalidraw>
 */

import { chromium } from "playwright";
import fs from "fs";
import path from "path";
import process from "process";

const PLAYGROUND_URL = "https://mermaid-to-excalidraw.vercel.app/";

async function exportToExcalidraw(inputPath, outputPath) {
  const mermaidCode = fs.readFileSync(inputPath, "utf-8");
  console.log(`Input: ${inputPath} (${mermaidCode.length} chars)`);

  const browser = await chromium.launch();
  const context = await browser.newContext();
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  const page = await context.newPage();

  try {
    // Load the official mermaid-to-excalidraw playground
    console.log("Loading playground...");
    await page.goto(PLAYGROUND_URL, {
      waitUntil: "networkidle",
      timeout: 30000,
    });

    // Enter Mermaid code into the textarea
    console.log("Entering Mermaid code...");
    await page.locator("textarea").first().fill(mermaidCode);
    await page.waitForTimeout(2000);

    // Click render button — must use specific ID, not generic button selector
    // (the page has 95+ example buttons that would also match)
    console.log("Rendering...");
    await page.locator("#render-excalidraw-btn").click();
    await page.waitForTimeout(5000);

    // Click the INTERACTIVE canvas — there are two canvases stacked;
    // the static one is underneath and blocks normal clicks
    const interactiveCanvas = page.locator(
      "canvas.excalidraw__canvas.interactive"
    );
    await interactiveCanvas.click({ force: true });
    await page.waitForTimeout(500);

    // Select all elements and copy to clipboard
    // On macOS use Meta instead of Control
    const modifier = process.platform === "darwin" ? "Meta" : "Control";
    console.log("Selecting all and copying...");
    await page.keyboard.press(`${modifier}+a`);
    await page.waitForTimeout(500);
    await page.keyboard.press(`${modifier}+c`);
    await page.waitForTimeout(1000);

    // Read clipboard — Excalidraw copies selected elements as JSON
    const clipboardText = await page.evaluate(async () => {
      try {
        return await navigator.clipboard.readText();
      } catch (e) {
        return "CLIPBOARD_ERROR: " + e.message;
      }
    });

    if (
      clipboardText.startsWith("CLIPBOARD_ERROR") ||
      clipboardText.length < 10
    ) {
      throw new Error(`Clipboard extraction failed: ${clipboardText}`);
    }

    // Parse clipboard JSON and wrap in standard .excalidraw format
    const parsed = JSON.parse(clipboardText);
    const elements = parsed.elements || [];
    const excalidrawData = {
      type: "excalidraw",
      version: 2,
      source: "mermaid-to-excalidraw",
      elements,
      appState: { viewBackgroundColor: "#ffffff", gridSize: null },
      files: parsed.files || {},
    };

    fs.writeFileSync(outputPath, JSON.stringify(excalidrawData, null, 2));
    console.log(`SUCCESS: ${elements.length} elements → ${outputPath}`);
  } finally {
    await browser.close();
  }
}

// CLI entry point
const args = process.argv.slice(2);
if (args.length < 2) {
  console.error("Usage: node export-to-excalidraw.mjs <input.mmd> <output.excalidraw>");
  process.exit(1);
}

exportToExcalidraw(args[0], args[1]).catch((err) => {
  console.error("Export failed:", err.message);
  process.exit(1);
});
