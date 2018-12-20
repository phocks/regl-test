import React from "react";
import styles from "./styles.scss";

let regl

// Again, we start out by requiring regl


export default class TestCanvas extends React.Component {
  componentWillMount() {
    regl = require("regl")();
  }
  componentDidMount() {
    // Next, we create a new command.
    //
    // To do this, we call the main regl function and pass it an object giving a
    // description of the rendering command and its properties:
    //
    var drawTriangle = regl({
      //
      // First we define a vertex shader.  This is a program which tells the GPU
      // where to draw the vertices.
      //
      vert: `
      precision mediump float;
      uniform float scale;
      attribute vec2 position;
      attribute vec3 color;
      varying vec3 fcolor;
      void main () {
        fcolor = color;
        gl_Position = vec4(scale * position, 0, 1);
      }
      `,

      //
      // Next, we define a fragment shader to tell the GPU what color to draw.
      //
      frag: `
      precision mediump float;
      varying vec3 fcolor;
      void main () {
        gl_FragColor = vec4(fcolor, 1);
      }
      `,

      // Finally we need to give the vertices to the GPU
      attributes: {
        position: [[0.8, 0], [0, 0.4], [-0.9, -0.5]],
        color: [[1, 0, 1], [0, 1, 0], [1, 0, 0.4]]
      },

      uniforms: {
        scale: 0.25
      },

      // And also tell it how many vertices to draw
      count: 3
    });

    // // Now that our command is defined, we hook a callback to draw it each frame:
    // regl.frame(function() {
    //   // First we clear the color and depth buffers like before
    //   regl.clear({
    //     color: [0, 0, 0, 0.0],
    //     depth: 1
    //   });

    //   // Then we call the command that we just defined
    //   drawTriangle();
    // });

    drawTriangle();
  }

  componentWillUnmount() {
    regl.destroy();
  }

  render() {
    return (
      <div className={styles.root}>
        Find me in <strong>src/components/TestCanvas/index.js</strong>
      </div>
    );
  }
}
