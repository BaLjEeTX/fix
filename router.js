// ENICILION CLIENT-SIDE ROUTER & SPA APPLICATION

// Auth Utilities
const AUTH_KEY = 'enc_access_token';
const USER_KEY = 'enc_user_info';

function getAuth() {
  const token = localStorage.getItem(AUTH_KEY);
  const user = localStorage.getItem(USER_KEY);
  return token ? { token, user: JSON.parse(user) } : null;
}

function setAuth(token, user) {
  localStorage.setItem(AUTH_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

function clearAuth() {
  localStorage.removeItem(AUTH_KEY);
  localStorage.removeItem(USER_KEY);
}

// Router & History Navigation
const routes = {
  '/': renderHome,
  '/event': renderEventCaseStudy,
  '/apply': renderApplyVehicle,
  '/creator-tickets': renderCreatorTickets,
  '/careers': renderCareers,
  '/blog': renderBlogList,
  '/login': renderLogin,
  '/signup': renderSignup,
  '/profile': renderProfile,
  '/tickets': renderTickets
};

export function navigateTo(path) {
  window.history.pushState({}, '', path);
  handleRouting();
}

window.addEventListener('popstate', handleRouting);

// Intercept Local Anchor Clicks
document.addEventListener('click', (e) => {
  const link = e.target.closest('a');
  if (link && link.href) {
    const url = new URL(link.href);
    if (url.origin === window.location.origin) {
      const path = url.pathname;
      // Skip static/backend routes
      if (
        path.startsWith('/admin') ||
        path.startsWith('/ops-admin') ||
        path.startsWith('/api') ||
        path.startsWith('/healthz')
      ) {
        return;
      }
      e.preventDefault();
      navigateTo(path);
    }
  }
});

// Dynamic Navbar & Footer Renders
function renderNavbar() {
  const navEl = document.getElementById('app-nav');
  if (!navEl) return;

  const auth = getAuth();
  const path = window.location.pathname;

  navEl.innerHTML = `
    <nav class="navbar">
      <div class="container nav-container">
        <a href="/" class="logo">ENICILION<span>.</span></a>
        
        <div class="nav-links">
          <a href="/" class="nav-link ${path === '/' ? 'active' : ''}">Services</a>
          <a href="/event" class="nav-link ${path === '/event' ? 'active' : ''}">Motorscape 26</a>
          <a href="/apply" class="nav-link ${path === '/apply' ? 'active' : ''}">Register Vehicle</a>
          <a href="/creator-tickets" class="nav-link ${path === '/creator-tickets' ? 'active' : ''}">Creators</a>
          <a href="/careers" class="nav-link ${path === '/careers' ? 'active' : ''}">Careers</a>
          <a href="/blog" class="nav-link ${path.startsWith('/blog') ? 'active' : ''}">Blog</a>
        </div>

        <div style="display: flex; gap: 16px; align-items: center;">
          <button id="deconstruct-toggle-btn" class="nav-cta" style="border-color: var(--accent-yellow); color: var(--accent-yellow); background: transparent; box-shadow: none; font-size: 0.7rem; padding: 8px 16px;">Deconstruct Canvas</button>
          ${auth 
            ? `
              <a href="/profile" class="nav-link ${path === '/profile' ? 'active' : ''}" style="font-size:0.8rem; font-weight: 800;">Profile</a>
              <button id="logout-btn-nav" class="nav-cta" style="background:transparent; color:var(--accent); border:2px solid var(--accent); box-shadow:none; padding: 8px 16px;">Logout</button>
              `
            : `
              <a href="/login" class="nav-link ${path === '/login' ? 'active' : ''}" style="font-size:0.8rem; font-weight: 800;">Login</a>
              <a href="/signup" class="nav-cta" style="padding: 8px 16px;">Register</a>
              `
          }
        </div>
      </div>
    </nav>
  `;

  // Bind Deconstruction Toggle
  const deconstructBtn = document.getElementById('deconstruct-toggle-btn');
  if (deconstructBtn) {
    const updateBtnStyle = () => {
      const isDeconstructed = document.body.classList.contains('state-deconstructed');
      deconstructBtn.textContent = isDeconstructed ? 'Reconstruct Canvas' : 'Deconstruct Canvas';
      deconstructBtn.style.background = isDeconstructed ? 'var(--accent)' : 'transparent';
      deconstructBtn.style.color = isDeconstructed ? '#fff' : 'var(--accent-yellow)';
      deconstructBtn.style.borderColor = isDeconstructed ? 'var(--accent)' : 'var(--accent-yellow)';
    };

    deconstructBtn.onclick = () => {
      document.body.classList.toggle('state-deconstructed');
      updateBtnStyle();
    };
    updateBtnStyle();
  }

  const logoutBtn = document.getElementById('logout-btn-nav');
  if (logoutBtn) {
    logoutBtn.onclick = () => {
      clearAuth();
      renderNavbar();
      navigateTo('/');
    };
  }
}

function renderFooter() {
  const footerEl = document.getElementById('app-footer');
  if (!footerEl) return;

  footerEl.innerHTML = `
    <footer class="footer">
      <div class="container">
        <div class="footer-grid">
          <div class="footer-brand">
            <h3 style="font-family: var(--font-display); font-size: 1.8rem; color: #fff;">ENICILION<span>.</span></h3>
            <p>Experiential event curation and automotive art execution. Pushing mechanical discipline into aggressive performance aesthetics.</p>
          </div>
          <div>
            <h4 class="footer-col-title">Navigation</h4>
            <ul class="footer-links">
              <li><a href="/">Services</a></li>
              <li><a href="/event">Motorscape 2026</a></li>
              <li><a href="/apply">Register Machine</a></li>
              <li><a href="/creator-tickets">Creator Access</a></li>
            </ul>
          </div>
          <div>
            <h4 class="footer-col-title">Operations</h4>
            <ul class="footer-links">
              <li><a href="/careers">Careers</a></li>
              <li><a href="/blog">Blog</a></li>
              <li><a href="/admin/">Ops Dashboard</a></li>
            </ul>
          </div>
        </div>
        <div class="footer-bottom">
          <p class="footer-copy">&copy; 2026 ENICILION. Organized by Jaspreet Singh and Vivan Vardhan. All rights reserved.</p>
          <div style="font-size: 0.8rem; color: var(--accent); font-family: var(--font-header); font-weight: 800; letter-spacing: 0.05em; text-transform: uppercase;">
            Curated by Discipline. Driven by Aggression.
          </div>
        </div>
      </div>
    </footer>
  `;
}

// Router Handler
export function handleRouting() {
  const path = window.location.pathname;
  const appRoot = document.getElementById('app-root');
  if (!appRoot) return;

  // Scroll to top on page change
  window.scrollTo(0, 0);

  // Render Navbar / Footer
  renderNavbar();
  renderFooter();

  // Blog post handler
  if (path.startsWith('/blog/')) {
    const slug = path.split('/')[2];
    if (slug) {
      renderBlogPost(appRoot, slug);
      return;
    }
  }

  const handler = routes[path] || renderNotFound;
  handler(appRoot);
}

// Decorative Cubist Sketch SVGs
function getCarSketchSVG() {
  return `
    <svg viewBox="0 0 500 240" class="sketch-svg" xmlns="http://www.w3.org/2000/svg">
      <!-- Geometric Color Blocks -->
      <polygon points="40,20 160,10 140,90 20,80" fill="var(--accent-secondary)" opacity="0.15"/>
      <polygon points="340,30 460,40 440,120 320,110" fill="var(--accent)" opacity="0.12"/>
      <circle cx="250" cy="120" r="50" fill="var(--accent-yellow)" opacity="0.08"/>
      
      <!-- Cubist Layout Guides -->
      <line x1="10" y1="120" x2="490" y2="120" stroke="rgba(18, 18, 23, 0.15)" stroke-width="1.5" stroke-dasharray="4,4"/>
      <line x1="250" y1="10" x2="250" y2="230" stroke="rgba(18, 18, 23, 0.15)" stroke-width="1.5" stroke-dasharray="4,4"/>

      <!-- Car Outline (Sketch Style) -->
      <path d="M 40 160 
               C 70 145, 110 150, 120 160 
               C 135 160, 155 125, 180 115 
               C 215 100, 305 90, 340 100 
               C 370 105, 395 85, 440 90
               C 465 95, 480 115, 485 130
               L 490 155
               C 475 160, 455 160, 445 160
               C 435 135, 380 135, 370 160
               L 190 160
               C 180 135, 125 135, 115 160
               L 40 160 Z" 
            fill="none" stroke="var(--text-paper)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
            
      <!-- Extra sketch construction lines -->
      <path d="M 120 160 L 180 115 M 340 100 L 370 160" fill="none" stroke="var(--text-paper)" stroke-width="1" opacity="0.6"/>
      <path d="M 180 115 L 205 135 L 305 135 L 340 100" fill="none" stroke="var(--text-paper)" stroke-width="1.5"/>
      <line x1="250" y1="100" x2="250" y2="135" stroke="var(--text-paper)" stroke-width="1"/>

      <!-- Wheels -->
      <circle cx="152" cy="160" r="32" fill="none" stroke="var(--text-paper)" stroke-width="2.5"/>
      <circle cx="152" cy="160" r="12" fill="none" stroke="var(--text-paper)" stroke-width="1.5"/>
      <circle cx="408" cy="160" r="32" fill="none" stroke="var(--text-paper)" stroke-width="2.5"/>
      <circle cx="408" cy="160" r="12" fill="none" stroke="var(--text-paper)" stroke-width="1.5"/>
      
      <!-- Spokes -->
      <line x1="152" y1="128" x2="152" y2="192" stroke="var(--text-paper)" stroke-width="1"/>
      <line x1="120" y1="160" x2="184" y2="160" stroke="var(--text-paper)" stroke-width="1"/>
      <line x1="408" y1="128" x2="408" y2="192" stroke="var(--text-paper)" stroke-width="1"/>
      <line x1="376" y1="160" x2="440" y2="160" stroke="var(--text-paper)" stroke-width="1"/>
      
      <!-- Speed lines / abstract sweeps -->
      <path d="M 15 130 Q 35 125 55 132" fill="none" stroke="var(--accent)" stroke-width="2" stroke-linecap="round"/>
      <path d="M 5 150 Q 20 148 35 152" fill="none" stroke="var(--accent-secondary)" stroke-width="2" stroke-linecap="round"/>
    </svg>
  `;
}

function getSmallCarSVG() {
  return `
    <svg viewBox="0 0 200 100" xmlns="http://www.w3.org/2000/svg">
      <path d="M 10 70 C 30 65, 45 68, 50 70 C 60 70, 70 55, 80 50 C 100 40, 140 40, 150 45 C 160 48, 170 40, 185 42 L 190 70 Z" 
            fill="none" stroke="var(--text-paper)" stroke-width="2" stroke-linejoin="round"/>
      <circle cx="65" cy="70" r="15" fill="none" stroke="var(--text-paper)" stroke-width="2"/>
      <circle cx="160" cy="70" r="15" fill="none" stroke="var(--text-paper)" stroke-width="2"/>
      <line x1="10" y1="50" x2="40" y2="50" stroke="var(--accent)" stroke-width="1.5"/>
    </svg>
  `;
}

// ============================================================
// PAGE RENDERERS
// ============================================================

// 1. Home Page (Services & Art Philosophy)
function renderHome(container) {
  container.innerHTML = `
    <!-- Hero Section -->
    <section class="hero animate-fade-in">
      <div class="container">
        <div class="hero-grid">
          <div class="hero-content">
            <span class="hero-tagline">Experiential Event Curators</span>
            <h1 class="hero-title">EXPERIENTIAL ART<br><span>DRIVEN BY</span><br>PERFORMANCE</h1>
            <p class="hero-desc">We design, coordinate, and execute premium, high-octane automotive spectacles. Merging precision mechanical design, kinetic motion, and acoustic engineering into prestige sensory experiences.</p>
            <div class="hero-actions">
              <a href="/event" class="btn btn-primary">Explore Case Studies</a>
              <a href="/apply" class="btn btn-secondary">Apply for Staging</a>
            </div>
          </div>
          
          <div class="sketch-box animate-fade-in" style="transform: rotate(1.5deg);">
            <div class="museum-label" style="border-color: var(--text-paper); color: var(--text-paper); margin-bottom: 12px;">EXHIBIT NO. 01 // Blueprints</div>
            ${getCarSketchSVG()}
            <p style="color: var(--text-paper); font-size: 0.8rem; font-family: var(--font-header); font-weight: 700; margin-top: 12px; text-transform: uppercase;">
              Figure A: Deconstructed Aerodynamic Geometry
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Services Section -->
    <section class="section section-alt">
      <div class="container">
        <div class="section-header">
          <span class="section-label">Our Capabilities</span>
          <h2 class="section-title">Logistics & Experimental Design</h2>
          <p>We provide end-to-end technical, artistic, and operational execution for high-intensity mechanical showcases.</p>
        </div>
        
        <div class="services-grid">
          <div class="collage-card service-card">
            <span class="museum-label">Catalog Ref. A-1</span>
            <div class="service-icon">✦</div>
            <h3 class="service-name">Bespoke Curation</h3>
            <p class="service-desc">From restricted underground night meets to professional closed-circuit track events. We engineer custom spectacles featuring curated vehicle selections.</p>
          </div>
          <div class="collage-card service-card theme-paper">
            <span class="museum-label" style="border-color:var(--text-paper); color:var(--text-paper);">Catalog Ref. A-2</span>
            <div class="service-icon">✦</div>
            <h3 class="service-name">Acoustic Orchestration</h3>
            <p class="service-desc">Orchestrating raw engine harmonics. Our team designs acoustic showcases, rev battles, and high-fidelity venue audio systems for peak sensory impact.</p>
          </div>
          <div class="collage-card service-card">
            <span class="museum-label">Catalog Ref. A-3</span>
            <div class="service-icon">✦</div>
            <h3 class="service-name">Drift Choreography</h3>
            <p class="service-desc">Providing certified drift demonstration logistics, stunt drivers, grid safety coordination, and track barriers to maintain a secure environment.</p>
          </div>
          <div class="collage-card service-card theme-paper">
            <span class="museum-label" style="border-color:var(--text-paper); color:var(--text-paper);">Catalog Ref. A-4</span>
            <div class="service-icon">✦</div>
            <h3 class="service-name">Creative Media Engine</h3>
            <p class="service-desc">High-speed camera tracking, cinematic videography, and creative direction to translate kinetic machine energy into brand-defining content assets.</p>
          </div>
          <div class="collage-card service-card">
            <span class="museum-label">Catalog Ref. A-5</span>
            <div class="service-icon">✦</div>
            <h3 class="service-name">Gate Operations</h3>
            <p class="service-desc">Seamless ticket validation systems, custom-branded check-in portals, and digital dashboard integrations mapping real-time spectator entries.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Art Philosophy -->
    <section class="section">
      <div class="container">
        <div class="phil-layout">
          <div class="phil-visual">
            <img src="/media/custom-build-bg.webp" class="phil-canvas" alt="Automotive Architecture">
            <div class="phil-overlay">
              <div class="phil-overlay-title">Aesthetic Core</div>
              <p style="font-size:0.85rem; font-weight: 700;">Mechanical sculpture in constant motion. Every rev, every slip is a deliberate artistic expression.</p>
            </div>
          </div>
          <div class="phil-content">
            <span class="section-label">Art Philosophy</span>
            <h3>The Machine as Sculpture</h3>
            <p class="phil-quote">"We don't meet to park. We meet to witness the translation of engineering discipline into raw, aggressive art."</p>
            <p style="margin-bottom:24px;">At ENICILION, we view cars and high-performance engineering as kinetic art. Our gatherings are conceptual galleries where vehicles are selected for their technical purity, aesthetic aggression, and mechanical innovation.</p>
            <p>Our goal is to elevate performance culture. By designing events around lighting, industrial design, and audio composition, we create immersive galleries for the modern automotive enthusiast.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Booking Form Section -->
    <section class="section section-alt" id="inquire">
      <div class="container">
        <div class="form-layout">
          <div>
            <span class="section-label">Partnerships</span>
            <h2 class="form-info-title">Partner with ENICILION</h2>
            <p>Interested in launching a brand activation, sponsoring our next motorsport spectacle, or commissioning our event coordination services? Submit your concept.</p>
            
            <div class="form-info-list">
              <div class="collage-card theme-paper form-info-item" style="padding: 24px;">
                <div class="form-info-icon">✦</div>
                <div>
                  <div class="form-info-label">Corporate Email</div>
                  <div class="form-info-val" style="color:var(--text-paper); font-weight:700;">partners@enicilion.com</div>
                </div>
              </div>
              <div class="collage-card theme-paper form-info-item" style="padding: 24px;">
                <div class="form-info-icon">✦</div>
                <div>
                  <div class="form-info-label">Operations HQ</div>
                  <div class="form-info-val" style="color:var(--text-paper); font-weight:700;">Chandigarh, Punjab, India</div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <form id="partner-form" class="collage-card card-form">
              <div class="museum-label" style="margin-bottom: 24px;">Inquiry Intake Form</div>
              <div class="form-group">
                <label class="form-label">Brand Name</label>
                <input type="text" id="brand_name" required class="form-control" placeholder="e.g. Redline Performance">
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Contact Person</label>
                  <input type="text" id="contact_person" required class="form-control" placeholder="e.g. Jaspreet Singh">
                </div>
                <div class="form-group">
                  <label class="form-label">Corporate Email</label>
                  <input type="email" id="partner_email" required class="form-control" placeholder="e.g. press@redline.com">
                </div>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Phone / WhatsApp</label>
                  <input type="tel" id="partner_phone" class="form-control" placeholder="e.g. +91 9999999999">
                </div>
                <div class="form-group">
                  <label class="form-label">Area of Interest</label>
                  <select id="interests" class="form-control" style="background:#0c0c10;">
                    <option value="Sponsorship">Event Sponsorship</option>
                    <option value="Curation Services">Event Design & Curation</option>
                    <option value="Media Activation">Creative & Tracking Media</option>
                    <option value="Other">Custom Collaboration</option>
                  </select>
                </div>
              </div>
              <div class="form-group">
                <label class="form-label">Collaboration Brief</label>
                <textarea id="partner_message" required class="form-control" placeholder="Outline your marketing timeline, target budget, or concept expectations."></textarea>
              </div>
              <button type="submit" id="partner-submit" class="btn btn-primary" style="width:100%;">Submit Inquiry</button>
              <div id="partner-feedback" class="form-feedback"></div>
            </form>
          </div>
        </div>
      </div>
    </section>
  `;

  // Bind Form Submission
  const form = document.getElementById('partner-form');
  if (form) {
    form.onsubmit = async (e) => {
      e.preventDefault();
      const submitBtn = document.getElementById('partner-submit');
      const feedback = document.getElementById('partner-feedback');
      
      submitBtn.disabled = true;
      submitBtn.textContent = 'TRANSMITTING...';
      feedback.className = 'form-feedback';
      feedback.style.display = 'none';

      try {
        const res = await fetch('/api/partners/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            brand_name: document.getElementById('brand_name').value,
            contact_person: document.getElementById('contact_person').value,
            email: document.getElementById('partner_email').value,
            phone: document.getElementById('partner_phone').value,
            interests: document.getElementById('interests').value,
            message: document.getElementById('partner_message').value,
          })
        });

        const data = await res.json();
        if (res.ok) {
          feedback.textContent = 'Inquiry transmitted successfully. Our creative team will contact you shortly.';
          feedback.className = 'form-feedback success';
          form.reset();
        } else {
          feedback.textContent = data.message || 'Transmission failed. Please check details.';
          feedback.className = 'form-feedback error';
        }
      } catch (err) {
        feedback.textContent = 'Network error. Please try again.';
        feedback.className = 'form-feedback error';
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit Inquiry';
      }
    };
  }
}

