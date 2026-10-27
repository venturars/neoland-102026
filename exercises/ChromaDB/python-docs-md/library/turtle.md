---
page: library/turtle.html
title: turtle — Turtle graphics
area: library
kind: guide
module: turtle
---

<!-- anchor: module-turtle | type: section -->
# `turtle` — Turtle graphics

**Source code:** Lib/turtle.py

Turtle star

Turtle can draw intricate shapes using programs that repeat simple moves.

[Image: A yellow starburst of thin spikes with a red outline, drawn by turtle.]

Imagine a robotic turtle starting at (0, 0) in the x-y plane. After an `import turtle`, give it the command `turtle.forward(15)`, and it moves (on-screen!) 15 pixels in the direction it is facing, drawing a line as it moves. Give it the command `turtle.right(25)`, and it rotates in-place 25 degrees clockwise.

Turtle graphics is an implementation of the drawing tools introduced in Logo in 1967. It was created as an educational tool, and its instant, visible feedback makes it an effective way for learners to encounter programming concepts. It is also a convenient way to produce simple graphical output without bringing in external libraries.

This document includes four main sections:

- Tutorial teaches the basics of turtle drawing.

- Reference describes the functions, methods and classes this module defines.

- How-to guides detail how to handle specific tasks.

- Explanation provides background on the object-oriented interface.

**Note:**

Turtle graphics requires the `tkinter` optional module. The python.org installers for Windows and macOS include it, but some Linux distributions and other platforms may package it separately. If `import turtle` fails with an error mentioning `_tkinter`, look for documentation from your distributor (that is, whoever provided Python to you). Check this in advance if you’re planning to use turtle graphics with a learner.

<!-- anchor: tutorial | type: section -->
## Tutorial

New users should start here. In this tutorial we’ll explore some of the basics of turtle drawing.

<!-- anchor: starting-a-turtle-environment | type: section -->
### Starting a turtle environment

In a Python shell, import all the objects of the `turtle` module:

```python
from turtle import *
```

If you run into a `Standard library module '_tkinter' was not found` error, you’ll have to install the `Tk interface package` on your system.

Nothing appears yet. To open the turtle window, make the turtle visible:

```python
showturtle()
```

A new window opens, with the turtle in the middle, shown as an arrow heading East.

<!-- anchor: basic-drawing | type: section -->
### Basic drawing

Send the turtle forward 100 steps:

```python
forward(100)
```

You should see a line drawn by the turtle, heading East. Change the direction of the turtle, so that it turns 120 degrees left (anti-clockwise):

```python
left(120)
```

Let’s continue by drawing a triangle:

```python
forward(100)
left(120)
forward(100)
```

Notice how the turtle, represented by an arrow, points in different directions as you steer it.

Experiment with those commands, and also with `backward()` and `right()`. Many commands also have shorter aliases, such as `fd()` for `forward()`.

<!-- anchor: pen-control | type: section -->
#### Pen control

Try changing the color - for example, `color('blue')` - and width of the line - for example, `width(3)` - and then drawing again.

You can also move the turtle around without drawing, by lifting up the pen: `up()` before moving. To start drawing again, use `down()`.

<!-- anchor: the-turtle-s-position | type: section -->
#### The turtle’s position

Send your turtle back to its starting-point (useful if it has disappeared off-screen):

```python
home()
```

The home position is at the center of the turtle’s screen. If you ever need to know them, get the turtle’s x-y coordinates with:

```python
pos()
```

Home is at `(0, 0)`.

And after a while, it will probably help to clear the window so we can start anew:

```python
clearscreen()
```

<!-- anchor: making-algorithmic-patterns | type: section -->
### Making algorithmic patterns

Using loops, it’s possible to build up geometric patterns:

```python
for steps in range(100):
    for c in ('blue', 'red', 'green'):
        color(c)
        forward(steps)
        right(30)
```

- which of course, are limited only by the imagination!

Let’s draw the star shape at the top of this page. We want red lines, filled in with yellow:

```python
color('red')
fillcolor('yellow')
```

Just as `up()` and `down()` determine whether lines will be drawn, filling can be turned on and off:

```python
begin_fill()
```

Next we’ll create a loop:

```python
start = pos()

while True:
    forward(200)
    left(170)
    if distance(start) < 1:
        break
```

`distance(start) < 1` is a good way to know when the turtle is back at its start position.

Finally, complete the filling:

```python
end_fill()
```

(Note that filling only actually takes place when you give the `end_fill()` command.)

<!-- anchor: reference | type: section -->
## Reference

<!-- anchor: turtle-methods-and-functions | type: section -->
### Turtle methods and functions

Most of the examples in this section refer to a Turtle instance called `turtle`.

<!-- anchor: move-and-draw | type: section -->
#### Move and draw

<!-- anchor: turtle.forward | type: py function -->
##### `turtle.forward(distance)`

`turtle.fd(distance)`

**Parameters:**

**distance** – a number

Move the turtle forward by the specified *distance*, in the direction the turtle is headed.

```pycon
>>> turtle.position()
(0.00,0.00)
>>> turtle.forward(25)
>>> turtle.position()
(25.00,0.00)
>>> turtle.forward(-75)
>>> turtle.position()
(-50.00,0.00)
```

<!-- anchor: turtle.back | type: py function -->
##### `turtle.back(distance)`

`turtle.bk(distance)`

`turtle.backward(distance)`

**Parameters:**

**distance** – a number

Move the turtle backward by *distance*, opposite to the direction the turtle is headed. The turtle’s heading does not change.

```pycon
>>> turtle.position()
(0.00,0.00)
>>> turtle.backward(30)
>>> turtle.position()
(-30.00,0.00)
```

<!-- anchor: turtle.right | type: py function -->
##### `turtle.right(angle)`

`turtle.rt(angle)`

**Parameters:**

**angle** – a number

Turn the turtle right by the specified *angle*. The angle is measured in degrees by default; the unit can be changed with `degrees()` or `radians()`. How the heading is measured depends on the turtle mode, see `mode()`.

```pycon
>>> turtle.heading()
22.0
>>> turtle.right(45)
>>> turtle.heading()
337.0
```

<!-- anchor: turtle.left | type: py function -->
##### `turtle.left(angle)`

`turtle.lt(angle)`

**Parameters:**

**angle** – a number

Turn the turtle left by the specified *angle*. The angle is measured in degrees by default; the unit can be changed with `degrees()` or `radians()`. How the heading is measured depends on the turtle mode, see `mode()`.

```pycon
>>> turtle.heading()
22.0
>>> turtle.left(45)
>>> turtle.heading()
67.0
```

<!-- anchor: turtle.goto | type: py function -->
##### `turtle.goto(x, y=None)`

`turtle.setpos(x, y=None)`

`turtle.setposition(x, y=None)`

**Parameters:**

- **x** – a number or a pair/vector of numbers

- **y** – a number or `None`

Move the turtle to an absolute position. If *y* is `None`, *x* must be a pair of coordinates or a `Vec2D`, for example as returned by `pos()`. If the pen is down, a line is drawn. The turtle’s heading does not change.

```pycon
>>> tp = turtle.pos()
>>> tp
(0.00,0.00)
>>> turtle.goto(60,30)
>>> turtle.pos()
(60.00,30.00)
>>> turtle.goto((20,80))
>>> turtle.pos()
(20.00,80.00)
>>> turtle.goto(tp)
>>> turtle.pos()
(0.00,0.00)
```

<!-- anchor: turtle.teleport | type: py function -->
##### `turtle.teleport(x, y=None, *, fill_gap=False)`

**Parameters:**

- **x** – a number or `None`

- **y** – a number or `None`

- **fill_gap** – a boolean

Move turtle to an absolute position. Unlike goto(x, y), a line will not be drawn. The turtle’s orientation does not change. If currently filling, the polygon(s) teleported from will be filled after leaving, and filling will begin again after teleporting. This can be disabled with fill_gap=True, which makes the imaginary line traveled during teleporting act as a fill barrier like in goto(x, y).

```pycon
>>> tp = turtle.pos()
>>> tp
(0.00,0.00)
>>> turtle.teleport(60)
>>> turtle.pos()
(60.00,0.00)
>>> turtle.teleport(y=10)
>>> turtle.pos()
(60.00,10.00)
>>> turtle.teleport(20, 30)
>>> turtle.pos()
(20.00,30.00)
```

Added in version 3.12.

<!-- anchor: turtle.setx | type: py function -->
##### `turtle.setx(x)`

**Parameters:**

**x** – a number

Set the turtle’s x coordinate to *x*. The y coordinate is unchanged.

```pycon
>>> turtle.position()
(0.00,240.00)
>>> turtle.setx(10)
>>> turtle.position()
(10.00,240.00)
```

<!-- anchor: turtle.sety | type: py function -->
##### `turtle.sety(y)`

**Parameters:**

**y** – a number

Set the turtle’s y coordinate to *y*. The x coordinate is unchanged.

```pycon
>>> turtle.position()
(0.00,40.00)
>>> turtle.sety(-10)
>>> turtle.position()
(0.00,-10.00)
```

<!-- anchor: turtle.setheading | type: py function -->
##### `turtle.setheading(to_angle)`

`turtle.seth(to_angle)`

**Parameters:**

**to_angle** – a number

Set the turtle’s heading to *to_angle*. Here are some common directions in degrees:

