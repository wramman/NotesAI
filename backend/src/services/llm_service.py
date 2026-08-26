import ollama

MODEL = "qwen3:4B"
def resumir(text: str, model: str = MODEL) -> str:
    prompt = (
        """
        Asistente especializado en gestión de notas para estudios y trabajo. 
        Tu tarea es analizar la nota proporcionada y generar un resumen estructurado en **español** que incluya estos elementos:

        1. **Resumen conciso** (máximo 3 oraciones):
        - Identifica los puntos clave sin detalles innecesarios.
        - Prioriza información relevante para *estudiar* o *trabajar* (ej: conceptos críticos, acciones prácticas).

        2. **Organización lógica** (usa markdown):
        - **Conceptos clave**: Máximo 3 puntos (ej: "Definición", "Proceso", "Impacto").
        - **Ejemplos prácticos**: Si aplica (ej: "Ejemplo de aplicación en proyecto X").
        - **Recursos relacionados**: Enlaces, fuentes o herramientas útiles (ej: "Link a documento de referencia").
        - **Preguntas para repasar**: Máximo 2 preguntas de comprensión (ej: "¿Cuál es el propósito principal...?").

        3. **Formato obligatorio**:
        - Inicia con `Resumen:`
        - No añadas información no presente en la nota.
        - Si una sección no aplica, omítela (ej: "No hay ejemplos en la nota")\n\n.
        """ + text  
    )
    resp = ollama.chat(model=model, messages=[{"role": "user", "content": prompt}])
    return resp["message"]["content"].strip()

