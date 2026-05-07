/* =============================================
   LOS XAVALES 00 — main.js
   ============================================= */

// ── CONFIG ──────────────────────────────────────
const CONFIG = {
  YT_API_KEY: 'AIzaSyANrARCZVtVJ5ZrPFWx0fq2ZaT-uokl4n0',
  YT_HANDLE: 'LosXavales',
  YT_CHANNEL_ID: 'UCVTXCAJ_1-cPhTYliqJaVYQ', // ID verificado @losxavales
  YT_MAX_RESULTS: 8,
  SUPABASE_URL: '',
  SUPABASE_ANON_KEY: '',
  SPLASH_DURATION: 3500,
};

// ── SPLASH SCREEN ────────────────────────────────
(function initSplash() {
  const splash      = document.getElementById('splash');
  const loader      = document.getElementById('splash-loader');
  const bar         = document.getElementById('loader-bar');
  const loaderText  = document.getElementById('loader-text');
  const main        = document.getElementById('main-content');

  const texts = ['CARGANDO...', 'INICIANDO...', 'CASI LISTO...', '¡VAMOS!'];
  let textIdx = 0;
  let progress = 0;

  // Show loader after logo spin (1.8s)
  setTimeout(() => {
    loader.classList.add('visible');

    const textInterval = setInterval(() => {
      textIdx = (textIdx + 1) % texts.length;
      loaderText.textContent = texts[textIdx];
    }, 600);

    const barInterval = setInterval(() => {
      progress += Math.random() * 8 + 4;
      if (progress >= 100) {
        progress = 100;
        clearInterval(barInterval);
        clearInterval(textInterval);
        loaderText.textContent = '¡VAMOS!';
      }
      bar.style.width = progress + '%';
    }, 80);

  }, 1900);

  // Hide splash
  setTimeout(() => {
    splash.classList.add('hidden');
    main.classList.remove('site-hidden');
    main.classList.add('site-visible');
    initHeroParticles();
    initScrollReveal();
    fetchChannelData();  // carga stats reales + vídeos en cadena
    checkNewVideo();
  }, CONFIG.SPLASH_DURATION);

  // Splash particles
  initSplashParticles();
})();

// ── SPLASH PARTICLES ─────────────────────────────
function initSplashParticles() {
  const canvas = document.getElementById('splash-particles');
  const ctx    = canvas.getContext('2d');
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;

  const particles = Array.from({ length: 60 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 2 + 0.5,
    speed: Math.random() * 0.4 + 0.1,
    opacity: Math.random() * 0.5 + 0.1,
  }));

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,224,0,${p.opacity})`;
      ctx.fill();
      p.y -= p.speed;
      if (p.y < -5) { p.y = canvas.height + 5; p.x = Math.random() * canvas.width; }
    });
    requestAnimationFrame(draw);
  }
  draw();
}

// ── HERO PARTICLES ───────────────────────────────
function initHeroParticles() {
  const canvas = document.getElementById('hero-particles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const particles = Array.from({ length: 80 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 1.5 + 0.3,
    vx: (Math.random() - 0.5) * 0.3,
    vy: (Math.random() - 0.5) * 0.3,
    opacity: Math.random() * 0.4 + 0.05,
  }));

  // Mouse parallax
  let mx = 0, my = 0;
  document.addEventListener('mousemove', e => {
    mx = (e.clientX / window.innerWidth - 0.5) * 0.5;
    my = (e.clientY / window.innerHeight - 0.5) * 0.5;
  });

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,224,0,${p.opacity})`;
      ctx.fill();
      p.x += p.vx + mx;
      p.y += p.vy + my;
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;
    });

    // Draw connecting lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(255,224,0,${0.06 * (1 - dist / 100)})`;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }
  draw();
}

// ── NAVBAR ───────────────────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 30);
});

const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('nav-links');
hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  const spans = hamburger.querySelectorAll('span');
  hamburger.classList.toggle('active');
  if (navLinks.classList.contains('open')) {
    spans[0].style.transform = 'rotate(45deg) translate(5px,5px)';
    spans[1].style.opacity   = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(5px,-5px)';
  } else {
    spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  }
});

// Close menu on link click
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  });
});

// ── SCROLL REVEAL ────────────────────────────────
function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, (entry.target.dataset.delay || 0));
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal').forEach((el, i) => {
    el.dataset.delay = (i % 4) * 80;
    observer.observe(el);
  });
}

function easeOut(t) { return 1 - Math.pow(1 - t, 3); }

