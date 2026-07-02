(function() {
  // ---------- CONFIG ----------
  const CIRCLE_SIZE = 10;
  const HOVER_SIZE = 30;
  const BEE_SIZE = 25;
  const FOLLOW_DELAY = 1000;
  const IDLE_TIMEOUT = 2000;
  const TRAIL_DURATION = 2000;
  const BASE_SPEED = 150;
  const MAX_SPEED_IDLE = 1200;
  const BURST_RADIUS = 20;
  const BURST_DURATION = 400;
  const BEE_BURST_DURATION = 400;

  // ---------- DOM SETUP ----------
  const cursorDot = document.createElement('div');
  cursorDot.id = 'cursor-dot';
  cursorDot.classList.add('init-hidden');
  document.body.appendChild(cursorDot);

  const hoverCircle = document.createElement('div');
  hoverCircle.id = 'hover-circle';
  hoverCircle.classList.add('init-hidden');
  document.body.appendChild(hoverCircle);

  const beeImg = document.createElement('img');
  beeImg.id = 'custom-bee';
  beeImg.classList.add('init-hidden');
  document.body.appendChild(beeImg);

  const beeDot = document.createElement('div');
  beeDot.id = 'bee-dot';
  beeDot.classList.add('init-hidden');
  document.body.appendChild(beeDot);

  const canvas = document.createElement('canvas');
  canvas.id = 'effect-canvas';
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  // ---------- STYLES ----------
  const style = document.createElement('style');
  style.textContent = `
    .init-hidden { display: none; }
    #cursor-dot {
      position: fixed; top: 0; left: 0;
      width: ${CIRCLE_SIZE}px; height: ${CIRCLE_SIZE}px;
      background: var(--accent-primary, #c22);
      border-radius: 50%;
      pointer-events: none; z-index: 1001;
      transform: translate(-50%, -50%);
      box-shadow: 0 0 8px var(--accent-glow, #ff4040);
      transition: opacity 0.2s ease, transform 0.2s ease;
    }
    #cursor-dot.hidden {
      opacity: 0; transform: translate(-50%, -50%) scale(0);
    }
    #hover-circle {
      position: fixed; top: 0; left: 0;
      width: ${HOVER_SIZE}px; height: ${HOVER_SIZE}px;
      background: transparent;
      border: 2px solid var(--accent-primary, #c22);
      border-radius: 50%;
      pointer-events: none; z-index: 1000;
      transform: translate(-50%, -50%);
      opacity: 0; transition: opacity 0.15s ease;
      box-shadow: 0 0 12px var(--accent-glow, #ff4040);
    }
    #hover-circle.visible { opacity: 1; }
    #custom-bee {
      position: fixed; top: 0; left: 0;
      width: ${BEE_SIZE}px; height: ${BEE_SIZE}px;
      pointer-events: none; z-index: 999;
      transition: transform 0.1s ease;
    }
    #bee-dot {
      position: fixed; top: 0; left: 0;
      width: 8px; height: 8px;
      background: var(--accent-primary, #c22);
      border-radius: 50%;
      pointer-events: none; z-index: 998;
      opacity: 0; transform: translate(-50%, -50%) scale(0);
      box-shadow: 0 0 8px var(--accent-glow, #ff4040);
      transition: opacity 0.2s ease, transform 0.2s ease;
    }
    #bee-dot.visible {
      opacity: 1; transform: translate(-50%, -50%) scale(1);
    }
    #effect-canvas {
      position: fixed; top: 0; left: 0;
      pointer-events: none; z-index: 997;
      /* width/height set inline to avoid scaling mismatch */
    }
    .burst-circle {
      position: fixed;
      border: 2px solid var(--accent-primary, #c22);
      border-radius: 50%;
      pointer-events: none;
      transform: translate(-50%, -50%);
      animation: burstOut ${BURST_DURATION}ms ease-out forwards;
      box-shadow: 0 0 8px var(--accent-glow, #ff4040);
      z-index: 1002;
    }
    @keyframes burstOut {
      0%   { width: ${BURST_RADIUS * 2}px; height: ${BURST_RADIUS * 2}px; opacity: 1; }
      100% { width: 0px; height: 0px; opacity: 0; }
    }
    #custom-bee.bee-burst {
      animation: beeBurst ${BEE_BURST_DURATION}ms ease-out forwards;
    }
    @keyframes beeBurst {
      0%   { transform: translate(-50%, -50%) scaleX(1) scale(0); opacity: 0; }
      50%  { transform: translate(-50%, -50%) scaleX(1) scale(1.15); opacity: 1; }
      100% { transform: translate(-50%, -50%) scaleX(1) scale(1); opacity: 1; }
    }
    body, a, button, input, textarea, select, img,
    .home-logo, .social-card, .blog-card, .project-card,
    .sidebar-item, .footer-link, .elem-btn, .toggle-expand,
    summary, .back-link, .page-btn, .hashtag, .tag,
    .hex-svg-cell, .skill-svg-cell, .photo-svg-cell {
      cursor: none !important;
    }
  `;
  document.head.appendChild(style);

  // ---------- STATE ----------
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let cursorHistory = [];
  let trailPoints = [];
  let lastBeeX = mouseX, lastBeeY = mouseY;
  let lastBeeDirection = 1;
  let lastMouseMoveTime = performance.now();
  let idleTarget = null;
  let isIdle = false;
  let dotAttached = false;
  let beeIsBursting = false;
  let lastFrameTime = null;
  let initialized = false;
  let isHovering = false;

  // ---------- THEME ----------
  function getTheme() {
    return document.body.getAttribute('data-theme') || 'dark';
  }
  function updateBeeImage() {
    beeImg.src = getTheme() === 'dark' ? 'img/redbee.png' : 'img/yellowbee.png';
  }
  const themeObserver = new MutationObserver(updateBeeImage);
  themeObserver.observe(document.body, { attributes: true, attributeFilter: ['data-theme'] });
  updateBeeImage();

  // ---------- BURST CIRCLE ----------
  function createBurstCircle(x, y) {
    const circle = document.createElement('div');
    circle.className = 'burst-circle';
    circle.style.left = x + 'px';
    circle.style.top = y + 'px';
    document.body.appendChild(circle);
    setTimeout(() => circle.remove(), BURST_DURATION);
  }

  // ---------- FIRST MOUSE MOVEMENT ----------
  function onFirstMove() {
    cursorDot.classList.remove('init-hidden');
    hoverCircle.classList.remove('init-hidden');
    beeImg.classList.remove('init-hidden');
    beeDot.classList.remove('init-hidden');
    initialized = true;
    resizeCanvas(); // ensure canvas fits the final viewport
  }

  // ---------- MOUSE ----------
  document.addEventListener('mousemove', (e) => {
    if (!initialized) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      lastBeeX = mouseX;
      lastBeeY = mouseY;
      lastMouseMoveTime = performance.now();
      onFirstMove();
      cursorDot.style.left = mouseX + 'px';
      cursorDot.style.top = mouseY + 'px';
      beeImg.style.left = mouseX + 'px';
      beeImg.style.top = mouseY + 'px';
      hoverCircle.style.left = mouseX + 'px';
      hoverCircle.style.top = mouseY + 'px';
      return;
    }

    mouseX = e.clientX;
    mouseY = e.clientY;
    const now = performance.now();

    if (dotAttached) {
      createBurstCircle(lastBeeX, lastBeeY);
      detachDot();
      createBurstCircle(mouseX, mouseY);

      beeImg.style.opacity = '0';
      beeIsBursting = true;
      beeImg.style.left = mouseX + 'px';
      beeImg.style.top = mouseY + 'px';
      lastBeeX = mouseX;
      lastBeeY = mouseY;
      beeImg.classList.add('bee-burst');
    }

    isIdle = false;
    idleTarget = null;
    lastMouseMoveTime = now;

    cursorHistory.push({ x: mouseX, y: mouseY, time: now });
    cursorHistory = cursorHistory.filter(p => now - p.time < 2000);

    if (isHovering) {
      createBurstCircle(mouseX, mouseY);
    } else {
      trailPoints.push({ x: mouseX, y: mouseY, time: now });
    }
  });

  beeImg.addEventListener('animationend', (e) => {
    if (e.animationName === 'beeBurst') {
      beeImg.classList.remove('bee-burst');
      beeImg.style.opacity = '1';
      beeIsBursting = false;
      beeImg.style.transform = 'translate(-50%, -50%) scaleX(1)';
    }
  });

  function detachDot() {
    beeDot.classList.remove('visible');
    cursorDot.classList.remove('hidden');
    dotAttached = false;
  }

  function attachDot() {
    cursorDot.classList.add('hidden');
    beeDot.classList.add('visible');
    dotAttached = true;
  }

  // ---------- HOVER ----------
  const interactiveSelector = 'a, button, input, textarea, select, .social-card, .playlist-card, .blog-card, .project-card, .sidebar-item, .footer-link, .elem-btn, .toggle-expand, summary, .back-link, .page-btn, .hashtag, .tag, .hex-svg-cell, .skill-svg-cell, .photo-svg-cell';
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(interactiveSelector)) {
      isHovering = true;
      hoverCircle.classList.add('visible');
    }
  });
  document.addEventListener('mouseout', (e) => {
    if (!document.elementFromPoint(e.clientX, e.clientY)?.closest(interactiveSelector)) {
      isHovering = false;
      hoverCircle.classList.remove('visible');
    }
  });

  // ---------- TRAIL + TIP DOT ----------
  function drawTrail(now) {
    if (isHovering) return;

    trailPoints = trailPoints.filter(p => now - p.time < TRAIL_DURATION);
    if (trailPoints.length < 2) return;

    ctx.save();
    ctx.globalCompositeOperation = 'source-over';
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    for (let i = 0; i < trailPoints.length - 1; i++) {
      const p1 = trailPoints[i];
      const p2 = trailPoints[i + 1];
      const age = now - p1.time;
      const alpha = Math.max(0, 1 - age / TRAIL_DURATION) * 0.7;
      if (alpha <= 0) continue;
      const width = (CIRCLE_SIZE / 2) * (1 - age / TRAIL_DURATION);
      if (width < 0.5) continue;

      const color = getTheme() === 'dark'
        ? `rgba(255, 60, 60, ${alpha})`
        : `rgba(212, 160, 23, ${alpha})`;

      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.strokeStyle = color;
      ctx.lineWidth = width;
      ctx.stroke();
    }

    const latest = trailPoints[trailPoints.length - 1];
    if (latest) {
      ctx.beginPath();
      ctx.arc(latest.x, latest.y, 3, 0, Math.PI * 2);   // slightly larger tip dot
      ctx.fillStyle = getTheme() === 'dark'
        ? 'rgba(255, 60, 60, 0.9)'
        : 'rgba(212, 160, 23, 0.9)';
      ctx.fill();
    }
    ctx.restore();
  }

  // ---------- BEE LOGIC ----------
  function generateIdleTarget() {
    const margin = 150;
    return {
      x: margin + Math.random() * (window.innerWidth - margin * 2),
      y: margin + Math.random() * (window.innerHeight - margin * 2)
    };
  }

  function getDynamicMaxSpeed(idleDuration) {
    const ratio = Math.min(1, idleDuration / IDLE_TIMEOUT);
    return BASE_SPEED + (MAX_SPEED_IDLE - BASE_SPEED) * ratio;
  }

  function updateBee(now) {
    if (beeIsBursting) return;
    if (!initialized) return;

    if (!lastFrameTime) {
      lastFrameTime = now;
      return;
    }
    const delta = Math.min(100, now - lastFrameTime);
    const idleDuration = now - lastMouseMoveTime;

    let maxSpeed = BASE_SPEED;
    if (idleDuration > 0 && idleDuration <= IDLE_TIMEOUT) {
      maxSpeed = getDynamicMaxSpeed(idleDuration);
    }
    const maxStep = maxSpeed * delta / 1000;

    let targetX, targetY;

    if (idleDuration > IDLE_TIMEOUT) {
      if (!dotAttached) attachDot();
      isIdle = true;
      if (!idleTarget) idleTarget = generateIdleTarget();
      targetX = idleTarget.x;
      targetY = idleTarget.y;
      const dist = Math.hypot(targetX - lastBeeX, targetY - lastBeeY);
      if (dist < 20) idleTarget = generateIdleTarget();
    } else {
      isIdle = false;
      idleTarget = null;
      targetX = mouseX;
      targetY = mouseY;
    }

    const dx = targetX - lastBeeX;
    const dy = targetY - lastBeeY;
    const dist = Math.hypot(dx, dy);
    let beeX = lastBeeX;
    let beeY = lastBeeY;

    if (dist > 0.5) {
      const step = Math.min(dist, maxStep);
      const ratio = step / dist;
      beeX = lastBeeX + dx * ratio;
      beeY = lastBeeY + dy * ratio;
    } else {
      beeX = targetX;
      beeY = targetY;
    }

    const wobbleX = Math.sin(now * 0.01) * 2;
    const wobbleY = Math.cos(now * 0.012) * 3;
    const finalX = beeX + wobbleX;
    const finalY = beeY + wobbleY;

    if (finalX < lastBeeX - 0.3) lastBeeDirection = -1;
    else if (finalX > lastBeeX + 0.3) lastBeeDirection = 1;

    lastBeeX = finalX;
    lastBeeY = finalY;

    beeImg.style.left = finalX + 'px';
    beeImg.style.top = finalY + 'px';
    if (!beeIsBursting) {
      beeImg.style.transform = `translate(-50%, -50%) scaleX(${lastBeeDirection})`;
    }

    if (dotAttached) {
      beeDot.style.left = finalX + 'px';
      beeDot.style.top = (finalY + BEE_SIZE/2 - 4 + 4) + 'px';
    }
  }

  // ---------- CANVAS SIZING (pixel perfect) ----------
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    trailPoints = [];
  }
  window.addEventListener('resize', resizeCanvas);
  // Also run after full page layout to catch scrollbar changes
  window.addEventListener('load', resizeCanvas);
  resizeCanvas();

  function loop(now) {
    if (initialized) {
      if (!dotAttached) {
        cursorDot.style.left = mouseX + 'px';
        cursorDot.style.top = mouseY + 'px';
      }
      hoverCircle.style.left = mouseX + 'px';
      hoverCircle.style.top = mouseY + 'px';

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawTrail(now);
      updateBee(now);
    }

    lastFrameTime = now;
    requestAnimationFrame(loop);
  }

  requestAnimationFrame(loop);
})();