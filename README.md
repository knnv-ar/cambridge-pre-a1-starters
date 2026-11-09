# Cambridge English: Pre A1 Starters — Simulador Interactivo (2026)

Aplicación web interactiva, lúdica y **100% estática** diseñada para que las niñas y los niños de **3.º grado** practiquen en casa en familia para el examen internacional **Cambridge English: Pre A1 Starters** del **sábado 14 de noviembre de 2026**.

## ✨ Características Principales

- **Bienvenida personalizada en cada sesión:** Apenas se carga `index.html`, un popup interactivo pregunta el nombre de la niña o el niño (*"What's your name? ¿Cómo te llamás?"*) y personaliza toda la aplicación, el estuche Ziploc, el guion de *Speaking* y el reporte final de escudos.
- **Filtrado exclusivo de Pre A1 Starters:** Incluye los dos exámenes oficiales de muestra completos (**Volumen 1** y **Volumen 2**, páginas impresas 3 a 26 de cada PDF), excluyendo *A1 Movers* y *A2 Flyers*.
- **Estuche Ziploc Virtual (`#ziploc-bar`):** Barra inferior permanente con **lápiz negro (`PENCIL`)**, **goma de borrar (`ERASER`)** y los **9 lápices de colores exactos** exigidos en la citación (`RED`, `BLUE`, `YELLOW`, `GREEN`, `ORANGE`, `PURPLE / VIOLET`, `PINK`, `BROWN`, `GREY`).
- **Listening (20 minutos — 4 partes, 20 preguntas por volumen):**
  - Pistas MP3 oficiales divididas por parte + control de velocidad (`1.0x` / `0.9x`) + **Tapescript oficial desplegable** para el adulto/docente.
  - **Part 1:** Trazado de líneas sobre `<canvas>` desde los nombres hasta las personas en la escena (con ejemplo resuelto y detección automática).
  - **Part 2:** Escritura de nombres deletreados y números (acepta cifras o palabras).
  - **Part 3:** Selección múltiple visual (`A`, `B`, `C`) con tilde (`✔`).
  - **Part 4:** Coloreado interactivo sobre la escena en blanco y negro usando los 9 lápices de colores oficiales (`mix-blend-mode: multiply`).
- **Reading & Writing (20 minutos — 5 partes, 25 preguntas por volumen):**
  - Rigurosidad ortográfica del 100% (*exact spelling*) y ejemplos oficiales resueltos.
  - **Part 1:** Tilde (`✔`) o cruz (`✘`) frente a 5 imágenes.
  - **Part 2:** Escena a color con 5 oraciones descriptivas (`yes` / `no`).
  - **Part 3:** Anagramas con las ilustraciones originales (jaulas/libros), guiones exactos (`_ _ _ _ _`) y fichitas de letras que se van tachando al usarlas.
  - **Part 4:** Texto *cloze* ilustrado (*Lizards* en Vol. 1, *Hippos* en Vol. 2) con caja de 8 palabras ilustradas (*click-to-place*, *drag & drop* o teclado).
  - **Part 5:** Historieta secuencial de 3 cuadros con respuestas de **una sola palabra** o número, respetando los prefijos impresos.
- **Speaking (3 a 5 minutos — Modo Alumno/a + Adulto/Docente Examinador):**
  - Lámina grande a color apaisada (*Scene picture*: *Kitchen* en Vol. 1, *At the Beach & Boat* en Vol. 2) + bandeja con las **8 tarjetas recortables (*Object cards*)** para arrastrar y ubicar sobre la escena (*"Put the robot under the table"*) o señalar con el dedo (`👆`).
  - Panel colapsable para el adulto/docente con el *Summary of procedures* y la tabla oficial completa de la página 24 (*What the examiner does*, *What the examiner says*, *Minimum response expected from child*, *Back-up questions*).
- **Sistema Oficial de Escudos de Cambridge (1 a 5 escudos por habilidad, máx. 15 escudos)** y **Entrenador de los 20 Nombres Propios Oficiales** con pronunciación y dictado deletreado (`en-GB`).

## 🚀 Cómo usarla localmente o desplegarla gratis

1. **Abrir directamente en la PC (sin servidor):**
   Hacé doble clic sobre `index.html` en cualquier navegador moderno (Chrome, Edge, Firefox, Safari).
2. **Servidor local opcional:**
   ```bash
   python -m http.server 8080
   ```
   Y abrí `http://localhost:8080` en el navegador.
3. **Despliegue gratuito en GitHub Pages o Cloudflare Pages:**
   Subí el repositorio y publicá la raíz (`/`) como sitio estático (incluye `.nojekyll` listo para GitHub Pages).