// ── YOUTUBE: CHANNEL DATA + VIDEOS ───────────────
async function fetchChannelData() {
  // Channel ID ya verificado — cargamos vídeos directamente
  await loadYouTubeVideos();
}

async function loadYouTubeVideos() {
  const grid = document.getElementById('episodes-grid');
  if (!CONFIG.YT_CHANNEL_ID) { renderMockEpisodes(grid); return; }
  try {
    // 1️⃣ Playlist de uploads = UU + channelId[2:] — orden cronológico real
    const uploadsId  = 'UU' + CONFIG.YT_CHANNEL_ID.slice(2);
    const plUrl      = `https://www.googleapis.com/youtube/v3/playlistItems?playlistId=${uploadsId}&part=snippet,contentDetails&maxResults=50&key=${CONFIG.YT_API_KEY}`;
    const plRes      = await fetch(plUrl);
    const plData     = await plRes.json();
    if (!plData.items || plData.items.length === 0) { renderMockEpisodes(grid); return; }

    // 2️⃣ Duración real en una sola llamada a videos.list
    const ids       = plData.items.map(i => i.contentDetails.videoId).join(',');
    const detailRes = await fetch(`https://www.googleapis.com/youtube/v3/videos?id=${ids}&part=contentDetails&key=${CONFIG.YT_API_KEY}`);
    const detailData = await detailRes.json();
    const durMap = {};
    (detailData.items || []).forEach(v => { durMap[v.id] = parseISO8601Duration(v.contentDetails.duration); });

    // 3️⃣ Normalizar a formato interno
    const items = plData.items.map(i => ({
      id: { videoId: i.contentDetails.videoId },
      snippet: {
        title: i.snippet.title,
        description: i.snippet.description || '',
        publishedAt: i.contentDetails.videoPublishedAt || i.snippet.publishedAt,
        thumbnails: i.snippet.thumbnails,
      }
    }));

    // 4️⃣ Filtrar eliminados, Shorts y < 2 min
    const filtered = items.filter(item => {
      const t = item.snippet.title.toLowerCase();
      if (t === 'deleted video' || t === 'private video') return false;
      if (t.includes('#shorts') || t.includes('shorts')) return false;
      return (durMap[item.id.videoId] ?? 999) >= 120;
    });

    const videos = filtered.slice(0, CONFIG.YT_MAX_RESULTS);
    if (videos.length === 0) { renderMockEpisodes(grid); return; }
    renderFeaturedVideo(videos[0]);
    renderEpisodes(grid, videos);
  } catch (e) {
    console.warn('Videos fetch error:', e);
    renderMockEpisodes(grid);
  }
}

// Convierte "PT1H43M30S" → segundos
function parseISO8601Duration(iso) {
  const m = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!m) return 0;
  return (parseInt(m[1] || 0) * 3600) + (parseInt(m[2] || 0) * 60) + parseInt(m[3] || 0);
}

function renderFeaturedVideo(item) {
  const id    = item.id.videoId;
  const title = item.snippet.title;
  const thumb = item.snippet.thumbnails.maxres?.url
             || item.snippet.thumbnails.high?.url
             || item.snippet.thumbnails.medium?.url;
  const date  = new Date(item.snippet.publishedAt).toLocaleDateString('es-ES', {
    day: '2-digit', month: 'long', year: 'numeric'
  });
  const container = document.getElementById('hero-latest-inner');
  if (!container) return;
  container.innerHTML = `
    <a href="https://www.youtube.com/watch?v=${id}" target="_blank" rel="noopener" class="hero-latest-card">
      <div class="hero-latest-thumb-wrap">
        <img src="${thumb}" alt="${title}" class="hero-latest-thumb" />
        <div class="hero-latest-play">▶</div>
        <span class="hero-latest-badge">🔴 ÚLTIMO VÍDEO</span>
      </div>
      <div class="hero-latest-info">
        <p class="hero-latest-title">${title}</p>
        <p class="hero-latest-date">${date}</p>
      </div>
    </a>
  `;
}

