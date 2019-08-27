import * as dat from 'dat.gui'
import frag from './frag.glsl'
import vert from './vert.glsl'
import {createGLContext, initShaders, setupBuffers, draw} from '../../tools/init'

const gl = createGLContext() 

const shaderProgram = initShaders(gl, vert, frag)

const vertexBuffer = setupBuffers(gl)

gl.clearColor(1.0, 1.0, 1.0, 1.0)

draw(gl, shaderProgram, vertexBuffer)
