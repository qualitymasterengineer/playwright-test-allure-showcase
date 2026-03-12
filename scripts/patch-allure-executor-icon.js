/**
 * Parche post-generación del reporte Allure: reemplaza el icono del casco
 * por el logo de Playwright en la fila "Playwright Framework" de Executors.
 * Solo modifica la celda del icono (oculta el icono nativo y muestra ::before con el logo).
 */
const fs = require('fs');
const path = require('path');

const reportDir = path.join(__dirname, '..', 'allure-report');
const resultsDir = path.join(__dirname, '..', 'allure-results');
const executorSource = path.join(resultsDir, 'executor.json');
const widgetExecutors = path.join(reportDir, 'widgets', 'executors.json');
const indexPath = path.join(reportDir, 'index.html');
const logoPath = path.join(__dirname, '..', 'assets', 'playwright-logo.svg');

if (!fs.existsSync(reportDir) || !fs.existsSync(indexPath)) {
  console.log('Allure report not found; skipping executor icon patch.');
  process.exit(0);
}

// Asegurar que el widget tenga los ejecutores (array). executor.json puede ser objeto o array.
if (fs.existsSync(executorSource) && fs.existsSync(path.join(reportDir, 'widgets'))) {
  try {
    const data = JSON.parse(fs.readFileSync(executorSource, 'utf8'));
    let list = Array.isArray(data) ? data : [data];
    // Si solo hay uno y es GitHub, añadir fila Playwright para las dos líneas en la UI
    const packagePath = path.join(__dirname, '..', 'package.json');
    let pwVersion = '1.49.0';
    try {
      const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
      const ver = pkg.devDependencies && pkg.devDependencies['@playwright/test'];
      if (ver) pwVersion = ver.replace(/^\^/, '');
    } catch (_) {}
    const playwrightRow = {
      name: 'Playwright Framework',
      type: 'playwright-custom',
      buildName: `v${pwVersion}`,
      reportUrl: 'https://playwright.dev',
    };
    const hasPlaywright = list.some((e) => e && e.name === 'Playwright Framework');
    if (list.length === 1 && list[0].type === 'github' && !hasPlaywright) {
      list = [list[0], playwrightRow];
    }
    if (list.length > 0) {
      fs.writeFileSync(widgetExecutors, JSON.stringify(list), 'utf8');
    }
  } catch (_) {}
}

// Logo SVG compacto (P verde Playwright) para mostrar en 20x20
const fallbackSvg =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#2EAD33"><path d="M7 3h4c3.3 0 6 2.7 6 6s-2.7 6-6 6H9v4H7V3zm2 2v8h2c2.2 0 4-1.8 4-4s-1.8-4-4-4H9z"/></svg>';

let svgForBase64 = fallbackSvg;
if (fs.existsSync(logoPath)) {
  try {
    svgForBase64 = fs
      .readFileSync(logoPath, 'utf8')
      .replace(/<\?xml[^>]*\?>/gi, '')
      .trim();
  } catch (_) {}
}

const base64Logo = Buffer.from(svgForBase64).toString('base64');

const css = `
.custom-playwright-logo::before {
  content: '';
  display: inline-block;
  width: 20px;
  height: 20px;
  min-width: 20px;
  min-height: 20px;
  background-image: url('data:image/svg+xml;base64,${base64Logo}');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  margin-right: 6px;
  vertical-align: middle;
}
.custom-playwright-logo .executor-icon,
.custom-playwright-logo [class*="executor-icon"] {
  display: none !important;
}
`;

/**
 * Busca la fila que contiene "Playwright Framework", localiza la celda del icono,
 * oculta el icono nativo y añade la clase para mostrar el logo en ::before.
 */
