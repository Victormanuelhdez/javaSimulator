# Java Exam Simulator — Complete Edition corregida

## Corrección aplicada

La versión anterior cargaba `storage.js` y también declaraba las mismas utilidades
de almacenamiento dentro de `app.js`. El navegador detenía JavaScript por nombres
duplicados y todas las pantallas permanecían ocultas.

Esta versión:

- Carga únicamente `questions.js`, `glossary.js` y `app.js`.
- Conserva los 1,303 reactivos.
- Conserva las 178 entradas del glosario.
- Conserva las gráficas del perfil.
- Conserva exámenes de 5, 10 y 40 preguntas.
- Conserva selección por tema.
- Conserva navegación responsive y modo oscuro.

## Ejecución recomendada

```bash
cd java-exam-simulator-complete-fixed
python3 -m http.server 5500
```

Después abre:

```text
http://localhost:5500
```
