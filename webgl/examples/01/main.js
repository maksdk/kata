function main() {
  const canvas = document.getElementById('canvas');
  const gl = canvas.getContext('webgl');
  if (!gl) {
    throw 'WebGL is not supported!';
  }

  // Use our boilerplate utils to compile the shaders and link into a program
  const program = createProgramFromScripts(gl, ["2d-vertex-shader", "2d-fragment-shader"]);

  // look up where the vertex data needs to go.
  const positionAttributeLocation = gl.getAttribLocation(program, "a_position");

  // Create a buffer to put three 2d clip space points in
  const positionBuffer = gl.createBuffer();

  // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  // три двумерных точки
  // координаты для пространства отсечения 
  const positions = [
    0, 0,
    0, 0.5,
    0.7, 0,
  ];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  // рачтягиваем канвас на весь экран
  setCanvasSize(gl.canvas);

  // Tell WebGL how to convert from clip space to pixels
  // говорим gl_Position как преобразовать координаты в пиксели
  // диапазон отсечение в webgl от -1 до 1
  // в пикселях это от 0 до ширины канваса
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  // Clear the canvas
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Tell it to use our program (pair of shaders)
  gl.useProgram(program);

  // Turn on the attribute
  gl.enableVertexAttribArray(positionAttributeLocation);

  // Bind the position buffer.
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  // Указываем атрибуту, как получать данные от positionBuffer (ARRAY_BUFFER)
  const size = 2;          // 2 компоненты на итерацию // смотри positions
  const type = gl.FLOAT;   // наши данные - 32-битные числа с плавающей точкой
  const normalize = false; // не нормализовать данные
  const stride = 0;        // 0 = перемещаться на size * sizeof(type) каждую итерацию для получения следующего положения
  const offset = 0;        // начинать с начала буфера
  gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);

  // по умолчанию vec4 gl_position = {x: 0, y: 0, z: 0, w: 0}
  // мы указали size = 2 значит на gl_position на каждой итерации будет менять x и y, 
  // а z и w остануться по умолчанию

  // говорим webgl выполнить нашу программу 
  const primitiveType = gl.TRIANGLES;
  const count = 3;
  gl.drawArrays(primitiveType, offset, count);
}

main();