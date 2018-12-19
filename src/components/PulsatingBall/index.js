import React from "react";
import styles from "./styles.scss";
// import regl from "regl"
const d3 = require("d3");

var regl = createREGL();

// Import the shaders
import frag from "./frag";
import vert from "./vert";

export default class PulsatingBall extends React.Component {
  componentDidMount() {
    console.log("Creating...", this.node);

    let pointWidth;

    var retina = window.devicePixelRatio > 1;

    if (retina) {
      pointWidth = 6;
    } else {
      pointWidth = 3;
    }

    const numPoints = 5000;

    const width = window.innerWidth;
    const height = window.innerHeight;

    const smallest_screen = Math.min(width, height);

    // duration of the animation ignoring delays
    const duration = 550; // 1500ms = 1.5s

    // helper to layout points in a green fuzzy circle
    function greenCircleLayout(points) {
      const rng = d3.randomNormal(0, 0.05);
      points.forEach((d, i) => {
        d.x = rng() * smallest_screen + width / 2;
        d.y = rng() * smallest_screen + height / 2;
        // d.x = (rng() + Math.cos(i)) * (width / 2.5) + (width / 2);
        // d.y = (rng() + Math.sin(i)) * (height / 2.5) + (height / 2);
        d.color = [0.1, Math.random(), 0.12]; // random amount of green
      });
    }

    // helper to layout points in a normally distributed area, colored blue
    function blueNormalLayout(points) {
      const rng = d3.randomNormal(0, 0.05);
      points.forEach(d => {
        d.x = rng() * smallest_screen + width / 2;
        d.y = rng() * smallest_screen + height / 2;
        d.color = [0.4, d.color[1] * 0.5, 0.9]; // some previous green and 0.9 blue
      });
    }

    // set the order of the layouts and some initial animation state
    const layouts = [greenCircleLayout, blueNormalLayout];
    let currentLayout = 0; // start with green circle layout

    // function to compile a draw points regl func
    function createDrawPoints(points) {
      const drawPoints = regl({
        frag: frag,
        vert: vert,

        attributes: {
          // each of these gets mapped to a single entry for each of the points.
          // this means the vertex shader will receive just the relevant value for a given point.
          positionStart: points.map(d => [d.sx, d.sy]),
          positionEnd: points.map(d => [d.tx, d.ty]),
          colorStart: points.map(d => d.colorStart),
          colorEnd: points.map(d => d.colorEnd)
        },

        uniforms: {
          // by using `regl.prop` to pass these in, we can specify them as arguments
          // to our drawPoints function
          pointWidth: regl.prop("pointWidth"),

          // regl actually provides these as viewportWidth and viewportHeight but I
          // am using these outside and I want to ensure they are the same numbers,
          // so I am explicitly passing them in.
          stageWidth: regl.prop("stageWidth"),
          stageHeight: regl.prop("stageHeight"),

          duration: regl.prop("duration"),
          // time in milliseconds since the prop startTime (i.e. time elapsed)
          // note that `time` is passed by regl whereas `startTime` is a prop passed
          // to the drawPoints function.
          elapsed: ({ time }, { startTime = 0 }) => (time - startTime) * 1000
        },

        // specify the number of points to draw
        count: points.length,

        // specify that each vertex is a point (not part of a mesh)
        primitive: "points"
      });

      return drawPoints;
    }

    // function to start the animation loop (note: time is in seconds)
    function animate(layout, points) {
      // make previous end the new beginning
      points.forEach(d => {
        d.sx = d.tx;
        d.sy = d.ty;
        d.colorStart = d.colorEnd;
      });

      // layout points
      layout(points);

      // copy layout x y to end positions
      points.forEach((d, i) => {
        d.tx = d.x;
        d.ty = d.y;
        d.colorEnd = d.color;
      });

      // create the regl function with the new start and end points
      const drawPoints = createDrawPoints(points);

      // start an animation loop
      let startTime = null; // in seconds
      const frameLoop = regl.frame(({ time }) => {
        // keep track of start time so we can get time elapsed
        // this is important since time doesn't reset when starting new animations
        if (startTime === null) {
          startTime = time;
        }

        // clear the buffer
        // regl.clear({
        //   // background color (black)
        //   color: [0, 0, 0, 0.0],
        //   depth: 1
        // });

        // draw the points using our created regl func
        // note that the arguments are available via `regl.prop`.
        drawPoints({
          pointWidth,
          stageWidth: width,
          stageHeight: height,
          duration,
          startTime
        });

        // if we have exceeded the maximum duration, move on to the next animation
        if (time - startTime > duration / 1000) {
          // cancel this loop, we are going to start another
          frameLoop.cancel();

          // increment to use next layout function
          currentLayout = (currentLayout + 1) % layouts.length;

          // start a new animation loop with next layout function
          animate(layouts[currentLayout], points);
        }
      });
    }

    // create initial set of points
    // initialize with all the points in the middle of the screen and black
    const points = d3.range(numPoints).map(i => ({
      tx: width / 2,
      ty: height / 2,
      colorEnd: [0, 0, 0]
    }));

    // start the initial animation
    animate(layouts[currentLayout], points);
  }

  componentWillUnmount() {
    console.log("Destroying.....");
    regl.destroy();
  }

  render() {
    return <div className={styles.root} ref={el => (this.node = el)} />;
  }
}