// 2. Case Study Page (Motorscape 2026 Details & Slider)
function renderEventCaseStudy(container) {
  container.innerHTML = `
    <section class="section animate-fade-in" style="padding-top:140px;">
      <div class="container">
        <div class="section-header" style="max-width:800px; margin-bottom:60px;">
          <span class="section-label">Case Study recap</span>
          <h1 class="hero-title" style="font-size:clamp(2rem, 6vw, 4rem); line-height:1;">Motorscape 26</h1>
          <p style="font-size:1.1rem; margin-top:20px;">A detailed review of our latest nocturnal showcase. Executed at HopUp Chandigarh, blending precision vehicle grid setups, industrial lighting displays, and professional drifting.</p>
          <div style="margin-top:20px; font-size:0.9rem; color:var(--text-secondary); font-family:var(--font-header);">
            Organized by <strong>Jaspreet Singh</strong> and <strong>Vivan Vardhan</strong>
          </div>
        </div>

        <!-- Metric Cards -->
        <div class="case-stats animate-fade-in">
          <div class="collage-card stat-item">
            <div class="stat-num">4,500+</div>
            <div class="stat-label">Spectators Audited</div>
          </div>
          <div class="collage-card stat-item theme-paper">
            <div class="stat-num">150+</div>
            <div class="stat-label">Curated Vehicles</div>
          </div>
          <div class="collage-card stat-item">
            <div class="stat-num">30+</div>
            <div class="stat-label">Pro Drift Runs</div>
          </div>
          <div class="collage-card stat-item theme-paper">
            <div class="stat-num">1.8M+</div>
            <div class="stat-label">Social Reach</div>
          </div>
        </div>

        <!-- Slider Section -->
        <div class="slider-container" style="margin-bottom: 80px;">
          <div class="slider-wrapper" id="case-slider-wrapper">
            <div class="slide">
              <img src="/media/supercar-bg.webp" alt="Motorscape Supercar Grid">
              <div class="slide-content">
                <span class="slide-category">Phase 1: Arrival</span>
                <h3 class="slide-title">Curated Rolling Supercar Showcases</h3>
              </div>
            </div>
            <div class="slide">
              <img src="/media/Exhaust Flame 2.webp" alt="Motorscape Exhaust Fire">
              <div class="slide-content">
                <span class="slide-category">Phase 2: Acoustics</span>
                <h3 class="slide-title">Acoustic Exhaust Rev Orchestrations</h3>
              </div>
            </div>
            <div class="slide">
              <img src="/media/drift-bg.webp" alt="Motorscape Pro Drift Show">
              <div class="slide-content">
                <span class="slide-category">Phase 3: Dynamics</span>
                <h3 class="slide-title">Professional Drift Taxi Demonstrations</h3>
              </div>
            </div>
            <div class="slide">
              <img src="/media/enthusiast-bg.webp" alt="Motorscape Night Gathering">
              <div class="slide-content">
                <span class="slide-category">Phase 4: Gallery</span>
                <h3 class="slide-title">High-Intensity Industrial Visual Layouts</h3>
              </div>
            </div>
          </div>
          <div class="slider-nav">
            <button class="slider-arrow" id="slide-prev">←</button>
            <button class="slider-arrow" id="slide-next">→</button>
          </div>
        </div>

        <!-- Narrative -->
        <div class="form-layout" style="margin-bottom:80px;">
          <div class="collage-card" style="padding:40px;">
            <h3 style="font-size:1.4rem; text-transform:uppercase; margin-bottom:16px; color:#fff; font-family:var(--font-header);">Nocturnal Grid Integration</h3>
            <p style="margin-bottom:16px;">Motorscape 2026 was curated to challenge the conventional "car meet" model. The venue, HopUp Chandigarh, was transformed into an industrial gallery using ambient red spotlight grids and low-frequency sonic setups.</p>
            <p>Our team managed all aspects: driver verification, registration gates using QR validation, noise-barrier compliance, and local fire department clearance for smoke/burnout protocols. By spacing the supercars and JDM imports strategically, we allowed spectators to witness structural mechanical design up close.</p>
          </div>

          <div class="collage-card theme-paper" style="padding:40px;">
            <h3 style="font-size:1.4rem; text-transform:uppercase; margin-bottom:16px; color:var(--text-paper); font-family:var(--font-header);">Chronological Protocols</h3>
            <ul style="list-style:none; padding:0; display:flex; flex-direction:column; gap:20px;">
              <li style="border-left: 3px solid var(--accent); padding-left: 20px;">
                <h4 style="color:var(--text-paper); font-size:1rem; font-family:var(--font-header); text-transform:uppercase;">Rolling Entries</h4>
                <p style="font-size:0.85rem; color:#333;">Controlled timing intervals of high-performance arrivals, keeping spectators engaged safely.</p>
              </li>
              <li style="border-left: 3px solid var(--accent); padding-left: 20px;">
                <h4 style="color:var(--text-paper); font-size:1rem; font-family:var(--font-header); text-transform:uppercase;">Exhaust Showcases</h4>
                <p style="font-size:0.85rem; color:#333;">Acoustic monitoring of engine displacement, rev acoustics, and exhaust flame mechanics.</p>
              </li>
              <li style="border-left: 3px solid var(--accent); padding-left: 20px;">
                <h4 style="color:var(--text-paper); font-size:1rem; font-family:var(--font-header); text-transform:uppercase;">Drift taxi runs</h4>
                <p style="font-size:0.85rem; color:#333;">Professional drivers carrying passengers in dynamic slip angles, demonstrating slip choreography.</p>
              </li>
            </ul>
          </div>
        </div>

        <!-- Ticket Tiers Overview -->
        <div class="section-header" style="margin-bottom:40px;">
          <h2 style="font-size:1.8rem; text-transform:uppercase;">Spectator Tier Overview</h2>
          <p>The event concluded with all tickets sold out within 72 hours of open registration.</p>
        </div>
        <div class="collage-card theme-paper" style="overflow-x:auto; padding:0;">
          <table style="width:100%; border-collapse:collapse; text-align:left; font-size:0.9rem; font-family:var(--font-header);">
            <thead>
              <tr style="border-bottom:2px solid var(--text-paper); background:rgba(0,0,0,0.03);">
                <th style="padding:20px 24px; color:var(--text-paper);">Tier Class</th>
                <th style="padding:20px 24px; color:var(--text-paper);">Event Access</th>
                <th style="padding:20px 24px; color:var(--text-paper);">Price Rate</th>
                <th style="padding:20px 24px; text-align:right; color:var(--text-paper);">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr style="border-bottom:1px solid rgba(0,0,0,0.08);">
                <td style="padding:20px 24px; font-weight:700; color:var(--text-paper);">Basic Showcase Pass</td>
                <td style="padding:20px 24px; color:#444;">General Access & Entry</td>
                <td style="padding:20px 24px; color:#444;">₹899</td>
                <td style="padding:20px 24px; text-align:right; color:var(--accent-secondary); font-weight:700;">CLOSED</td>
              </tr>
              <tr style="border-bottom:1px solid rgba(0,0,0,0.08);">
                <td style="padding:20px 24px; font-weight:700; color:var(--text-paper);">Paddock Pass</td>
                <td style="padding:20px 24px; color:#444;">Inner Paddock Grid & Driver Access</td>
                <td style="padding:20px 24px; color:#444;">₹2,099</td>
                <td style="padding:20px 24px; text-align:right; color:var(--accent-secondary); font-weight:700;">CLOSED</td>
              </tr>
              <tr style="border-bottom:1px solid rgba(0,0,0,0.08);">
                <td style="padding:20px 24px; font-weight:700; color:var(--text-paper);">VIP Pass</td>
                <td style="padding:20px 24px; color:#444;">Lounge Access, VIP Deck & Merch Kit</td>
                <td style="padding:20px 24px; color:#444;">₹4,599</td>
                <td style="padding:20px 24px; text-align:right; color:var(--accent-secondary); font-weight:700;">CLOSED</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  `;

  // Bind Slider Logic
  const sliderWrapper = document.getElementById('case-slider-wrapper');
  const prevBtn = document.getElementById('slide-prev');
  const nextBtn = document.getElementById('slide-next');
  if (sliderWrapper && prevBtn && nextBtn) {
    let currentIdx = 0;
    const slidesCount = 4;
    
    const updateSlider = () => {
      sliderWrapper.style.transform = `translateX(-${currentIdx * 100}%)`;
    };

    nextBtn.onclick = () => {
      currentIdx = (currentIdx + 1) % slidesCount;
      updateSlider();
    };

    prevBtn.onclick = () => {
      currentIdx = (currentIdx - 1 + slidesCount) % slidesCount;
      updateSlider();
    };
  }
}