| standard mode | logo mode |
| --- | --- |
| 0 - east | 0 - north |
| 90 - north | 90 - east |
| 180 - west | 180 - south |
| 270 - south | 270 - west |

```pycon
>>> turtle.setheading(90)
>>> turtle.heading()
90.0
```

<!-- anchor: turtle.home | type: py function -->
##### `turtle.home()`

Move the turtle to the origin, coordinates (0,0). The turtle’s heading is set to its start orientation, which depends on the turtle mode, see `mode()`.

```pycon
>>> turtle.heading()
90.0
>>> turtle.position()
(0.00,-10.00)
>>> turtle.home()
>>> turtle.position()
(0.00,0.00)
>>> turtle.heading()
0.0
```

<!-- anchor: turtle.circle | type: py function -->
##### `turtle.circle(radius, extent=None, steps=None)`

**Parameters:**

- **radius** – a number

- **extent** – a number or `None`

- **steps** – an integer or `None`

Draw a circle with the given *radius*. The center is *radius* units left of the turtle; *extent*, an angle, determines which part of the circle is drawn. If *extent* is not given, draw the entire circle. If *extent* is not a full circle, one endpoint of the arc is the current pen position. Draw the arc in counterclockwise direction if *radius* is positive, otherwise in clockwise direction. Finally, the turtle’s heading is changed by *extent*.

As the circle is approximated by an inscribed regular polygon, *steps* determines the number of steps to use. If not given, it will be calculated automatically. May be used to draw regular polygons.

```pycon
>>> turtle.home()
>>> turtle.position()
(0.00,0.00)
>>> turtle.heading()
0.0
>>> turtle.circle(50)
>>> turtle.position()
(-0.00,0.00)
>>> turtle.heading()
0.0
>>> turtle.circle(120, 180)  # draw a semicircle
>>> turtle.position()
(0.00,240.00)
>>> turtle.heading()
180.0
```

<!-- anchor: turtle.dot | type: py function -->
##### `turtle.dot()`

`turtle.dot(size)`

`turtle.dot(color, /)`

`turtle.dot(size, color, /)`

`turtle.dot(size, r, g, b, /)`

**Parameters:**

- **size** – an integer >= 1 (if given)

- **color** – a colorstring or a numeric color tuple

Draw a circular dot with diameter *size*, using *color*. If *size* is not given, the maximum of `pensize+4` and `2*pensize` is used.

```pycon
>>> turtle.home()
>>> turtle.dot()
>>> turtle.fd(50); turtle.dot(20, "blue"); turtle.fd(50)
>>> turtle.position()
(100.00,-0.00)
>>> turtle.heading()
0.0
```

<!-- anchor: turtle.stamp | type: py function -->
##### `turtle.stamp()`

Stamp a copy of the turtle shape onto the canvas at the current turtle position. Return a stamp_id for that stamp, which can be used to delete it by calling `clearstamp(stamp_id)`.

```pycon
>>> turtle.color("blue")
>>> stamp_id = turtle.stamp()
>>> turtle.fd(50)
```

<!-- anchor: turtle.clearstamp | type: py function -->
##### `turtle.clearstamp(stampid)`

**Parameters:**

**stampid** – an integer, must be return value of previous `stamp()` call

Delete stamp with given *stampid*.

```pycon
>>> turtle.position()
(150.00,-0.00)
>>> turtle.color("blue")
>>> astamp = turtle.stamp()
>>> turtle.fd(50)
>>> turtle.position()
(200.00,-0.00)
>>> turtle.clearstamp(astamp)
>>> turtle.position()
(200.00,-0.00)
```

<!-- anchor: turtle.clearstamps | type: py function -->
##### `turtle.clearstamps(n=None)`

**Parameters:**

**n** – an integer (or `None`)

Delete all or first/last *n* of turtle’s stamps. If *n* is `None`, delete all stamps, if *n* > 0 delete first *n* stamps, else if *n* < 0 delete last *n* stamps.

```pycon
>>> for i in range(8):
...     unused_stamp_id = turtle.stamp()
...     turtle.fd(30)
>>> turtle.clearstamps(2)
>>> turtle.clearstamps(-2)
>>> turtle.clearstamps()
```

<!-- anchor: turtle.undo | type: py function -->
##### `turtle.undo()`

Undo (repeatedly) the last turtle action(s). Number of available undo actions is determined by the size of the undobuffer.

```pycon
>>> for i in range(4):
...     turtle.fd(50); turtle.lt(80)
...
>>> for i in range(8):
...     turtle.undo()
```

<!-- anchor: turtle.speed | type: py function -->
##### `turtle.speed(speed=None)`

**Parameters:**

**speed** – an integer in the range 0..10 or a speedstring (see below)

Set the turtle’s speed to an integer value in the range 0..10. If no argument is given, return current speed.

If input is a number greater than 10 or smaller than 0.5, speed is set to 0. Speedstrings are mapped to speedvalues as follows:

- “fastest”: 0

- “fast”: 10

- “normal”: 6

- “slow”: 3

- “slowest”: 1

Speeds from 1 to 10 enforce increasingly faster animation of line drawing and turtle turning.

Attention: *speed* = 0 means that *no* animation takes place. forward/back makes turtle jump and likewise left/right make the turtle turn instantly.

```pycon
>>> turtle.speed()
3
>>> turtle.speed('normal')
>>> turtle.speed()
6
>>> turtle.speed(9)
>>> turtle.speed()
9
```

<!-- anchor: tell-turtle-s-state | type: section -->
#### Tell Turtle’s state

<!-- anchor: turtle.position | type: py function -->
##### `turtle.position()`

`turtle.pos()`

Return the turtle’s current location (x,y) as a `Vec2D` vector.

```pycon
>>> turtle.pos()
(440.00,-0.00)
```

<!-- anchor: turtle.towards | type: py function -->
##### `turtle.towards(x, y=None)`

**Parameters:**

- **x** – a number or a pair/vector of numbers or a turtle instance

- **y** – a number if *x* is a number, else `None`

Return the angle of the line from the turtle’s position to (x,y). If *y* is `None`, *x* must be a pair of coordinates, a `Vec2D`, for example as returned by `pos()`, or another turtle. The angle is measured from the turtle’s start orientation, which depends on the turtle mode, see `mode()`.

```pycon
>>> turtle.goto(10, 10)
>>> turtle.towards(0,0)
225.0
```

<!-- anchor: turtle.xcor | type: py function -->
##### `turtle.xcor()`

Return the turtle’s x coordinate.

```pycon
>>> turtle.home()
>>> turtle.left(50)
>>> turtle.forward(100)
>>> turtle.pos()
(64.28,76.60)
>>> print(round(turtle.xcor(), 5))
64.27876
```

<!-- anchor: turtle.ycor | type: py function -->
##### `turtle.ycor()`

Return the turtle’s y coordinate.

```pycon
>>> turtle.home()
>>> turtle.left(60)
>>> turtle.forward(100)
>>> print(turtle.pos())
(50.00,86.60)
>>> print(round(turtle.ycor(), 5))
86.60254
```

<!-- anchor: turtle.heading | type: py function -->
##### `turtle.heading()`

Return the turtle’s current heading. The value depends on the turtle mode, see `mode()`.

```pycon
>>> turtle.home()
>>> turtle.left(67)
>>> turtle.heading()
67.0
```

<!-- anchor: turtle.distance | type: py function -->
##### `turtle.distance(x, y=None)`

**Parameters:**

- **x** – a number or a pair/vector of numbers or a turtle instance

- **y** – a number if *x* is a number, else `None`

Return the distance from the turtle to (x,y) in turtle step units. If *y* is `None`, *x* must be a pair of coordinates, a `Vec2D`, for example as returned by `pos()`, or another turtle.

```pycon
>>> turtle.home()
>>> turtle.distance(30,40)
50.0
>>> turtle.distance((30,40))
50.0
>>> joe = Turtle()
>>> joe.forward(77)
>>> turtle.distance(joe)
77.0
```

<!-- anchor: settings-for-measurement | type: section -->
#### Settings for measurement

<!-- anchor: turtle.degrees | type: py function -->
##### `turtle.degrees(fullcircle=360.0)`

**Parameters:**

**fullcircle** – a number

Set the angle measurement units to degrees. The number of degrees in a full circle is set to *fullcircle*, which defaults to 360.

```pycon
>>> turtle.home()
>>> turtle.left(90)
>>> turtle.heading()
90.0

>>> # Change angle measurement unit to grad (also known as gon,
>>> # grade, or gradian and equals 1/100-th of the right angle.)
>>> turtle.degrees(400.0)
>>> turtle.heading()
100.0
>>> turtle.degrees(360)
>>> turtle.heading()
90.0
```

<!-- anchor: turtle.radians | type: py function -->
##### `turtle.radians()`

Set the angle measurement units to radians. Equivalent to `degrees(2 * math.pi)`.

```pycon
>>> turtle.home()
>>> turtle.left(90)
>>> turtle.heading()
90.0
>>> turtle.radians()
>>> turtle.heading()
1.5707963267948966
```

<!-- anchor: id1 | type: section -->
#### Pen control

<!-- anchor: drawing-state | type: section -->
##### Drawing state

<!-- anchor: turtle.pendown | type: py function -->
###### `turtle.pendown()`

