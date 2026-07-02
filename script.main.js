(function(){
  "use strict";

  // ----- ELEMENTS -----
  const canvas = document.getElementById('hexCanvas');
  const ctx = canvas.getContext('2d');
  const header = document.getElementById('mainHeader');
  const footer = document.getElementById('mainFooter');
  const headerLogo = document.getElementById('headerLogo');
  const sidebar = document.getElementById('sidebar');
  const sidebarOverlay = document.getElementById('sidebarOverlay');
  const sidebarToggle = document.getElementById('sidebarToggle');
  const themeToggle = document.getElementById('themeToggle');
  const currentPageElement = document.getElementById('currentPage');
  const body = document.body;

  let animationStarted = false, headerFooterVisible = false;
  let currentTheme = 'dark';

  // Hex animation parameters
  let animFrame, width, height, hexes = [];
  const HEX_RADIUS = 32, HEX_PADDING = 6;
  const HEX_WIDTH = (HEX_RADIUS + HEX_PADDING) * Math.sqrt(3);
  const HEX_HEIGHT = (HEX_RADIUS + HEX_PADDING) * 2;
  const MAX_LIT_HEXES = 12, CYCLE_DURATION = 5.0;
  let litHexes = new Map(), lastUpdateTime = 0, neighborMap = new Map();

  const themes = {
    dark: { bg:'#0a0a0a', hexFill:'#000000', hexStroke:'#000000', litBase:{r:220,g:45,b:45}, litOuter:{r:255,g:60,b:60} },
    light:{ bg:'#f0f0f0', hexFill:'#ffffff', hexStroke:'#ffffff', litBase:{r:212,g:160,b:23}, litOuter:{r:255,g:215,b:0} }
  };

  // ----- THEME MANAGEMENT -----
  function detectBrowserTheme() {
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }
  // ----- LOGO SWAPPER -----
  function updateLogos(theme) {
    const lightElements = document.querySelectorAll('.logo-light');
    const darkElements = document.querySelectorAll('.logo-dark');
    lightElements.forEach(el => el.style.display = theme === 'light' ? '' : 'none');
    darkElements.forEach(el => el.style.display = theme === 'dark' ? '' : 'none');
  }
  function setTheme(theme) {
    currentTheme = theme;
    body.setAttribute('data-theme', theme);
    themeToggle.textContent = theme === 'dark' ? '🌙' : '☀️';
    localStorage.setItem('portfolio-theme', theme);
    updateLogos(theme);
  }
  function toggleTheme() { setTheme(currentTheme === 'dark' ? 'light' : 'dark'); }
  const savedTheme = localStorage.getItem('portfolio-theme');
  setTheme(savedTheme || detectBrowserTheme());
  themeToggle.addEventListener('click', toggleTheme);
  window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', e => {
    if (!localStorage.getItem('portfolio-theme')) setTheme(e.matches ? 'light' : 'dark');
  });

  // ----- SIDEBAR MANAGEMENT -----
  function openSidebar(){ sidebar.classList.add('open'); sidebarOverlay.classList.add('open'); }
  function closeSidebar(){ sidebar.classList.remove('open'); sidebarOverlay.classList.remove('open'); }
  sidebarToggle.addEventListener('click', () => sidebar.classList.contains('open') ? closeSidebar() : openSidebar());
  sidebarOverlay.addEventListener('click', closeSidebar);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeSidebar(); });

  // ----- HEADER & FOOTER REVEAL -----
  function revealHeaderFooter() {
    if (!headerFooterVisible) {
      header.classList.add('visible');
      footer.classList.add('visible');
      headerLogo.classList.add('visible');
      headerFooterVisible = true;
    }
  }

  // Start hex animation immediately, always
  function startHexAnimation() {
    if (!animationStarted) {
      animationStarted = true;
      lastUpdateTime = performance.now()/1000;
      animFrame = requestAnimationFrame(animationLoop);
    }
  }

  // Decide when to reveal header/footer based on current page
  function initHeaderFooter() {
    // Homepage: script.home.js handles the reveal and fade-in
    if (document.body.classList.contains('home-page')) return;

    // Subpages: fast header reveal after 0.5s
    setTimeout(() => {
      revealHeaderFooter();
    }, 500);

    // Fade-in the whole .content wrapper
    const content = document.querySelector('.content');
    if (content) {
      setTimeout(() => {
        content.classList.add('page-fade-in');
      }, 50);
    }
  }

  // ----- HEXAGON CANVAS LOGIC (unchanged) -----
  function resizeCanvas() {
    width = window.innerWidth; height = window.innerHeight;
    canvas.width = width; canvas.height = height;
    computeHexGrid(); buildNeighborMap();
  }
  function computeHexGrid() {
    hexes = [];
    const hSpacing = HEX_WIDTH, vSpacing = HEX_HEIGHT*0.75;
    const startX = -HEX_RADIUS*2, startY = -HEX_RADIUS*2;
    const cols = Math.ceil(width/hSpacing)+4, rows = Math.ceil(height/vSpacing)+4;
    let idx = 0;
    for (let r=0; r<rows; r++) {
      for (let c=0; c<cols; c++) {
        const x = c*hSpacing + (r%2)*(hSpacing/2) + startX;
        const y = r*vSpacing + startY;
        hexes.push({ x, y, index:idx, row:r, col:c });
        idx++;
      }
    }
  }
  function buildNeighborMap() {
    neighborMap.clear();
    const hexMap = new Map();
    hexes.forEach(h => hexMap.set(`${h.row},${h.col}`, h.index));
    hexes.forEach(h => {
      const n = new Set(), row = h.row, col = h.col, even = row%2===0;
      [[row, col-1], [row, col+1],
       [row-1, even?col-1:col], [row-1, even?col:col+1],
       [row+1, even?col-1:col], [row+1, even?col:col+1]
      ].forEach(([r,c]) => { const key=`${r},${c}`; if(hexMap.has(key)) n.add(hexMap.get(key)); });
      neighborMap.set(h.index, n);
    });
  }
  function drawHexagon(cx, cy, radius) {
    ctx.beginPath();
    for (let i=0; i<6; i++) {
      const angle = Math.PI/6 + i*Math.PI/3;
      const x = cx + radius*Math.cos(angle), y = cy + radius*Math.sin(angle);
      if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
    }
    ctx.closePath();
  }
  function canLightHex(index) {
    const neighbors = neighborMap.get(index)||new Set();
    for (let n of neighbors) if(litHexes.has(n)) return false;
    return true;
  }
  function calculateIntensity(startTime, currentTime) {
    const elapsed = currentTime - startTime;
    const cycleProgress = (elapsed % CYCLE_DURATION) / CYCLE_DURATION;
    let intensity = cycleProgress<0.5 ? cycleProgress*2 : 1 - (cycleProgress-0.5)*2;
    intensity = Math.max(0, Math.min(1, intensity));
    intensity = intensity<0.5 ? 2*intensity*intensity : 1-2*(1-intensity)*(1-intensity);
    return intensity;
  }
  function updateLighting(currentTime) {
    if (!animationStarted) return;
    for (let [idx, data] of litHexes.entries()) {
      if (calculateIntensity(data.startTime, currentTime) <= 0.01) {
        if (((currentTime - data.startTime)%CYCLE_DURATION)/CYCLE_DURATION >= 0.95) litHexes.delete(idx);
      }
    }
    const toAdd = Math.min(MAX_LIT_HEXES - litHexes.size, 3);
    if (toAdd>0 && hexes.length>0) {
      const available = hexes.filter(h => !litHexes.has(h.index) && canLightHex(h.index)).map(h => h.index);
      for (let i=available.length-1; i>0; i--) { const j=Math.floor(Math.random()*(i+1)); [available[i],available[j]]=[available[j],available[i]]; }
      available.slice(0,toAdd).forEach(idx => litHexes.set(idx, { startTime: currentTime - Math.random()*0.5 }));
    }
    if (litHexes.size===0 && hexes.length>0) {
      const available = hexes.map(h=>h.index);
      for (let i=available.length-1; i>0; i--) { const j=Math.floor(Math.random()*(i+1)); [available[i],available[j]]=[available[j],available[i]]; }
      available.slice(0, Math.min(6,available.length)).forEach(idx => {
        if (canLightHex(idx)) litHexes.set(idx, { startTime: currentTime - Math.random() });
      });
    }
  }
  function drawCanvas() {
    if (!width||!height) return;
    const currentTime = performance.now()/1000;
    const theme = themes[currentTheme];
    ctx.fillStyle = theme.bg; ctx.fillRect(0,0,width,height);
    for (let h of hexes) {
      let intensity = 0;
      if (litHexes.has(h.index)) intensity = calculateIntensity(litHexes.get(h.index).startTime, currentTime);
      if (intensity>0.01) intensity *= (0.9+0.2*Math.sin(currentTime*2 + h.x*0.01));
      ctx.fillStyle = theme.hexFill; drawHexagon(h.x,h.y,HEX_RADIUS); ctx.fill();
      if (intensity>0.01) {
        const t = intensity;
        const sc = currentTheme==='dark'?{r:0,g:0,b:0}:{r:255,g:255,b:255};
        const ir=Math.floor(sc.r*(1-t)+theme.litBase.r*t), ig=Math.floor(sc.g*(1-t)+theme.litBase.g*t), ib=Math.floor(sc.b*(1-t)+theme.litBase.b*t);
        ctx.lineWidth=2.5; ctx.strokeStyle=`rgb(${ir},${ig},${ib})`; ctx.stroke();
        ctx.save();
        ctx.shadowColor=`rgba(${theme.litOuter.r},${theme.litOuter.g},${theme.litOuter.b},${intensity*0.9})`; ctx.shadowBlur=18*intensity;
        const or=Math.floor(sc.r*(1-t)+theme.litOuter.r*t), og=Math.floor(sc.g*(1-t)+theme.litOuter.g*t), ob=Math.floor(sc.b*(1-t)+theme.litOuter.b*t);
        ctx.lineWidth=3.5; ctx.strokeStyle=`rgb(${or},${og},${ob})`; ctx.stroke();
        ctx.restore();
        if(intensity>0.5){ ctx.save(); ctx.shadowColor=`rgba(${theme.litOuter.r},${theme.litOuter.g},${theme.litOuter.b},1)`; ctx.shadowBlur=25*intensity; ctx.lineWidth=2; ctx.strokeStyle=`rgba(${theme.litOuter.r},${theme.litOuter.g},${theme.litOuter.b},${intensity})`; ctx.stroke(); ctx.restore(); }
      } else { ctx.lineWidth=1.8; ctx.strokeStyle=theme.hexStroke; ctx.stroke(); }
    }
  }
  function animationLoop() {
    const now = performance.now()/1000;
    if (animationStarted) updateLighting(now);
    drawCanvas();
    animFrame = requestAnimationFrame(animationLoop);
  }

  window.addEventListener('resize', () => { resizeCanvas(); buildNeighborMap(); drawCanvas(); });

  // ----- NAVIGATION (with fade‑out transition) -----
  const pageMap = {
    cv: 'cv.html',
    projects: 'projects.html',
    blogs: 'blogs.html',
    social: 'socialmedia.html'
  };

  function navigateTo(targetUrl) {
    const content = document.querySelector('.content');
    if (content) {
      content.classList.add('page-exit');
    }
    setTimeout(() => {
      window.location.href = targetUrl;
    }, 500);
  }

  // Event delegation – catches clicks on sidebar & footer
  document.body.addEventListener('click', (e) => {
    const link = e.target.closest('.footer-link, .sidebar-item');
    if (!link) return;
    const section = link.dataset.section;
    const target = pageMap[section];
    if (target) {
      e.preventDefault();
      closeSidebar();
      navigateTo(target);
    }
  });

  // ----- EXPAND / COLLAPSE BUTTONS (shared) -----
  document.querySelectorAll('.toggle-expand').forEach(btn => {
    btn.addEventListener('click', () => {
      const sectionId = btn.dataset.target;
      const section = document.getElementById(sectionId);
      if (!section) return;
      const expandable = section.querySelector('.expandable-content');
      if (!expandable) return;
      if (expandable.classList.contains('show')) {
        expandable.classList.remove('show');
        btn.textContent = 'Show More';
      } else {
        expandable.classList.add('show');
        btn.textContent = 'Show Less';
      }
    });
  });

  // Initialize canvas and header/footer
  function initCanvas() {
    resizeCanvas();
    if (animFrame) cancelAnimationFrame(animFrame);
    animFrame = requestAnimationFrame(animationLoop);
  }
  updateLogos(currentTheme);
  initCanvas();
  startHexAnimation();
  initHeaderFooter();
})();