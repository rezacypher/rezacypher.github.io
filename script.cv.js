(function(){
  "use strict";

  // ----- BUILD SKILL HONEYCOMB (5 cells) -----
  function buildSkillHoneycomb(skillSide) {
    const skillsData = {
      "Programming": [{ name:"C#", percent:84 }, { name:"Java (Android)", percent:80 }, { name:"Python", percent:86 }],
      "Web Development": [{ name:"HTML", percent:70 }, { name:"CSS", percent:73 }, { name:"JavaScript", percent:65 }, { name:"WordPress", percent:70 }],
      "Multimedia": [{ name:"Editing", percent:85 }, { name:"Premiere", percent:65 }, { name:"AfterEffects", percent:50 }],
      "Game Engine": [{ name:"Unreal Engine", percent:65 }, { name:"Mari", percent:70 }],
      "Office": [{ name:"MS-Word", percent:95 }, { name:"MS-PowerPoint", percent:93 }, { name:"MS-Excel", percent:70 }, { name:"Others", percent:50 }]
    };

    const honeycomb = document.getElementById('honeycomb');
    if (!honeycomb) return;

    const s = skillSide;
    const r = s, cx = s, cy = s;

    document.documentElement.style.setProperty('--hex-side', `${s}px`);

    honeycomb.innerHTML = '';

    const angleOffset = -Math.PI / 6;
    function getHexPath() {
      let d = '';
      for (let i = 0; i < 6; i++) {
        const angle = angleOffset + i * Math.PI / 3;
        const x = cx + r * Math.cos(angle);
        const y = cy + r * Math.sin(angle);
        d += (i === 0 ? 'M' : 'L') + `${x.toFixed(2)},${y.toFixed(2)} `;
      }
      return d + 'Z';
    }

    const fontSizeCategory = Math.round(s * 0.18);
    const fontSizePercent  = Math.round(s * 0.33);
    const fontSizeHover    = Math.round(s * 0.14);

    const skillEntries = Object.entries(skillsData);
    const cells = [];
    for (let i = 0; i < skillEntries.length; i++) {
      cells.push({ type: 'skill', row: i, category: skillEntries[i][0], skills: skillEntries[i][1] });
    }

    cells.forEach(cellData => {
      const cell = document.createElement('div');
      cell.className = 'hex-svg-cell skill-svg-cell';
      cell.setAttribute('data-row', cellData.row);
      cell.setAttribute('data-col', '0');

      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.setAttribute("viewBox", `0 0 ${2*s} ${2*s}`);

      // Border
      const borderPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
      borderPath.setAttribute("d", getHexPath());
      borderPath.setAttribute("fill", "none");
      borderPath.classList.add("hex-bg-border");
      svg.appendChild(borderPath);

      // Progress ring
      const avg = Math.round(cellData.skills.reduce((sum, sk) => sum + sk.percent, 0) / cellData.skills.length);
      const progressPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
      progressPath.setAttribute("d", getHexPath());
      progressPath.setAttribute("fill", "none");
      progressPath.classList.add("hex-progress-ring");
      const totalLength = 6 * r * 1.05;
      const drawLength = totalLength * (avg / 100);
      progressPath.setAttribute("stroke-dasharray", `${drawLength} ${totalLength - drawLength}`);
      progressPath.setAttribute("stroke-dashoffset", "0");
      svg.appendChild(progressPath);

      // Default text
      const defaultGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
      defaultGroup.classList.add("hex-default-text");
      defaultGroup.setAttribute("text-anchor", "middle");
      const catText = document.createElementNS("http://www.w3.org/2000/svg", "text");
      catText.setAttribute("x", s); catText.setAttribute("y", s * 0.85);
      catText.setAttribute("fill", "var(--text-primary)");
      catText.setAttribute("font-size", fontSizeCategory);
      catText.setAttribute("font-weight", "600");
      catText.textContent = cellData.category;
      const avgText = document.createElementNS("http://www.w3.org/2000/svg", "text");
      avgText.setAttribute("x", s); avgText.setAttribute("y", s * 1.15);
      avgText.setAttribute("fill", "var(--accent-primary)");
      avgText.setAttribute("font-size", fontSizePercent);
      avgText.setAttribute("font-weight", "bold");
      avgText.textContent = avg + '%';
      defaultGroup.appendChild(catText);
      defaultGroup.appendChild(avgText);
      svg.appendChild(defaultGroup);

      // Hover text
      const hoverGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
      hoverGroup.classList.add("hex-hover-text");
      hoverGroup.setAttribute("text-anchor", "middle");
      let yStart = s * 0.75;
      cellData.skills.forEach((skill, idx) => {
        const textLine = document.createElementNS("http://www.w3.org/2000/svg", "text");
        textLine.setAttribute("x", s);
        textLine.setAttribute("y", yStart + idx * fontSizeHover * 1.4);
        textLine.setAttribute("fill", "var(--text-primary)");
        textLine.setAttribute("font-size", fontSizeHover);
        textLine.textContent = `${skill.name}: ${skill.percent}%`;
        hoverGroup.appendChild(textLine);
      });
      svg.appendChild(hoverGroup);

      cell.appendChild(svg);
      honeycomb.appendChild(cell);
    });
  }

  // ----- BUILD PHOTO HEXAGON (themed image) -----
  function getPhotoSrc() {
    const theme = document.body.getAttribute('data-theme') || 'dark';
    return theme === 'dark' ? 'img/mypic.png' : 'img/mypic2.png';
  }

  function buildPhotoHexagon(photoSide) {
    const container = document.getElementById('photoContainer');
    if (!container) return;

    container.innerHTML = '';

    const s = photoSide;
    const cell = document.createElement('div');
    cell.className = 'hex-svg-cell photo-svg-cell';
    cell.style.width = `${Math.sqrt(3) * s}px`;
    cell.style.height = `${2 * s}px`;
    cell.style.position = 'static';
    cell.style.margin = '0 auto';

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", `0 0 ${2 * s} ${2 * s}`);

    const angleOffset = -Math.PI / 6;
    function getHexPath() {
      let d = '';
      for (let i = 0; i < 6; i++) {
        const angle = angleOffset + i * Math.PI / 3;
        const x = s + s * Math.cos(angle);
        const y = s + s * Math.sin(angle);
        d += (i === 0 ? 'M' : 'L') + `${x.toFixed(2)},${y.toFixed(2)} `;
      }
      return d + 'Z';
    }

    // Clip path for the hexagon shape (applied to the image)
    const clipPath = document.createElementNS("http://www.w3.org/2000/svg", "clipPath");
    clipPath.setAttribute("id", "hex-clip");
    const clipPathShape = document.createElementNS("http://www.w3.org/2000/svg", "path");
    clipPathShape.setAttribute("d", getHexPath());
    clipPath.appendChild(clipPathShape);
    svg.appendChild(clipPath);

    // The image, clipped to hexagon
    const image = document.createElementNS("http://www.w3.org/2000/svg", "image");
    image.setAttribute("href", getPhotoSrc());
    image.setAttribute("x", "0");
    image.setAttribute("y", "0");
    image.setAttribute("width", `${2 * s}`);
    image.setAttribute("height", `${2 * s}`);
    image.setAttribute("clip-path", "url(#hex-clip)");
    image.setAttribute("preserveAspectRatio", "xMidYMid slice");
    svg.appendChild(image);

    // Border (dashed, glowing)
    const borderPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
    borderPath.setAttribute("d", getHexPath());
    borderPath.setAttribute("fill", "none");
    borderPath.classList.add("hex-bg-border");
    svg.appendChild(borderPath);

    cell.appendChild(svg);
    container.appendChild(cell);
  }

  // ----- RESPONSIVE SIZING -----
  function calculateSizes() {
    const vw = Math.min(window.innerWidth, window.innerHeight);
    let skillSide = vw * 0.12;
    skillSide = Math.min(skillSide, 100);
    skillSide = Math.max(skillSide, 50);
    const photoSide = skillSide * 1.5;
    return { skillSide, photoSide };
  }

  function buildAllHexagons() {
    const { skillSide, photoSide } = calculateSizes();
    buildSkillHoneycomb(skillSide);
    buildPhotoHexagon(photoSide);
  }

  // Build on load + resize + orientation change
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildAllHexagons);
  } else {
    buildAllHexagons();
  }
  window.addEventListener('resize', buildAllHexagons);
  window.addEventListener('orientationchange', buildAllHexagons);

  // Rebuild photo when theme changes (to swap image)
  const themeObserver = new MutationObserver(() => {
    buildAllHexagons();
  });
  themeObserver.observe(document.body, { attributes: true, attributeFilter: ['data-theme'] });
})();