`turtle.pd()`

`turtle.down()`

Pull the pen down – drawing when moving.

<!-- anchor: turtle.penup | type: py function -->
###### `turtle.penup()`

`turtle.pu()`

`turtle.up()`

Pull the pen up – no drawing when moving.

<!-- anchor: turtle.pensize | type: py function -->
###### `turtle.pensize(width=None)`

`turtle.width(width=None)`

**Parameters:**

**width** – a positive number

Set the line thickness to *width* or return it. If resizemode is set to “auto” and turtleshape is a polygon, that polygon is drawn with the same line thickness. If no argument is given, the current pensize is returned.

```pycon
>>> turtle.pensize()
1
>>> turtle.pensize(10)   # from here on lines of width 10 are drawn
```

<!-- anchor: turtle.pen | type: py function -->
###### `turtle.pen(pen=None, **pendict)`

**Parameters:**

- **pen** – a dictionary with some or all of the below listed keys

- **pendict** – one or more keyword-arguments with the below listed keys as keywords

Return or set the pen’s attributes in a “pen-dictionary” with the following key/value pairs:

- “shown”: True/False

- “pendown”: True/False

- “pencolor”: color-string or color-tuple

- “fillcolor”: color-string or color-tuple

- “pensize”: positive number

- “speed”: number in range 0..10

- “resizemode”: “auto” or “user” or “noresize”

- “stretchfactor”: (positive number, positive number)

- “outline”: positive number

- “tilt”: number

This dictionary can be used as argument for a subsequent call to `pen()` to restore the former pen-state. Moreover one or more of these attributes can be provided as keyword-arguments. This can be used to set several pen attributes in one statement.

```pycon
>>> turtle.pen(fillcolor="black", pencolor="red", pensize=10)
>>> sorted(turtle.pen().items())
[('fillcolor', 'black'), ('outline', 1), ('pencolor', 'red'),
 ('pendown', True), ('pensize', 10), ('resizemode', 'noresize'),
 ('shearfactor', 0.0), ('shown', True), ('speed', 9),
 ('stretchfactor', (1.0, 1.0)), ('tilt', 0.0)]
>>> penstate=turtle.pen()
>>> turtle.color("yellow", "")
>>> turtle.penup()
>>> sorted(turtle.pen().items())[:3]
[('fillcolor', ''), ('outline', 1), ('pencolor', 'yellow')]
>>> turtle.pen(penstate, fillcolor="green")
>>> sorted(turtle.pen().items())[:3]
[('fillcolor', 'green'), ('outline', 1), ('pencolor', 'red')]
```

<!-- anchor: turtle.isdown | type: py function -->
###### `turtle.isdown()`

Return `True` if pen is down, `False` if it’s up.

```pycon
>>> turtle.penup()
>>> turtle.isdown()
False
>>> turtle.pendown()
>>> turtle.isdown()
True
```

<!-- anchor: color-control | type: section -->
##### Color control

<!-- anchor: turtle.pencolor | type: py function -->
###### `turtle.pencolor()`

`turtle.pencolor(color, /)`

`turtle.pencolor(r, g, b, /)`

Return or set the pencolor.

Four input formats are allowed:

**`pencolor()`**

Return the current pencolor as color specification string or as a tuple (see example). May be used as input to another `color()`, `pencolor()`, `fillcolor()` or `bgcolor()` call.

**`pencolor(colorstring)`**

Set pencolor to *colorstring*, which is a Tk color specification string, such as `"red"`, `"yellow"`, or `"#33cc8c"`.

**`pencolor((r, g, b))`**

Set pencolor to the RGB color represented by the tuple of *r*, *g*, and *b*. Each of *r*, *g*, and *b* must be in the range 0..colormode, where colormode is either 1.0 or 255 (see `colormode()`).

**`pencolor(r, g, b)`**

Set pencolor to the RGB color represented by *r*, *g*, and *b*. Each of *r*, *g*, and *b* must be in the range 0..colormode.

If turtleshape is a polygon, the outline of that polygon is drawn with the newly set pencolor.

```pycon
>>> colormode()
1.0
>>> turtle.pencolor()
'red'
>>> turtle.pencolor("brown")
>>> turtle.pencolor()
'brown'
>>> tup = (0.2, 0.8, 0.55)
>>> turtle.pencolor(tup)
>>> turtle.pencolor()
(0.2, 0.8, 0.5490196078431373)
>>> colormode(255)
>>> turtle.pencolor()
(51.0, 204.0, 140.0)
>>> turtle.pencolor('#32c18f')
>>> turtle.pencolor()
(50.0, 193.0, 143.0)
```

<!-- anchor: turtle.fillcolor | type: py function -->
###### `turtle.fillcolor()`

`turtle.fillcolor(color, /)`

`turtle.fillcolor(r, g, b, /)`

Return or set the fillcolor.

Four input formats are allowed:

**`fillcolor()`**

Return the current fillcolor as color specification string, possibly in tuple format (see example). May be used as input to another `color()`, `pencolor()`, `fillcolor()` or `bgcolor()` call.

**`fillcolor(colorstring)`**

Set fillcolor to *colorstring*, which is a Tk color specification string, such as `"red"`, `"yellow"`, or `"#33cc8c"`.

**`fillcolor((r, g, b))`**

Set fillcolor to the RGB color represented by the tuple of *r*, *g*, and *b*. Each of *r*, *g*, and *b* must be in the range 0..colormode, where colormode is either 1.0 or 255 (see `colormode()`).

**`fillcolor(r, g, b)`**

Set fillcolor to the RGB color represented by *r*, *g*, and *b*. Each of *r*, *g*, and *b* must be in the range 0..colormode.

If turtleshape is a polygon, the interior of that polygon is drawn with the newly set fillcolor.

```pycon
>>> turtle.fillcolor("violet")
>>> turtle.fillcolor()
'violet'
>>> turtle.pencolor()
(50.0, 193.0, 143.0)
>>> turtle.fillcolor((50, 193, 143))  # Integers, not floats
>>> turtle.fillcolor()
(50.0, 193.0, 143.0)
>>> turtle.fillcolor('#ffffff')
>>> turtle.fillcolor()
(255.0, 255.0, 255.0)
```

<!-- anchor: turtle.color | type: py function -->
###### `turtle.color()`

`turtle.color(color, /)`

`turtle.color(r, g, b, /)`

`turtle.color(pencolor, fillcolor, /)`

Return or set pencolor and fillcolor.

Several input formats are allowed. They use 0 to 3 arguments as follows:

**`color()`**

Return the current pencolor and the current fillcolor as a pair of color specification strings or tuples as returned by `pencolor()` and `fillcolor()`.

**`color(colorstring)`, `color((r,g,b))`, `color(r,g,b)`**

Inputs as in `pencolor()`, set both, fillcolor and pencolor, to the given value.

**`color(colorstring1, colorstring2)`, `color((r1,g1,b1), (r2,g2,b2))`**

Equivalent to `pencolor(colorstring1)` and `fillcolor(colorstring2)` and analogously if the other input format is used.

If turtleshape is a polygon, outline and interior of that polygon is drawn with the newly set colors.

```pycon
>>> turtle.color("red", "green")
>>> turtle.color()
('red', 'green')
>>> color("#285078", "#a0c8f0")
>>> color()
((40.0, 80.0, 120.0), (160.0, 200.0, 240.0))
```

See also: Screen method `colormode()`.

<!-- anchor: filling | type: section -->
##### Filling

<!-- anchor: turtle.filling | type: py function -->
###### `turtle.filling()`

Return fillstate (`True` if filling, `False` else).

```pycon
>>> turtle.begin_fill()
>>> if turtle.filling():
...    turtle.pensize(5)
... else:
...    turtle.pensize(3)
```

<!-- anchor: turtle.fill | type: py function -->
###### `turtle.fill()`

Fill the shape drawn in the `with turtle.fill():` block.

```pycon
>>> turtle.color("black", "red")
>>> with turtle.fill():
...     turtle.circle(80)
```

Using `fill()` is equivalent to adding the `begin_fill()` before the fill-block and `end_fill()` after the fill-block:

```pycon
>>> turtle.color("black", "red")
>>> turtle.begin_fill()
>>> turtle.circle(80)
>>> turtle.end_fill()
```

Added in version 3.14.

<!-- anchor: turtle.begin_fill | type: py function -->
###### `turtle.begin_fill()`

To be called just before drawing a shape to be filled.

<!-- anchor: turtle.end_fill | type: py function -->
###### `turtle.end_fill()`

Fill the shape drawn after the last call to `begin_fill()`.

Whether or not overlap regions for self-intersecting polygons or multiple shapes are filled depends on the operating system graphics, type of overlap, and number of overlaps. For example, the Turtle star above may be either all yellow or have some white regions.

```pycon
>>> turtle.color("black", "red")
>>> turtle.begin_fill()
>>> turtle.circle(80)
>>> turtle.end_fill()
```

<!-- anchor: more-drawing-control | type: section -->
##### More drawing control

<!-- anchor: turtle.reset | type: py function -->
###### `turtle.reset()`

Delete the turtle’s drawings and re-center the turtle. The turtle’s settings are restored to their default values.

