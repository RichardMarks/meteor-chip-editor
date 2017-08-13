# Meteor Chip Editor

## What in the world is this?

This project is a meteor based app which allows visual creation of chips for the currently unreleased chip game engine being developed by Richard Marks.

## What is a chip?

_Chips are crunchy, and tend to taste like heaven..._

Haha, no, seriously though, a chip is a single tile in a 2D tile based game environment that is described by a single 32-bit integer.

## What?

Many 2D games are represented by a tile-based game environment.
Tiles are squares of pixel data which are the graphics you see in the game. Usually they are multi-colored and represented by image files like bmp or png.

The chip engine has an extremely low resolution and also a very restrictive technical architecture by design. Each chip may be made using a single color, and is only 5x5 pixels in size.

The NES and other retro consoles uses tiles that are 8x8 pixels. So the chip engine having only 5x5 pixels per tile means that you are going to have very minimal details you are able to represent.

## What does a chip look like?

The number `32214844417` in decimal, or `0x2E821A81` in hexadecimal is what describes a white smiley face chip.

You can see the reason that I needed to create an editor for creating these now can't you?

## Chip Data

The following data format is the property of Richard Marks (c) 2017. The use of this format requires that this copyright notice is visible to users of any software using this format.
> CHIP ENGINE CHIP DATA FORMAT v2.0 (C) 2017 Richard Marks
```
# CHIP ENGINE CHIP DATA FORMAT v2.0 (C) 2017 Richard Marks

A chip is represented by a total of 32 bits

byte 1 - color selection + first data bit
 0 - black
 1 - white
 2 - red
 3 - cyan
 4 - violet
 5 - green
 6 - blue
 7 - yellow
 8 - orange
 9 - brown
 10 - light red
 11 - dark grey
 12 - light grey
 13 - light green
 14 - light blue
 15 - lighter grey
 16 - reserved
 ...
 127 - reserved
 128 - data bit 0 (if set, first pixel is turned on, otherwise first pixel is turned off)

 byte 2 - data
 byte 3 - data
 byte 4 - data

 data bytes are tricky and laid out as follows

 the upper left pixel (0,0) is in bit 7 of byte 1

 byte 2
  bit 7 - pixel (1,0)
  bit 6 - pixel (2,0)
  bit 5 - pixel (3,0)
  bit 4 - pixel (4,0)
  bit 3 - pixel (0,1)
  bit 2 - pixel (1,1)
  bit 1 - pixel (2,1)
  bit 0 - pixel (3,1)

 byte 3
  bit 7 - pixel (4,1)
  bit 6 - pixel (0,2)
  bit 5 - pixel (1,2)
  bit 4 - pixel (2,2)
  bit 3 - pixel (3,2)
  bit 2 - pixel (4,2)
  bit 1 - pixel (0,3)
  bit 0 - pixel (1,3)

 byte 4
  bit 7 - pixel (2,3)
  bit 6 - pixel (3,3)
  bit 5 - pixel (4,3)
  bit 4 - pixel (0,4)
  bit 3 - pixel (1,4)
  bit 2 - pixel (2,4)
  bit 1 - pixel (3,4)
  bit 0 - pixel (4,4)
```

> Chip Engine, Chip Editor, Chip, and all related material (C) 2017, Richard Marks
