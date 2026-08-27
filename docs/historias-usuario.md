# Historias de usuario  NoteAI v1.0

## Epica #1: NoteAI v1.0

Gestionar notas de texto y generar un resumen con un LLM local (Ollama), sin login ni APIs de IA externas.

---

## HU-01 — Crear nota

**RF:** RF-01 · **Priority:** 1

**Título:** Crear una nota con título y contenido

**Descripción**  
Como estudiante o profesional,  
quiero crear una nota con título y contenido,  
para guardar un apunte y consultarlo después.

**Criterios de aceptación**

- Existe `POST /notes` con `title` y `content`.
- La nota se persiste en PostgreSQL y aparece en el listado.
- El frontend tiene acción “Nueva nota” y abre el editor.

---

## HU-02 — Listar y abrir nota

**RF:** RF-02 · **Priority:** 1

**Título:** Ver mis notas y abrir una para editarla

**Descripción**  
Como usuario,  
quiero ver el listado de notas no eliminadas y abrir una,  
para continuar editándola.

**Criterios de aceptación**

- Existe `GET /notes` (excluye `is_deleted = true`).
- Existe `GET /notes/{id}`.
- El sidebar muestra las notas; al seleccionar una se carga el editor.
- Si la nota no existe, el API responde 404.

---

## HU-03 — Editar nota

**RF:** RF-03 · **Priority:** 1

**Título:** Modificar título y contenido de una nota

**Descripción**  
Como usuario,  
quiero editar el título y el contenido,  
para actualizar el apunte.

**Criterios de aceptación**

- Existe `PUT /notes/{id}` con campos opcionales.
- Los cambios se guardan y se ven al recargar.
- El frontend guarda al salir del campo (blur).

---

## HU-04 — Eliminar nota (borrado lógico)

**RF:** RF-04 · **Priority:** 1

**Título:** Quitar una nota del listado sin borrarla de la base

**Descripción**  
Como usuario,  
quiero eliminar una nota de la lista,  
para no verla más, sin perder el registro en servidor.

**Criterios de aceptación**

- Existe `DELETE /notes/{id}` que pone `is_deleted = true`.
- La nota deja de aparecer en `GET /notes`.
- El frontend la saca del sidebar.

---

## HU-05 — Generar resumen con LLM local

**RF:** RF-05 · **Priority:** 1

**Título:** Resumir una nota con Ollama

**Descripción**  
Como usuario,  
quiero generar un resumen de la nota abierta,  
para no releer todo el texto, sin enviar el contenido a una API de IA externa.

**Criterios de aceptación**

- Existe `GET /notes/{id}/summarize`.
- El resumen se guarda en `summary`.
- Sin contenido (vacío o solo espacios): **400**; no se llama al LLM.
- Ollama caído: **503**; el contenido de la nota no se pierde.
- Nota inexistente: **404**.
- El frontend deshabilita “Resumir” si no hay contenido y muestra mensaje según 400 o 503.

---

## HU-06 — Color de nota

**RF:** RF-06 · **Priority:** 3

**Título:** Asignar un color hexadecimal a la nota

**Descripción**  
Como usuario,  
quiero elegir un color hex para la nota,  
para distinguirla en el listado.

**Criterios de aceptación**

- El color se persiste en el campo `color`.
- El sidebar muestra la barrita con ese color.
- El frontend abre un selector hex (paleta) sobre la nota abierta.

---

## HU-07 — Destacar nota (pin)

**RF:** RF-07 · **Priority:** 2

**Título:** Marcar o desmarcar una nota como destacada

**Descripción**  
Como usuario,  
quiero fijar una nota,  
para resaltarla respecto del resto.

**Criterios de aceptación**

- El estado se persiste en `is_pinned`.
- El frontend permite marcar/desmarcar (estrella) sobre la nota abierta.

---

## HU-08 — Interfaz web usable

**RNF:** RNF-03 · **Priority:** 2

**Título:** Usar NoteAI desde el navegador

**Descripción**  
Como usuario,  
quiero una interfaz web,  
para operar las notas sin usar el API a mano.

**Criterios de aceptación**

- La UI funciona en desktop (≥1280 px).
- En viewport chico el listado se abre con menú.
- Tema claro/oscuro.
- El front consume `http://localhost:8000` con CORS desde `http://localhost:4200`.

---

## Fuera de v1.0 (backlog, no Done)

No crearlas como Done. Si el tablero pide ítems futuros:

| ID | Título | Notas |
|----|--------|--------|
| HU-09 | Inicio de sesión | Fuera de alcance v1.0 |
| HU-10 | Búsqueda de notas | Fuera de alcance v1.0 |
| HU-11 | Etiquetas / notebooks | Fuera de alcance v1.0 |
| HU-12 | Historial de resúmenes | Regenerar pisa `summary`; no hay historial |

---

## Orden sugerido en el tablero (aunque ya estén Done)

HU-01 → HU-02 → HU-03 → HU-04 → HU-06 → HU-07 → HU-05 → HU-08

El resumen (HU-05) va después del CRUD: depende de tener nota con contenido.
