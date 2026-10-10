---
title: "Install Pulsar OS"
description: "Everything you need to flash the ISO to a USB drive, plus notes about Secure Boot and dual boot."
order: 1
---

Installing Pulsar OS is a task a thousand times easier than installing Windows or macOS.

All you need is a USB drive (or storage memory) and a disk image flashing tool.  

## Windows users  

### Flash the ISO from Windows

You will need a USB drive for this. Basically it is about making it possible to boot an operating system from a USB, as if it were your PC's disk, to then install it.

- Download RUFUS to do it visually. [This is its website](https://rufus.ie/)
- Select the ISO image and set it up as you would for any other Linux distro
- When asked whether to use dd or iso mode, choose **DD mode**  

### Boot Pulsar OS on a Windows PC

Search Google for how to disable Secure Boot on your PC (upcoming releases will include Secure Boot support). What Secure Boot does is verify that the operating system carries a Microsoft signature (to prevent boot-sector viruses) and nothing more — don't worry, Pulsar OS's code is fully open and auditable.

Once Secure Boot is disabled, look up on Google which key on your PC opens the boot loader, from which you should select your USB drive.

Once you have selected the USB, a window will appear with several options:
- We recommend selecting the first one (TO RAM: it copies the whole system from the USB into your computer's memory; it takes a while)
- If it errors out or you think it takes too long (patience is a virtue), select the third option  

## MacOS users  

### Flash the ISO from macOS

You will need a USB drive.

- Download [Balena Etcher here](https://etcher.balena.io/#download-etcher).
- Select the ISO you downloaded, then select your USB and hit flash.

### Boot Pulsar OS on a MacBook

**Important!** Pulsar OS only supports MacBooks with an Intel processor, which you can check under "About This Mac" while in macOS.

- Shut down your computer
- Turn it on and, as soon as the screen lights up, start holding down Alt/Option (depending on what it is called on your keyboard)
- Select the USB

Once you have selected the USB, a window will appear with several options:
- We recommend selecting the first one (TO RAM: it copies the whole system from the USB into your computer's memory; it takes a while)
- If it errors out or you think it takes too long (patience is a virtue), select the third option

## Linux users    


If you don't know how to do it, keep reading. If you already do, you can skip this section.

### Flash the ISO from Linux

**You can use DD**

- If you come from another Linux distribution, we recommend that you **do not use Balena Etcher**. Use `gnome-disk-utility` instead.
- Select the USB and in the ⋯ menu choose "Restore Disk Image".
- In the popup select the Pulsar OS ISO and hit flash.

### Boot Pulsar OS on a Linux PC

- Search Google for the key combination to enter your PC's boot loader and select the USB there. Remember to have disabled Secure Boot.

## Secure Boot

Our great friend Secure Boot, a Microsoft invention to prevent the installation of Linux at the hardware level. Obviously it has a security component too, but it is a big pain for Linux.

We are trying to implement support for Secure Boot. In the meantime, you will need to go into your device's BIOS and disable it. It is not a virus or danger: the only thing your computer will not do is check the integrity of your operating system before starting it, to avoid viruses. But Linux has fewer viruses than Windows, and Pulsar OS is 100% auditable.

**Search Google for specific instructions to know how to disable Secure Boot on your device model.** You can use the AI we have already prepared for you [here, thanks to Google AI Mode](https://www.google.com/search?q=you+will+act+as+an+assistant+that+searches+the+internet+and+explains+to+the+user+how+to+disable+secure+boot+on+their+computer).

## Dual boot    

Pulsar OS supports dual boot (installing it alongside another operating system).
What you have to do is select the Dual Boot option in the installer and the GParted program will open, from which you can resize the system partition you already have to make room for a new one, which you will then need to format as ext4; finally, when leaving GParted, reload the partition list.

## Don't understand some concepts? Ask us on Discord or Telegram and we will give you personal support.

## Ventoy  
**Not supported in the currently published version**
The next version (2.0) will support it.