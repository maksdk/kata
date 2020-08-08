var canvas = document.getElementById("canvas"),
   context = canvas.getContext("2d"),
   width = canvas.width = window.innerWidth,
   height = canvas.height = window.innerHeight;

var p0 = {
      x: 100,
      y: 100
   },
   p1 = {
      x: 500,
      y: 500
   },
   p2 = {
      x: 600,
      y: 50
   },
   p3 = {
      x: 80,
      y: 600
   };

context.beginPath();
context.moveTo(p0.x, p0.y);
context.lineTo(p1.x, p1.y);
context.moveTo(p2.x, p2.y);
context.lineTo(p3.x, p3.y);
context.stroke();

var intersect = lineIntersect(p0, p1, p2, p3);

context.beginPath();
context.arc(intersect.x, intersect.y, 20, 0, Math.PI * 2, false);
context.stroke();
