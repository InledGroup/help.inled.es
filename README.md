# help.inled.es 🚀

Centro de ayuda moderno con diseño **Glassmorphism**, construido con **Astro** y gestionado íntegramente mediante **GitHub Issues**.

## 🌟 Características
- **CMS via GitHub Issues**: Añade, edita o elimina páginas sin tocar el código.
- **Diseño Moderno**: Efectos de desenfoque (blur), cristal (glass) y fondos animados.
- **IA-Ready**: Diseñado para que agentes de IA puedan actualizar la documentación vía `gh cli`.
- **Arquitectura Hexagonal**: Código limpio, tipado y fácil de mantener.

## 🚀 Despliegue y CI/CD
El proyecto está configurado para desplegarse automáticamente en **Cloudflare Pages** mediante **GitHub Actions**.

### 🔐 Configuración de Secretos en GitHub
Para que el despliegue funcione, añade los siguientes secretos en tu repositorio (`Settings > Secrets and variables > Actions`):
1. `CLOUDFLARE_API_TOKEN`: Tu token de API de Cloudflare.
2. `CLOUDFLARE_ACCOUNT_ID`: Tu ID de cuenta de Cloudflare.

**Nota:** Las variables `GITHUB_OWNER` y `GITHUB_REPO` se inyectan automáticamente en el workflow, y usaremos el `GITHUB_TOKEN` nativo de las Actions para leer las Issues sin límites de rate limit.

### 🔄 Actualización Automática
La web se reconstruirá automáticamente cuando:
- Hagas un `push` a `main`.
- Se cree, edite o cierre una **Issue** con la etiqueta `documentation`.
- Ejecutes el workflow manualmente.

## 🤖 Cómo añadir contenido (Agentes/IA/Propietario)
Para añadir una página, crea una Issue con la etiqueta `documentation`:

```bash
gh issue create --title "Título de mi Ayuda" --label "documentation" --body "slug: mi-url-amigable
group: Nombre de la App

# Mi Contenido
Aquí va el markdown..."
```

## 📐 Estructura de Archivos
- `src/core`: Lógica de dominio y modelos.
- `src/infrastructure`: Conexión con GitHub API.
- `src/ui`: Componentes Astro y estilos Glassmorphism.
- `src/pages`: Rutas dinámicas.

---
Hecho con ❤️ por Jaime & Gemini CLI
