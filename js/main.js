/**
 * main.js — Abdul Moeed Portfolio
 * Three.js neural network hero, skills canvas, 3D card tilt, scroll reveals.
 *
 * Dependencies loaded via CDN in index.html:
 *   - Three.js  r162
 *   - GSAP 3
 */

'use strict';

/* ─── UTILS ──────────────────────────────────────────────────── */
const isMobile = () => window.innerWidth < 768;
const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ─── LOADING SCREEN ─────────────────────────────────────────── */
function hideLoader() {
  const loader = document.getElementById('loading-screen');
  if (!loader) return;
  setTimeout(() => {
    loader.classList.add('hidden');
    setTimeout(() => loader.remove(), 700);
  }, 800);
}

/* ══════════════════════════════════════════════════════════════
   NEURAL NETWORK HERO CANVAS  (Three.js)
   ══════════════════════════════════════════════════════════════ */
function initNeuralNetwork() {
  if (prefersReducedMotion()) return;

  const canvas = document.getElementById('hero-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  /* ─── Scene setup ─────────────────────────────────────────── */
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile() ? 1.5 : 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 0, isMobile() ? 35 : 28);

  /* ─── Particles / Nodes ────────────────────────────────────── */
  const NODE_COUNT  = isMobile() ? 60 : 120;
  const EDGE_COUNT  = isMobile() ? 80 : 180;
  const SPREAD      = isMobile() ? 20 : 28;

  // Node positions (random sphere distribution)
  const positions = [];
  for (let i = 0; i < NODE_COUNT; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi   = Math.acos(2 * Math.random() - 1);
    const r     = SPREAD * (0.35 + 0.65 * Math.random());
    positions.push(
      new THREE.Vector3(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi)
      )
    );
  }

  /* Nodes — glowing spheres */
  const nodeGeo  = new THREE.SphereGeometry(0.22, 8, 8);
  const nodeMat  = new THREE.MeshBasicMaterial({ color: 0x4f8ef7, transparent: true, opacity: 0.9 });
  const nodeGroup = new THREE.Group();

  positions.forEach(pos => {
    const mesh = new THREE.Mesh(nodeGeo, nodeMat.clone());
    mesh.position.copy(pos);
    // randomise size slightly
    const s = 0.6 + Math.random() * 0.8;
    mesh.scale.setScalar(s);
    mesh.userData.baseScale = s;
    mesh.userData.phase = Math.random() * Math.PI * 2;
    nodeGroup.add(mesh);
  });
  scene.add(nodeGroup);

  /* Edges — lines between close nodes */
  const edgeMat  = new THREE.LineBasicMaterial({ color: 0x4f8ef7, transparent: true, opacity: 0.18 });
  const edgeGroup = new THREE.Group();

  // Build edges by nearest-neighbour proximity
  let edgesBuilt = 0;
  for (let i = 0; i < NODE_COUNT && edgesBuilt < EDGE_COUNT; i++) {
    for (let j = i + 1; j < NODE_COUNT && edgesBuilt < EDGE_COUNT; j++) {
      const dist = positions[i].distanceTo(positions[j]);
      if (dist < SPREAD * 0.45) {
        const geo = new THREE.BufferGeometry().setFromPoints([positions[i], positions[j]]);
        edgeGroup.add(new THREE.Line(geo, edgeMat.clone()));
        edgesBuilt++;
      }
    }
  }
  scene.add(edgeGroup);

  /* Ambient light-glow particles */
  const PARTICLE_COUNT = isMobile() ? 200 : 500;
  const particleGeo = new THREE.BufferGeometry();
  const particlePos = new Float32Array(PARTICLE_COUNT * 3);
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particlePos[i * 3]     = (Math.random() - 0.5) * 80;
    particlePos[i * 3 + 1] = (Math.random() - 0.5) * 80;
    particlePos[i * 3 + 2] = (Math.random() - 0.5) * 80;
  }
  particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
  const particleMat = new THREE.PointsMaterial({
    color: 0x4f8ef7, size: 0.12, transparent: true, opacity: 0.35,
  });
  scene.add(new THREE.Points(particleGeo, particleMat));

  /* ─── Mouse interaction ────────────────────────────────────── */
  const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };

  window.addEventListener('mousemove', e => {
    mouse.targetX = (e.clientX / window.innerWidth  - 0.5) * 2;
    mouse.targetY = (e.clientY / window.innerHeight - 0.5) * 2;
  }, { passive: true });

  /* ─── Scroll-based canvas fade ─────────────────────────────── */
  let scrollY = 0;
  window.addEventListener('scroll', () => { scrollY = window.scrollY; }, { passive: true });

  /* ─── Animation loop ───────────────────────────────────────── */
  let animId;
  const clock = new THREE.Clock();

  function animate() {
    animId = requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    // Smooth mouse follow
    mouse.x += (mouse.targetX - mouse.x) * 0.04;
    mouse.y += (mouse.targetY - mouse.y) * 0.04;

    // Rotate network group
    nodeGroup.rotation.y = t * 0.06 + mouse.x * 0.4;
    nodeGroup.rotation.x = mouse.y * 0.25;
    edgeGroup.rotation.copy(nodeGroup.rotation);

    // Pulse nodes
    nodeGroup.children.forEach((mesh, i) => {
      const s = mesh.userData.baseScale * (0.88 + 0.12 * Math.sin(t * 1.4 + mesh.userData.phase));
      mesh.scale.setScalar(s);
    });

    // Scroll-based camera push
    const scrollFade = Math.min(scrollY / (window.innerHeight * 0.7), 1);
    camera.position.z = (isMobile() ? 35 : 28) + scrollFade * 12;
    camera.position.y = -scrollFade * 4;

    // Canvas opacity based on scroll
    canvas.style.opacity = 1 - scrollFade * 0.82;

    renderer.render(scene, camera);
  }

  animate();

  /* ─── Resize ───────────────────────────────────────────────── */
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }, { passive: true });
}

