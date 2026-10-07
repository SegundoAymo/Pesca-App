# Kit de Pesca — guía para Claude

Las reglas comunes con ChatGPT están en `AGENTS.md` y valen enteras para Claude:

@AGENTS.md

## Solo para Claude

- La revisión independiente de un nudo se hace con el subagente `revisor-nudos` (`.claude/agents/revisor-nudos.md`). ChatGPT usa ese mismo archivo como lista de control.
- Si se cambia algo en un artifact de claude.ai (doc o lienzo), exportarlo al repo en la misma tarea: ChatGPT no puede abrir los artifacts y solo ve lo que está en el repo.
- Al terminar, en el commit va `Agente: Claude` además de las líneas de atribución de siempre.
