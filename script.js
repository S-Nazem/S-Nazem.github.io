const canvas = document.getElementById("signalCanvas");
const ctx = canvas.getContext("2d");

const palette = {
  grid: "rgba(255, 253, 247, 0.08)",
  signal: "#8cd1ca",
  forecast: "#e0ae4f",
  residual: "#e47762",
  text: "rgba(255, 253, 247, 0.72)"
};

function resizeCanvas() {
  const rect = canvas.getBoundingClientRect();
  const scale = window.devicePixelRatio || 1;
  canvas.width = Math.max(1, Math.floor(rect.width * scale));
  canvas.height = Math.max(1, Math.floor(rect.height * scale));
  ctx.setTransform(scale, 0, 0, scale, 0, 0);
}

function drawGrid(width, height) {
  ctx.strokeStyle = palette.grid;
  ctx.lineWidth = 1;

  for (let x = 0; x <= width; x += width / 8) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }

  for (let y = 0; y <= height; y += height / 6) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }
}

function plotLine(width, height, phase, color, offset, amplitude, dash = []) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.setLineDash(dash);
  ctx.beginPath();

  for (let i = 0; i <= 220; i += 1) {
    const x = (i / 220) * width;
    const t = i / 16;
    const y =
      height * offset +
      Math.sin(t + phase) * amplitude +
      Math.cos(t * 0.37 + phase * 0.7) * amplitude * 0.42;

    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }

  ctx.stroke();
  ctx.setLineDash([]);
}

function drawParticles(width, height, phase) {
  for (let i = 0; i < 26; i += 1) {
    const x = ((i * 37 + phase * 22) % width + width) % width;
    const y = height * (0.18 + ((i * 19) % 64) / 100);
    const radius = 1.2 + (i % 4) * 0.35;
    ctx.fillStyle = i % 3 === 0 ? palette.forecast : "rgba(140, 209, 202, 0.72)";
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }
}

function render(timestamp) {
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  const phase = timestamp / 1200;

  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#101b2d";
  ctx.fillRect(0, 0, width, height);
  drawGrid(width, height);
  drawParticles(width, height, phase);
  plotLine(width, height, phase, palette.signal, 0.46, height * 0.09);
  plotLine(width, height, phase + 0.8, palette.forecast, 0.48, height * 0.075, [7, 6]);
  plotLine(width, height, phase + 1.9, palette.residual, 0.68, height * 0.035);

  ctx.fillStyle = palette.text;
  ctx.font = "600 12px Inter, system-ui, sans-serif";
  ctx.fillText("signal", 18, 26);
  ctx.fillText("forecast", 18, 44);
  ctx.fillText("residual", 18, 62);

  requestAnimationFrame(render);
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);
requestAnimationFrame(render);