/* ══════════════════════════════════════════════════════════════
   SKILLS ORBIT CANVAS  (Three.js)
   ══════════════════════════════════════════════════════════════ */
function initSkillsCanvas() {
  if (prefersReducedMotion()) return;

  const canvas = document.getElementById('skills-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const wrap   = canvas.parentElement;
  const W = wrap.offsetWidth;
  const H = wrap.offsetHeight;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(W, H);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, W / H, 0.1, 500);
  camera.position.set(0, 0, isMobile() ? 30 : 22);

  /* All skills flat list */
  const allSkills = [];
  Object.entries(SKILLS).forEach(([group, items]) => {
    items.forEach(s => allSkills.push({ ...s, group }));
  });

  /* Create text-sprite nodes */
  const nodes = [];
  const angleStep = (Math.PI * 2) / allSkills.length;
  const radii = [6, 9, 12, 15, 18];

  allSkills.forEach((skill, i) => {
    // Sprite canvas
    const c = document.createElement('canvas');
    c.width = 256; c.height = 64;
    const ctx = c.getContext('2d');

    // Background pill
    const grd = ctx.createLinearGradient(0, 0, 256, 0);
    grd.addColorStop(0, 'rgba(79,142,247,0.22)');
    grd.addColorStop(1, 'rgba(124,92,252,0.15)');
    ctx.fillStyle = grd;
    roundRect(ctx, 2, 8, 252, 48, 24);
    ctx.fill();

    // Border
    ctx.strokeStyle = 'rgba(79,142,247,0.5)';
    ctx.lineWidth = 1.5;
    roundRect(ctx, 2, 8, 252, 48, 24);
    ctx.stroke();

    // Label
    ctx.fillStyle = '#e2e8f0';
    ctx.font = 'bold 22px "Space Grotesk", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(skill.name, 128, 32);

    const tex = new THREE.CanvasTexture(c);
    const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, opacity: 0.88 });
    const sprite = new THREE.Sprite(mat);

    const r   = radii[i % radii.length];
    const angle = angleStep * i + (Math.floor(i / 5) * 0.7);
    const tilt  = (Math.random() - 0.5) * 0.6;

    sprite.position.set(
      r * Math.cos(angle),
      (Math.random() - 0.5) * 8,
      r * Math.sin(angle)
    );
    sprite.scale.set(isMobile() ? 3 : 4, isMobile() ? 0.9 : 1.1, 1);
    sprite.userData = { r, angle, tilt, speed: 0.08 + Math.random() * 0.06, phase: Math.random() * Math.PI * 2 };
    scene.add(sprite);
    nodes.push(sprite);
  });

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }

  /* Mouse hover detect (raycasting sprites) */
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  canvas.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    pointer.x =  ((e.clientX - rect.left) / rect.width)  * 2 - 1;
    pointer.y = -((e.clientY - rect.top)  / rect.height) * 2 + 1;
  }, { passive: true });

  const clock = new THREE.Clock();
  let animId2;

  function animate() {
    animId2 = requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    // Orbit
    nodes.forEach(node => {
      const { r, speed, phase } = node.userData;
      node.userData.angle += speed * 0.008;
      const a = node.userData.angle;
      node.position.x = r * Math.cos(a);
      node.position.z = r * Math.sin(a);
      node.position.y = Math.sin(t * 0.5 + phase) * 1.8;
      node.material.opacity = 0.65 + 0.25 * Math.sin(t + phase);
    });

    // Slow camera orbit
    camera.position.x = Math.sin(t * 0.08) * 3;
    camera.position.y = Math.cos(t * 0.06) * 2;
    camera.lookAt(0, 0, 0);

    // Raycaster hover highlight
    raycaster.setFromCamera(pointer, camera);
    const hits = raycaster.intersectObjects(nodes);
    nodes.forEach(n => n.material.opacity = 0.65);
    if (hits.length) hits[0].object.material.opacity = 1;

    renderer.render(scene, camera);
  }

  animate();

  /* Resize */
  const ro = new ResizeObserver(() => {
    const nW = wrap.offsetWidth;
    const nH = wrap.offsetHeight;
    camera.aspect = nW / nH;
    camera.updateProjectionMatrix();
    renderer.setSize(nW, nH);
  });
  ro.observe(wrap);
}

