import { ExpoWebGLRenderingContext, GLView } from "expo-gl";
import { Alert, View } from "react-native";

import React, { useMemo } from "react";
import useGlobalStore from "~/store/globalStore";

type Props = {};

const FilterView = (props: Props) => {
  const { filter } = useGlobalStore();

  if (!filter) return null;

  const fragmentShader = useMemo(() => {
    switch (filter) {
      case "summer":
        return summerFragSrc;
      case "winter":
        return winterFragSrc;
      default:
        return "";
    }
  }, [filter]);
  const key = `gl-view-${filter}`;

  return (
    <View
      style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
    >
      <GLView
        key={key}
        style={{
          height: "100%",
          width: "100%",
          opacity: 0.5,
          zIndex: 1,
        }}
        onContextCreate={(gl) => {
          console.log("Creating new GL context for filter:", filter);
          onContextCreate(gl, fragmentShader);
        }}
      />
    </View>
  );
};

export default FilterView;

function onContextCreate(gl: ExpoWebGLRenderingContext, fragSrc: string) {
  // Set the viewport and clear the context with a transparent background.
  gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Enable blending for transparency.
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

  // Vertex shader: renders a full-screen quad and calculates UV coordinates.
  const vertSrc = `
      attribute vec2 position;
      varying vec2 vUV;
      void main() {
        // Convert from clip space [-1,1] to UV space [0,1]
        vUV = (position + 1.0) * 0.5;
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

  // Compile vertex shader.
  const vertShader = gl.createShader(gl.VERTEX_SHADER);
  if (!vertShader) {
    Alert.alert("Failed to create vertex shader");
    return;
  }
  gl.shaderSource(vertShader, vertSrc);
  gl.compileShader(vertShader);
  if (!gl.getShaderParameter(vertShader, gl.COMPILE_STATUS)) {
    Alert.alert("Vertex shader error: " + gl.getShaderInfoLog(vertShader));
    return;
  }

  // Compile fragment shader.
  const fragShader = gl.createShader(gl.FRAGMENT_SHADER);
  if (!fragShader) {
    Alert.alert("Failed to create fragment shader");
    return;
  }
  gl.shaderSource(fragShader, fragSrc);
  gl.compileShader(fragShader);
  if (!gl.getShaderParameter(fragShader, gl.COMPILE_STATUS)) {
    Alert.alert("Fragment shader error: " + gl.getShaderInfoLog(fragShader));
    return;
  }

  // Create and link the program.
  const program = gl.createProgram();
  gl.attachShader(program, vertShader);
  gl.attachShader(program, fragShader);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    Alert.alert("Program link error: " + gl.getProgramInfoLog(program));
    return;
  }
  gl.useProgram(program);

  // Define vertices for a full-screen quad (two triangles).
  const vertices = new Float32Array([
    -1.0,
    -1.0, // bottom left
    1.0,
    -1.0, // bottom right
    -1.0,
    1.0, // top left

    -1.0,
    1.0, // top left
    1.0,
    -1.0, // bottom right
    1.0,
    1.0, // top right
  ]);

  // Create a buffer and load vertex data.
  const vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

  // Get the attribute location, enable it, and set up the pointer.
  const positionLoc = gl.getAttribLocation(program, "position");
  gl.enableVertexAttribArray(positionLoc);
  gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

  // Draw the full-screen quad.
  gl.drawArrays(gl.TRIANGLES, 0, 6);

  // Finalize the frame.
  gl.flush();
  gl.endFrameEXP();
}

// Fragment shader: creates a warm gradient from top (warm orange) to bottom (warm pink).
// Both colors have an alpha value for transparency.
const summerFragSrc = `
      precision mediump float;
      varying vec2 vUV;
      void main() {
        vec4 topColor = vec4(1.0, 0.65, 0.0, 0.4);   // Warm orange (RGBA: 1,0.65,0,0.4)
        vec4 bottomColor = vec4(1.0, 0.41, 0.71, 0.4); // Warm pink (RGBA: 1,0.41,0.71,0.4)
        gl_FragColor = mix(bottomColor, topColor, vUV.y);
      }
    `;

const winterFragSrc = `
    precision mediump float;
    varying vec2 vUV;
    void main() {
      // Top color: a cool, dark blue with moderate transparency.
      vec4 topColor = vec4(0.0, 0.3, 0.6, 0.4);
      // Bottom color: a light blue, evoking a frosty winter feel.
      vec4 bottomColor = vec4(0.6, 0.8, 1.0, 0.4);
      // Interpolate between the bottom and top color based on the vertical coordinate.
      gl_FragColor = mix(bottomColor, topColor, vUV.y);
    }
  `;
