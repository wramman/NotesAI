## Proyecto Integrador DW NoteAI

### Descipción del Proyecto

Aplicacion nativa en Python con Frontend en Angular, busca crear un programa de almacenamiento de notas
implementando CRUD en una base de datos sencilla en PostgresSQL

### Tecnologias

- Python 3.12.7
    - FastAPI
    - Uvicorn
    - Ollama
- Angular LTS
- PostgreSQL

### Modelo de Datos

    Tabla - Notas
| name | type |
| ---- | ---- |
| id (PK)  | long |
| title | string|
| content | text |
|is_pined | boolean |
|id_deleted | boolean| 
|color | string |
|created_at | time|
|update_at | time

    Opcional Tabla - Etiquetas

| name | type |
|----|----|
|id (PK) | long |
|name | string |

### Estructura de carpetas

    backend/
        ├── main.py                 # crea la app, incluye routers
        ├── config.py                # settings (DB URL, etc.) via pydantic-settings
        ├── database.py               # engine, SessionLocal, get_db() dependency
        ├── models/
        │   └── note.py                # modelo ORM (SQLAlchemy) — tabla real en Postgres
        ├── schemas/
        │   └── note.py                # modelos Pydantic (NoteCreate, NoteUpdate, NoteOut)
        ├── repositories/
        │   └── note_repository.py      # funciones que hablan con la DB (CRUD puro)
        ├── services/
        │   └── note_service.py          # lógica de negocio (orquesta repository + futuro llm_service)
        ├── routers/
        │   └── notes.py                  # endpoints HTTP, delega todo a services
        ├── llm/                             # carpeta vacía por ahora, lista para el futuro
        |   (llm_service.py más adelante)
        |
        ├── .env                  # Credenciales y variables sensibles
        ├── .gitignore
        ├── requirements.txt      # Dependencias del proyecto
        └── README.md