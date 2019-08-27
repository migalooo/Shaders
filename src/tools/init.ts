function createGLContext(canvas) {
  if (!canvas) {
    canvas = document.createElement('canvas')
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    document.body.appendChild(canvas)
  }

  let gl = canvas.getContext('webgl2');
  if (gl) {
    gl.viewportWidth = canvas.width;
    gl.viewportHeight = canvas.height;
  } else {
    alert("Failed to create WebGL context!");
  }
  return gl;
}

function initShaders(gl, vert, frag) {
  let shaderProgram = gl.createProgram();
  let vertexShader = createShader(gl, vert, gl.VERTEX_SHADER)
  let fragmentShader = createShader(gl, frag, gl.FRAGMENT_SHADER)
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert("Failed to setup shaders");
  }

  gl.useProgram(shaderProgram);

  return shaderProgram
}

function createShader (gl, sourceCode, type) {
  // Compiles either a shader of type gl.VERTEX_SHADER or gl.FRAGMENT_SHADER
  var shader = gl.createShader( type );
  gl.shaderSource( shader, sourceCode );
  gl.compileShader( shader );

  if ( !gl.getShaderParameter(shader, gl.COMPILE_STATUS) ) {
    var info = gl.getShaderInfoLog( shader );
    throw 'Could not compile WebGL program. \n\n' + info;
  }
  return shader;
}

function setupBuffers(gl, vertices) {
  if (!vertices) {
    vertices = [
      1.0, 1.0, 0.0,
      1.0, -1.0, 0.0,
      -1.0, 1.0, 0.0,
      -1.0, -1.0, 0.0,
    ];
  }
  let vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
  vertexBuffer.itemSize = 3;
  vertexBuffer.numberOfItems = 4;

  return vertexBuffer
}

function draw(gl, shaderProgram, vertexBuffer) {
  gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
  gl.clear(gl.COLOR_BUFFER_BIT);

  let vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
  gl.vertexAttribPointer(vertexPositionAttribute, vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vertexPositionAttribute);


  let u_time=gl.getUniformLocation(shaderProgram,'u_time');
  let time = new Date().getSeconds();
  gl.uniform1f(u_time, time);

  gl.drawArrays(gl.TRIANGLE_STRIP, 0, vertexBuffer.numberOfItems);
}

export {
  createGLContext,
  initShaders,
  setupBuffers,
  draw
}