```pycon
>>> turtle.goto(0,-22)
>>> turtle.left(100)
>>> turtle.position()
(0.00,-22.00)
>>> turtle.heading()
100.0
>>> turtle.reset()
>>> turtle.position()
(0.00,0.00)
>>> turtle.heading()
0.0
```

<!-- anchor: turtle.clear | type: py function -->
###### `turtle.clear()`

Delete the turtle’s drawings from the screen. The state and position of the turtle as well as the drawings of other turtles are not affected.

<!-- anchor: turtle.write | type: py function -->
###### `turtle.write(arg, move=False, align='left', font=('Arial', 8, 'normal'))`

**Parameters:**

- **arg** – object to be written to the TurtleScreen

- **move** – True/False

- **align** – one of the strings “left”, “center” or right”

- **font** – a triple (fontname, fontsize, fonttype)

Write text - the string representation of *arg* - at the current turtle position according to *align* (“left”, “center” or “right”) and with the given font. If *move* is true, the pen is moved to the bottom-right corner of the text. By default, *move* is `False`.

```pycon
>>> turtle.write("Home = ", True, align="center")
>>> turtle.write((0,0), True)
```

<!-- anchor: turtle-state | type: section -->
#### Turtle state

<!-- anchor: visibility | type: section -->
##### Visibility

<!-- anchor: turtle.hideturtle | type: py function -->
###### `turtle.hideturtle()`

`turtle.ht()`

Make the turtle invisible. If the pen is down, movement still draws.

<!-- anchor: turtle.showturtle | type: py function -->
###### `turtle.showturtle()`

`turtle.st()`

Make the turtle visible.

<!-- anchor: turtle.isvisible | type: py function -->
###### `turtle.isvisible()`

Return `True` if the turtle is shown, `False` if it’s hidden.

```pycon
>>> turtle.hideturtle()
>>> turtle.isvisible()
False
>>> turtle.showturtle()
>>> turtle.isvisible()
True
```

<!-- anchor: appearance | type: section -->
##### Appearance

<!-- anchor: turtle.shape | type: py function -->
###### `turtle.shape(name=None)`

**Parameters:**

**name** – a string which is a valid shapename

Set turtle shape to shape with given *name* or, if name is not given, return name of current shape. Shape with *name* must exist in the TurtleScreen’s shape dictionary. Initially there are the following polygon shapes: “arrow”, “turtle”, “circle”, “square”, “triangle”, “classic”. To learn about how to deal with shapes see Screen method `register_shape()`.

```pycon
>>> turtle.shape()
'classic'
>>> turtle.shape("turtle")
>>> turtle.shape()
'turtle'
```

<!-- anchor: turtle.resizemode | type: py function -->
###### `turtle.resizemode(rmode=None)`

**Parameters:**

**rmode** – one of the strings “auto”, “user”, “noresize”

Set resizemode to one of the values: “auto”, “user”, “noresize”. If *rmode* is not given, return current resizemode. Different resizemodes have the following effects:

- “auto”: adapts the appearance of the turtle corresponding to the value of pensize.

- “user”: adapts the appearance of the turtle according to the values of stretchfactor and outlinewidth (outline), which are set by `shapesize()`.

- “noresize”: no adaption of the turtle’s appearance takes place.

`resizemode("user")` is called by `shapesize()` when used with arguments.

```pycon
>>> turtle.resizemode()
'noresize'
>>> turtle.resizemode("auto")
>>> turtle.resizemode()
'auto'
```

<!-- anchor: turtle.shapesize | type: py function -->
###### `turtle.shapesize(stretch_wid=None, stretch_len=None, outline=None)`

`turtle.turtlesize(stretch_wid=None, stretch_len=None, outline=None)`

**Parameters:**

- **stretch_wid** – positive number

- **stretch_len** – positive number

- **outline** – positive number

Return or set the pen’s attributes x/y-stretchfactors and/or outline. Set resizemode to “user”. If and only if resizemode is set to “user”, the turtle will be displayed stretched according to its stretchfactors: *stretch_wid* is stretchfactor perpendicular to its orientation, *stretch_len* is stretchfactor in direction of its orientation, *outline* determines the width of the shape’s outline.

```pycon
>>> turtle.shapesize()
(1.0, 1.0, 1)
>>> turtle.resizemode("user")
>>> turtle.shapesize(5, 5, 12)
>>> turtle.shapesize()
(5, 5, 12)
>>> turtle.shapesize(outline=8)
>>> turtle.shapesize()
(5, 5, 8)
```

<!-- anchor: turtle.shearfactor | type: py function -->
###### `turtle.shearfactor(shear=None)`

**Parameters:**

**shear** – number (optional)

Set or return the current shearfactor. Shear the turtleshape according to the given shearfactor shear, which is the tangent of the shear angle. Do *not* change the turtle’s heading (direction of movement). If shear is not given: return the current shearfactor, i. e. the tangent of the shear angle, by which lines parallel to the heading of the turtle are sheared.

```pycon
>>> turtle.shape("circle")
>>> turtle.shapesize(5,2)
>>> turtle.shearfactor(0.5)
>>> turtle.shearfactor()
0.5
```

<!-- anchor: turtle.tilt | type: py function -->
###### `turtle.tilt(angle)`

**Parameters:**

**angle** – a number

Rotate the turtleshape by *angle* from its current tilt-angle, but do *not* change the turtle’s heading (direction of movement).

```pycon
>>> turtle.reset()
>>> turtle.shape("circle")
>>> turtle.shapesize(5,2)
>>> turtle.tilt(30)
>>> turtle.fd(50)
>>> turtle.tilt(30)
>>> turtle.fd(50)
```

<!-- anchor: turtle.tiltangle | type: py function -->
###### `turtle.tiltangle(angle=None)`

**Parameters:**

**angle** – a number (optional)

Set or return the current tilt-angle. If angle is given, rotate the turtleshape to point in the direction specified by angle, regardless of its current tilt-angle. Do *not* change the turtle’s heading (direction of movement). If angle is not given: return the current tilt-angle, i. e. the angle between the orientation of the turtleshape and the heading of the turtle (its direction of movement).

```pycon
>>> turtle.reset()
>>> turtle.shape("circle")
>>> turtle.shapesize(5,2)
>>> turtle.tilt(45)
>>> turtle.tiltangle()
45.0
```

<!-- anchor: turtle.shapetransform | type: py function -->
###### `turtle.shapetransform(t11=None, t12=None, t21=None, t22=None)`

**Parameters:**

- **t11** – a number (optional)

- **t12** – a number (optional)

- **t21** – a number (optional)

- **t12** – a number (optional)

Set or return the current transformation matrix of the turtle shape.

If none of the matrix elements are given, return the transformation matrix as a tuple of 4 elements. Otherwise set the given elements and transform the turtleshape according to the matrix consisting of first row t11, t12 and second row t21, t22. The determinant t11 * t22 - t12 * t21 must not be zero, otherwise an error is raised. Modify stretchfactor, shearfactor and tiltangle according to the given matrix.

```pycon
>>> turtle = Turtle()
>>> turtle.shape("square")
>>> turtle.shapesize(4,2)
>>> turtle.shearfactor(-0.5)
>>> turtle.shapetransform()
(4.0, -1.0, -0.0, 2.0)
```

<!-- anchor: turtle.get_shapepoly | type: py function -->
###### `turtle.get_shapepoly()`

Return the current shape polygon as tuple of coordinate pairs. This can be used to define a new shape or components of a compound shape.

```pycon
>>> turtle.shape("square")
>>> turtle.shapetransform(4, -1, 0, 2)
>>> turtle.get_shapepoly()
((50, -20), (30, 20), (-50, 20), (-30, -20))
```

<!-- anchor: using-events | type: section -->
#### Using events

<!-- anchor:  | type: py function -->
##### `turtle.onclick(fun, btn=1, add=None)`

**Parameters:**

- **fun** – a function with two arguments or `None`

- **btn** – an integer

- **add** – a boolean or `None`

Bind *fun* to mouse-click events on this turtle. *fun* is called with the coordinates of the clicked point on the canvas. If *fun* is `None`, existing bindings are removed. *btn* is the number of the mouse button and defaults to 1, the left mouse button. If *add* is `True`, a new binding is added, otherwise it replaces a former binding. Example for the anonymous turtle, that is, the procedural way:

```pycon
>>> def turn(x, y):
...     left(180)
...
>>> onclick(turn)  # Now clicking into the turtle will turn it.
>>> onclick(None)  # event-binding will be removed
```

<!-- anchor: turtle.onrelease | type: py function -->
##### `turtle.onrelease(fun, btn=1, add=None)`

**Parameters:**

- **fun** – a function with two arguments which will be called with the coordinates of the clicked point on the canvas

- **btn** – number of the mouse-button, defaults to 1 (left mouse button)

- **add** – `True` or `False` – if `True`, a new binding will be added, otherwise it will replace a former binding

Bind *fun* to mouse-button-release events on this turtle. If *fun* is `None`, existing bindings are removed.

```pycon
>>> class MyTurtle(Turtle):
...     def glow(self,x,y):
...         self.fillcolor("red")
...     def unglow(self,x,y):
...         self.fillcolor("")
...
>>> turtle = MyTurtle()
>>> turtle.onclick(turtle.glow)     # clicking on turtle turns fillcolor red,
>>> turtle.onrelease(turtle.unglow) # releasing turns it to transparent.
```

