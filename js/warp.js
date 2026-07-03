/* ==========================================================================
   Cursor-reactive "liquid warp" on work-grid thumbnails (WebGL shader).
   One shared canvas is moved into whichever figure the cursor is over;
   pixels are displaced around the cursor proportionally to its velocity,
   with a touch of chromatic aberration. Falls back to the CSS hover zoom
   on touch devices, reduced-motion, or when WebGL is unavailable.
   ========================================================================== */
(function () {
  "use strict";

  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  var grid = document.getElementById("workGrid");
  if (!grid) return;

  var canvas = document.createElement("canvas");
  canvas.className = "warp-canvas";
  var gl = canvas.getContext("webgl", { alpha: false, antialias: false });
  if (!gl) return;

  /* ---------------------------------------------------------- shaders */
  var VERT =
    "attribute vec2 aPos;varying vec2 vUv;" +
    "void main(){vUv=aPos*0.5+0.5;gl_Position=vec4(aPos,0.,1.);}";

  var FRAG =
    "precision mediump float;" +
    "varying vec2 vUv;" +
    "uniform sampler2D uTex;" +
    "uniform vec2 uMouse;" +   // cursor in uv space (smoothed)
    "uniform vec2 uVel;" +     // cursor velocity in uv space (smoothed)
    "uniform float uInt;" +    // 0..1 effect ramp
    "uniform float uAspect;" + // plane width / height
    "void main(){" +
    // slight zoom-in, replicating the CSS hover scale
    "  vec2 uv=(vUv-0.5)/(1.0+0.055*uInt)+0.5;" +
    "  vec2 d=uv-uMouse;d.x*=uAspect;" +
    "  float fall=exp(-dot(d,d)*14.0);" +
    "  vec2 off=uVel*fall*uInt;" +
    "  vec2 uv2=uv-off;" +
    "  vec2 ca=off*0.22;" +
    "  float r=texture2D(uTex,uv2+ca).r;" +
    "  float g=texture2D(uTex,uv2).g;" +
    "  float b=texture2D(uTex,uv2-ca).b;" +
    "  gl_FragColor=vec4(r,g,b,1.0);" +
    "}";

  function compile(type, src) {
    var s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null;
  }
  var vs = compile(gl.VERTEX_SHADER, VERT);
  var fs = compile(gl.FRAGMENT_SHADER, FRAG);
  if (!vs || !fs) return;
  var prog = gl.createProgram();
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
  gl.useProgram(prog);

  var buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  var aPos = gl.getAttribLocation(prog, "aPos");
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  var U = {
    mouse: gl.getUniformLocation(prog, "uMouse"),
    vel: gl.getUniformLocation(prog, "uVel"),
    inte: gl.getUniformLocation(prog, "uInt"),
    aspect: gl.getUniformLocation(prog, "uAspect"),
  };

  /* ----------------------------------------------------- texture cache */
  var texCache = {};
  function getTexture(img) {
    var key = img.currentSrc || img.src;
    if (texCache[key]) return texCache[key];
    var tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    texCache[key] = tex;
    return tex;
  }

  /* -------------------------------------------------------- hover state */
  var fig = null;          // active figure
  var rect = null;         // its bounding rect
  var raf = 0;
  var intensity = 0, intTarget = 0;
  var mouse = [0.5, 0.5], mouseT = [0.5, 0.5];
  var vel = [0, 0], velT = [0, 0];
  var DPR = Math.min(window.devicePixelRatio || 1, 1.5);

  function activate(f, e) {
    var img = f.querySelector("img");
    if (!img || !img.complete || !img.naturalWidth) return;
    if (fig) release();

    fig = f;
    rect = img.getBoundingClientRect();
    canvas.width = Math.round(rect.width * DPR);
    canvas.height = Math.round(rect.height * DPR);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.bindTexture(gl.TEXTURE_2D, getTexture(img));
    gl.uniform1f(U.aspect, rect.width / rect.height);

    fig.classList.add("warp-on");
    fig.insertBefore(canvas, fig.querySelector("figcaption"));

    var uv = toUv(e);
    mouse = uv.slice(); mouseT = uv.slice();
    vel = [0, 0]; velT = [0, 0];
    intensity = 0; intTarget = 1;
    if (!raf) raf = requestAnimationFrame(tick);
  }

  function release() {
    if (!fig) return;
    fig.classList.remove("warp-on");
    if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
    fig = null;
  }

  function toUv(e) {
    return [
      (e.clientX - rect.left) / rect.width,
      1 - (e.clientY - rect.top) / rect.height,
    ];
  }

  function tick() {
    raf = 0;
    if (!fig) return;
    if (!fig.isConnected) { release(); return; } // grid was re-rendered mid-hover

    intensity += (intTarget - intensity) * 0.09;
    mouse[0] += (mouseT[0] - mouse[0]) * 0.14;
    mouse[1] += (mouseT[1] - mouse[1]) * 0.14;
    vel[0] += (velT[0] - vel[0]) * 0.1;
    vel[1] += (velT[1] - vel[1]) * 0.1;
    velT[0] *= 0.86;
    velT[1] *= 0.86;

    gl.uniform2f(U.mouse, mouse[0], mouse[1]);
    gl.uniform2f(U.vel, vel[0], vel[1]);
    gl.uniform1f(U.inte, intensity);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    if (intTarget === 0 && intensity < 0.012) { release(); return; }
    raf = requestAnimationFrame(tick);
  }

  grid.addEventListener("pointerover", function (e) {
    var f = e.target.closest("figure");
    if (!f || f === fig) return;
    activate(f, e);
  });

  grid.addEventListener("pointermove", function (e) {
    if (!fig) return;
    rect = fig.getBoundingClientRect();
    var uv = toUv(e);
    // velocity impulse in uv space, clamped so fast flicks don't tear
    var dx = (uv[0] - mouseT[0]) * 1.1;
    var dy = (uv[1] - mouseT[1]) * 1.1;
    var m = Math.sqrt(dx * dx + dy * dy);
    var cap = 0.28;
    if (m > cap) { dx = (dx / m) * cap; dy = (dy / m) * cap; }
    velT[0] += dx;
    velT[1] += dy;
    mouseT = uv;
    intTarget = 1;
  });

  document.addEventListener("pointerout", function (e) {
    if (!fig) return;
    if (!e.relatedTarget || !fig.contains(e.relatedTarget)) intTarget = 0;
  });
})();