/* ══════════════════════════════════════════════════════════════
   3D CARD TILT  (vanilla JS)
   ══════════════════════════════════════════════════════════════ */
function initCardTilt() {
  if (prefersReducedMotion() || isMobile()) return;

  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width  / 2;
      const cy = rect.top  + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width  / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);

      card.style.transform = `perspective(800px) rotateY(${dx * 8}deg) rotateX(${-dy * 6}deg) scale(1.03)`;

      // dynamic radial glow follows cursor
      const mx = ((e.clientX - rect.left) / rect.width  * 100).toFixed(1);
      const my = ((e.clientY - rect.top)  / rect.height * 100).toFixed(1);
      card.style.setProperty('--mx', `${mx}%`);
      card.style.setProperty('--my', `${my}%`);
    }, { passive: true });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.setProperty('--mx', '50%');
      card.style.setProperty('--my', '50%');
    });
  });
}

/* ══════════════════════════════════════════════════════════════
   PROJECT MODAL
   ══════════════════════════════════════════════════════════════ */
function initModals() {
  const overlay = document.getElementById('project-modal');
  if (!overlay) return;

  const fields = {
    emoji:    overlay.querySelector('.modal-emoji'),
    title:    overlay.querySelector('.modal-title'),
    tagline:  overlay.querySelector('.modal-tagline'),
    desc:     overlay.querySelector('.modal-desc'),
    list:     overlay.querySelector('.modal-highlights'),
    tech:     overlay.querySelector('.modal-tech'),
    btnGH:    overlay.querySelector('#modal-github'),
    btnLive:  overlay.querySelector('#modal-live'),
  };

  function openModal(id) {
    const proj = PROJECTS.find(p => p.id === id);
    if (!proj) return;

    fields.emoji.textContent = proj.emoji;
    fields.title.textContent = proj.title;
    fields.tagline.textContent = proj.tagline;
    fields.desc.textContent = proj.description;

    fields.list.innerHTML = proj.highlights
      .map(h => `<li>${h}</li>`).join('');

    fields.tech.innerHTML = proj.tech
      .map(t => `<span class="tech-pill">${t}</span>`).join('');

    fields.btnGH.href   = proj.github;
    fields.btnLive.href = proj.live;

    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  // Open via card click
  document.querySelectorAll('.project-card[data-id]').forEach(card => {
    card.addEventListener('click', e => {
      // Ignore clicks on links inside card
      if (e.target.closest('.card-link')) return;
      openModal(card.dataset.id);
    });
  });

  // Close button
  overlay.querySelector('.modal-close').addEventListener('click', closeModal);

  // Backdrop click
  overlay.addEventListener('click', e => {
    if (e.target === overlay) closeModal();
  });

  // Escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
  });
}

/* ══════════════════════════════════════════════════════════════
   SCROLL REVEAL  (IntersectionObserver)
   ══════════════════════════════════════════════════════════════ */
function initScrollReveal() {
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal, .timeline-item').forEach(el => io.observe(el));
}