const script =
  '<script id="custom-playwright-executor-patch">\n' +
  '(function() {\n' +
  '  var targetText = "Playwright Framework";\n' +
  '  var className = "custom-playwright-logo";\n' +
  '  function findIconCellForPlaywrightRow() {\n' +
  '    var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);\n' +
  '    var node;\n' +
  '    while ((node = walker.nextNode())) {\n' +
  '      var text = (node.textContent || "").trim();\n' +
  '      if (text.indexOf(targetText) === -1) continue;\n' +
  '      var el = node.parentElement;\n' +
  '      while (el && el !== document.body) {\n' +
  '        var icon = el.querySelector("[class*=\\"executor-icon\\"], [class*=\\"icon\\"]");\n' +
  '        if (icon) {\n' +
  '          var iconParent = icon.parentElement;\n' +
  '          if (iconParent && !iconParent.classList.contains(className)) {\n' +
  '            icon.style.setProperty("display", "none", "important");\n' +
  '            iconParent.classList.add(className);\n' +
  '            return true;\n' +
  '          }\n' +
  '          return false;\n' +
  '        }\n' +
  '        var prev = el.previousElementSibling;\n' +
  '        if (prev) {\n' +
  '          var iconInPrev = prev.querySelector("[class*=\\"icon\\"]");\n' +
  '          if (iconInPrev && !prev.classList.contains(className)) {\n' +
  '            iconInPrev.style.setProperty("display", "none", "important");\n' +
  '            prev.classList.add(className);\n' +
  '            return true;\n' +
  '          }\n' +
  '        }\n' +
  '        el = el.parentElement;\n' +
  '      }\n' +
  '    }\n' +
  '    return false;\n' +
  '  }\n' +
  '  function run() {\n' +
  '    findIconCellForPlaywrightRow();\n' +
  '    var attempts = 0;\n' +
  '    var id = setInterval(function() {\n' +
  '      attempts++;\n' +
  '      if (findIconCellForPlaywrightRow() || attempts >= 30) clearInterval(id);\n' +
  '    }, 200);\n' +
  '  }\n' +
  '  var debounceTimer;\n' +
  '  function reapplyOnDomChange() {\n' +
  '    clearTimeout(debounceTimer);\n' +
  '    debounceTimer = setTimeout(findIconCellForPlaywrightRow, 150);\n' +
  '  }\n' +
  '  if (document.readyState === "loading") {\n' +
  '    document.addEventListener("DOMContentLoaded", function() {\n' +
  '      run();\n' +
  '      if (typeof MutationObserver !== "undefined") {\n' +
  '        var obs = new MutationObserver(reapplyOnDomChange);\n' +
  '        obs.observe(document.body, { childList: true, subtree: true });\n' +
  '      }\n' +
  '    });\n' +
  '  } else {\n' +
  '    setTimeout(function() {\n' +
  '      run();\n' +
  '      if (typeof MutationObserver !== "undefined") {\n' +
  '        var obs = new MutationObserver(reapplyOnDomChange);\n' +
  '        obs.observe(document.body, { childList: true, subtree: true });\n' +
  '      }\n' +
  '    }, 100);\n' +
  '  }\n' +
  '})();\n' +
  '</script>';

const styleBlock = '<style id="custom-playwright-executor-style">\n' + css.trim() + '\n</style>';

let html = fs.readFileSync(indexPath, 'utf8');

if (html.includes('id="custom-playwright-executor-style"')) {
  html = html.replace(
    /<style id="custom-playwright-executor-style">[\s\S]*?<\/style>/,
    styleBlock
  );
} else {
  html = html.replace('</head>', styleBlock + '\n</head>');
}

if (html.includes('id="custom-playwright-executor-patch"')) {
  html = html.replace(
    /<script id="custom-playwright-executor-patch">[\s\S]*?<\/script>/,
    script
  );
} else {
  html = html.replace('</body>', script + '\n</body>');
}

fs.writeFileSync(indexPath, html, 'utf8');
console.log('Allure: executor icon patch applied (Playwright logo replaces helmet).');