// 3. Vehicle Application Page (/apply)
function renderApplyVehicle(container) {
  container.innerHTML = `
    <section class="section animate-fade-in" style="padding-top:140px;">
      <div class="container">
        <div class="section-header" style="max-width:700px; margin-bottom:60px;">
          <span class="section-label">Staging registrations</span>
          <h1 class="hero-title" style="font-size:clamp(2rem, 5vw, 3.5rem); line-height:1;">Register Machine</h1>
          <p style="margin-top:20px;">Submit your vehicle for verification. We select high-performance modifications, clean imports, exotic supercars, and professional drift builds.</p>
        </div>

        <div class="form-layout">
          <div>
            <h3 style="font-size:1.6rem; text-transform:uppercase; margin-bottom:20px; font-family:var(--font-display);">Entry Protocols</h3>
            <p style="margin-bottom:24px;">To maintain a premium standard, all entries undergo structural and safety reviews. If accepted, you will receive a digital grid pass with staging guidelines.</p>
            
            <ul style="list-style:none; padding:0; display:flex; flex-direction:column; gap:20px;">
              <li class="collage-card" style="padding:24px; display:flex; gap:16px;">
                <div style="color:var(--accent); font-family:var(--font-header); font-weight:700;">01</div>
                <div>
                  <strong style="color:#fff; display:block; text-transform:uppercase; font-size:0.85rem; font-family:var(--font-header);">Clean Presentation</strong>
                  <span style="font-size:0.85rem; color:var(--text-secondary);">Vehicles must be aesthetically polished and detailing must be complete.</span>
                </div>
              </li>
              <li class="collage-card theme-paper" style="padding:24px; display:flex; gap:16px;">
                <div style="color:var(--accent-secondary); font-family:var(--font-header); font-weight:700;">02</div>
                <div>
                  <strong style="color:var(--text-paper); display:block; text-transform:uppercase; font-size:0.85rem; font-family:var(--font-header);">Mechanical Soundness</strong>
                  <span style="font-size:0.85rem; color:#333;">No active fluid leaks. Brake pads, cooling systems, and tire ratings must comply.</span>
                </div>
              </li>
              <li class="collage-card" style="padding:24px; display:flex; gap:16px;">
                <div style="color:var(--accent); font-family:var(--font-header); font-weight:700;">03</div>
                <div>
                  <strong style="color:#fff; display:block; text-transform:uppercase; font-size:0.85rem; font-family:var(--font-header);">Safety Marshal Compliance</strong>
                  <span style="font-size:0.85rem; color:var(--text-secondary);">Drivers must comply with staging marshals. Burnout/drift demos are restricted to active periods.</span>
                </div>
              </li>
            </ul>
          </div>

          <div>
            <form id="apply-form" class="collage-card theme-paper card-form" enctype="multipart/form-data">
              <div class="museum-label" style="border-color:var(--text-paper); color:var(--text-paper); margin-bottom:24px;">Staging Form</div>
              
              <div class="form-group">
                <label class="form-label">Driver Full Name</label>
                <input type="text" id="app_full_name" required class="form-control" placeholder="e.g. Jaspreet Singh">
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">WhatsApp Number</label>
                  <input type="tel" id="app_whatsapp" required class="form-control" placeholder="e.g. +91 9999999999">
                </div>
                <div class="form-group">
                  <label class="form-label">Instagram Handle</label>
                  <input type="text" id="app_instagram" class="form-control" placeholder="e.g. @username">
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">City</label>
                <input type="text" id="app_city" required class="form-control" placeholder="e.g. Ludhiana">
              </div>

              <!-- Vehicle Spec -->
              <h4 style="font-size:0.85rem; text-transform:uppercase; color:var(--accent-secondary); margin: 32px 0 16px; border-bottom:2px solid var(--accent-secondary); padding-bottom:8px; font-family:var(--font-header);">Vehicle Specifications</h4>
              
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Vehicle Make</label>
                  <input type="text" id="veh_make" required class="form-control" placeholder="e.g. Toyota">
                </div>
                <div class="form-group">
                  <label class="form-label">Vehicle Model</label>
                  <input type="text" id="veh_model" required class="form-control" placeholder="e.g. Supra MK5">
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Manufacture Year</label>
                  <input type="number" id="veh_year" required min="1950" max="2027" class="form-control" placeholder="e.g. 2021">
                </div>
                <div class="form-group">
                  <label class="form-label">License Plate / VIN</label>
                  <input type="text" id="veh_vin" required class="form-control" placeholder="e.g. CH01AB1234">
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">Upgrades & Modifications</label>
                <textarea id="app_modifications" class="form-control" placeholder="List power upgrades, suspension setups, aesthetic modifications..."></textarea>
              </div>

              <div class="form-group">
                <label class="form-label">Vehicle Media Upload (Min 1 Photo)</label>
                <input type="file" id="app_photos" required multiple accept="image/*" class="form-control" style="background:rgba(0,0,0,0.03); padding: 10px;">
                <span style="font-size:0.75rem; color:#444; margin-top:4px; display:block;">Supported formats: JPG, PNG, WEBP. Max size 5MB.</span>
              </div>

              <div class="form-group" style="margin-top:24px;">
                <label class="form-label" style="margin-bottom:16px;">Staging Agreement</label>
                <div style="display:flex; flex-direction:column; gap:12px; font-size:0.85rem;">
                  <label style="display:flex; gap:10px; align-items:flex-start; cursor:pointer; color:var(--text-paper);">
                    <input type="checkbox" id="protocol_1" required style="accent-color:var(--accent); margin-top:3px;">
                    <span>I confirm my vehicle has no fluid leaks and is mechanically sound.</span>
                  </label>
                  <label style="display:flex; gap:10px; align-items:flex-start; cursor:pointer; color:var(--text-paper);">
                    <input type="checkbox" id="protocol_2" required style="accent-color:var(--accent); margin-top:3px;">
                    <span>I agree to park and operate the vehicle only in designated active spots.</span>
                  </label>
                  <label style="display:flex; gap:10px; align-items:flex-start; cursor:pointer; color:var(--text-paper);">
                    <input type="checkbox" id="protocol_3" required style="accent-color:var(--accent); margin-top:3px;">
                    <span>I agree to comply with ENICILION safety guidelines and marshal warnings.</span>
                  </label>
                </div>
              </div>

              <button type="submit" id="apply-submit" class="btn btn-primary" style="width:100%; margin-top:24px;">Submit Vehicle Spec</button>
              <div id="apply-feedback" class="form-feedback"></div>
            </form>
          </div>
        </div>
      </div>
    </section>
  `;

  // Bind Form Submit
  const form = document.getElementById('apply-form');
  if (form) {
    form.onsubmit = async (e) => {
      e.preventDefault();
      const submitBtn = document.getElementById('apply-submit');
      const feedback = document.getElementById('apply-feedback');
      
      submitBtn.disabled = true;
      submitBtn.textContent = 'TRANSMITTING SPECIFICATIONS...';
      feedback.style.display = 'none';
      feedback.className = 'form-feedback';

      try {
        // Fetch event ID first
        const eventRes = await fetch('/api/events/latest');
        const eventData = await eventRes.json();
        
        if (!eventRes.ok || !eventData.success) {
          throw new Error('Failed to retrieve active event configurations.');
        }

        const eventId = eventData.data.id;

        // Collect inputs
        const fullName = document.getElementById('app_full_name').value;
        const whatsapp = document.getElementById('app_whatsapp').value;
        const instagram = document.getElementById('app_instagram').value;
        const city = document.getElementById('app_city').value;
        const make = document.getElementById('veh_make').value;
        const model = document.getElementById('veh_model').value;
        const year = document.getElementById('veh_year').value;
        const vin = document.getElementById('veh_vin').value;
        const modifications = document.getElementById('app_modifications').value;
        
        const photoFiles = document.getElementById('app_photos').files;

        // Build FormData
        const formData = new FormData();
        formData.append('full_name', fullName);
        formData.append('whatsapp', whatsapp);
        formData.append('instagram', instagram);
        formData.append('city', city);
        formData.append('modifications', modifications);
        formData.append('event_id', eventId);
        
        // Match backend GenesisSchema
        const vehiclesObj = [{
          make,
          model,
          year: parseInt(year),
          vin,
          photoCount: photoFiles.length
        }];
        formData.append('vehicles', JSON.stringify(vehiclesObj));
        formData.append('protocols', JSON.stringify([true, true, true]));

        // Attach photos
        for (let i = 0; i < photoFiles.length; i++) {
          formData.append('photos', photoFiles[i]);
        }

        // Send to backend
        const res = await fetch('/api/genesis/apply', {
          method: 'POST',
          body: formData
        });

        const data = await res.json();

        if (res.ok) {
          feedback.textContent = 'Application transmitted successfully. Staging classification will be updated in your profile.';
          feedback.className = 'form-feedback success';
          form.reset();
        } else {
          feedback.textContent = data.message || 'Verification failed. Please check details.';
          feedback.className = 'form-feedback error';
        }
      } catch (err) {
        feedback.textContent = err.message || 'Network error occurred. Please verify your files and try again.';
        feedback.className = 'form-feedback error';
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit Vehicle Spec';
      }
    };
  }
}