/* ══════════════════════════════════════════════════════════════
   SKILL BAR ANIMATION
   ══════════════════════════════════════════════════════════════ */
function initSkillBars() {
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.querySelectorAll('.skill-fill').forEach(bar => {
        bar.style.width = bar.dataset.pct + '%';
      });
      io.unobserve(entry.target);
    });
  }, { threshold: 0.2 });

  document.querySelectorAll('.skill-group').forEach(g => io.observe(g));
}

/* ══════════════════════════════════════════════════════════════
   NAV: active section highlight + scroll class
   ══════════════════════════════════════════════════════════════ */
function initNav() {
  const nav = document.querySelector('nav');
  const links = document.querySelectorAll('.nav-links a');
  const sections = document.querySelectorAll('section[id]');

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const id = entry.target.id;
      links.forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
      });
    });
  }, { rootMargin: '-45% 0px -45% 0px' });

  sections.forEach(s => io.observe(s));

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  /* Hamburger */
  const toggle   = document.querySelector('.nav-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  toggle.addEventListener('click', () => {
    const open = toggle.classList.toggle('open');
    mobileMenu.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });
  mobileMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      toggle.classList.remove('open');
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

/* ══════════════════════════════════════════════════════════════
   CONTACT FORM
   ══════════════════════════════════════════════════════════════ */
function initContactForm() {
  const form   = document.getElementById('contact-form');
  const status = document.getElementById('form-status');
  if (!form) return;

  form.addEventListener('submit', async e => {
    e.preventDefault();

    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.textContent = 'Sending…';
    status.className = 'form-status';
    status.style.display = 'none';

    try {
      const response = await fetch('https://formspree.io/f/mqperved', {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' },
      });

      if (response.ok) {
        status.className = 'form-status success';
        status.textContent = '✓ Message sent! I\'ll get back to you soon.';
        form.reset();
      } else {
        const data = await response.json();
        const errMsg = data?.errors?.map(e => e.message).join(', ') || 'Something went wrong.';
        status.className = 'form-status error';
        status.textContent = `✗ ${errMsg}`;
      }
    } catch (err) {
      status.className = 'form-status error';
      status.textContent = '✗ Network error — please email me directly at Moeedsethi21@gmail.com';
    } finally {
      btn.disabled = false;
      btn.textContent = 'Send Message';
    }
  });
}

/* ══════════════════════════════════════════════════════════════
   TYPED HERO SUBTITLE
   ══════════════════════════════════════════════════════════════ */
function initTyped() {
  const el = document.getElementById('typed-role');
  if (!el || prefersReducedMotion()) return;

  const roles = ['AI Engineer', 'Software Engineer', 'Python Developer', 'Full-Stack Builder'];
  let ri = 0, ci = 0, deleting = false;

  function tick() {
    const word = roles[ri];
    if (!deleting) {
      el.textContent = word.slice(0, ci + 1);
      ci++;
      if (ci === word.length) {
        deleting = true;
        setTimeout(tick, 1800);
        return;
      }
    } else {
      el.textContent = word.slice(0, ci - 1);
      ci--;
      if (ci === 0) {
        deleting = false;
        ri = (ri + 1) % roles.length;
      }
    }
    setTimeout(tick, deleting ? 55 : 90);
  }
  tick();
}

/* ══════════════════════════════════════════════════════════════
   GSAP SCROLL ANIMATIONS (if available)
   ══════════════════════════════════════════════════════════════ */
function initGSAP() {
  if (typeof gsap === 'undefined' || prefersReducedMotion()) return;

  // Section titles glide in
  gsap.utils.toArray('.section-title, .section-label').forEach(el => {
    gsap.fromTo(el,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' }
      }
    );
  });
}

/* ══════════════════════════════════════════════════════════════
   BOOT
   ══════════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  // Staggered init to keep main thread responsive
  initNav();
  initTyped();
  initScrollReveal();
  initSkillBars();
  initCardTilt();
  initModals();
  initContactForm();

  // Defer heavy 3D
  if (!prefersReducedMotion()) {
    requestIdleCallback
      ? requestIdleCallback(() => {
          initNeuralNetwork();
          initSkillsCanvas();
          hideLoader();
        })
      : setTimeout(() => {
          initNeuralNetwork();
          initSkillsCanvas();
          hideLoader();
        }, 100);
  } else {
    hideLoader();
  }

  // GSAP (loaded async via CDN)
  if (typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    initGSAP();
  }
});