<!-- anchor: turtle.ondrag | type: py function -->
##### `turtle.ondrag(fun, btn=1, add=None)`

**Parameters:**

- **fun** – a function with two arguments which will be called with the coordinates of the clicked point on the canvas

- **btn** – number of the mouse-button, defaults to 1 (left mouse button)

- **add** – `True` or `False` – if `True`, a new binding will be added, otherwise it will replace a former binding

Bind *fun* to mouse-move events on this turtle. If *fun* is `None`, existing bindings are removed.

Remark: Every sequence of mouse-move-events on a turtle is preceded by a mouse-click event on that turtle.

```pycon
>>> turtle.ondrag(turtle.goto)
```

Subsequently, clicking and dragging the Turtle will move it across the screen thereby producing handdrawings (if pen is down).

<!-- anchor: special-turtle-methods | type: section -->
#### Special Turtle methods

<!-- anchor: turtle.poly | type: py function -->
##### `turtle.poly()`

Record the vertices of a polygon drawn in the `with turtle.poly():` block. The first and last vertices will be connected.

```pycon
>>> with turtle.poly():
...     turtle.forward(100)
...     turtle.right(60)
...     turtle.forward(100)
```

Added in version 3.14.

<!-- anchor: turtle.begin_poly | type: py function -->
##### `turtle.begin_poly()`

Start recording the vertices of a polygon. The current turtle position is the first vertex of the polygon.

<!-- anchor: turtle.end_poly | type: py function -->
##### `turtle.end_poly()`

Stop recording the vertices of a polygon. The current turtle position is the last vertex of the polygon. This will be connected with the first vertex.

<!-- anchor: turtle.get_poly | type: py function -->
##### `turtle.get_poly()`

Return the last recorded polygon.

```pycon
>>> turtle.home()
>>> turtle.begin_poly()
>>> turtle.fd(100)
>>> turtle.left(20)
>>> turtle.fd(30)
>>> turtle.left(60)
>>> turtle.fd(50)
>>> turtle.end_poly()
>>> p = turtle.get_poly()
>>> register_shape("myFavouriteShape", p)
```

<!-- anchor: turtle.clone | type: py function -->
##### `turtle.clone()`

Create and return a clone of the turtle with same position, heading and turtle properties.

```pycon
>>> mick = Turtle()
>>> joe = mick.clone()
```

<!-- anchor: turtle.getturtle | type: py function -->
##### `turtle.getturtle()`

`turtle.getpen()`

Return the Turtle object itself. Only reasonable use: as a function to return the “anonymous turtle”:

```pycon
>>> pet = getturtle()
>>> pet.fd(50)
>>> pet
<turtle.Turtle object at 0x...>
```

<!-- anchor: turtle.getscreen | type: py function -->
##### `turtle.getscreen()`

Return the `TurtleScreen` object the turtle is drawing on. TurtleScreen methods can then be called for that object.

```pycon
>>> ts = turtle.getscreen()
>>> ts
<turtle._Screen object at 0x...>
>>> ts.bgcolor("pink")
```

<!-- anchor: turtle.setundobuffer | type: py function -->
##### `turtle.setundobuffer(size)`

**Parameters:**

**size** – an integer or `None`

Set or disable undobuffer. If *size* is an integer, an empty undobuffer of given size is installed. *size* gives the maximum number of turtle actions that can be undone by the `undo()` method/function. If *size* is `None`, the undobuffer is disabled.

```pycon
>>> turtle.setundobuffer(42)
```

<!-- anchor: turtle.undobufferentries | type: py function -->
##### `turtle.undobufferentries()`

Return number of entries in the undobuffer.

```pycon
>>> while undobufferentries():
...     undo()
```

<!-- anchor: compound-shapes | type: section -->
#### Compound shapes

To use compound turtle shapes, which consist of several polygons of different color, you must use the helper class `Shape` explicitly as described below:

1. Create an empty Shape object of type “compound”.

2. Add as many components to this object as desired, using the `addcomponent()` method.

   For example:

   ```pycon
   >>> s = Shape("compound")
   >>> poly1 = ((0,0),(10,-5),(0,10),(-10,-5))
   >>> s.addcomponent(poly1, "red", "blue")
   >>> poly2 = ((0,0),(10,-5),(-10,-5))
   >>> s.addcomponent(poly2, "blue", "red")
   ```

3. Now add the Shape to the Screen’s shapelist and use it:

   ```pycon
   >>> register_shape("myshape", s)
   >>> shape("myshape")
   ```

**Note:**

The `Shape` class is used internally by the `register_shape()` method in different ways. The application programmer has to deal with the Shape class *only* when using compound shapes like shown above!

<!-- anchor: screen-methods-and-functions | type: section -->
### Screen methods and functions

Most of the examples in this section refer to a TurtleScreen instance called `screen`.

<!-- anchor: window-control | type: section -->
#### Window control

<!-- anchor: turtle.bgcolor | type: py function -->
##### `turtle.bgcolor()`

`turtle.bgcolor(color, /)`

`turtle.bgcolor(r, g, b, /)`

Return or set the background color of the TurtleScreen.

Four input formats are allowed:

**`bgcolor()`**

Return the current background color as a color specification string or as a tuple (see example). May be used as input to another `color()`, `pencolor()`, `fillcolor()` or `bgcolor()` call.

**`bgcolor(colorstring)`**

Set the background color to *colorstring*, which is a Tk color specification string, such as `"red"`, `"yellow"`, or `"#33cc8c"`.

**`bgcolor((r, g, b))`**

Set the background color to the RGB color represented by the tuple of *r*, *g*, and *b*. Each of *r*, *g*, and *b* must be between 0 and colormode, where colormode is either 1.0 or 255 (see `colormode()`).

**`bgcolor(r, g, b)`**

Set the background color to the RGB color represented by *r*, *g*, and *b*. Each of *r*, *g*, and *b* must be between 0 and colormode.

```pycon
>>> screen.bgcolor("orange")
>>> screen.bgcolor()
'orange'
>>> screen.bgcolor("#800080")
>>> screen.bgcolor()
(128.0, 0.0, 128.0)
```

<!-- anchor: turtle.bgpic | type: py function -->
##### `turtle.bgpic(picname=None)`

**Parameters:**

**picname** – a string, name of an image file (PNG, GIF, PGM, and PPM) or `"nopic"`, or `None`

Set background image or return name of current backgroundimage. If *picname* is a filename, set the corresponding image as background. If *picname* is `"nopic"`, delete background image, if present. If *picname* is `None`, return the filename of the current backgroundimage.

```python
>>> screen.bgpic()
'nopic'
>>> screen.bgpic("landscape.gif")
>>> screen.bgpic()
"landscape.gif"
```

<!-- anchor:  | type: py function -->
##### `turtle.clear()`

**Note:**

This TurtleScreen method is available as a global function only under the name `clearscreen`. The global function `clear` is a different one derived from the Turtle method `clear`.

<!-- anchor: turtle.clearscreen | type: py function -->
##### `turtle.clearscreen()`

Delete all drawings and all turtles from the TurtleScreen. Reset the now empty TurtleScreen to its initial state: white background, no background image, no event bindings and tracing on.

<!-- anchor:  | type: py function -->
##### `turtle.reset()`

**Note:**

This TurtleScreen method is available as a global function only under the name `resetscreen`. The global function `reset` is another one derived from the Turtle method `reset`.

<!-- anchor: turtle.resetscreen | type: py function -->
##### `turtle.resetscreen()`

Reset all turtles on the screen to their initial state.

<!-- anchor: turtle.screensize | type: py function -->
##### `turtle.screensize(canvwidth=None, canvheight=None, bg=None)`

**Parameters:**

- **canvwidth** – positive integer, new width of canvas in pixels

- **canvheight** – positive integer, new height of canvas in pixels

- **bg** – colorstring or color-tuple, new background color

If no arguments are given, return current (canvaswidth, canvasheight). Else resize the canvas the turtles are drawing on. Do not alter the drawing window. To observe hidden parts of the canvas, use the scrollbars. With this method, one can make visible those parts of a drawing which were outside the canvas before.

```pycon
>>> screen.screensize()
(400, 300)
>>> screen.screensize(2000,1500)
>>> screen.screensize()
(2000, 1500)
```

e.g. to search for an erroneously escaped turtle ;-)

<!-- anchor: turtle.setworldcoordinates | type: py function -->
##### `turtle.setworldcoordinates(llx, lly, urx, ury)`

**Parameters:**

- **llx** – a number

- **lly** – a number

- **urx** – a number

- **ury** – a number

Set up a user-defined coordinate system. *llx* and *lly* are the x and y coordinates of the lower left corner of the canvas. *urx* and *ury* are the x and y coordinates of the upper right corner. Switch to mode “world” if necessary, which performs a reset. If mode “world” is already active, all drawings are redrawn according to the new coordinates. In user-defined coordinate systems, angles may appear distorted, see `mode()`.

```pycon
>>> screen.reset()
>>> screen.setworldcoordinates(-50,-7.5,50,7.5)
>>> for _ in range(72):
...     left(10)
...
>>> for _ in range(8):
...     left(45); fd(2)   # a regular octagon
```

<!-- anchor: animation-control | type: section -->
#### Animation control

<!-- anchor: turtle.no_animation | type: py function -->
##### `turtle.no_animation()`

