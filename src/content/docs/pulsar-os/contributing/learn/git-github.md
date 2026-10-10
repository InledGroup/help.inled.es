---
title: Git y Github
subtitle: Donde subir cada cosa
---
**Git** es un software que te permite guardar los cambios que vas haciendo al código que está screando, de manera que si cambias algo que ha estropeado más que arreglado puedas volver atrás fácilmente.  
**Github** es la plataforma más usada para subir repositorios que usan Git (osea, capretas con código en las cuales guardamos nuestros cambios, la evolución del proyecto). Con Github puedes contribuir a otros repositorios (que alojan el código de otros programas) y crear reportes de errores.  

## Git  
### Instalar GIT  
Usa [este chat de IA para que te explique exactamente como hacerlo en tu sistema operativo](https://www.google.com/search?q=como+instalar+git+en+mi+pc.+debes+preguntar+al+usuario+si+usa+windows%2C+macos+o+qu%C3%A9+distro+linux+usa+y+darle+los+comandos+exactos+en+el+idioma+al+cual+se+haya+referido+a+ti+%28si+te+escribe+en+un+idioma%2C+tu+le+respondes+en+el+mismo%29.+el+prtimer+mensaje+hazlo+en+ingles&client=&udm=50)  

### Comandos esenciales  
Para moverte a la carpeta de tu proyecto desde la terminal se usa el comando **cd**. Aprende más sobre el comando [en este chat con IA](https://www.google.com/search?q=vas+a+explicar+al+usuario+como+usar+el+comando+CD%2C+preguntando+primero+cual+es+su+OS.+el+primer+mensaje+ser%C3%A1+en+ingles+y+luego+le+responder%C3%A1s+segun+el+idioma+en+el+que+te+envie+el+mensaje&udm=50)  

Lo primero que deberás hacer cuando entres en la carpeta es hacer **git init** para decirle a git que lo quieres usar en esa carpeta y entonces iniciará un repo.  
Cuando hagas una serie de cambios en el codigo, haz `git status` para ver qué cosas tienes sin **commitear** (trackear el cambio) y entonces haz `git add` + el archivo o haz `git add .` para todo. Luego haz `git commit -m "tu mensaje"` y ya lo tendrás hecho!  

## Github  
Github, como ya dijimos, te permitirá alojar el código que crees y hacer Pull Requests.  
Primero deberás crearte una cuenta [clicando desde aquí, por ejemplo](https://github.com/signup)  
Ahora [accede a este chat para que la IA te explique como configurar tu PC para subir desde git a Github](https://www.google.com/search?q=vas+a+explicar+al+usuario+como+configurar+ssh+en+su+sistema+y+en+github+para+poder+hacer+pushes+a+sus+repos.+el+usuario+est%C3%A1+aprendiendo,+ha+sido+redirigido+desde+help.inled.es+y+el+primer+mensaje+que+le+des+debe+ser+en+ingles+y+ya+luego+continuareis+segun+el+idioma+en+el+que+te+responda&udm=50)  

Ahora simplemente creas un repositorio, copias la url git@... que te aparce al clicar en el boton Code del repositorio ya creado o la que te da al crearlo y haces `git remote add origin git@...` y luego `git push origin main`