// 4. Creator Tickets (/creator-tickets)
function renderCreatorTickets(container) {
  container.innerHTML = `
    <section class="section animate-fade-in" style="padding-top:140px;">
      <div class="container">
        <div class="section-header" style="max-width:750px; margin-bottom:60px;">
          <span class="section-label">Media & Press Passes</span>
          <h1 class="hero-title" style="font-size:clamp(2rem, 5vw, 3.5rem); line-height:1;">Creator Access</h1>
          <p style="margin-top:20px;">We collaborate with creative media agencies, automotive photographers, vloggers, and editorial writers to capture the sensory atmosphere of our spectacles.</p>
        </div>

        <div class="form-layout">
          <div>
            <h3 style="font-size:1.6rem; text-transform:uppercase; margin-bottom:20px; font-family:var(--font-display);">Collaboration Profiles</h3>
            <p style="margin-bottom:30px;">Select your creative profile. We provide certified access passes to designated inner-paddock track zones and tracking vehicles.</p>
            
            <div class="tabs-control">
              <button class="tab-btn active" id="tab-creator-btn">Content Creator</button>
              <button class="tab-btn" id="tab-press-btn">Press & Agency</button>
            </div>

            <div class="collage-card theme-paper" style="padding:32px; font-size:0.9rem; line-height:1.6;">
              <div id="creator-guide" class="tab-pane active">
                <h4 style="color:var(--text-paper); text-transform:uppercase; margin-bottom:10px; font-family:var(--font-header);">Content Creator Guidelines</h4>
                <p style="margin-bottom:12px; color:#333;">Geared towards independent photographers, videographers, and social media creators who focus on automotive styling and drift culture.</p>
                <p style="color:#333;">Requires a minimum of 2,000 active followers or a verifiable portfolio showing premium grading and high-shutter kinetic photography.</p>
              </div>
              <div id="press-guide" class="tab-pane">
                <h4 style="color:var(--text-paper); text-transform:uppercase; margin-bottom:10px; font-family:var(--font-header);">Press & Media Agency Guidelines</h4>
                <p style="margin-bottom:12px; color:#333;">For established digital publications, news broadcasts, or regional magazines writing event summaries or reviews.</p>
                <p style="color:#333;">Access packages include high-speed media zones, grid access credentials, and direct driver interviews with Jaspreet Singh and Vivan Vardhan.</p>
              </div>
            </div>
          </div>

          <div>
            <!-- Creator Form -->
            <form id="creator-apply-form" class="collage-card card-form tab-pane active">
              <div class="museum-label" style="margin-bottom:24px;">Creator Application</div>
              <div class="form-group">
                <label class="form-label">Full Name</label>
                <input type="text" id="cre_full_name" required class="form-control" placeholder="e.g. Jaspreet Singh">
              </div>
              <div class="form-group">
                <label class="form-label">Email Address</label>
                <input type="email" id="cre_email" required class="form-control" placeholder="e.g. jaspreet@creative.com">
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Social Media Link</label>
                  <input type="url" id="cre_social" required class="form-control" placeholder="e.g. https://instagram.com/user">
                </div>
                <div class="form-group">
                  <label class="form-label">Follower Count</label>
                  <input type="number" id="cre_followers" required class="form-control" placeholder="e.g. 5000">
                </div>
              </div>
              <div class="form-group">
                <label class="form-label">Primary Content Format</label>
                <select id="cre_style" class="form-control" style="background:#0c0c10;">
                  <option value="Photography">Kinetic / Shutter Photography</option>
                  <option value="Videography">Cinematic Reels / Videography</option>
                  <option value="Vlog">Automotive Vlogging</option>
                  <option value="Editorial">Technical Reviews & Writing</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Coverage Concept Pitch</label>
                <textarea id="cre_pitch" required class="form-control" placeholder="Describe how you plan to cover the Motorscape grid. Outline tracking styles, lighting setups, or drone coverage ideas..."></textarea>
              </div>
              <button type="submit" id="cre-submit" class="btn btn-primary" style="width:100%;">Transmit Application</button>
              <div id="cre-feedback" class="form-feedback"></div>
            </form>

            <!-- Press Form -->
            <form id="press-apply-form" class="collage-card card-form tab-pane">
              <div class="museum-label" style="margin-bottom:24px;">Press Application</div>
              <div class="form-group">
                <label class="form-label">Agency Name</label>
                <input type="text" id="press_org" required class="form-control" placeholder="e.g. Octane Magazine">
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Contact Person</label>
                  <input type="text" id="press_name" required class="form-control" placeholder="e.g. Vivan Vardhan">
                </div>
                <div class="form-group">
                  <label class="form-label">Corporate Email</label>
                  <input type="email" id="press_email" required class="form-control" placeholder="e.g. editor@octane.com">
                </div>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Phone Number</label>
                  <input type="tel" id="press_phone" required class="form-control" placeholder="e.g. +91 9999999999">
                </div>
                <div class="form-group">
                  <label class="form-label">Coverage Format</label>
                  <select id="press_type" class="form-control" style="background:#0c0c10;">
                    <option value="Digital">Digital Article / Web Publication</option>
                    <option value="Print">Print Feature / Magazine</option>
                    <option value="Broadcast">Television / Video Broadcast</option>
                  </select>
                </div>
              </div>
              <div class="form-group">
                <label class="form-label">Publication Portfolio Link</label>
                <input type="url" id="press_link" required class="form-control" placeholder="e.g. https://octanemag.com">
              </div>
              <div class="form-group">
                <label class="form-label">Press Coverage Brief</label>
                <textarea id="press_message" required class="form-control" placeholder="Specify requirements, grid access needs, or scheduled media team size..."></textarea>
              </div>
              <button type="submit" id="press-submit" class="btn btn-primary" style="width:100%;">Transmit Press Application</button>
              <div id="press-feedback" class="form-feedback"></div>
            </form>
          </div>
        </div>
      </div>
    </section>
  `;

  // Bind Tabs
  const creBtn = document.getElementById('tab-creator-btn');
  const pressBtn = document.getElementById('tab-press-btn');
  const creForm = document.getElementById('creator-apply-form');
  const pressForm = document.getElementById('press-apply-form');
  const creGuide = document.getElementById('creator-guide');
  const pressGuide = document.getElementById('press-guide');

  if (creBtn && pressBtn) {
    creBtn.onclick = () => {
      creBtn.classList.add('active');
      pressBtn.classList.remove('active');
      creForm.classList.add('active');
      pressForm.classList.remove('active');
      creGuide.classList.add('active');
      pressGuide.classList.remove('active');
    };
    pressBtn.onclick = () => {
      pressBtn.classList.add('active');
      creBtn.classList.remove('active');
      pressForm.classList.add('active');
      creForm.classList.remove('active');
      pressGuide.classList.add('active');
      creGuide.classList.remove('active');
    };
  }

  // Bind Creator Form Submit
  const cForm = document.getElementById('creator-apply-form');
  if (cForm) {
    cForm.onsubmit = async (e) => {
      e.preventDefault();
      const submit = document.getElementById('cre-submit');
      const feedback = document.getElementById('cre-feedback');
      
      submit.disabled = true;
      submit.textContent = 'TRANSMITTING SPECIFICATIONS...';
      feedback.style.display = 'none';

      try {
        const res = await fetch('/api/creators/apply', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            full_name: document.getElementById('cre_full_name').value,
            email: document.getElementById('cre_email').value,
            social_link: document.getElementById('cre_social').value,
            follower_count: parseInt(document.getElementById('cre_followers').value),
            content_type: document.getElementById('cre_style').value,
            pitch: document.getElementById('cre_pitch').value
          })
        });

        const data = await res.json();
        if (res.ok) {
          feedback.textContent = 'Creator access details received. Portfolio check update will be sent in 72 hours.';
          feedback.className = 'form-feedback success';
          cForm.reset();
        } else {
          feedback.textContent = data.message || 'Registration failed. Verify requirements.';
          feedback.className = 'form-feedback error';
        }
      } catch (err) {
        feedback.textContent = 'Transmission error. Try again.';
        feedback.className = 'form-feedback error';
      } finally {
        submit.disabled = false;
        submit.textContent = 'Transmit Application';
      }
    };
  }

  // Bind Press Form Submit
  const pForm = document.getElementById('press-apply-form');
  if (pForm) {
    pForm.onsubmit = async (e) => {
      e.preventDefault();
      const submit = document.getElementById('press-submit');
      const feedback = document.getElementById('press-feedback');
      
      submit.disabled = true;
      submit.textContent = 'TRANSMITTING PRESS BRIEF...';
      feedback.style.display = 'none';

      try {
        const res = await fetch('/api/media/apply', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            full_name: document.getElementById('press_name').value,
            organization: document.getElementById('press_org').value,
            email: document.getElementById('press_email').value,
            phone: document.getElementById('press_phone').value,
            link: document.getElementById('press_link').value,
            media_type: document.getElementById('press_type').value,
            message: document.getElementById('press_message').value
          })
        });

        const data = await res.json();
        if (res.ok) {
          feedback.textContent = 'Press credentials brief submitted. Direct agency setup details will be emailed shortly.';
          feedback.className = 'form-feedback success';
          pForm.reset();
        } else {
          feedback.textContent = data.message || 'Submission failed. Please check details.';
          feedback.className = 'form-feedback error';
        }
      } catch (err) {
        feedback.textContent = 'Transmission error. Try again.';
        feedback.className = 'form-feedback error';
      } finally {
        submit.disabled = false;
        submit.textContent = 'Transmit Press Application';
      }
    };
  }
}

