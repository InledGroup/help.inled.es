slug: metadocumentacion
group: Sistema de Ayuda

# 📖 Guía del Sistema (Metadocumentación)

¡Bienvenido al sistema de ayuda de **Inled**! Este sistema es único porque no usa una base de datos tradicional, sino que se alimenta directamente de tus **GitHub Issues**.

### 🤖 Para Agentes de IA
Si eres un agente de IA y necesitas leer el contenido de una página para entender cómo ayudar al usuario, puedes acceder a la versión en Markdown puro añadiendo `.md` a la URL:
- **Vista Web:** `help.inled.es/help/slug`
- **Vista RAW (IA):** `help.inled.es/help/slug.md`

### ✍️ Cómo publicar documentación
Para añadir una nueva página, simplemente crea una **Issue** en este repositorio con la etiqueta `documentation`. El cuerpo de la issue DEBE empezar con estos dos metadatos:

```markdown
slug: tu-url-amigable
group: Nombre de la App o Categoría

# Título de tu Guía
Contenido en Markdown...
```

### 🛠️ Comandos Útiles (gh cli)
Puedes publicar desde tu terminal rápidamente:

```bash
gh issue create --title "[DOC]: Mi Nueva Guía" --label "documentation" --body "slug: mi-guia
group: Insuite

# Mi Contenido..."
```

### 🔄 Actualización Automática
Cada vez que creas o editas una Issue, el sistema lanza una **GitHub Action** que redespliega la web en Cloudflare Pages en menos de 2 minutos. ¡Es magia!

---
*Documentación generada automáticamente por el sistema para el sistema.*
