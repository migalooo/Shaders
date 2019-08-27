import * as dat from 'dat.gui'

import frag from './frag.glsl'
import vert from './vert.glsl'

import {createGLContext, initShaders, setupBuffers} from '../../tools/init'

const gl = createGLContext() 

const shaderProgram = initShaders(gl, vert, frag)

const vertexBuffer = setupBuffers(gl)

gl.clearColor(1.0, 1.0, 1.0, 1.0)
gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
gl.clear(gl.COLOR_BUFFER_BIT);

let vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
gl.vertexAttribPointer(vertexPositionAttribute, vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(vertexPositionAttribute);

let u_resolution=gl.getUniformLocation(shaderProgram, 'u_resolution');
gl.uniform2fv(u_resolution, [gl.viewportWidth, gl.viewportHeight]);

let u_time=gl.getUniformLocation(shaderProgram,'u_time');


function draw() {
  let time = new Date().getMilliseconds()/1000 - 0.5;
  gl.uniform1f(u_time, time);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, vertexBuffer.numberOfItems);
  requestAnimationFrame(draw)
}

draw()