Temporarily turn off turtle animation. The code inside the `with` block is not animated. Once the block is exited, the drawing appears. This is useful for drawing complex shapes where even the fastest speed setting is too slow.

```pycon
>>> with screen.no_animation():
...     for dist in range(2, 400, 2):
...         fd(dist)
...         rt(90)
```

Added in version 3.14.

<!-- anchor: turtle.delay | type: py function -->
##### `turtle.delay(delay=None)`

**Parameters:**

**delay** – a nonnegative integer or `None`

Return or set the drawing delay in milliseconds. This is approximately the time interval between two consecutive canvas updates. The longer the drawing delay, the slower the animation.

```pycon
>>> screen.delay()
10
>>> screen.delay(5)
>>> screen.delay()
5
```

<!-- anchor: turtle.tracer | type: py function -->
##### `turtle.tracer(n=None, delay=None)`

**Parameters:**

- **n** – a nonnegative integer or `None`

- **delay** – a nonnegative integer or `None`

Turn turtle animation on or off and set the drawing delay. If *n* is given, only every n-th regular screen update is performed, which can be used to speed up the drawing of complex graphics. If *n* is 0, animation is turned off and the screen is only updated by calling `update()`. If *delay* is given, it sets the drawing delay, see `delay()`. When called without arguments, return the current value of *n*.

```pycon
>>> screen.tracer(8, 25)
>>> dist = 2
>>> for i in range(200):
...     fd(dist)
...     rt(90)
...     dist += 2
```

<!-- anchor: turtle.update | type: py function -->
##### `turtle.update()`

Perform a TurtleScreen update. To be used when tracer is turned off.

See also the RawTurtle/Turtle method `speed()`.

<!-- anchor: using-screen-events | type: section -->
#### Using screen events

<!-- anchor: turtle.listen | type: py function -->
##### `turtle.listen(xdummy=None, ydummy=None)`

Set focus on TurtleScreen (in order to collect key-events). Dummy arguments are provided in order to be able to pass `listen()` to the onclick method.

<!-- anchor: turtle.onkey | type: py function -->
##### `turtle.onkey(fun, key)`

`turtle.onkeyrelease(fun, key)`

**Parameters:**

- **fun** – a function with no arguments or `None`

- **key** – a string: key (e.g. “a”) or key-symbol (e.g. “space”)

Bind *fun* to key-release event of key. If *fun* is `None`, event bindings are removed. Remark: in order to be able to register key-events, TurtleScreen must have the focus. (See method `listen()`.)

```pycon
>>> def f():
...     fd(50)
...     lt(60)
...
>>> screen.onkey(f, "Up")
>>> screen.listen()
```

<!-- anchor: turtle.onkeypress | type: py function -->
##### `turtle.onkeypress(fun, key=None)`

**Parameters:**

- **fun** – a function with no arguments or `None`

- **key** – a string: key (e.g. “a”) or key-symbol (e.g. “space”)

Bind *fun* to key-press event of key if key is given, or to any key-press-event if no key is given. Remark: in order to be able to register key-events, TurtleScreen must have focus. (See method `listen()`.)

```pycon
>>> def f():
...     fd(50)
...
>>> screen.onkey(f, "Up")
>>> screen.listen()
```

<!-- anchor: turtle.onclick | type: py function -->
##### `turtle.onclick(fun, btn=1, add=None)`

`turtle.onscreenclick(fun, btn=1, add=None)`

**Parameters:**

- **fun** – a function with two arguments or `None`

- **btn** – an integer

- **add** – a boolean or `None`

Bind *fun* to mouse-click events on this screen. *fun* is called with the coordinates of the clicked point on the canvas. If *fun* is `None`, existing bindings are removed. *btn* is the number of the mouse button and defaults to 1, the left mouse button. If *add* is `True`, a new binding is added, otherwise it replaces a former binding.

Example for a TurtleScreen instance named `screen` and a Turtle instance named `turtle`:

```pycon
>>> screen.onclick(turtle.goto) # Subsequently clicking into the TurtleScreen will
>>>                             # make the turtle move to the clicked point.
>>> screen.onclick(None)        # remove event binding again
```

**Note:**

This TurtleScreen method is available as a global function only under the name `onscreenclick`. The global function `onclick` is another one derived from the Turtle method `onclick`.

<!-- anchor: turtle.ontimer | type: py function -->
##### `turtle.ontimer(fun, t=0)`

**Parameters:**

- **fun** – a function with no arguments

- **t** – a number >= 0

Install a timer that calls *fun* after *t* milliseconds.

```pycon
>>> running = True
>>> def f():
...     if running:
...         fd(50)
...         lt(60)
...         screen.ontimer(f, 250)
>>> f()   ### makes the turtle march around
>>> running = False
```

<!-- anchor: turtle.mainloop | type: py function -->
##### `turtle.mainloop()`

`turtle.done()`

Start the event loop by calling Tkinter’s `mainloop()` method. Must be the last statement in a turtle graphics program. Must *not* be used if a script is run from within IDLE in -n mode (see Running without a subprocess).

<!-- anchor: input-methods | type: section -->
#### Input methods

<!-- anchor: turtle.textinput | type: py function -->
##### `turtle.textinput(title, prompt)`

**Parameters:**

- **title** – a string

- **prompt** – a string

Pop up a dialog window for input of a string. *title* is the title of the dialog window and *prompt* is a text describing what information to input. Return the string entered. If the dialog is canceled, return `None`.

```python
>>> screen.textinput("NIM", "Name of first player:")
```

<!-- anchor: turtle.numinput | type: py function -->
##### `turtle.numinput(title, prompt, default=None, minval=None, maxval=None)`

**Parameters:**

- **title** – a string

- **prompt** – a string

- **default** – a number or `None`

- **minval** – a number or `None`

- **maxval** – a number or `None`

Pop up a dialog window for input of a number. *title* is the title of the dialog window and *prompt* is a text describing what numerical information to input. *default* is the default value, *minval* and *maxval* are the minimum and maximum values for input. If these are given, the number entered must be between *minval* and *maxval*. If not, a hint is issued and the dialog remains open for correction. Return the number entered. If the dialog is canceled, return `None`.

```python
>>> screen.numinput("Poker", "Your stakes:", 1000, minval=10, maxval=10000)
```

<!-- anchor: settings-and-special-methods | type: section -->
#### Settings and special methods

<!-- anchor: turtle.mode | type: py function -->
##### `turtle.mode(mode=None)`

**Parameters:**

**mode** – a string or `None`

Set the turtle mode and perform a reset. *mode* is one of the strings “standard”, “logo” or “world”. If *mode* is not given, return the current mode.

Mode “standard” is compatible with the old `turtle` module. Mode “logo” is compatible with most Logo turtle graphics. Mode “world” uses user-defined world coordinates, see `setworldcoordinates()`. In this mode, angles appear distorted if the x and y units are not of equal length.

| Mode | Initial turtle heading | positive angles |
| --- | --- | --- |
| “standard” | to the right (east) | counterclockwise |
| “logo” | upward (north) | clockwise |

```pycon
>>> mode("logo")  # resets turtle heading to north
>>> mode()
'logo'
```

<!-- anchor: turtle.colormode | type: py function -->
##### `turtle.colormode(cmode=None)`

**Parameters:**

**cmode** – a number or `None`

Return the colormode or set it to 1.0 or 255. After setting it, the *r*, *g* and *b* values of color triples have to be between 0 and *cmode*.

```pycon
>>> screen.colormode(1)
>>> turtle.pencolor(240, 160, 80)
Traceback (most recent call last):
     ...
TurtleGraphicsError: bad color sequence: (240, 160, 80)
>>> screen.colormode()
1.0
>>> screen.colormode(255)
>>> screen.colormode()
255
>>> turtle.pencolor(240,160,80)
```

<!-- anchor: turtle.getcanvas | type: py function -->
##### `turtle.getcanvas()`

Return the Canvas of this TurtleScreen. Useful for insiders who know what to do with a Tkinter Canvas.

```pycon
>>> cv = screen.getcanvas()
>>> cv
<turtle.ScrolledCanvas object ...>
```

<!-- anchor: turtle.getshapes | type: py function -->
##### `turtle.getshapes()`

Return a list of names of all currently available turtle shapes.

```pycon
>>> screen.getshapes()
['arrow', 'blank', 'circle', ..., 'turtle']
```

<!-- anchor: turtle.register_shape | type: py function -->
##### `turtle.register_shape(name, shape=None)`

`turtle.addshape(name, shape=None)`

**Parameters:**

- **name** – a string

- **shape** – a string, a tuple of pairs of numbers, a `Shape` object or `None`

Add a turtle shape to the TurtleScreen’s shape list. It can be called in four different ways:

1. *name* is the name of an image file (PNG, GIF, PGM, and PPM) and *shape* is `None`: Install the corresponding image shape.

   ```python
   >>> screen.register_shape("turtle.gif")
   ```

2. *name* is an arbitrary string and *shape* is the name of an image file (PNG, GIF, PGM, and PPM): Install the corresponding image shape.

   ```python
   >>> screen.register_shape("turtle", "turtle.gif")
   ```

3. *name* is an arbitrary string and *shape* is a tuple of pairs of coordinates: Install the corresponding polygon shape.

   ```pycon
   >>> screen.register_shape("triangle", ((5,-3), (0,5), (-5,-3)))
   ```

