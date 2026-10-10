---
title: "Install Pulsar OS"
description: "Everything you need to flash the ISO to a USB drive, plus notes about Secure Boot and dual boot."
order: 1
---

Installing Pulsar OS is a task a thousand times easier than installing Windows or macOS.

All you need is a USB drive (or storage memory) and a disk image flashing tool.  

## Windows users  

### Flashear la ISO desde Windows  

Necesitarás un USB para esto. Basicamente se trata de hacer que puedas arrancar un sistema operativo desde un USB, como si fuera el disco de tu PC, para luego instalarlo.  

- Descarga RUFUS para hacerlo visualmente. [Esta es su web](https://rufus.ie/)  
- Selecciona la imagen ISO y configura como para cualquier otra distro Linux
- Cuando te pregunte si usar modo dd o iso, selecciona **modo DD**  

### Arrancar Pulsar OS en un PC Windows  

Busca en Google como desactivar el Secure Boot en tu PC (próximas versiones incluirán soporte para secure Boot). Secure Boot lo que hace es verificar que el sistema operativo tiene una firma de Microsoft (para evitar virus de sector de arranque) pero nada más, no te preocupes, el código de Pulsar OS es completamente abierto y auditable.  

Una vez hayas desactivado Secure Boot, encuentra en Google cual es la tecla que en tu PC sirve para acceder al cargador de arranque desde el cual deberás seleccionar tu USB.  

Una vez seleccionado el USB, te aparecerá una ventana en la que tendrás varias opciones:
- Se recomienda seleccionar la primera (TO RAM, copiará el todo el sistema que está en el USB a la memoria de tu ordenador, tardará un rato)
- En caso de que de error o consideres queb tarda mucho (la paciencia es buena consejera) selecciona la tercera opción  

## MacOS users  

### Flashear la ISO desde MacOS 

Necesitarás una memoria USB.  

- Descarga [Balena Etcher aquí](https://etcher.balena.io/#download-etcher).  
- Selecciona la ISO que te has bajado, luego selecciona tu USB y dale a flashear.  

### Arrancar Pulsar OS en un MacBook  

**Importante!** Pulsar OS solo soporta Macbooks con procesador de Intel, lo cual puedes comprobar en el menú Acerca de mi Mac cuando estés en MacOS.  

- Apaga tu ordenador  
- Enciéndelo y cuando veas que la pantalla emite luz empieza a mantener presionado Alt/Option (según como se llame en tu teclado)  
- Selecciona el USB  

Una vez seleccionado el USB, te aparecerá una ventana en la que tendrás varias opciones:
- Se recomienda seleccionar la primera (TO RAM, copiará el todo el sistema que está en el USB a la memoria de tu ordenador, tardará un rato)
- En caso de que de error o consideres queb tarda mucho (la paciencia es buena consejera) selecciona la tercera opción    

## Linux users    


Si no sabes como hacerlo, sigue esta guía. Si ya sabes, no hace falta leerla.

### Flashear ISO desde Linux  

**Puedes usar DD**

- If you come from another Linux distribution, we recommend that you **do not use Balena Etcher**. Use `gnome-disk-utility` instead.
- Selecciona el USB y en el menú de los ··· selecciona Restaurar imagen de disco.  
- En el popup selecciona la ISO de Pulsar OS y dale a flashear.  

### Arrancar Pulsar OS en un PC con Linux  

- BUsca en Google la combinación de teclas para accedr al cargador de arranque de tu PC y en él selecciona el USB. Recuerda haber desactivado Secure Boot.

## Secure Boot

Our great friend Secure Boot, a Microsoft invention to prevent the installation of Linux at the hardware level. Obviously it has a security component too, but it is a big pain for Linux.

We are trying to implement support for Secure Boot. In the meantime, you will need to go into your device's BIOS and disable it. It is not a virus or danger: the only thing your computer will not do is check the integrity of your operating system before starting it, to avoid viruses. But Linux has fewer viruses than Windows, and Pulsar OS is 100% auditable.

**Search Google for specific instructions to know how to disable Secure Boot on your device model.** You can use the AI we have already prepared for you [here, thanks to Google AI Mode](https://www.google.com/search?q=vas+a+hacer+de+asistente+que+buscar%C3%A1+en+internet+y+explicar%C3%A1+al+usuario+como+desactivar+secure+boot+en+su+ordenador).

## Dual boot    

Pulsar OS soporta dual boot (instalarlo al lado de otro sistema operativo).  
Lo que debes hacer es seleccionar la opción de Dual Boot en el instalador y se te abrirá el programa GParted, desde el cual puedes redimensionar la partición del sistema que ya tienes para dejar espacio para crear otra la cual luego deberás formatear a formato ext4 y finalmente al salir de GPARTED recargar la lista de particiones.  

## No entiendes algunos conceptos? Pregúntanos en Discord o Telegram y te atenderemos personalizadamente.

## Ventoy  
**No está soportado en la versión actual publicada**  
En la próxima versión (2.0) sí que lo estará.