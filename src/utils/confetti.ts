/**
 * Lightweight, zero-dependency canvas confetti burst for milestone celebrations.
 * Cleanly renders temporary canvas on document.body, runs physics animation, and self-removes.
 */
export function triggerConfetti(durationMs: number = 2200): void {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  const canvas = document.createElement('canvas');
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '99999';
  document.body.appendChild(canvas);

  let ctx: CanvasRenderingContext2D | null = null;
  try {
    ctx = canvas.getContext ? (canvas.getContext('2d') as CanvasRenderingContext2D | null) : null;
  } catch {
    ctx = null;
  }

  if (!ctx) {
    if (canvas.parentNode) {
      document.body.removeChild(canvas);
    }
    return;
  }

  const width = (canvas.width = window.innerWidth);
  const height = (canvas.height = window.innerHeight);

  const colors = ['#f59e0b', '#10b981', '#3b82f6', '#ec4899', '#8b5cf6', '#fbbf24', '#ffffff'];
  const particles: Array<{
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    color: string;
    rotation: number;
    rotationSpeed: number;
    opacity: number;
  }> = [];

  const particleCount = 85;
  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: width * (0.4 + Math.random() * 0.2), // Burst outwards from top-center
      y: height * 0.25,
      vx: (Math.random() - 0.5) * 14,
      vy: Math.random() * -10 - 4,
      size: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 12,
      opacity: 1,
    });
  }

  const startTime = performance.now();

  function render(time: number) {
    const elapsed = time - startTime;
    const progress = elapsed / durationMs;

    if (progress >= 1) {
      if (canvas.parentNode) {
        document.body.removeChild(canvas);
      }
      return;
    }

    ctx?.clearRect(0, 0, width, height);

    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.35; // gravity
      p.vx *= 0.98; // air drag
      p.rotation += p.rotationSpeed;
      p.opacity = Math.max(0, 1 - progress);

      if (!ctx) return;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.globalAlpha = p.opacity;
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      ctx.restore();
    });

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}