4. *name* is an arbitrary string and *shape* is a (compound) `Shape` object: Install the corresponding compound shape.

Image shapes do not rotate when turning the turtle, so they do not display the heading of the turtle. To use a registered shape, call `shape()` with its name.

Changed in version 3.14: Added support for PNG, PGM, and PPM image formats. Both a shape name and an image file name can be specified.

<!-- anchor: turtle.turtles | type: py function -->
##### `turtle.turtles()`

Return the list of turtles on the screen.

```pycon
>>> for turtle in screen.turtles():
...     turtle.color("red")
```

<!-- anchor: turtle.window_height | type: py function -->
##### `turtle.window_height()`

Return the height of the turtle window.

```python
>>> screen.window_height()
480
```

<!-- anchor: turtle.window_width | type: py function -->
##### `turtle.window_width()`

Return the width of the turtle window.

```python
>>> screen.window_width()
640
```

<!-- anchor: screen-only-methods | type: section -->
#### Screen-only methods

<!-- anchor: turtle.bye | type: py function -->
##### `turtle.bye()`

Close the turtle graphics window.

<!-- anchor: turtle.exitonclick | type: py function -->
##### `turtle.exitonclick()`

Bind `bye()` method to mouse clicks on the Screen.

If the value “using_IDLE” in the configuration dictionary is `False` (default value), also enter mainloop. Remark: If IDLE with the `-n` switch (no subprocess) is used, this value should be set to `True` in `turtle.cfg`. In this case IDLE’s own mainloop is active also for the client script.

<!-- anchor: turtle.save | type: py function -->
##### `turtle.save(filename, overwrite=False)`

Save the current turtle drawing (and turtles) as a PostScript file.

**Parameters:**

- **filename** – the path of the saved PostScript file

- **overwrite** – if `False` and there already exists a file with the given filename, then the function will raise a `FileExistsError`. If it is `True`, the file will be overwritten.

```pycon
>>> screen.save("my_drawing.ps")
>>> screen.save("my_drawing.ps", overwrite=True)
```

Added in version 3.14.

<!-- anchor: turtle.setup | type: py function -->
##### `turtle.setup(width=_CFG['width'], height=_CFG['height'], startx=_CFG['leftright'], starty=_CFG['topbottom'])`

Set the size and position of the main window. Default values of arguments are stored in the configuration dictionary and can be changed via a `turtle.cfg` file.

**Parameters:**

- **width** – if an integer, a size in pixels, if a float, a fraction of the screen; default is 50% of screen

- **height** – if an integer, the height in pixels, if a float, a fraction of the screen; default is 75% of screen

- **startx** – if positive, starting position in pixels from the left edge of the screen, if negative from the right edge, if `None`, center window horizontally

- **starty** – if positive, starting position in pixels from the top edge of the screen, if negative from the bottom edge, if `None`, center window vertically

```pycon
>>> screen.setup (width=200, height=200, startx=0, starty=0)
>>>              # sets window to 200x200 pixels, in upper left of screen
>>> screen.setup(width=.75, height=0.5, startx=None, starty=None)
>>>              # sets window to 75% of screen by 50% of screen and centers
```

<!-- anchor: turtle.title | type: py function -->
##### `turtle.title(titlestring)`

**Parameters:**

**titlestring** – a string

Set the title of the turtle window to *titlestring*. The title is shown in the title bar of the turtle graphics window.

```pycon
>>> screen.title("Welcome to the turtle zoo!")
```

<!-- anchor: public-classes | type: section -->
### Public classes

<!-- anchor: turtle.RawTurtle | type: py class -->
#### `class turtle.RawTurtle(canvas)`

`class turtle.RawPen(canvas)`

**Parameters:**

**canvas** – a `tkinter.Canvas`, a `ScrolledCanvas` or a `TurtleScreen`

Create a turtle. The turtle has all methods described above as “methods of Turtle/RawTurtle”.

<!-- anchor: turtle.Turtle | type: py class -->
#### `class turtle.Turtle`

Subclass of RawTurtle, has the same interface but draws on a default `Screen` object created automatically when needed for the first time.

<!-- anchor: turtle.TurtleScreen | type: py class -->
#### `class turtle.TurtleScreen(cv)`

**Parameters:**

**cv** – a `tkinter.Canvas`

Provides screen oriented methods like `bgcolor()` etc. that are described above.

<!-- anchor: turtle.Screen | type: py class -->
#### `class turtle.Screen`

Subclass of `TurtleScreen`, with four methods added. Calling `Screen()` returns the single screen object. If it does not exist yet, it is created. Otherwise the existing one is returned.

<!-- anchor: turtle.ScrolledCanvas | type: py class -->
#### `class turtle.ScrolledCanvas(master)`

**Parameters:**

**master** – some Tkinter widget to contain the ScrolledCanvas, i.e. a Tkinter-canvas with scrollbars added

Used by class Screen, which thus automatically provides a ScrolledCanvas as playground for the turtles.

<!-- anchor: turtle.Shape | type: py class -->
#### `class turtle.Shape(type_, data)`

**Parameters:**

- **type_** – a string

- **data** – depends on *type_*

Data structure modeling shapes. *type_* is one of the strings “polygon”, “image” or “compound”. What *data* must be depends on *type_*: for “polygon” a tuple of pairs of coordinates, for “image” an image (only used internally), and for “compound” `None`, as a compound shape is built up using the `addcomponent()` method.

<!-- anchor: turtle.Shape.addcomponent | type: py method -->
##### `addcomponent(poly, fill, outline=None)`

**Parameters:**

- **poly** – a tuple of pairs of numbers

- **fill** – a color

- **outline** – a color or `None`

Add a component to a shape of type “compound”. *poly* is a polygon, a tuple of pairs of numbers. *fill* is the color the polygon is filled with and *outline* is the color of its outline. If *outline* is not given, *fill* is used for it as well.

Example:

```pycon
>>> poly = ((0,0), (10,-5), (0,10), (-10,-5))
>>> s = Shape("compound")
>>> s.addcomponent(poly, "red", "blue")
>>> # ... add more components and then use register_shape()
```

See Compound shapes.

<!-- anchor: turtle.Vec2D | type: py class -->
#### `class turtle.Vec2D(x, y)`

A two-dimensional vector class, used as a helper class for implementing turtle graphics. May be useful for turtle graphics programs too. Derived from tuple, so a vector is a tuple!

Provides (for *a*, *b* vectors, *k* number):

- `a + b` vector addition

- `a - b` vector subtraction

- `a * b` inner product

- `k * a` and `a * k` multiplication with scalar

- `abs(a)` absolute value of a

- `a.rotate(angle)` rotation

<!-- anchor: exceptions | type: section -->
### Exceptions

The `turtle` module defines the following exception:

<!-- anchor: turtle.TurtleGraphicsError | type: py exception -->
#### `exception turtle.TurtleGraphicsError`

Raised for invalid arguments or operations. For example, a malformed color string:

```pycon
>>> turtle.color("blau")
Traceback (most recent call last):
    ...
turtle.TurtleGraphicsError: bad color string: blau
```

<!-- anchor: how-to-guides | type: section -->
## How-to guides

This section covers some typical turtle use-cases and approaches.

<!-- anchor: automatically-begin-and-end-filling | type: section -->
### Automatically begin and end filling

Starting with Python 3.14, you can use the `fill()` context manager instead of `begin_fill()` and `end_fill()` to automatically begin and end fill. Here is an example:

```python
with fill():
    for i in range(4):
        forward(100)
        right(90)

forward(200)
```

The code above is equivalent to:

```python
begin_fill()
for i in range(4):
    forward(100)
    right(90)
end_fill()

forward(200)
```

<!-- anchor: use-the-turtle-module-namespace | type: section -->
### Use the `turtle` module namespace

Using `from turtle import *` is convenient - but be warned that it imports a rather large collection of objects, and if you’re doing anything but turtle graphics you run the risk of a name conflict (this becomes even more an issue if you’re using turtle graphics in a script where other modules might be imported).

The solution is to use `import turtle` - `fd()` becomes `turtle.fd()`, `width()` becomes `turtle.width()` and so on. (If typing “turtle” over and over again becomes tedious, use for example `import turtle as t` instead.)

<!-- anchor: use-turtle-graphics-in-a-script | type: section -->
### Use turtle graphics in a script

It’s recommended to use the `turtle` module namespace as described immediately above, for example:

```python
import turtle as t
from random import random

for i in range(100):
    steps = int(random() * 100)
    angle = int(random() * 360)
    t.right(angle)
    t.fd(steps)
```

Another step is also required though - as soon as the script ends, Python will also close the turtle’s window. Add:

```python
t.mainloop()
```

to the end of the script. The script will now wait to be dismissed and will not exit until it is terminated, for example by closing the turtle graphics window.

<!-- anchor: use-object-oriented-turtle-graphics | type: section -->
### Use object-oriented turtle graphics

**See also:**

Explanation of the object-oriented interface

Other than for very basic introductory purposes, or for trying things out as quickly as possible, it’s more usual and much more powerful to use the object-oriented approach to turtle graphics. For example, this allows multiple turtles on screen at once.

In this approach, the various turtle commands are methods of objects (mostly of `Turtle` objects). You *can* use the object-oriented approach in the shell, but it would be more typical in a Python script.

