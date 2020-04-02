/**
 * Создание и компиляция шейдера
 *
 * @param {!WebGLRenderingContext} gl Контекст WebGL
 * @param {string} shaderSource Исходный код шейдера на языке GLSL
 * @param {number} shaderType Тип шейдера, VERTEX_SHADER или FRAGMENT_SHADER.
 * @return {!WebGLShader} Шейдер
 */
function compileShader(gl, shaderSource, shaderType) {
  // создаём объект шейдера
  const shader = gl.createShader(shaderType);

  // устанавливаем исходный код шейдера
  gl.shaderSource(shader, shaderSource);

  // компилируем шейдер
  gl.compileShader(shader);

  // проверяем результат компиляции
  const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (!success) {
    // Ошибка! Что-то не так на этапе компиляции
    throw "Компиляция шейдера не удалась:" + gl.getShaderInfoLog(shader);
  }

  return shader;
}


/**
 * Создаём программу из 2 шейдеров
 *
 * @param {!WebGLRenderingContext) gl Контекст WebGL
 * @param {!WebGLShader} vertexShader Вершинный шейдер
 * @param {!WebGLShader} fragmentShader Фрагментный шейдер
 * @return {!WebGLProgram} Программа
 */
function createProgram(gl, vertexShader, fragmentShader) {
  // создаём программу
  const program = gl.createProgram();

  // прикрепляем шейдеры
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);

  // компонуем программу
  gl.linkProgram(program);

  // проверяем результат компоновки
  const success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (!success) {
    // что-то пошло не так на этапе компоновки
    throw ("ошибка компоновки программы:" + gl.getProgramInfoLog(program));
  }

  return program;
};


/**
 * Создание шейдера из содержимого тега
 *
 * @param {!WebGLRenderingContext} gl Контекст WebGL
 * @param {string} scriptId Атрибут id тега скрипта
 * @param {string} opt_shaderType Тип создаваемого шейдера.
 *     Если не передан, будет использован атрибут тега type
 * @return {!WebGLShader} Шейдер
 */
function createShaderFromScript(gl, scriptId, opt_shaderType) {
  // находим тег скрипта по его id
  const shaderScript = document.getElementById(scriptId);
  if (!shaderScript) {
    throw ("*** Ошибка: не найден тег скрипта" + scriptId);
  }

  // получаем содержимое тега скрипта
  const shaderSource = shaderScript.text;

  // Если тип не передан, используем атрибут тега 'type'
  if (!opt_shaderType) {
    if (shaderScript.type == "x-shader/x-vertex") {
      opt_shaderType = gl.VERTEX_SHADER;
    } else if (shaderScript.type == "x-shader/x-fragment") {
      opt_shaderType = gl.FRAGMENT_SHADER;
    } else if (!opt_shaderType) {
      throw ("*** Ошибка: не задан тип шейдера");
    }
  }

  return compileShader(gl, shaderSource, opt_shaderType);
};

function createShader(gl, type, source) {
  const shader = gl.createShader(type); // создание шейдера

  gl.shaderSource(shader, source); // устанавливаем шейдеру его программный код
  gl.compileShader(shader); // компилируем 

  const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (success) { // если компиляция прошла успешно - возвращаем шейдер
    return shader;
  }

  gl.deleteShader(shader);
}

function createProgram(gl, vertexShader, fragmentShader) {
  const program = gl.createProgram();

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  const success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (success) {
    return program;
  }

  gl.deleteProgram(program);
}

/**
 * Создание программы из 2 тегов скриптов
 *
 * @param {!WebGLRenderingContext} gl Контекст WebGL
 * @param {string[]} shaderScriptIds Массив идентификаторов
          тегов  шейдеров. Первым передаётся вершинный шейдер,
          вторым - фрагментный шейдер.
 * @return {!WebGLProgram} Программа
 */
function createProgramFromScripts(gl, shaderScriptIds) {
  const [vertexScript, fragmentScript] = shaderScriptIds;
  const vertexShader = createShaderFromScript(gl, vertexScript, gl.VERTEX_SHADER);
  const fragmentShader = createShaderFromScript(gl, fragmentScript, gl.FRAGMENT_SHADER);
  return createProgram(gl, vertexShader, fragmentShader);
}


function setCanvasSize(canvas, widht = window.innerWidth, height = window.innerHeight) {
  // проверяем, отличается ли размер canvas
  if (canvas.width != widht ||
    canvas.height != height) {

    // подгоняем размер буфера отрисовки под размер HTML-элемента
    canvas.width = widht;
    canvas.height = height;
  }
}