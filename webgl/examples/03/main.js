(function (){
  const canvas = document.getElementById('canvas');
  const gl = canvas.getContext('webgl');
  if (!gl) {
    throw 'WebGL is not supported!';
  }

  const program = createProgramFromScripts(gl, ['2d-vertex-shader', '2d-fragment-shader']);
  
  const positionAttributeLocation = gl.getAttribLocation(program, 'a_position');
  
  const resolutionUniformLocation = gl.getUniformLocation(program, 'u_resolution');
  const colorUniformLocation = gl.getUniformLocation(program, 'u_color');

  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  setCanvasSize(gl.canvas);

  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.useProgram(program);

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

  gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);

  const count = 6;
  const primitiveType = gl.TRIANGLES;

  const sizeRange = Math.min(gl.canvas.width, gl.canvas.height) * 0.6;
  for (let i = 0; i < 50; i += 1) {
    setRectangle(gl, randomInt(sizeRange), randomInt(sizeRange), randomInt(sizeRange), randomInt(sizeRange));
    gl.uniform4f(colorUniformLocation, Math.random(), Math.random(), Math.random(), 1);
    gl.drawArrays(primitiveType, offset, count);
  }
})(); 