The example above then becomes:

```python
from turtle import Turtle
from random import random

t = Turtle()
for i in range(100):
    steps = int(random() * 100)
    angle = int(random() * 360)
    t.right(angle)
    t.fd(steps)

t.screen.mainloop()
```

Note the last line. `t.screen` is an instance of the `Screen` that a Turtle instance exists on; it’s created automatically along with the turtle.

The turtle’s screen can be customised, for example:

```python
t.screen.title('Object-oriented turtle demo')
t.screen.bgcolor("orange")
```

<!-- anchor: how-to-use-help | type: section -->
### How to use help

The public methods of the Screen and Turtle classes are documented extensively via docstrings. So these can be used as online-help via the Python help facilities:

- When using IDLE, tooltips show the signatures and first lines of the docstrings of typed in function-/method calls.

- Calling `help()` on methods or functions displays the docstrings:

  ```python
  >>> help(Screen.bgcolor)
  Help on method bgcolor in module turtle:

  bgcolor(self, *args) unbound turtle.Screen method
      Set or return backgroundcolor of the TurtleScreen.

      Arguments (if given): a color string or three numbers
      in the range 0..colormode or a 3-tuple of such numbers.


      >>> screen.bgcolor("orange")
      >>> screen.bgcolor()
      "orange"
      >>> screen.bgcolor(0.5,0,0.5)
      >>> screen.bgcolor()
      "#800080"

  >>> help(Turtle.penup)
  Help on method penup in module turtle:

  penup(self) unbound turtle.Turtle method
      Pull the pen up -- no drawing when moving.

      Aliases: penup | pu | up

      No argument

      >>> turtle.penup()
  ```

- The docstrings of the functions which are derived from methods have a modified form:

  ```python
  >>> help(bgcolor)
  Help on function bgcolor in module turtle:

  bgcolor(*args)
      Set or return backgroundcolor of the TurtleScreen.

      Arguments (if given): a color string or three numbers
      in the range 0..colormode or a 3-tuple of such numbers.

      Example::

        >>> bgcolor("orange")
        >>> bgcolor()
        "orange"
        >>> bgcolor(0.5,0,0.5)
        >>> bgcolor()
        "#800080"

  >>> help(penup)
  Help on function penup in module turtle:

  penup()
      Pull the pen up -- no drawing when moving.

      Aliases: penup | pu | up

      No argument

      Example:
      >>> penup()
  ```

These modified docstrings are created automatically together with the function definitions that are derived from the methods at import time.

<!-- anchor: translation-of-docstrings-into-different-languages | type: section -->
### Translation of docstrings into different languages

There is a utility to create a dictionary the keys of which are the method names and the values of which are the docstrings of the public methods of the classes Screen and Turtle.

<!-- anchor: turtle.write_docstringdict | type: py function -->
#### `turtle.write_docstringdict(filename='turtle_docstringdict')`

**Parameters:**

**filename** – a string, used as filename

Create and write docstring-dictionary to a Python script with the given filename. This function has to be called explicitly (it is not used by the turtle graphics classes). The docstring dictionary will be written to the Python script `filename.py`. It is intended to serve as a template for translation of the docstrings into different languages.

If you (or your students) want to use `turtle` with online help in your native language, you have to translate the docstrings and save the resulting file as e.g. `turtle_docstringdict_german.py`.

If you have an appropriate entry in your `turtle.cfg` file this dictionary will be read in at import time and will replace the original English docstrings.

At the time of this writing there are docstring dictionaries in German and in Italian. (Requests please to glingl@aon.at.)

<!-- anchor: how-to-configure-screen-and-turtles | type: section -->
### How to configure Screen and Turtles

The built-in default configuration mimics the appearance and behaviour of the old turtle module in order to retain best possible compatibility with it.

If you want to use a different configuration which better reflects the features of this module or which better fits to your needs, e.g. for use in a classroom, you can prepare a configuration file `turtle.cfg` which will be read at import time and modify the configuration according to its settings.

The built in configuration would correspond to the following `turtle.cfg`:

```ini
width = 0.5
height = 0.75
leftright = None
topbottom = None
canvwidth = 400
canvheight = 300
mode = standard
colormode = 1.0
delay = 10
undobuffersize = 1000
shape = classic
pencolor = black
fillcolor = black
resizemode = noresize
visible = True
language = english
exampleturtle = turtle
examplescreen = screen
title = Python Turtle Graphics
using_IDLE = False
```

Short explanation of selected entries:

- The first four lines correspond to the arguments of the `Screen.setup` method.

- Line 5 and 6 correspond to the arguments of the method `Screen.screensize`.

- *shape* can be any of the built-in shapes, e.g: arrow, turtle, etc. For more info try `help(shape)`.

- If you want to use no fill color (i.e. make the turtle transparent), you have to write `fillcolor = ""` (but all nonempty strings must not have quotes in the cfg file).

- If you want to reflect the turtle its state, you have to use `resizemode = auto`.

- If you set e.g. `language = italian` the docstringdict `turtle_docstringdict_italian.py` will be loaded at import time (if present on the import path, e.g. in the same directory as `turtle`).

- The entries *exampleturtle* and *examplescreen* define the names of these objects as they occur in the docstrings. The transformation of method-docstrings to function-docstrings will delete these names from the docstrings.

- *using_IDLE*: Set this to `True` if you regularly work with IDLE and its `-n` switch (“no subprocess”). This will prevent `exitonclick()` to enter the mainloop.

There can be a `turtle.cfg` file in the directory where `turtle` is stored and an additional one in the current working directory. The latter will override the settings of the first one.

The `Lib/turtledemo` directory contains a `turtle.cfg` file. You can study it as an example and see its effects when running the demos (preferably not from within the demo-viewer).

<!-- anchor: explanation | type: section -->
## Explanation

A turtle object draws on a screen object, and there a number of key classes in the turtle object-oriented interface that can be used to create them and relate them to each other.

A `Turtle` instance will automatically create a `Screen` instance if one is not already present.

`Turtle` is a subclass of `RawTurtle`, which *doesn’t* automatically create a drawing surface - a *canvas* will need to be provided or created for it. The *canvas* can be a `tkinter.Canvas`, `ScrolledCanvas` or `TurtleScreen`.

`TurtleScreen` is the basic drawing surface for a turtle. `Screen` is a subclass of `TurtleScreen`, and includes some additional methods for managing its appearance (including size and title) and behaviour. `TurtleScreen`’s constructor needs a `tkinter.Canvas` or a `ScrolledCanvas` as an argument.

The functional interface for turtle graphics uses the various methods of `Turtle` and `TurtleScreen`/`Screen`. Behind the scenes, a screen object is automatically created whenever a function derived from a `Screen` method is called. Similarly, a turtle object is automatically created whenever any of the functions derived from a Turtle method is called.

To use multiple turtles on a screen, the object-oriented interface must be used.

<!-- anchor: module-turtledemo | type: section -->
## `turtledemo` — Demo scripts

The `turtledemo` package includes a set of demo scripts. These scripts can be run and viewed using the supplied demo viewer as follows:

```python
python -m turtledemo
```

Alternatively, you can run the demo scripts individually. For example,

```python
python -m turtledemo.bytedesign
```

The `turtledemo` package directory contains:

- A demo viewer `__main__.py` which can be used to view the sourcecode of the scripts and run them at the same time.

- Multiple scripts demonstrating different features of the `turtle` module. Examples can be accessed via the Examples menu. They can also be run standalone.

- A `turtle.cfg` file which serves as an example of how to write and use such files.

The demo scripts are:

| Name | Description | Features |
| --- | --- | --- |
| `bytedesign` | complex classical turtle graphics pattern | `tracer()`, `delay()`, `update()` |
| `chaos` | graphs Verhulst dynamics, shows that computer’s computations can generate results sometimes against the common sense expectations | world coordinates |
| `clock` | analog clock showing time of your computer | turtles as clock’s hands, `ontimer()` |
| `colormixer` | experiment with r, g, b | `ondrag()` |
| `forest` | 3 breadth-first trees | randomization |
| `fractalcurves` | Hilbert & Koch curves | recursion |
| `lindenmayer` | ethnomathematics (indian kolams) | L-System |
| `minimal_hanoi` | Towers of Hanoi | Rectangular Turtles as Hanoi discs (`shape()`, `shapesize()`) |
| `nim` | play the classical nim game with three heaps of sticks against the computer. | turtles as nimsticks, event driven (mouse, keyboard) |
| `paint` | super minimalistic drawing program | `onclick()` |
| `peace` | elementary | turtle: appearance and animation |
| `penrose` | aperiodic tiling with kites and darts | `stamp()` |
| `planet_and_moon` | simulation of gravitational system | compound shapes, `Vec2D` |
| `rosette` | a pattern from the wikipedia article on turtle graphics | `clone()`, `undo()` |
| `round_dance` | dancing turtles rotating pairwise in opposite direction | compound shapes, `clone()` `shapesize()`, `tilt()`, `get_shapepoly()`, `update()` |
| `sorting_animate` | visual demonstration of different sorting methods | simple alignment, randomization |
| `tree` | a (graphical) breadth first tree (using generators) | `clone()` |
| `two_canvases` | simple design | turtles on two canvases |
| `yinyang` | another elementary example | `circle()` |

Have fun!
