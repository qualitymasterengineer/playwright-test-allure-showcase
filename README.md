# Allure Report Showcase

Repositorio de **visualización** de reportes Allure. No ejecuta tests.

## Propósito

Este proyecto **solo muestra** los resultados de ejecución que genera el proyecto **playwright-test**. Ese proyecto es quien ejecuta las pruebas con Playwright y actualiza este repositorio con la carpeta `allure-results` para que aquí se genere y se visualice el reporte Allure. Los despliegues normales **mantienen el historial** de ejecuciones (tendencia en el reporte).

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
- **`report:clean-history`**: borra `allure-results` y `allure-report` en local para iniciar el histórico desde cero.

## Cómo hacer la limpieza del histórico

Cuando quieras **iniciar los reportes desde cero** (sin tendencias ni ejecuciones anteriores):

### En este repositorio (rama `main`)

- Ejecuta en local:
  ```bash
  npm run report:clean-history
  ```
- Luego haz commit y push si `allure-results` está versionado, o deja que el proyecto **playwright-test** vuelva a subir resultados.

### En el reporte publicado (rama `gh-pages`)

- Ve a **Actions** → **Clear Allure Report History (gh-pages)**.
- Pulsa **Run workflow**.

La rama `gh-pages` quedará vacía (con un placeholder). El próximo despliegue desde `main` publicará un reporte nuevo sin historial en el sitio.

## Estructura esperada

```
allure-results/   ← actualizado por el proyecto playwright-test
allure-report/   ← generado localmente (ignorado por git)
```

## Requisitos

- Node.js >= 18
- Allure CLI (incluido vía `allure-commandline` como dependencia)
