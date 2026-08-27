# Levantamiento de requerimientos — NoteAI

**Nombre del proyecto:** NoteAI  
**Líder del proyecto:** Juan Sebastian Giraldo  
**Fecha de creación:** 24/08/2026  
**Versión:** 1.0

---

## 1. Introducción y objetivos

### Propósito

Permitir a una persona guardar notas de texto y obtener un resumen generado en local, sin enviar el contenido a un servicio de IA externo.

### Dentro del alcance (v1.0)

- Crear, leer, editar y eliminar (borrado lógico) notas.
- Destacar una nota (pin).
- Asignar un color hexadecimal a una nota para identificarla en el listado.
- Generar un resumen con un modelo LLM local (Ollama) y persistirlo en la nota.
- Interfaz web para operar esas funciones.

### Fuera del alcance (v1.0)

- Inicio de sesión, usuarios y contraseñas.
- Búsqueda de notas.
- Etiquetas / notebooks / archivo.
- Estilos de resumen e historial de resúmenes (regenerar pisa el `summary` actual).
- Modelos o APIs de IA externas; el backend no descarga modelos distintos a pedido del cliente.
- Aplicación móvil nativa.

Esas capacidades, si se retoman, quedan para una v2.

### Usuarios finales

Estudiantes y profesionales que necesitan guardar apuntes breves y sintetizarlos.

---

## 2. Requerimientos funcionales

| ID | Nombre | Descripción | Listo cuando | Prioridad |
|----|--------|-------------|--------------|-----------|
| RF-01 | Crear nota | El usuario crea una nota con título y contenido. | Existe `POST /notes`. La nota queda persistida y aparece en el listado. | Alta |
| RF-02 | Listar y abrir nota | El usuario ve sus notas (no eliminadas) y abre una para editarla. | Existe `GET /notes` y `GET /notes/{id}`. El front muestra la lista y el editor. | Alta |
| RF-03 | Editar nota | El usuario modifica título y/o contenido. | Existe `PUT /notes/{id}`. Los cambios se guardan y se reflejan al recargar. | Alta |
| RF-04 | Eliminar nota | El usuario quita una nota del listado sin borrarla físicamente. | Existe `DELETE /notes/{id}` (soft delete: `is_deleted = true`). Deja de listarse. | Alta |
| RF-05 | Generar resumen | El usuario pide un resumen de la nota abierta. | Existe `GET /notes/{id}/summarize`. El campo `summary` se guarda. Si Ollama no responde, se informa error y no se pierde el contenido. | Alta |
| RF-06 | Color de nota | El usuario asigna un color hex para distinguir la nota en el sidebar. | El color se persiste en `color` y se muestra en el listado. | Baja |
| RF-07 | Destacar nota | El usuario marca o desmarca una nota como destacada. | El estado se persiste en `is_pinned`. | Media |

---

## 3. Requerimientos no funcionales

| ID | Nombre | Descripción | Prioridad |
|----|--------|-------------|-----------|
| RNF-01 | Tiempo de consultas CRUD | Altas, lecturas y actualizaciones de notas (sin LLM) responden en menos de 2 s en entorno local. No aplica al resumen. | Alta |
| RNF-02 | Resumen local | El texto de la nota no se envía a APIs de IA externas; el resumen corre en Ollama en la máquina del usuario. | Alta |
| RNF-03 | Interfaz usable | La UI funciona en desktop (≥1280 px). En viewport chico el listado se abre con menú. Navegadores: Chrome, Firefox, Safari (versiones actuales). | Media |
| RNF-04 | Secretos | Credenciales de base de datos no van al repositorio; se configuran por `.env`. | Alta |

---

## 4. Restricciones

- Backend: Python 3.12, FastAPI, SQLModel, PostgreSQL.
- Frontend: Angular 22.
- LLM: Ollama en local.
- Un solo usuario por instalación (sin multi-tenant).

## 5. Suposiciones

- El entorno de desarrollo tiene Python 3.12, Node/Angular 22, PostgreSQL 18 y Ollama instalados y en ejecución.
- La base `NotesAI` ya existe; el backend crea las tablas al arrancar (`create_all`).
- El frontend habla con `http://localhost:8000` y el origen `http://localhost:4200` está permitido por CORS.

---

## 6. Modelo de datos (v1.0)

Tabla `notes`:

| Campo | Tipo | Notas |
|-------|------|--------|
| id | integer PK | Autogenerado |
| title | string | Obligatorio |
| content | text | Obligatorio |
| color | string nullable | Hex `#RRGGBB` |
| is_pinned | boolean | Default false |
| is_deleted | boolean | Borrado lógico; default false |
| summary | string nullable | Último resumen generado |
| created_at | timestamptz | UTC |
| updated_at | timestamptz | UTC |

No hay tabla de etiquetas en v1.0.

---

## 7. Arquitectura

Monolito backend en capas + SPA Angular.

```
Angular (localhost:4200)
    HTTP
FastAPI (localhost:8000)
    ├── routers     → contrato HTTP
    ├── services    → negocio (resumen)
    ├── repositories → PostgreSQL
    ├── models / schemas
    └── llm_service → Ollama (localhost:11434)
```

El frontend no accede a la base ni a Ollama: solo consume la API REST.

### Estructura del repositorio

```
backend/src/
  main.py
  config.py
  database.py
  models/note.py
  schemas/note.py
  repositories/note_repository.py
  services/llm_service.py
  routers/notes_routers.py
  requirements.txt
frontend/          # aplicación Angular (Sanctuary)
.env.example
```

---

## 8. Cómo correr (desarrollo)

1. Copiar `.env.example` a `.env` y completar `DATABASE_URL`.
2. Backend: instalar `backend/src/requirements.txt`, levantar PostgreSQL y Uvicorn sobre `src.main:app`.
3. `ollama pull` del modelo configurado; dejar Ollama en ejecución.
4. Frontend: `cd frontend && npm start` (puerto 4200).
