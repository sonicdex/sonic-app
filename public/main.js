const SNOW_COUNT = 300;

function startAnimation() {
  const CANVAS_WIDTH = window.innerWidth;
  const CANVAS_HEIGHT = window.innerHeight;
  const MIN = 0;
  const MAX = CANVAS_WIDTH;

  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;

  function clamp(number, min = MIN, max = MAX) {
    return Math.max(min, Math.min(number, max));
  }

  function random(factor = 1) {
    return Math.random() * factor;
  }

  function degreeToRadian(deg) {
    return deg * (Math.PI / 180);
  }

  // All the properties for Circle
  class Circle {
    radius = 0;
    x = 0;
    y = 0;
    vx = 0;
    vy = 0;

    constructor(ctx) {
      this.ctx = ctx;
      this.reset();
    }

    draw() {
      this.ctx.beginPath();
      this.ctx.fillStyle = `rgba(255,255,255,${0.8})`;
      this.ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
      this.ctx.fill();
      this.ctx.closePath();
    }

    reset() {
      this.radius = random(2.5);
      this.x = random(CANVAS_WIDTH);
      this.y = this.y ? 0 : random(CANVAS_HEIGHT);
      this.vx = clamp((Math.random() - 0.5) * 0.4, -0.4, 0.4);
      this.vy = clamp(random(1.5), 0.1, 0.8) * this.radius * 0.5;
    }
  }

  // Array for storing all the generated circles
  let circles = [];

  // Generate circles
  for (let i = 0; i < SNOW_COUNT; i++) {
    circles.push(new Circle(ctx));
  }

  // Clear canvas
  function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  // start and end cordinates of canvas
  let canvasOffset = {
    x0: ctx.canvas.offsetLeft,
    y0: ctx.canvas.offsetTop,
    x1: ctx.canvas.offsetLeft + ctx.canvas.width,
    y1: ctx.canvas.offsetTop + ctx.canvas.height
  };

  function animate() {
    clearCanvas();

    circles.forEach((e) => {
      // reset the circle if it collides on border
      if (
        e.x <= canvasOffset.x0 ||
        e.x >= canvasOffset.x1 ||
        e.y <= canvasOffset.y0 ||
        e.y >= canvasOffset.y1
      ) {
        e.reset();
      }

      // Drawing path using polar cordinates
      e.x = e.x + e.vx;
      e.y = e.y + e.vy;
      e.draw();
    });

    requestAnimationFrame(animate);
  }

  animate();
}

startAnimation();

window.addEventListener("resize", startAnimation);