// 5. Careers Page (/careers)
async function renderCareers(container) {
  container.innerHTML = `
    <section class="section animate-fade-in" style="padding-top:140px;">
      <div class="container">
        <div class="section-header" style="max-width:700px; margin-bottom:60px;">
          <span class="section-label">Operations Vacancies</span>
          <h1 class="hero-title" style="font-size:clamp(2rem, 5vw, 3.5rem); line-height:1;">Careers</h1>
          <p style="margin-top:20px;">Join the grid logistics, safety, or design engine. We seek detail-focused curators to deliver elite, high-octane sensory motorsport experiences.</p>
        </div>

        <div id="careers-loading" style="text-align:center; color:var(--text-secondary); margin:40px 0; font-family:var(--font-header);">QUERYING VACANCIES...</div>
        <div class="careers-grid" id="jobs-container" style="display:none;"></div>
      </div>
    </section>

    <!-- Modal for job application -->
    <div id="job-modal" style="position:fixed; inset:0; z-index:2000; background:rgba(0,0,0,0.85); display:none; align-items:center; justify-content:center; padding:20px; backdrop-filter:blur(8px); -webkit-backdrop-filter:blur(8px);">
      <div class="collage-card theme-paper card-form" style="max-width:600px; width:100%; max-height:90vh; overflow-y:auto; position:relative; padding: 48px;">
        <button id="close-job-modal" style="position:absolute; top:20px; right:20px; background:transparent; border:none; color:var(--accent-secondary); font-size:1.5rem; cursor:pointer;">✕</button>
        <h3 id="modal-job-title" style="font-size:1.4rem; text-transform:uppercase; margin-bottom:8px; font-family:var(--font-header); color:var(--text-paper);">Position Application</h3>
        <p id="modal-job-meta" style="font-size:0.85rem; color:#444; margin-bottom:24px; font-family:var(--font-header);"></p>
        
        <form id="job-apply-form">
          <input type="hidden" id="modal_job_id">
          <div class="form-group">
            <label class="form-label">Full Name</label>
            <input type="text" id="job_full_name" required class="form-control" placeholder="e.g. Jaspreet Singh">
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Email Address</label>
              <input type="email" id="job_email" required class="form-control" placeholder="e.g. jaspreet@creative.com">
            </div>
            <div class="form-group">
              <label class="form-label">Phone Number</label>
              <input type="tel" id="job_phone" required class="form-control" placeholder="e.g. +91 9999999999">
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Resume Link (PDF Link)</label>
            <input type="url" id="job_resume" required class="form-control" placeholder="https://drive.google.com/file/...">
          </div>
          <div class="form-group">
            <label class="form-label">Portfolio Link (Optional)</label>
            <input type="url" id="job_portfolio" class="form-control" placeholder="https://behance.net/username">
          </div>
          <div class="form-group">
            <label class="form-label">Why are you a fit for ENICILION?</label>
            <textarea id="job_letter" required class="form-control" placeholder="Explain your motorsport background, logistics skills, or staging experience..."></textarea>
          </div>
          <button type="submit" id="job-submit" class="btn btn-primary" style="width:100%;">Submit Application</button>
          <div id="job-feedback" class="form-feedback"></div>
        </form>
      </div>
    </div>
  `;

  const loadingEl = document.getElementById('careers-loading');
  const jobsContainer = document.getElementById('jobs-container');

  const fallbackJobs = [
    { id: 'mock-1', title: 'Experiential Art Director', location: 'Chandigarh', type: 'Full-time', salary: 'Competitive', description: 'Lead the conceptual branding, ambient visual design, and lighting aesthetics for all night meets.' },
    { id: 'mock-2', title: 'Lead Safety Coordinator', location: 'Mohali / Ludhiana', type: 'Contract', salary: 'Fixed Day Rate', description: 'Monitor run grids, track marshals, safety barrier integration, and local safety authority clearances.' },
    { id: 'mock-3', title: 'Creative Cinema Specialist', location: 'Remote / Travel', type: 'Full-time', salary: 'Based on Portfolio', description: 'Capture elite vehicle kinetics, exhaust acoustics, and drift taxi motion reels on-site.' }
  ];

  try {
    const res = await fetch('/api/jobs');
    const data = await res.json();
    
    let jobsList = fallbackJobs;
    if (res.ok && data.success && data.data && data.data.length > 0) {
      jobsList = data.data;
    }

    loadingEl.style.display = 'none';
    jobsContainer.style.display = 'grid';
    jobsContainer.innerHTML = jobsList.map(job => `
      <div class="collage-card career-card animate-fade-in">
        <span class="career-dept">${job.type} • ${job.location}</span>
        <h3 class="career-title">${job.title}</h3>
        <p style="font-size:0.9rem; margin-bottom:20px; line-height:1.6;">${job.description}</p>
        <div class="career-meta">
          <span>Salary: ${job.salary || 'Varies'}</span>
        </div>
        <button class="btn btn-secondary apply-job-btn" data-id="${job.id}" data-title="${job.title}" data-meta="${job.type} • ${job.location}" style="padding:10px 20px; font-size:0.75rem; width:100%;">Apply Now</button>
      </div>
    `).join('');

    // Modal Logic Bindings
    const modal = document.getElementById('job-modal');
    const closeBtn = document.getElementById('close-job-modal');
    const jobIdInput = document.getElementById('modal_job_id');
    const jobForm = document.getElementById('job-apply-form');
    const modalTitle = document.getElementById('modal-job-title');
    const modalMeta = document.getElementById('modal-job-meta');

    const handleClose = () => {
      modal.style.display = 'none';
      jobForm.reset();
      const feedback = document.getElementById('job-feedback');
      feedback.style.display = 'none';
    };

    document.querySelectorAll('.apply-job-btn').forEach(btn => {
      btn.onclick = () => {
        const auth = getAuth();
        if (!auth) {
          navigateTo('/login');
          return;
        }
        modalTitle.textContent = `Apply for: ${btn.dataset.title}`;
        modalMeta.textContent = btn.dataset.meta;
        jobIdInput.value = btn.dataset.id;
        modal.style.display = 'flex';
      };
    });

    closeBtn.onclick = handleClose;

    jobForm.onsubmit = async (e) => {
      e.preventDefault();
      const auth = getAuth();
      if (!auth) {
        navigateTo('/login');
        return;
      }
      
      const jobId = jobIdInput.value;
      const submit = document.getElementById('job-submit');
      const feedback = document.getElementById('job-feedback');
      
      submit.disabled = true;
      submit.textContent = 'TRANSMITTING APPLICATION...';
      feedback.style.display = 'none';

      // Check if it is a mock job
      if (jobId.startsWith('mock-')) {
        setTimeout(() => {
          feedback.textContent = 'Application received. Staging coordinator will review soon.';
          feedback.className = 'form-feedback success';
          submit.disabled = false;
          submit.textContent = 'Submit Application';
          setTimeout(() => {
            modal.style.display = 'none';
            jobForm.reset();
            feedback.style.display = 'none';
          }, 2000);
        }, 1500);
        return;
      }

      try {
        const res = await fetch(`/api/jobs/${jobId}/apply`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${auth.token}`
          },
          body: JSON.stringify({
            fullName: document.getElementById('job_full_name').value,
            email: document.getElementById('job_email').value,
            phone: document.getElementById('job_phone').value,
            resumeLink: document.getElementById('job_resume').value,
            portfolioLink: document.getElementById('job_portfolio').value,
            coverLetter: document.getElementById('job_letter').value
          })
        });

        const data = await res.json();
        if (res.ok) {
          feedback.textContent = 'Application transmitted successfully. Career specialists will contact you shortly.';
          feedback.className = 'form-feedback success';
          setTimeout(() => {
            modal.style.display = 'none';
            jobForm.reset();
            feedback.style.display = 'none';
          }, 2000);
        } else {
          feedback.textContent = data.message || 'Verification error. Try again.';
          feedback.className = 'form-feedback error';
        }
      } catch (err) {
        feedback.textContent = 'Transmission failed. Try again.';
        feedback.className = 'form-feedback error';
      } finally {
        submit.disabled = false;
        submit.textContent = 'Submit Application';
      }
    };

  } catch (err) {
    loadingEl.textContent = 'Failed to fetch active vacancies.';
  }
}

// 6. Blog Listing Page (/blog)
async function renderBlogList(container) {
  container.innerHTML = `
    <section class="section animate-fade-in" style="padding-top:140px;">
      <div class="container">
        <div class="section-header" style="max-width:700px; margin-bottom:60px;">
          <span class="section-label">Media & Editorial</span>
          <h1 class="hero-title" style="font-size:clamp(2rem, 5vw, 3.5rem); line-height:1;">Enicilion Blog</h1>
          <p style="margin-top:20px;">Technical summaries, engineering blueprints, event reviews, and structural photography chronicles.</p>
        </div>

        <div id="blog-loading" style="text-align:center; color:var(--text-secondary); margin:40px 0; font-family:var(--font-header);">QUERYING CHRONICLES...</div>
        
        <div class="collage-card" id="blog-panel" style="display:none; overflow:hidden; padding: 0;">
          <div id="blogs-container"></div>
        </div>
      </div>
    </section>
  `;

  const loadingEl = document.getElementById('blog-loading');
  const blogPanel = document.getElementById('blog-panel');
  const blogsContainer = document.getElementById('blogs-container');

  const fallbackBlogs = [
    { slug: 'acoustic-engineering', title: 'Acoustic Engineering: Designing the Perfect Exhaust Chord', createdAt: '2026-06-15T10:00:00.000Z' },
    { slug: 'drift-dynamics', title: 'Drift Dynamics: The Physics of Slide and Slip Angles', createdAt: '2026-06-10T14:30:00.000Z' },
    { slug: 'motorscape-nocturnal', title: 'Motorscape 2026: The Nocturnal Shift at HopUp', createdAt: '2026-06-05T09:15:00.000Z' }
  ];

  try {
    const res = await fetch('/api/blog');
    const data = await res.json();

    let blogs = fallbackBlogs;
    if (res.ok && data.success && data.data && data.data.length > 0) {
      blogs = data.data;
    }

    loadingEl.style.display = 'none';
    blogPanel.style.display = 'block';
    blogsContainer.innerHTML = blogs.map((post, idx) => {
      const date = new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      return `
        <div style="cursor:pointer; padding: 28px; border-bottom: ${idx === blogs.length - 1 ? 'none' : '2px solid var(--border-color)'}; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:16px; transition:var(--transition);" 
             onmouseenter="this.style.background='rgba(27, 67, 224, 0.05)';" 
             onmouseleave="this.style.background='transparent';" 
             onclick="window.history.pushState({}, '', '/blog/${post.slug}'); window.handleRouting();">
          <div>
            <span style="font-family:var(--font-header); font-size:0.75rem; color:var(--accent-yellow); font-weight:800; text-transform:uppercase;">${date} • Article</span>
            <h3 style="margin:8px 0 0 0; font-size:1.3rem; color:#fff; font-family:var(--font-header);">${post.title}</h3>
          </div>
          <p style="font-size:0.8rem; color:var(--accent); font-family:var(--font-header); font-weight:800; text-transform:uppercase;">Read Log →</p>
        </div>
      `;
    }).join('');

  } catch (err) {
    loadingEl.textContent = 'Failed to retrieve blog posts.';
  }
}

// 6b. Single Blog Post Page (/blog/:slug)
async function renderBlogPost(container, slug) {
  container.innerHTML = `
    <section class="section animate-fade-in" style="padding-top:140px; min-height:80vh;">
      <div class="container" style="max-width:850px;">
        <a href="/blog" class="nav-link" style="margin-bottom:30px; display:inline-block; font-size:0.85rem; letter-spacing:0.02em; color:var(--accent); font-family:var(--font-header); font-weight:700;">← Back to Blog Index</a>
        
        <div id="post-loading" style="text-align:center; color:var(--text-secondary); margin:40px 0; font-family:var(--font-header);">DECODING CHRONICLE...</div>
        
        <div class="collage-card" id="post-panel" style="display:none; padding:48px;">
          <h1 id="post-title" class="hero-title" style="font-size:clamp(1.6rem, 5vw, 2.5rem); line-height:1.1; margin-bottom:16px; text-transform:uppercase; color:#fff;"></h1>
          <div id="post-date" style="font-size:0.8rem; color:var(--text-muted); text-transform:uppercase; margin-bottom:40px; border-bottom:2px solid var(--border-color); padding-bottom:16px; font-family:var(--font-header);"></div>
          
          <div id="post-body" style="line-height:1.8; color:var(--text-secondary); font-size:0.95rem;" class="markdown-body"></div>
        </div>
      </div>
    </section>
  `;

  const loadingEl = document.getElementById('post-loading');
  const postPanel = document.getElementById('post-panel');
  const titleEl = document.getElementById('post-title');
  const dateEl = document.getElementById('post-date');
  const bodyEl = document.getElementById('post-body');

  const fallbackPostsContent = {
    'acoustic-engineering': {
      title: 'Acoustic Engineering: Designing the Perfect Exhaust Chord',
      createdAt: '2026-06-15T10:00:00.000Z',
      content: `Designing exhaust acoustics is a science of frequency orchestration. High-performance machine noise profiles are not random; they are defined by engine cylinder configurations, firing patterns, manifold geometry, and acoustic dampeners.

### The Mathematics of Frequency
Exhaust tones are determined by engine rotational speeds. For example, a V8 engine operating at 6,000 RPM produces a fundamental sound frequency calculated as:
\\[f = \\\\frac{6000 \\\\times 8}{2 \\\\times 60} = 400\\\\text{ Hz}\\]
This 400Hz frequency defines the aggressive sound profile. Equal-length manifolds align secondary sound pulses, creating crisp, clear acoustics. Unequal-length setups cause phase differences, yielding the classic rhythmic rumble.

### Materials and Resonance
The material selection plays a massive role in acoustic dynamics:
*   **Titanium**: Exhibits ultra-high rigidity and low density, producing bright, sharp mechanical tones.
*   **Inconel**: Retains high temperature stability and yields a dense, metallic howl similar to legacy Formula 1 profiles.
*   **Stainless Steel**: Generates a deeper, bass-dominated tone.

At ENICILION, our acoustics marshals test each showcase vehicle using high-frequency decibel analyzers, balancing pure sonic volume with refined, clear mechanical resonance.`
    },
    'drift-dynamics': {
      title: 'Drift Dynamics: The Physics of Slide and Slip Angles',
      createdAt: '2026-06-10T14:30:00.000Z',
      content: `Drifting is the deliberate negotiation of sliding friction. It is a controlled dynamic state where the driver exceeds the grip limit of the rear tires while maintaining lateral steering control.

### The Physics of Slip Angle
Slip angle is defined as the deviation angle between the physical heading direction of a wheel and its target trajectory. In a drift, the slip angles of the rear wheels must be maintained beyond their peak grip coefficient:
\\[\\\\alpha_{\\\\text{rear}} > \\\\alpha_{\\\\text{peak}}\\]
At this junction, lateral tire grip drops off, transitioning from static friction to dynamic sliding friction. The driver must balance this drop by throttle adjustments, regulating rear tire spin speed.

### Steering and Torque Balance
Balancing the drift requires a continuous adjustment of counter-steer torque. The front wheels must guide the vehicle's vector. The rotational torque is balanced as:
\\[\\\\tau = I \\\\cdot \\\\ddot{\\\\theta}\\]
By balancing this rotation against the forward thrust of the rear wheels, the car slides smoothly through the corner. At ENICILION showcases, we choreograph these drift angles to allow professional stunt drivers to slide within inches of cameras safely.`
    },
    'motorscape-nocturnal': {
      title: 'Motorscape 2026: The Nocturnal Shift at HopUp',
      createdAt: '2026-06-05T09:15:00.000Z',
      content: `Motorscape 2026 was designed as a living gallery for modern automotive sculpture. Setting the showcase at night under high-intensity red grids allowed us to frame the mechanical curves and carbon profiles of hypercars with extreme detail.

### Operational Grid Architecture
Our layout integrated:
*   **Main Arena**: Centered around HopUp's staging course, featuring pro-drifters performing tandem slides.
*   **Acoustic Zone**: A low-wall corridor structured to amplify the exhaust notes of high-revving naturally aspirated engines.
*   **VIP Gallery**: An elevated glass lounge looking over the grid setup.

Led by organizers **Jaspreet Singh** and **Vivan Vardhan**, the showcase executed flawless operations, hosting 4,500 audited spectators with zero safety incidents. The digital check-in database logged an average gate processing speed of 2.2 seconds per spectator.`
    }
  };

  try {
    const res = await fetch(`/api/blog/${slug}`);
    const data = await res.json();

    let post = null;
    if (res.ok && data.success && data.data) {
      post = data.data;
    } else if (fallbackPostsContent[slug]) {
      post = fallbackPostsContent[slug];
    }

    if (!post) {
      loadingEl.textContent = 'Chronicle not found.';
      return;
    }

    loadingEl.style.display = 'none';
    postPanel.style.display = 'block';

    titleEl.textContent = post.title;
    const date = new Date(post.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    dateEl.textContent = `Published: ${date} • Written by ENICILION Editorial`;

    // Process markdown including math
    bodyEl.innerHTML = parseMarkdown(post.content);

    // Re-render LaTeX math if window.MathJax exists
    if (window.MathJax) {
      window.MathJax.typesetPromise([bodyEl]).catch(() => {});
    }

  } catch (err) {
    loadingEl.textContent = 'Error decoding chronicle.';
  }
}

// 7. Login Page (/login)
function renderLogin(container) {
  container.innerHTML = `
    <section class="section animate-fade-in" style="padding-top:140px; min-height:80vh; display:flex; align-items:center;">
      <div class="container" style="max-width:480px; width:100%;">
        <form id="login-form" class="collage-card card-form">
          <div class="museum-label" style="margin-bottom:24px;">Sign In</div>
          <p style="font-size:0.8rem; color:var(--text-muted); margin-bottom:24px; font-family:var(--font-header);">Enter your credentials to load staging profile data.</p>
          
          <div class="form-group">
            <label class="form-label">Email Address</label>
            <input type="email" id="log_email" required class="form-control" placeholder="e.g. jaspreet@domain.com">
          </div>
          <div class="form-group" style="margin-bottom:30px;">
            <label class="form-label">Password</label>
            <input type="password" id="log_password" required class="form-control" placeholder="••••••••">
          </div>

          <button type="submit" id="login-submit" class="btn btn-primary" style="width:100%;">Initialize Session</button>
          <div id="login-feedback" class="form-feedback"></div>

          <div style="margin-top:24px; text-align:center; font-size:0.85rem; color:var(--text-secondary); font-family:var(--font-header);">
            No active profile? <a href="/signup" style="color:var(--accent); font-weight:700;">Register Account</a>
          </div>
        </form>
      </div>
    </section>
  `;

  const form = document.getElementById('login-form');
  if (form) {
    form.onsubmit = async (e) => {
      e.preventDefault();
      const submit = document.getElementById('login-submit');
      const feedback = document.getElementById('login-feedback');
      
      submit.disabled = true;
      submit.textContent = 'CHECKING PROFILE...';
      feedback.style.display = 'none';

      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: document.getElementById('log_email').value,
            password: document.getElementById('log_password').value
          })
        });

        const data = await res.json();
        if (res.ok && data.success) {
          setAuth(data.data.access_token, data.data.user);
          renderNavbar();
          navigateTo('/profile');
        } else {
          feedback.textContent = data.message || 'Credentials invalid. Please try again.';
          feedback.className = 'form-feedback error';
        }
      } catch (err) {
        feedback.textContent = 'Connection error. Auth handshake failed.';
        feedback.className = 'form-feedback error';
      } finally {
        submit.disabled = false;
        submit.textContent = 'Initialize Session';
      }
    };
  }
}

// 8. Signup Page (/signup)
function renderSignup(container) {
  container.innerHTML = `
    <section class="section animate-fade-in" style="padding-top:140px; min-height:80vh; display:flex; align-items:center;">
      <div class="container" style="max-width:520px; width:100%;">
        <form id="signup-form" class="collage-card card-form">
          <div class="museum-label" style="margin-bottom:24px;">Create Profile</div>
          <p style="font-size:0.8rem; color:var(--text-muted); margin-bottom:24px; font-family:var(--font-header);">Register user variables in the staging database.</p>
          
          <div class="form-group">
            <label class="form-label">Full Name</label>
            <input type="text" id="reg_full_name" required class="form-control" placeholder="e.g. Jaspreet Singh">
          </div>
          <div class="form-group">
            <label class="form-label">Email Address</label>
            <input type="email" id="reg_email" required class="form-control" placeholder="e.g. jaspreet@domain.com">
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">WhatsApp Number</label>
              <input type="tel" id="reg_whatsapp" required class="form-control" placeholder="e.g. +91 9999999999">
            </div>
            <div class="form-group">
              <label class="form-label">City</label>
              <input type="text" id="reg_city" required class="form-control" placeholder="e.g. Chandigarh">
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Instagram Handle (Optional)</label>
            <input type="text" id="reg_instagram" class="form-control" placeholder="e.g. @username">
          </div>
          <div class="form-group" style="margin-bottom:30px;">
            <label class="form-label">Password</label>
            <input type="password" id="reg_password" required minlength="6" class="form-control" placeholder="••••••••">
          </div>

          <button type="submit" id="signup-submit" class="btn btn-primary" style="width:100%;">Create Profile</button>
          <div id="signup-feedback" class="form-feedback"></div>

          <div style="margin-top:24px; text-align:center; font-size:0.85rem; color:var(--text-secondary); font-family:var(--font-header);">
            Already registered? <a href="/login" style="color:var(--accent); font-weight:700;">Sign In</a>
          </div>
        </form>
      </div>
    </section>
  `;

  const form = document.getElementById('signup-form');
  if (form) {
    form.onsubmit = async (e) => {
      e.preventDefault();
      const submit = document.getElementById('signup-submit');
      const feedback = document.getElementById('signup-feedback');
      
      submit.disabled = true;
      submit.textContent = 'REGISTERING...';
      feedback.style.display = 'none';

      try {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            full_name: document.getElementById('reg_full_name').value,
            email: document.getElementById('reg_email').value,
            whatsapp: document.getElementById('reg_whatsapp').value,
            city: document.getElementById('reg_city').value,
            instagram: document.getElementById('reg_instagram').value || undefined,
            password: document.getElementById('reg_password').value
          })
        });

        const data = await res.json();
        if (res.ok && data.success) {
          setAuth(data.data.access_token, data.data.user);
          renderNavbar();
          navigateTo('/profile');
        } else {
          feedback.textContent = data.message || 'Registration failed. Check details and try again.';
          feedback.className = 'form-feedback error';
        }
      } catch (err) {
        feedback.textContent = 'Connection error. Registration failed.';
        feedback.className = 'form-feedback error';
      } finally {
        submit.disabled = false;
        submit.textContent = 'Create Profile';
      }
    };
  }
}

// 9. Profile Page (/profile)
async function renderProfile(container) {
  const auth = getAuth();
  if (!auth) {
    navigateTo('/login');
    return;
  }

  container.innerHTML = `
    <section class="section animate-fade-in" style="padding-top:140px; min-height:85vh;">
      <div class="container">
        <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:2px solid var(--border-color); padding-bottom:24px; margin-bottom:48px; flex-wrap:wrap; gap:20px;">
          <div>
            <span class="section-label">Account details</span>
            <h1 class="hero-title" style="font-size:clamp(2rem, 5vw, 3rem); line-height:1; text-transform:uppercase;">${auth.user.full_name}</h1>
            <p style="font-size:0.85rem; color:var(--text-secondary); margin-top:8px; font-family:var(--font-header);">Classification: <strong style="color:var(--accent-yellow); text-transform:uppercase;">${auth.user.role}</strong></p>
          </div>
          <div style="display:flex; gap:16px;">
            <a href="/tickets" class="btn btn-primary" style="padding:10px 24px; font-size:0.75rem;">My Passes</a>
            <button id="logout-btn-profile" class="btn btn-secondary" style="padding:10px 24px; font-size:0.75rem;">Logout</button>
          </div>
        </div>

        <div class="form-layout">
          <div>
            <h3 style="font-size:1.35rem; text-transform:uppercase; margin-bottom:20px; font-family:var(--font-header); color:#fff;">Registered Garage</h3>
            <div id="vehicles-loading" style="color:var(--text-muted); font-size:0.9rem;">Querying garage...</div>
            <div id="vehicles-container" style="display:flex; flex-direction:column; gap:16px; margin-top:16px;"></div>
          </div>
          <div>
            <h3 style="font-size:1.35rem; text-transform:uppercase; margin-bottom:20px; font-family:var(--font-header); color:#fff;">Upcoming Schedule</h3>
            <div class="collage-card" style="padding:32px; text-align:center;">
              <h4 style="font-size:1rem; text-transform:uppercase; color:#fff; margin-bottom:12px; font-family:var(--font-header);">Motorscape 2026 Completed</h4>
              <p style="font-size:0.9rem; margin-bottom:20px; line-height:1.6;">The HopUp Chandigarh grid showcase has completed. Stay updated for future session schedules.</p>
              <a href="/event" class="btn btn-secondary" style="font-size:0.75rem; padding:10px 20px;">View Recap</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;

  // Bind Logout
  document.getElementById('logout-btn-profile').onclick = () => {
    clearAuth();
    navigateTo('/');
  };

  const vehLoading = document.getElementById('vehicles-loading');
  const vehContainer = document.getElementById('vehicles-container');

  try {
    const res = await fetch('/api/vehicles/my', {
      headers: { 'Authorization': `Bearer ${auth.token}` }
    });
    const data = await res.json();
    
    vehLoading.style.display = 'none';
    if (res.ok && data.success && data.vehicles && data.vehicles.length > 0) {
      vehContainer.innerHTML = data.vehicles.map(v => `
        <div class="collage-card" style="padding:20px; display:flex; justify-content:space-between; align-items:center; font-family:var(--font-header);">
          <div>
            <h4 style="color:#fff; font-size:1rem; text-transform:uppercase; margin-bottom:4px;">${v.car.year} ${v.car.make} ${v.car.model}</h4>
            <p style="font-size:0.8rem; color:var(--text-muted);">Plate: ${v.car.vin}</p>
          </div>
          <span style="font-size:0.8rem; font-weight:700; text-transform:uppercase; color:${v.status === 'approved' ? '#10b981' : v.status === 'rejected' ? '#ef4444' : '#f59e0b'}">${v.status}</span>
        </div>
      `).join('');
    } else {
      vehContainer.innerHTML = `
        <div class="collage-card" style="padding:32px; text-align:center; color:var(--text-muted); font-size:0.9rem;">
          No machines registered in garage.
          <a href="/apply" style="color:var(--accent); font-weight:700; display:block; margin-top:12px;">Register a Vehicle →</a>
        </div>
      `;
    }
  } catch (err) {
    vehLoading.style.display = 'none';
    vehContainer.innerHTML = `<div style="color:#ef4444; font-size:0.9rem;">Failed to fetch garage inventory.</div>`;
  }
}

// 10. Tickets Page (/tickets)
async function renderTickets(container) {
  const auth = getAuth();
  if (!auth) {
    navigateTo('/login');
    return;
  }

  container.innerHTML = `
    <section class="section animate-fade-in" style="padding-top:140px; min-height:85vh;">
      <div class="container" style="max-width:850px;">
        <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:2px solid var(--border-color); padding-bottom:24px; margin-bottom:48px;">
          <div>
            <span class="section-label">Active Event Passes</span>
            <h1 class="hero-title" style="font-size:2.5rem; line-height:1; text-transform:uppercase;">My Passes</h1>
          </div>
          <a href="/profile" class="btn btn-secondary" style="font-size:0.75rem; padding:12px 20px;">Back to Profile</a>
        </div>

        <div id="tickets-loading" style="text-align:center; color:var(--text-secondary); font-family:var(--font-header);">Retrieving passes...</div>
        <div id="tickets-container" style="display:flex; flex-direction:column; gap:32px;"></div>
      </div>
    </section>
  `;

  const loadingEl = document.getElementById('tickets-loading');
  const containerEl = document.getElementById('tickets-container');

  try {
    const res = await fetch('/api/tickets/my-tickets', {
      headers: { 'Authorization': `Bearer ${auth.token}` }
    });
    const data = await res.json();

    loadingEl.style.display = 'none';
    if (res.ok && data.success && data.data && data.data.length > 0) {
      containerEl.innerHTML = data.data.map(ticket => {
        const eventDate = new Date(ticket.event.eventDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
        return `
          <div class="perforated-ticket">
            <div class="ticket-main">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 20px;">
                <div>
                  <span class="museum-label" style="border-color: var(--text-paper); color: var(--text-paper); margin-bottom: 16px;">${ticket.tier.name}</span>
                  <h3 style="font-size: 1.8rem; color: var(--text-paper); text-transform: uppercase; margin: 12px 0 16px; font-family: var(--font-header);">${ticket.event.name}</h3>
                  <div style="display:flex; flex-direction:column; gap:8px; font-size:0.85rem; color:#333; font-family:var(--font-header);">
                    <div>📅 ${eventDate}</div>
                    <div>📍 ${ticket.event.location}</div>
                    <div style="margin-top:16px; font-size:0.75rem; color:var(--text-muted); text-transform:uppercase;">Pass Code: ${ticket.ticketCode}</div>
                  </div>
                </div>
                <div style="width: 130px; opacity: 0.85; transform: rotate(-2deg); margin-top: 10px;">
                  ${getSmallCarSVG()}
                </div>
              </div>
            </div>

            <div class="ticket-stub">
              <span style="font-size:0.75rem; font-weight:800; text-transform:uppercase; padding:6px 12px; background:rgba(16, 185, 129, 0.1); border:2px solid #10b981; color:#10b981; border-radius:0;">${ticket.status}</span>
              
              <!-- Barcode frame -->
              <div style="text-align:center; width:100%;">
                <div style="height:36px; background:repeating-linear-gradient(90deg, #111116, #111116 2px, #e9e4db 2px, #e9e4db 6px); border: 1.5px solid var(--text-paper); margin-bottom:12px; opacity:0.9;"></div>
                <a href="/api/ticket-pdf/${ticket.ticketCode}" target="_blank" class="btn btn-secondary" style="font-size:0.7rem; padding:8px 12px; width:100%; text-align:center; border-radius:0; border-color: var(--text-paper); color: var(--text-paper);">Download PDF</a>
              </div>
            </div>
          </div>
        `;
      }).join('');
    } else {
      containerEl.innerHTML = `
        <div class="collage-card theme-paper" style="padding:48px; text-align:center; color:var(--text-muted); font-size:0.9rem;">
          No spectator passes found. 
          <p style="margin-top:12px; color:var(--text-muted);">Motorscape 2026 is concluded. Keep checking for upcoming events.</p>
        </div>
      `;
    }

  } catch (err) {
    loadingEl.style.display = 'none';
    containerEl.innerHTML = `<div style="color:#ef4444; text-align:center; font-size:0.9rem;">Failed to query passes.</div>`;
  }
}

// Fallback Route
function renderNotFound(container) {
  container.innerHTML = `
    <section class="section animate-fade-in" style="padding-top:200px; min-height:80vh; display:flex; align-items:center; text-align:center;">
      <div class="container" style="max-width:600px;">
        <span class="section-label" style="font-size:1.5rem; letter-spacing:0.3em; margin-bottom:20px; display:block;">404</span>
        <h1 class="hero-title" style="font-size:2.5rem; line-height:1; margin-bottom:24px; font-family:var(--font-display);">Passage Blocked</h1>
        <p style="margin-bottom:40px;">The staging lane you requested does not exist or has been closed. Re-route to the home grid.</p>
        <a href="/" class="btn btn-primary">Return Home</a>
      </div>
    </section>
  `;
}

// Markdown Parser Helper
function parseMarkdown(md) {
  return md
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/^### (.*$)/gim, '<h3 style="color:#fff; font-size:1.2rem; margin:24px 0 12px; text-transform:uppercase; font-family:var(--font-header);"># $1</h3>')
    .replace(/^## (.*$)/gim, '<h2 style="color:#fff; font-size:1.4rem; margin:32px 0 16px; text-transform:uppercase; font-family:var(--font-header);">## $1</h2>')
    .replace(/^# (.*$)/gim, '<h1 style="color:#fff; font-size:1.6rem; margin:36px 0 20px; text-transform:uppercase; font-family:var(--font-header);">### $1</h1>')
    .replace(/\*\*(.*)\*\*/gim, '<strong style="color:var(--accent); font-family:var(--font-header);">$1</strong>')
    .replace(/\*(.*)\*/gim, '<em>$1</em>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" style="color:var(--accent-secondary); font-weight:700;">$1</a>')
    .replace(/^- (.*$)/gim, '<li style="margin-left:20px; margin-bottom:8px; font-family:var(--font-header);">* $1</li>')
    .split('\n').map(line => {
      const trimmed = line.trim();
      if (!trimmed) return '';
      if (trimmed.startsWith('<h') || trimmed.startsWith('<ul') || trimmed.startsWith('<li') || trimmed.startsWith('<ol') || trimmed.startsWith('\\[') || trimmed.startsWith('$$')) return line;
      return `<p style="margin-bottom:16px;">${line}</p>`;
    }).join('\n');
}

// Trigger initial route match
document.addEventListener('DOMContentLoaded', () => {
  handleRouting();
});
window.handleRouting = handleRouting;
