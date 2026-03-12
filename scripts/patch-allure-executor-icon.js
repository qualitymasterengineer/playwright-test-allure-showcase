#!/usr/bin/env node
/**
 * Inyecta CSS/JS en allure-report/index.html para mostrar el logo de Playwright
 * en la fila "Playwright Framework" del widget Executors y ocultar el icono por defecto.
 * Compatible con el reporte generado por playwright-test (mismo parche que en ese proyecto).
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const INDEX_HTML = path.join(ROOT, "allure-report", "index.html");
const LOGO_SVG = path.join(ROOT, "assets", "playwright-logo.svg");

if (!fs.existsSync(INDEX_HTML)) {
  console.warn("patch-allure-executor-icon: index.html not found at", INDEX_HTML);
  process.exit(0);
}

if (!fs.existsSync(LOGO_SVG)) {
  console.warn("patch-allure-executor-icon: playwright-logo.svg not found at", LOGO_SVG);
  process.exit(0);
}

let html = fs.readFileSync(INDEX_HTML, "utf8");
const svgRaw = fs.readFileSync(LOGO_SVG, "utf8");
const logoDataUrl =
  "data:image/svg+xml;base64," + Buffer.from(svgRaw, "utf8").toString("base64");

const inject = `
<!-- Patched by patch-allure-executor-icon.js: Playwright logo in Executors -->
<style id="allure-executor-playwright-patch">
  /* Oculta el icono por defecto en la fila del executor "Playwright Framework" */
  .executor-row-playwright .executor-icon,
  .executor-row-playwright img[src*="icon"],
  .executor-row-playwright .icon {
    opacity: 0;
    width: 0;
    height: 0;
    overflow: hidden;
  }
  /* Muestra el logo de Playwright como ::before en el bloque del nombre */
  .executor-row-playwright .executor-name::before,
  .executor-row-playwright .info-block__name::before,
  .executor-row-playwright td:first-child::before {
    content: "";
    display: inline-block;
    width: 24px;
    height: 24px;
    margin-right: 8px;
    vertical-align: middle;
    background: url("${logoDataUrl}") no-repeat center;
    background-size: contain;
  }
</style>
<script>
(function() {
  function markPlaywrightExecutorRow() {
    var xpath = "//*[contains(text(),'Playwright Framework') or contains(text(),'Playwright')]";
    var iter = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
    var node;
    while ((node = iter.iterateNext())) {
      var row = node.closest('tr') || node.closest('li') || node.closest('.info-block') || node.closest('div[class*="executor"]') || node.parentElement;
      if (row && !row.classList.contains('executor-row-playwright')) {
        row.classList.add('executor-row-playwright');
      }
    }
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', markPlaywrightExecutorRow);
  } else {
    markPlaywrightExecutorRow();
  }
  setTimeout(markPlaywrightExecutorRow, 500);
  setTimeout(markPlaywrightExecutorRow, 2000);
})();
</script>
`;

if (html.includes("allure-executor-playwright-patch")) {
  console.log("patch-allure-executor-icon: already patched, skip.");
  process.exit(0);
}

const insertBefore = "</head>";
const idx = html.indexOf(insertBefore);
if (idx === -1) {
  console.warn("patch-allure-executor-icon: </head> not found in index.html");
  process.exit(1);
}

html = html.slice(0, idx) + inject + "\n" + html.slice(idx);
fs.writeFileSync(INDEX_HTML, html, "utf8");
console.log("patch-allure-executor-icon: Playwright logo patch applied to index.html.");
