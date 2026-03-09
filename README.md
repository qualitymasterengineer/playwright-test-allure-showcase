<div align="center">
  <img src="https://raw.githubusercontent.com/qualitymasterengineer/portfolio/main/assets/img/logo-gold.png" alt="Quality Master Engineer Logo" width="120" />

  # 🏆 Quality Master Engineer
  ### **Playwright Automation Framework & Allure Showcase**

  [![Playwright Tests](https://img.shields.io/badge/Framework-Playwright-D4AF37?style=for-the-badge&logo=playwright&logoColor=white)](https://playwright.dev/)
  [![Language-TypeScript](https://img.shields.io/badge/Language-TypeScript-D4AF37?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![Allure-Report](https://img.shields.io/badge/Report-Allure-D4AF37?style=for-the-badge&logo=allure&logoColor=white)](https://allurereport.org/)
  [![CI/CD-GitHub_Actions](https://img.shields.io/badge/CI/CD-GitHub_Actions-D4AF37?style=for-the-badge&logo=githubactions&logoColor=white)](https://github.com/features/actions)

  ---
  
  **"Transformando la Calidad en una Ventaja Competitiva mediante Ingeniería de Software y Observabilidad Estratégica."**

  [🌐 Ver Portafolio Principal](https://qualitymasterengineer.github.io/portfolio) • [📊 Ver Reporte en Vivo](https://qualitymasterengineer.github.io/playwright-test-allure-showcase/)
</div>

---

## 🛠️ Arquitectura del Ecosistema
Este proyecto no es solo una suite de pruebas; es un **Showcase de Ingeniería de Calidad** diseñado para demostrar escalabilidad, mantenibilidad y visibilidad técnica avanzada.

## Propósito

Este proyecto **solo muestra** los resultados de ejecución que genera el proyecto **playwright-test**. Ese proyecto es quien ejecuta las pruebas con Playwright y actualiza este repositorio con la carpeta `allure-results` para que aquí se genere y se visualice el reporte Allure.

## Uso

1. Asegúrate de que la carpeta `allure-results` esté actualizada (el proyecto **playwright-test** la copia o sube aquí).
2. Instala dependencias y genera/abre el reporte:

```bash
npm install
npm run report:generate
npm run report:open
```

- **`report:generate`**: genera el reporte HTML en `allure-report` a partir de `allure-results`.
- **`report:open`**: abre el reporte en el navegador.
- **`report:clean-history`**: borra `allure-results` y `allure-report` para iniciar el histórico desde cero.

## Reiniciar el histórico de ejecuciones

Para limpiar el historial y que el siguiente reporte empiece desde cero (sin tendencias ni ejecuciones anteriores):

```bash
npm run report:clean-history
```

Luego haz commit y push de los cambios si `allure-results` está versionado, o deja que el proyecto **playwright-test** vuelva a subir resultados; la próxima generación y despliegue mostrará solo esa ejecución.

## Estructura esperada

```
allure-results/   ← actualizado por el proyecto playwright-test
allure-report/   ← generado localmente (ignorado por git)
```

## Requisitos

- Node.js >= 18
- Allure CLI (incluido vía `allure-commandline` como dependencia)