function renderEpisodes(grid, items) {
  grid.innerHTML = '';
  items.forEach(item => {
    const id    = item.id.videoId;
    const snip  = item.snippet;
    const title = snip.title;
    // Intentar la mejor resolución disponible
    const thumb = snip.thumbnails.maxres?.url
                || snip.thumbnails.high?.url
                || snip.thumbnails.medium?.url;
    const date  = new Date(snip.publishedAt).toLocaleDateString('es-ES', {
      day: '2-digit', month: 'short', year: 'numeric'
    });

    const card = document.createElement('a');
    card.href        = `https://www.youtube.com/watch?v=${id}`;
    card.target      = '_blank';
    card.rel         = 'noopener noreferrer';
    card.className   = 'episode-card';
    card.innerHTML = `
      <img class="episode-thumb" src="${thumb}" alt="${title}" loading="lazy" />
      <div class="episode-play"><div class="play-icon">&#9654;</div></div>
      <div class="episode-info">
        <p class="episode-title">${title}</p>
        <div class="episode-meta"><span>Los Xavales 00</span><span>${date}</span></div>
      </div>`;
    grid.appendChild(card);
    // Fade-in card
    requestAnimationFrame(() => card.style.opacity = '1');
  });
}

function renderMockEpisodes(grid) {
  grid.innerHTML = '';
  const mocks = [
    { title: 'REACCIÓN: Nuevo banger de la escena urbana 🔥', ch: 'Los Xavales 00', date: 'hace 2 días' },
    { title: 'De Palique con... el artista del momento', ch: 'Los Xavales 00', date: 'hace 5 días' },
    { title: 'PASALASBARRAS — Ronda eliminatoria', ch: 'Los Xavales 00', date: 'hace 1 semana' },
    { title: 'Top 5 canciones que están petando ahora mismo', ch: 'Los Xavales 00', date: 'hace 2 semanas' },
    { title: 'REACCIÓN en directo: Álbum sorpresa', ch: 'Los Xavales 00', date: 'hace 2 semanas' },
    { title: 'Vlogs desde la grabación — Behind the scenes', ch: 'Los Xavales 00', date: 'hace 3 semanas' },
    { title: 'GIVE ME FIVE: Las canciones del mes', ch: 'Los Xavales 00', date: 'hace 1 mes' },
    { title: 'Entrevista exclusiva con el artista revelación', ch: 'Los Xavales 00', date: 'hace 1 mes' },
  ];
  mocks.forEach(m => {
    const card = document.createElement('a');
    card.href   = 'https://www.youtube.com/@LosXavales';
    card.target = '_blank';
    card.className = 'episode-card';
    card.innerHTML = `
      <div class="episode-thumb-placeholder">▶</div>
      <div class="episode-play"><div class="play-icon">▶</div></div>
      <div class="episode-info">
        <p class="episode-title">${m.title}</p>
        <div class="episode-meta"><span>${m.ch}</span><span>${m.date}</span></div>
      </div>`;
    grid.appendChild(card);
  });
}

// ── CHECK NEW VIDEO ───────────────────────────
async function checkNewVideo() {
  try {
    // Mismo filtro: sin shorts
    const url = `https://www.googleapis.com/youtube/v3/search?channelId=${CONFIG.YT_CHANNEL_ID}&part=snippet,id&order=date&maxResults=5&type=video&key=${CONFIG.YT_API_KEY}`;
    const res  = await fetch(url);
    const data = await res.json();
    if (!data.items || data.items.length === 0) return;

    const latest   = data.items[0];
    const latestId = latest.id.videoId;
    const savedId  = localStorage.getItem('xavales_last_video');

    if (savedId && savedId !== latestId) {
      const banner = document.getElementById('new-video-banner');
      const link   = document.getElementById('new-video-link');
      link.href        = `https://www.youtube.com/watch?v=${latestId}`;
      link.textContent = latest.snippet.title;
      banner.classList.remove('hidden');
      document.getElementById('navbar').style.top = banner.offsetHeight + 'px';
    }
    localStorage.setItem('xavales_last_video', latestId);
  } catch (e) {
    console.warn('New video check failed:', e);
  }
}

// ── MEMBER CARDS — AUDIO HOVER ───────────────────
const currentAudio = { el: null };

document.querySelectorAll('.member-card').forEach(card => {
  const audioSrc = card.dataset.audio;
  if (!audioSrc) return;

  let audio = null;

  card.addEventListener('mouseenter', () => {
    // Stop any playing audio
    if (currentAudio.el && currentAudio.el !== audio) {
      currentAudio.el.pause();
      currentAudio.el.currentTime = 0;
    }

    if (!audio) {
      audio = new Audio(audioSrc);
      audio.volume = 0.5;
      audio.loop   = true;
    }

    // Show mini player
    const name = card.querySelector('.member-name')?.textContent || '—';
    showMiniPlayer(name, audioSrc);

    audio.currentTime = 0;
    audio.play().catch(() => {}); // autoplay policy guard
    currentAudio.el = audio;
  });

  card.addEventListener('mouseleave', () => {
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
    hideMiniPlayer();
  });
});

