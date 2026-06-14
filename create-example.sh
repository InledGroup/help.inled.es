#!/bin/bash

# Script para crear un artículo de ejemplo usando GitHub CLI
# Script to create an example article using GitHub CLI

# Verifica si gh está instalado / Check if gh is installed
if ! command -v gh &> /dev/null
then
    echo "Error: GitHub CLI (gh) no está instalado."
    exit
fi

# Datos del artículo de ejemplo / Example article data
TITLE="Guía Rápida de Insuite Office"
SLUG="guia-insuite-office"
GROUP="Insuite Office"
BODY="slug: $SLUG
group: $GROUP

# Bienvenido a Insuite Office

Esta es una página de ejemplo creada automáticamente para mostrar cómo funciona el sistema de ayuda de **Inled**.

### ¿Qué puedes hacer aquí?
*   **Edición en tiempo real**: Todos tus cambios se guardan localmente.
*   **Privacidad total**: Tus documentos nunca salen de tu navegador.
*   **Compatibilidad**: Funciona en cualquier dispositivo moderno.

### Cómo editar este contenido
Como propietario del repositorio, puedes editar este artículo simplemente modificando la Issue correspondiente en GitHub. ¡Tus agentes de IA también pueden hacerlo!

\`\`\`bash
gh issue edit <ID_ISSUE> --body \"nuevo contenido...\"
\`\`\`

---
*Este artículo es solo un ejemplo de la potencia de help.inled.es*"

# Crear la issue / Create the issue
echo "Creando artículo de ejemplo en GitHub..."
gh issue create --title "$TITLE" --label "documentation" --body "$BODY"
