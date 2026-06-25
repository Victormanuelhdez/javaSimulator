````markdown
# Java Exam Simulator

Java Exam Simulator es una aplicación web desarrollada como herramienta  de estudio para la preparación del examen de certificación **Oracle Certified Professional: Java SE 17 Developer**.

La plataforma permite practicar mediante exámenes aleatorios, consultar conceptos importantes en un glosario y llevar un registro del progreso del estudiante.

Cada reactivo ofrece retroalimentación inmediata, indicando si la respuesta seleccionada es correcta o incorrecta, además de mostrar una explicación del concepto evaluado.

---

## Objetivo del proyecto

El objetivo de esta aplicación es facilitar el estudio de los temas incluidos en la certificación Java SE 17.

La plataforma permite:

- Reforzar conocimientos.
- Identificar áreas de mejora.
- Practicar con diferentes tipos de reactivos.
- Consultar conceptos importantes de Java.
- Registrar el progreso obtenido en cada intento.

---

## Funcionalidades principales

- Exámenes de 5, 10 o 40 preguntas.
- Selección de preguntas por tema.
- Preguntas de respuesta única y múltiple.
- Retroalimentación inmediata.
- Explicación detallada de cada respuesta.
- Glosario de conceptos relacionados con Java SE 17.
- Buscador por términos y palabras clave.
- Historial de resultados.
- Estadísticas de intentos, aciertos y errores.
- Gráficas de progreso.
- Guardado automático del examen en curso.
- Modo claro y oscuro.
- Diseño adaptable para computadoras, tabletas y dispositivos móviles.

---

## Tecnologías utilizadas

- HTML5
- CSS3
- JavaScript
- LocalStorage
- Canvas API
- Diseño responsive

---

## Almacenamiento de información

La aplicación utiliza `localStorage` para guardar información directamente en el navegador.

Entre los datos almacenados se encuentran:

- Nombre del estudiante.
- Preferencia de modo claro u oscuro.
- Historial de resultados.
- Número de intentos.
- Total de respuestas correctas.
- Total de respuestas incorrectas.
- Examen pendiente.
- Progreso del estudiante.

No se requiere una base de datos ni la creación de una cuenta.

---

## Ejecución del proyecto

Para ejecutar el proyecto localmente, abre una terminal dentro de la carpeta principal y utiliza el siguiente comando:

```bash
python3 -m http.server 5500
````

Después abre la siguiente dirección en el navegador:

```text
http://localhost:5500
```

También es posible abrir directamente el archivo `index.html`, aunque se recomienda utilizar un servidor local durante el desarrollo.

---

## Estructura del proyecto

```text
java-exam-simulator/
├── index.html
├── css/
│   └── styles.css
├── data/
│   ├── questions.js
│   └── glossary.js
├── js/
│   ├── app.js
│   └── storage.js
└── README.md
```

---

## Uso de la aplicación

1. Ingresa tu nombre para crear un perfil local.
2. Selecciona la cantidad de preguntas.
3. Elige un tema específico o utiliza todo el banco de reactivos.
4. Responde cada pregunta.
5. Envía tu respuesta para conocer el resultado.
6. Consulta la explicación correspondiente.
7. Revisa tu calificación y progreso al finalizar.
8. Consulta el glosario para reforzar conceptos.

---

## Propósito educativo

Este proyecto fue creado con fines educativos y como apoyo para el estudio de la certificación **Java SE 17 Developer**.

Su objetivo es complementar el aprendizaje mediante la práctica constante, la consulta de conceptos y el análisis del progreso obtenido en cada sesión.

```
```