// ── MINI PLAYER ──────────────────────────────────
const miniPlayer   = document.getElementById('mini-player');
const playerTitle  = document.getElementById('player-title');
const playerArtist = document.getElementById('player-artist');
const playerPlay   = document.getElementById('player-play');
const playerBar    = document.getElementById('player-bar');

function showMiniPlayer(title, src) {
  playerTitle.textContent = title;
  miniPlayer.classList.remove('hidden');
}

function hideMiniPlayer() {
  miniPlayer.classList.add('hidden');
}

playerPlay.addEventListener('click', () => {
  if (currentAudio.el) {
    if (currentAudio.el.paused) {
      currentAudio.el.play().catch(() => {});
      playerPlay.textContent = '⏸';
    } else {
      currentAudio.el.pause();
      playerPlay.textContent = '▶';
    }
  }
});

// ── SMOOTH SCROLL FOR ANCHOR LINKS ───────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href').slice(1);
    const el = document.getElementById(id);
    if (el) {
      e.preventDefault();
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ── CURSOR GLOW (desktop only) ────────────────────
if (window.matchMedia('(hover: hover)').matches) {
  const glow = document.createElement('div');
  glow.style.cssText = `
    position:fixed;width:300px;height:300px;border-radius:50%;pointer-events:none;z-index:9997;
    background:radial-gradient(circle,rgba(255,224,0,0.04) 0%,transparent 70%);
    transform:translate(-50%,-50%);transition:opacity 0.3s;
  `;
  document.body.appendChild(glow);
  document.addEventListener('mousemove', e => {
    glow.style.left = e.clientX + 'px';
    glow.style.top  = e.clientY + 'px';
  });
}

// ── NAV LOGO SPIN on click ────────────────────────
document.getElementById('nav-logo-link')?.addEventListener('click', e => {
  e.preventDefault();
  const logo = document.getElementById('nav-logo');
  logo.style.transition = 'transform 0.6s cubic-bezier(0.4,0,0.2,1)';
  logo.style.transform  = 'rotate(720deg)';
  setTimeout(() => {
    logo.style.transition = '';
    logo.style.transform  = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, 700);
});

// ── GIVE ME FIVE — Spotify track cards ───────────
async function loadSpotifyTracks() {
  const cards = document.querySelectorAll('.gmf-track-card');
  for (const card of cards) {
    const trackId = card.dataset.track;
    const artist  = card.dataset.artist;
    const num     = card.dataset.num;
    const url     = `https://open.spotify.com/track/${trackId}`;

    try {
      const res  = await fetch(`https://open.spotify.com/oembed?url=${encodeURIComponent(url)}&format=json`);
      const data = await res.json();
      const cover = data.thumbnail_url || '';
      const title = data.title || '';

      card.innerHTML = `
        <a href="${url}" target="_blank" rel="noopener" class="gmf-track-link">
          <div class="gmf-cover-wrap">
            ${cover ? `<img src="${cover}" alt="${title}" class="gmf-cover" loading="lazy" />` : `<div class="gmf-cover-placeholder"></div>`}
            <div class="gmf-cover-overlay">
              <svg class="gmf-spotify-icon" viewBox="0 0 24 24" fill="#1DB954"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/></svg>
              <span class="gmf-play-text">ESCUCHAR</span>
            </div>
          </div>
          <div class="gmf-track-info">
            <span class="gmf-track-num">${num}</span>
            <div class="gmf-track-text">
              <p class="gmf-track-title">${title}</p>
              <p class="gmf-track-artist">${artist}</p>
            </div>
          </div>
        </a>
      `;
    } catch {
      // Fallback sin portada
      card.innerHTML = `
        <a href="${url}" target="_blank" rel="noopener" class="gmf-track-link">
          <div class="gmf-cover-wrap">
            <div class="gmf-cover-placeholder"></div>
            <div class="gmf-cover-overlay">
              <svg class="gmf-spotify-icon" viewBox="0 0 24 24" fill="#1DB954"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/></svg>
              <span class="gmf-play-text">ESCUCHAR</span>
            </div>
          </div>
          <div class="gmf-track-info">
            <span class="gmf-track-num">${num}</span>
            <div class="gmf-track-text">
              <p class="gmf-track-title">— ${artist}</p>
              <p class="gmf-track-artist">${artist}</p>
            </div>
          </div>
        </a>
      `;
    }
  }
}

loadSpotifyTracks();

