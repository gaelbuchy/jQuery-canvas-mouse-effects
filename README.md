# Documentation

This is a simple jQuery plugin that allows you to add effects under mouse event using canvas.

## Demo

Demos are included in this package.

## Setup

Include the jQuery library and the plugin files in your webpage :
```html
<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
<script src="js/jquery.cme.js"></script>
```
Add a canvas element to the body :
```html
<canvas id='canvas'></canvas>
```
And call the plugin :
```js
$(document).ready(function(){
    $("#canvas").cme();
};
```
Set the css, position to absolute and z-index to the lower for the canvas element :
```css
#canvas{
    position: absolute;
    z-index:1;
}
```

## Options

### width

The width of the canvas element. (`default=window.innerWidth`)

### height

The height of the canvas element. (`default=window.innerHeight`)

### type

The type of the object displayed (star, circle, rect, image). (`default='star'`)

### size

The size of the object displayed, not applied with the image type. (`default=3`)

### opacity

The opacity of the object displayed between 0 and 1. (`default=1`)

### number

The number of objects diplayed, a number or auto (random number each time). (`default='auto'`)

### color

The fill color of the object, not applied with the image type. (`default='#000'`)

### strokeColor

The stroke color of the object, not applied with the image type. (`default='#000'`)

### strokeSize

The stoke size of the object, not applied with the image type. (`default='#111'`)

### action

The jquery mouse event on which to display the objects. (mousedown, mousemove ...) (`default='mousemove'`)

### src

The url of the image when using the image type. (`default=''`)

### shadow

The shadow of the object with several parameters :
```js
    shadow : {
            show : false    // display shadow or not
            color : '#111', // color of the shadow
            blur : 3,       // blur level of the shadow
            offsetX : 3,    // horizontal distance of the shadow from the object
            offsetY : 3     // vertical distance of the shadow from the object
    }
```