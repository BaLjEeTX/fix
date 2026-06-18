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
        <a href="/" class="logo">ENICILION<span>.sys</span></a>
        
        <div class="nav-links">
          <a href="/" class="nav-link ${path === '/' ? 'active' : ''}">capabilities</a>
          <a href="/event" class="nav-link ${path === '/event' ? 'active' : ''}">motorscape.dat</a>
          <a href="/apply" class="nav-link ${path === '/apply' ? 'active' : ''}">register.sh</a>
          <a href="/creator-tickets" class="nav-link ${path === '/creator-tickets' ? 'active' : ''}">creators.cfg</a>
          <a href="/careers" class="nav-link ${path === '/careers' ? 'active' : ''}">vacancies</a>
          <a href="/blog" class="nav-link ${path.startsWith('/blog') ? 'active' : ''}">editorial.log</a>
        </div>

        <div style="display: flex; gap: 16px; align-items: center;">
          ${auth 
            ? `
              <a href="/profile" class="nav-link ${path === '/profile' ? 'active' : ''}" style="font-size:0.8rem;">[profile]</a>
              <button id="logout-btn-nav" class="nav-cta" style="border-color:transparent; color:#ff0055;">logout</button>
              `
            : `
              <a href="/login" class="nav-link ${path === '/login' ? 'active' : ''}" style="font-size:0.8rem;">sign_in</a>
              <a href="/signup" class="nav-cta">register</a>
              `
          }
        </div>
      </div>
    </nav>
  `;

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
            <h3 style="font-family: var(--font-display); font-size: 1.5rem; color: #fff;">ENICILION<span>.sys</span></h3>
            <p>Experiential event curation and automotive art execution. Pushing mechanical discipline into aggressive performance aesthetics.</p>
          </div>
          <div>
            <h4 class="footer-col-title">Index Map</h4>
            <ul class="footer-links">
              <li><a href="/">/capabilities</a></li>
              <li><a href="/event">/motorscape_recap</a></li>
              <li><a href="/apply">/register_machine</a></li>
              <li><a href="/creator-tickets">/creator_credentials</a></li>
            </ul>
          </div>
          <div>
            <h4 class="footer-col-title">Operations</h4>
            <ul class="footer-links">
              <li><a href="/careers">/vacancies_index</a></li>
              <li><a href="/blog">/editorial_logs</a></li>
              <li><a href="/admin/">/ops_console</a></li>
            </ul>
          </div>
        </div>
        <div class="footer-bottom">
          <p class="footer-copy">&copy; 2026 ENICILION. Organized by Jaspreet Singh and Vivan Vardhan. All rights reserved.</p>
          <div style="font-size: 0.75rem; color: var(--accent); font-family: var(--font-header);">
            $ status: active_grid_initialized
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

// ============================================================
// PAGE RENDERERS
// ============================================================

// 1. Home Page (Services & Art Philosophy)
function renderHome(container) {
  container.innerHTML = `
    <!-- Hero Section -->
    <section class="hero animate-fade-in">
      <div class="hero-bg"></div>
      <div class="hero-grid"></div>
      <div class="container">
        <div class="hero-content">
          <span class="hero-tagline">event_curation_engine_v1.0</span>
          <h1 class="hero-title">EXPERIENTIAL ART<br><span>DRIVEN BY</span><br>DISCIPLINE</h1>
          <p class="hero-desc">We design, coordinate, and execute premium, high-octane automotive spectacles. Merging precision mechanical design, kinetic motion, and acoustic engineering into prestige sensory experiences.</p>
          <div class="hero-actions">
            <a href="/event" class="btn btn-primary">[ EXPLORE_RECAPS ]</a>
            <a href="/apply" class="btn btn-secondary">[ REGISTER_MACHINE ]</a>
          </div>
        </div>
      </div>
    </section>

    <!-- Services Section -->
    <section class="section section-alt">
      <div class="container">
        <div class="section-header">
          <span class="section-label">capabilities.log</span>
          <h2 class="section-title">Logistics & Architectural Layout</h2>
          <p>We provide end-to-end technical, artistic, and operational execution for high-intensity mechanical showcases.</p>
        </div>
        
        <div class="services-grid">
          <div class="service-card">
            <div class="service-icon">>_</div>
            <h3 class="service-name">Bespoke Curation</h3>
            <p class="service-desc">From restricted underground night meets to professional closed-circuit track events. We engineer custom spectacles featuring curated vehicle selections.</p>
          </div>
          <div class="service-card">
            <div class="service-icon">>_</div>
            <h3 class="service-name">Acoustic Choreography</h3>
            <p class="service-desc">Orchestrating raw engine harmonics. Our team designs acoustic showcases, rev battles, and high-fidelity venue audio systems for peak sensory impact.</p>
          </div>
          <div class="service-card">
            <div class="service-icon">>_</div>
            <h3 class="service-name">Precision Slip</h3>
            <p class="service-desc">Providing certified drift demonstration logistics, stunt drivers, grid safety coordination, and track barriers to maintain a secure environment.</p>
          </div>
          <div class="service-card">
            <div class="service-icon">>_</div>
            <h3 class="service-name">Creative Media</h3>
            <p class="service-desc">High-speed camera tracking, cinematic videography, and creative direction to translate kinetic machine energy into brand-defining content assets.</p>
          </div>
          <div class="service-card">
            <div class="service-icon">>_</div>
            <h3 class="service-name">Digital Gate Entry</h3>
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
              <div class="phil-overlay-title">aesthetic_protocol.cfg</div>
              <p style="font-size:0.8rem; color:#8b949e; font-family:var(--font-header);">Mechanical sculpture in constant motion. Every rev, every slip is a deliberate artistic expression.</p>
            </div>
          </div>
          <div class="phil-content">
            <span class="section-label">philosophy.txt</span>
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
            <span class="section-label">partnership_portal.cfg</span>
            <h2 class="form-info-title">Partner with ENICILION</h2>
            <p>Interested in launching a brand activation, sponsoring our next motorsport spectacle, or commissioning our event coordination services? Transmit your specs.</p>
            
            <div class="form-info-list">
              <div class="form-info-item">
                <div class="form-info-icon">>></div>
                <div>
                  <div class="form-info-label">email_address</div>
                  <div class="form-info-val">partners@enicilion.com</div>
                </div>
              </div>
              <div class="form-info-item">
                <div class="form-info-icon">>></div>
                <div>
                  <div class="form-info-label">staging_hq</div>
                  <div class="form-info-val">Chandigarh, Punjab, India</div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div class="terminal-window">
              <div class="terminal-header">
                <div class="terminal-dots">
                  <span class="terminal-dot red"></span>
                  <span class="terminal-dot yellow"></span>
                  <span class="terminal-dot green"></span>
                </div>
                <span class="terminal-title">corporate_inquire.exe</span>
              </div>
              <div class="terminal-body">
                <form id="partner-form">
                  <div class="form-group">
                    <label class="form-label">$ brand_name:</label>
                    <input type="text" id="brand_name" required class="form-control" placeholder="e.g. Redline Performance">
                  </div>
                  <div class="form-row">
                    <div class="form-group">
                      <label class="form-label">$ contact_person:</label>
                      <input type="text" id="contact_person" required class="form-control" placeholder="e.g. Jaspreet Singh">
                    </div>
                    <div class="form-group">
                      <label class="form-label">$ email_address:</label>
                      <input type="email" id="partner_email" required class="form-control" placeholder="e.g. press@redline.com">
                    </div>
                  </div>
                  <div class="form-row">
                    <div class="form-group">
                      <label class="form-label">$ contact_phone:</label>
                      <input type="tel" id="partner_phone" class="form-control" placeholder="e.g. +91 9999999999">
                    </div>
                    <div class="form-group">
                      <label class="form-label">$ target_interest:</label>
                      <select id="interests" class="form-control" style="background:#07080a;">
                        <option value="Sponsorship">Event Sponsorship</option>
                        <option value="Curation Services">Event Design & Curation</option>
                        <option value="Media Activation">Creative & Tracking Media</option>
                        <option value="Other">Custom Collaboration</option>
                      </select>
                    </div>
                  </div>
                  <div class="form-group">
                    <label class="form-label">$ collaboration_brief:</label>
                    <textarea id="partner_message" required class="form-control" placeholder="Outline your marketing timeline, target budget, or concept expectations."></textarea>
                  </div>
                  <button type="submit" id="partner-submit" class="btn btn-primary" style="width:100%;">[ TRANSMIT_INQUIRY ]</button>
                  <div id="partner-feedback" class="form-feedback"></div>
                </form>
              </div>
            </div>
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
          feedback.textContent = 'Inquiry transmitted successfully. Output: 200 OK. Our creative leads will contact you.';
          feedback.className = 'form-feedback success';
          form.reset();
        } else {
          feedback.textContent = data.message || 'Transmission failed. Status code: 400 Bad Request.';
          feedback.className = 'form-feedback error';
        }
      } catch (err) {
        feedback.textContent = 'Network error. Transmission terminated.';
        feedback.className = 'form-feedback error';
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = '[ TRANSMIT_INQUIRY ]';
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
          <span class="section-label">event_recap.log</span>
          <h1 class="hero-title" style="font-size:clamp(1.8rem, 6vw, 3.5rem); line-height:1;">Motorscape 2026</h1>
          <p style="font-size:1rem; margin-top:20px;">A detailed review of our latest nocturnal showcase. Executed at HopUp Chandigarh, blending precision vehicle grid setups, industrial lighting displays, and professional drifting.</p>
          <div style="margin-top:20px; font-size:0.85rem; color:var(--text-secondary); font-family:var(--font-header);">
            $ operators: Jaspreet Singh & Vivan Vardhan
          </div>
        </div>

        <!-- Metric Cards -->
        <div class="case-stats animate-fade-in">
          <div class="stat-item">
            <div class="stat-num">4,500+</div>
            <div class="stat-label">Spectators Audited</div>
          </div>
          <div class="stat-item">
            <div class="stat-num">150+</div>
            <div class="stat-label">Supercars Grid</div>
          </div>
          <div class="stat-item">
            <div class="stat-num">30+</div>
            <div class="stat-label">Pro Drift Runs</div>
          </div>
          <div class="stat-item">
            <div class="stat-num">1.8M+</div>
            <div class="stat-label">Social Reach</div>
          </div>
        </div>

        <!-- Slider Section -->
        <div class="terminal-window" style="margin-bottom: 80px;">
          <div class="terminal-header">
            <div class="terminal-dots">
              <span class="terminal-dot red"></span>
              <span class="terminal-dot yellow"></span>
              <span class="terminal-dot green"></span>
            </div>
            <span class="terminal-title">motorscape_recaps.dat</span>
          </div>
          <div class="slider-container">
            <div class="slider-wrapper" id="case-slider-wrapper">
              <div class="slide">
                <img src="/media/supercar-bg.webp" alt="Motorscape Supercar Grid">
                <div class="slide-content">
                  <span class="slide-category">Phase 01: Arrival</span>
                  <h3 class="slide-title">Curated Rolling Supercar Showcases</h3>
                </div>
              </div>
              <div class="slide">
                <img src="/media/Exhaust Flame 2.webp" alt="Motorscape Exhaust Fire">
                <div class="slide-content">
                  <span class="slide-category">Phase 02: Acoustics</span>
                  <h3 class="slide-title">Acoustic Exhaust Rev Orchestrations</h3>
                </div>
              </div>
              <div class="slide">
                <img src="/media/drift-bg.webp" alt="Motorscape Pro Drift Show">
                <div class="slide-content">
                  <span class="slide-category">Phase 03: Dynamics</span>
                  <h3 class="slide-title">Professional Drift Taxi Demonstrations</h3>
                </div>
              </div>
              <div class="slide">
                <img src="/media/enthusiast-bg.webp" alt="Motorscape Night Gathering">
                <div class="slide-content">
                  <span class="slide-category">Phase 04: Gallery</span>
                  <h3 class="slide-title">High-Intensity Industrial Visual Layouts</h3>
                </div>
              </div>
            </div>
            <div class="slider-nav">
              <button class="slider-arrow" id="slide-prev">[ PREV ]</button>
              <button class="slider-arrow" id="slide-next">[ NEXT ]</button>
            </div>
          </div>
        </div>

        <!-- Narrative -->
        <div class="form-layout" style="margin-bottom:80px;">
          <div class="terminal-window">
            <div class="terminal-header">
              <div class="terminal-dots">
                <span class="terminal-dot red"></span>
                <span class="terminal-dot yellow"></span>
                <span class="terminal-dot green"></span>
              </div>
              <span class="terminal-title">operational_audit.txt</span>
            </div>
            <div class="terminal-body">
              <h3 style="font-size:1.2rem; text-transform:uppercase; margin-bottom:16px; color:#fff; font-family:var(--font-header);">Nocturnal Grid Integration</h3>
              <p style="margin-bottom:16px;">Motorscape 2026 was curated to challenge the conventional "car meet" model. The venue, HopUp Chandigarh, was transformed into an industrial gallery using ambient red spotlight grids and low-frequency sonic setups.</p>
              <p>Our team managed all aspects: driver verification, registration gates using QR validation, noise-barrier compliance, and local fire department clearance for smoke/burnout protocols. By spacing the supercars and JDM imports strategically, we allowed spectators to witness structural mechanical design up close.</p>
            </div>
          </div>

          <div class="terminal-window">
            <div class="terminal-header">
              <div class="terminal-dots">
                <span class="terminal-dot red"></span>
                <span class="terminal-dot yellow"></span>
                <span class="terminal-dot green"></span>
              </div>
              <span class="terminal-title">protocol_timeline.cfg</span>
            </div>
            <div class="terminal-body">
              <h3 style="font-size:1.2rem; text-transform:uppercase; margin-bottom:16px; color:#fff; font-family:var(--font-header);">Chronological Protocols</h3>
              <ul style="list-style:none; padding:0; display:flex; flex-direction:column; gap:16px;">
                <li style="border-left: 2px solid var(--accent); padding-left: 16px;">
                  <h4 style="color:#fff; font-size:0.95rem; font-family:var(--font-header);">Rolling Entries</h4>
                  <p style="font-size:0.8rem;">Controlled timing intervals of high-performance arrivals, keeping spectators engaged safely.</p>
                </li>
                <li style="border-left: 2px solid var(--accent); padding-left: 16px;">
                  <h4 style="color:#fff; font-size:0.95rem; font-family:var(--font-header);">Exhaust Showcases</h4>
                  <p style="font-size:0.8rem;">Acoustic monitoring of engine displacement, rev acoustics, and exhaust flame mechanics.</p>
                </li>
                <li style="border-left: 2px solid var(--accent); padding-left: 16px;">
                  <h4 style="color:#fff; font-size:0.95rem; font-family:var(--font-header);">Drift taxi runs</h4>
                  <p style="font-size:0.8rem;">Professional drivers carrying passengers in dynamic slip angles, demonstrating slip choreography.</p>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Ticket Tiers Overview -->
        <div class="section-header" style="margin-bottom:30px;">
          <h2 style="font-size:1.6rem; text-transform:uppercase;">Spectator Tier Analytics</h2>
          <p>The event concluded with all tickets sold out within 72 hours of open registration.</p>
        </div>
        <div class="terminal-window">
          <div class="terminal-header">
            <div class="terminal-dots">
              <span class="terminal-dot red"></span>
              <span class="terminal-dot yellow"></span>
              <span class="terminal-dot green"></span>
            </div>
            <span class="terminal-title">spectator_access_tiers.db</span>
          </div>
          <div style="overflow-x:auto;">
            <table style="width:100%; border-collapse:collapse; text-align:left; font-size:0.85rem; font-family:var(--font-header);">
              <thead>
                <tr style="border-bottom:1px solid var(--border-color); background:rgba(0, 255, 102, 0.02);">
                  <th style="padding:16px 24px; color:#fff;">Tier Class</th>
                  <th style="padding:16px 24px; color:#fff;">Event Access</th>
                  <th style="padding:16px 24px; color:#fff;">Closing Rate</th>
                  <th style="padding:16px 24px; text-align:right; color:#fff;">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr style="border-bottom:1px solid rgba(0, 255, 102, 0.05);">
                  <td style="padding:16px 24px; font-weight:700; color:#fff;">Basic Showcase Pass</td>
                  <td style="padding:16px 24px; color:var(--text-secondary);">General Access & Entry</td>
                  <td style="padding:16px 24px; color:var(--text-secondary);">₹899</td>
                  <td style="padding:16px 24px; text-align:right; color:var(--accent); font-weight:700;">[CLOSED]</td>
                </tr>
                <tr style="border-bottom:1px solid rgba(0, 255, 102, 0.05);">
                  <td style="padding:16px 24px; font-weight:700; color:#fff;">Paddock Pass</td>
                  <td style="padding:16px 24px; color:var(--text-secondary);">Inner Paddock Grid & Driver Access</td>
                  <td style="padding:16px 24px; color:var(--text-secondary);">₹2,099</td>
                  <td style="padding:16px 24px; text-align:right; color:var(--accent); font-weight:700;">[CLOSED]</td>
                </tr>
                <tr style="border-bottom:1px solid rgba(0, 255, 102, 0.05);">
                  <td style="padding:16px 24px; font-weight:700; color:#fff;">VIP Pass</td>
                  <td style="padding:16px 24px; color:var(--text-secondary);">Lounge Access, VIP Deck & Merch Kit</td>
                  <td style="padding:16px 24px; color:var(--text-secondary);">₹4,599</td>
                  <td style="padding:16px 24px; text-align:right; color:var(--accent); font-weight:700;">[CLOSED]</td>
                </tr>
              </tbody>
            </table>
          </div>
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
          <span class="section-label">staging_applications.sh</span>
          <h1 class="hero-title" style="font-size:clamp(1.8rem, 5vw, 3.5rem); line-height:1;">Register Machine</h1>
          <p style="margin-top:20px;">Submit your vehicle for verification. We select high-performance modifications, clean imports, exotic supercars, and professional drift builds.</p>
        </div>

        <div class="form-layout">
          <div>
            <h3 style="font-size:1.6rem; text-transform:uppercase; margin-bottom:20px; font-family:var(--font-display);">Entry Protocols</h3>
            <p style="margin-bottom:24px;">To maintain a premium standard, all entries undergo structural and safety reviews. If accepted, you will receive a digital grid pass with staging guidelines.</p>
            
            <ul style="list-style:none; padding:0; display:flex; flex-direction:column; gap:20px;">
              <li style="display:flex; gap:16px; border:1px solid var(--border-color); background:var(--bg-secondary); padding:16px; border-radius:var(--border-radius);">
                <div style="color:var(--accent); font-family:var(--font-header);">[01]</div>
                <div>
                  <strong style="color:#fff; display:block; text-transform:uppercase; font-size:0.8rem; font-family:var(--font-header);">Clean Presentation</strong>
                  <span style="font-size:0.8rem; color:var(--text-secondary);">Vehicles must be aesthetically polished and detailing must be complete.</span>
                </div>
              </li>
              <li style="display:flex; gap:16px; border:1px solid var(--border-color); background:var(--bg-secondary); padding:16px; border-radius:var(--border-radius);">
                <div style="color:var(--accent); font-family:var(--font-header);">[02]</div>
                <div>
                  <strong style="color:#fff; display:block; text-transform:uppercase; font-size:0.8rem; font-family:var(--font-header);">Mechanical Verification</strong>
                  <span style="font-size:0.8rem; color:var(--text-secondary);">No active fluid leaks. Brake pads, cooling systems, and tire ratings must comply.</span>
                </div>
              </li>
              <li style="display:flex; gap:16px; border:1px solid var(--border-color); background:var(--bg-secondary); padding:16px; border-radius:var(--border-radius);">
                <div style="color:var(--accent); font-family:var(--font-header);">[03]</div>
                <div>
                  <strong style="color:#fff; display:block; text-transform:uppercase; font-size:0.8rem; font-family:var(--font-header);">Safe Operation</strong>
                  <span style="font-size:0.8rem; color:var(--text-secondary);">Drivers must comply with staging marshals. Burnout/drift demos are restricted to active demo periods.</span>
                </div>
              </li>
            </ul>
          </div>

          <div>
            <div class="terminal-window">
              <div class="terminal-header">
                <div class="terminal-dots">
                  <span class="terminal-dot red"></span>
                  <span class="terminal-dot yellow"></span>
                  <span class="terminal-dot green"></span>
                </div>
                <span class="terminal-title">garage_registry.sh</span>
              </div>
              <div class="terminal-body">
                <form id="apply-form" enctype="multipart/form-data">
                  <div class="form-group">
                    <label class="form-label">$ driver_name:</label>
                    <input type="text" id="app_full_name" required class="form-control" placeholder="e.g. Jaspreet Singh">
                  </div>

                  <div class="form-row">
                    <div class="form-group">
                      <label class="form-label">$ whatsapp_number:</label>
                      <input type="tel" id="app_whatsapp" required class="form-control" placeholder="e.g. +91 9999999999">
                    </div>
                    <div class="form-group">
                      <label class="form-label">$ instagram_handle:</label>
                      <input type="text" id="app_instagram" class="form-control" placeholder="e.g. @username">
                    </div>
                  </div>

                  <div class="form-group">
                    <label class="form-label">$ current_city:</label>
                    <input type="text" id="app_city" required class="form-control" placeholder="e.g. Ludhiana">
                  </div>

                  <!-- Vehicle Spec -->
                  <h4 style="font-size:0.75rem; text-transform:uppercase; color:var(--accent-secondary); margin: 24px 0 12px; border-bottom:1px solid rgba(255,0,85,0.15); padding-bottom:4px; font-family:var(--font-header);">// Vehicle Profile Specs</h4>
                  
                  <div class="form-row">
                    <div class="form-group">
                      <label class="form-label">$ make:</label>
                      <input type="text" id="veh_make" required class="form-control" placeholder="e.g. Toyota">
                    </div>
                    <div class="form-group">
                      <label class="form-label">$ model:</label>
                      <input type="text" id="veh_model" required class="form-control" placeholder="e.g. Supra MK5">
                    </div>
                  </div>

                  <div class="form-row">
                    <div class="form-group">
                      <label class="form-label">$ manufacture_year:</label>
                      <input type="number" id="veh_year" required min="1950" max="2027" class="form-control" placeholder="e.g. 2021">
                    </div>
                    <div class="form-group">
                      <label class="form-label">$ license_plate_or_vin:</label>
                      <input type="text" id="veh_vin" required class="form-control" placeholder="e.g. CH01AB1234">
                    </div>
                  </div>

                  <div class="form-group">
                    <label class="form-label">$ modifications_log:</label>
                    <textarea id="app_modifications" class="form-control" placeholder="List power upgrades, suspension setups, aesthetic modifications..."></textarea>
                  </div>

                  <div class="form-group">
                    <label class="form-label">$ upload_photos (Min 1):</label>
                    <input type="file" id="app_photos" required multiple accept="image/*" class="form-control" style="background:#07080a; padding: 10px;">
                    <span style="font-size:0.7rem; color:var(--text-muted); margin-top:4px; display:block;">Supported: JPG, PNG, WEBP. Max size 5MB.</span>
                  </div>

                  <div class="form-group" style="margin-top:24px;">
                    <label class="form-label" style="margin-bottom:12px;">$ staging_protocols:</label>
                    <div style="display:flex; flex-direction:column; gap:12px; font-size:0.8rem; font-family:var(--font-header);">
                      <label style="display:flex; gap:10px; align-items:flex-start; cursor:pointer;">
                        <input type="checkbox" id="protocol_1" required style="accent-color:var(--accent); margin-top:3px;">
                        <span>I confirm my vehicle has no fluid leaks and is mechanically sound.</span>
                      </label>
                      <label style="display:flex; gap:10px; align-items:flex-start; cursor:pointer;">
                        <input type="checkbox" id="protocol_2" required style="accent-color:var(--accent); margin-top:3px;">
                        <span>I agree to park and operate the vehicle only in designated grid spots.</span>
                      </label>
                      <label style="display:flex; gap:10px; align-items:flex-start; cursor:pointer;">
                        <input type="checkbox" id="protocol_3" required style="accent-color:var(--accent); margin-top:3px;">
                        <span>I agree to comply with ENICILION safety guidelines and marshal warnings.</span>
                      </label>
                    </div>
                  </div>

                  <button type="submit" id="apply-submit" class="btn btn-primary" style="width:100%; margin-top:24px;">[ TRANSMIT_GARAGE_SPEC ]</button>
                  <div id="apply-feedback" class="form-feedback"></div>
                </form>
              </div>
            </div>
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
      submitBtn.textContent = 'TRANSMITTING PROFILE...';
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
        submitBtn.textContent = '[ TRANSMIT_GARAGE_SPEC ]';
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
          <span class="section-label">media_relations.cfg</span>
          <h1 class="hero-title" style="font-size:clamp(1.8rem, 5vw, 3.5rem); line-height:1;">Creator Access</h1>
          <p style="margin-top:20px;">We collaborate with creative media agencies, automotive photographers, vloggers, and editorial writers to capture the sensory atmosphere of our spectacles.</p>
        </div>

        <div class="form-layout">
          <div>
            <h3 style="font-size:1.6rem; text-transform:uppercase; margin-bottom:20px; font-family:var(--font-display);">Collaboration Options</h3>
            <p style="margin-bottom:30px;">Select your creative profile. We provide certified access passes to designated inner-paddock track zones and tracking vehicles.</p>
            
            <div class="tabs-control">
              <button class="tab-btn active" id="tab-creator-btn">Content Creator</button>
              <button class="tab-btn" id="tab-press-btn">Press & Agency</button>
            </div>

            <div class="terminal-window">
              <div class="terminal-header">
                <div class="terminal-dots">
                  <span class="terminal-dot red"></span>
                  <span class="terminal-dot yellow"></span>
                  <span class="terminal-dot green"></span>
                </div>
                <span class="terminal-title">access_criteria.md</span>
              </div>
              <div class="terminal-body" style="font-size:0.85rem; line-height:1.6; color:var(--text-secondary);">
                <div id="creator-guide" class="tab-pane active">
                  <h4 style="color:#fff; text-transform:uppercase; margin-bottom:10px; font-family:var(--font-header);">Content Creator guidelines</h4>
                  <p style="margin-bottom:12px;">Geared towards independent photographers, videographers, and social media creators who focus on automotive styling and drift culture.</p>
                  <p>Requires a minimum of 2,000 active followers or a verifiable portfolio showing premium grading and high-shutter kinetic photography.</p>
                </div>
                <div id="press-guide" class="tab-pane">
                  <h4 style="color:#fff; text-transform:uppercase; margin-bottom:10px; font-family:var(--font-header);">Press & Media Agency guidelines</h4>
                  <p style="margin-bottom:12px;">For established digital publications, news broadcasts, or regional magazines writing event summaries or reviews.</p>
                  <p>Access packages include high-speed media zones, grid access credentials, and direct driver interviews with Jaspreet Singh and Vivan Vardhan.</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <!-- Creator Form -->
            <div class="terminal-window tab-pane active" id="creator-form-window">
              <div class="terminal-header">
                <div class="terminal-dots">
                  <span class="terminal-dot red"></span>
                  <span class="terminal-dot yellow"></span>
                  <span class="terminal-dot green"></span>
                </div>
                <span class="terminal-title">content_creator_dossier.cfg</span>
              </div>
              <div class="terminal-body">
                <form id="creator-apply-form">
                  <div class="form-group">
                    <label class="form-label">$ creator_name:</label>
                    <input type="text" id="cre_full_name" required class="form-control" placeholder="e.g. Jaspreet Singh">
                  </div>
                  <div class="form-group">
                    <label class="form-label">$ contact_email:</label>
                    <input type="email" id="cre_email" required class="form-control" placeholder="e.g. jaspreet@creative.com">
                  </div>
                  <div class="form-row">
                    <div class="form-group">
                      <label class="form-label">$ portfolio_url:</label>
                      <input type="url" id="cre_social" required class="form-control" placeholder="e.g. https://instagram.com/user">
                    </div>
                    <div class="form-group">
                      <label class="form-label">$ follower_count:</label>
                      <input type="number" id="cre_followers" required class="form-control" placeholder="e.g. 5000">
                    </div>
                  </div>
                  <div class="form-group">
                    <label class="form-label">$ content_format:</label>
                    <select id="cre_style" class="form-control" style="background:#07080a;">
                      <option value="Photography">Kinetic / Shutter Photography</option>
                      <option value="Videography">Cinematic Reels / Videography</option>
                      <option value="Vlog">Automotive Vlogging</option>
                      <option value="Editorial">Technical Reviews & Writing</option>
                    </select>
                  </div>
                  <div class="form-group">
                    <label class="form-label">$ coverage_pitch:</label>
                    <textarea id="cre_pitch" required class="form-control" placeholder="Describe how you plan to cover the Motorscape grid. Outline tracking styles, lighting setups, or drone coverage ideas..."></textarea>
                  </div>
                  <button type="submit" id="cre-submit" class="btn btn-primary" style="width:100%;">[ TRANSMIT_DOSSIER ]</button>
                  <div id="cre-feedback" class="form-feedback"></div>
                </form>
              </div>
            </div>

            <!-- Press Form -->
            <div class="terminal-window tab-pane" id="press-form-window">
              <div class="terminal-header">
                <div class="terminal-dots">
                  <span class="terminal-dot red"></span>
                  <span class="terminal-dot yellow"></span>
                  <span class="terminal-dot green"></span>
                </div>
                <span class="terminal-title">press_agency_dossier.cfg</span>
              </div>
              <div class="terminal-body">
                <form id="press-apply-form">
                  <div class="form-group">
                    <label class="form-label">$ agency_name:</label>
                    <input type="text" id="press_org" required class="form-control" placeholder="e.g. Octane Magazine">
                  </div>
                  <div class="form-row">
                    <div class="form-group">
                      <label class="form-label">$ contact_person:</label>
                      <input type="text" id="press_name" required class="form-control" placeholder="e.g. Vivan Vardhan">
                    </div>
                    <div class="form-group">
                      <label class="form-label">$ corporate_email:</label>
                      <input type="email" id="press_email" required class="form-control" placeholder="e.g. editor@octane.com">
                    </div>
                  </div>
                  <div class="form-row">
                    <div class="form-group">
                      <label class="form-label">$ contact_phone:</label>
                      <input type="tel" id="press_phone" required class="form-control" placeholder="e.g. +91 9999999999">
                    </div>
                    <div class="form-group">
                      <label class="form-label">$ coverage_format:</label>
                      <select id="press_type" class="form-control" style="background:#07080a;">
                        <option value="Digital">Digital Article / Web Publication</option>
                        <option value="Print">Print Feature / Magazine</option>
                        <option value="Broadcast">Television / Video Broadcast</option>
                      </select>
                    </div>
                  </div>
                  <div class="form-group">
                    <label class="form-label">$ publication_url:</label>
                    <input type="url" id="press_link" required class="form-control" placeholder="e.g. https://octanemag.com">
                  </div>
                  <div class="form-group">
                    <label class="form-label">$ coverage_brief:</label>
                    <textarea id="press_message" required class="form-control" placeholder="Specify requirements, grid access needs, or scheduled media team size..."></textarea>
                  </div>
                  <button type="submit" id="press-submit" class="btn btn-primary" style="width:100%;">[ TRANSMIT_PRESS_BRIEF ]</button>
                  <div id="press-feedback" class="form-feedback"></div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;

  // Bind Tabs
  const creBtn = document.getElementById('tab-creator-btn');
  const pressBtn = document.getElementById('tab-press-btn');
  const creFormWindow = document.getElementById('creator-form-window');
  const pressFormWindow = document.getElementById('press-form-window');
  const creGuide = document.getElementById('creator-guide');
  const pressGuide = document.getElementById('press-guide');

  if (creBtn && pressBtn) {
    creBtn.onclick = () => {
      creBtn.classList.add('active');
      pressBtn.classList.remove('active');
      creFormWindow.classList.add('active');
      pressFormWindow.classList.remove('active');
      creGuide.classList.add('active');
      pressGuide.classList.remove('active');
    };
    pressBtn.onclick = () => {
      pressBtn.classList.add('active');
      creBtn.classList.remove('active');
      pressFormWindow.classList.add('active');
      creFormWindow.classList.remove('active');
      pressGuide.classList.add('active');
      creGuide.classList.remove('active');
    };
  }

  // Bind Creator Form Submit
  const creForm = document.getElementById('creator-apply-form');
  if (creForm) {
    creForm.onsubmit = async (e) => {
      e.preventDefault();
      const submit = document.getElementById('cre-submit');
      const feedback = document.getElementById('cre-feedback');
      
      submit.disabled = true;
      submit.textContent = 'TRANSMITTING CREATOR SPEC...';
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
          creForm.reset();
        } else {
          feedback.textContent = data.message || 'Registration failed. Verify requirements.';
          feedback.className = 'form-feedback error';
        }
      } catch (err) {
        feedback.textContent = 'Transmission error. Try again.';
        feedback.className = 'form-feedback error';
      } finally {
        submit.disabled = false;
        submit.textContent = '[ TRANSMIT_DOSSIER ]';
      }
    };
  }

  // Bind Press Form Submit
  const pressForm = document.getElementById('press-apply-form');
  if (pressForm) {
    pressForm.onsubmit = async (e) => {
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
          pressForm.reset();
        } else {
          feedback.textContent = data.message || 'Submission failed. Please check details.';
          feedback.className = 'form-feedback error';
        }
      } catch (err) {
        feedback.textContent = 'Transmission error. Try again.';
        feedback.className = 'form-feedback error';
      } finally {
        submit.disabled = false;
        submit.textContent = '[ TRANSMIT_PRESS_BRIEF ]';
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
          <span class="section-label">operations_vacancies.db</span>
          <h1 class="hero-title" style="font-size:clamp(1.8rem, 5vw, 3.5rem); line-height:1;">Careers</h1>
          <p style="margin-top:20px;">Join the grid logistics, safety, or design engine. We seek detail-focused curators to deliver elite, high-octane sensory motorsport experiences.</p>
        </div>

        <div id="careers-loading" style="text-align:center; color:var(--text-secondary); margin:40px 0; font-family:var(--font-header);">QUERYING VACANCIES...</div>
        <div class="careers-grid" id="jobs-container" style="display:none;"></div>
      </div>
    </section>

    <!-- Glassmorphic Modal for job application -->
    <div id="job-modal" style="position:fixed; inset:0; z-index:2000; background:rgba(0,0,0,0.85); display:none; align-items:center; justify-content:center; padding:20px; backdrop-filter:blur(8px); -webkit-backdrop-filter:blur(8px);">
      <div class="terminal-window" style="max-width:600px; width:100%; max-height:90vh; overflow-y:auto; position:relative;">
        <div class="terminal-header">
          <div class="terminal-dots">
            <span class="terminal-dot red" id="close-job-modal-dot" style="cursor:pointer;"></span>
            <span class="terminal-dot yellow"></span>
            <span class="terminal-dot green"></span>
          </div>
          <span class="terminal-title">submit_resume.sh</span>
        </div>
        <div class="terminal-body">
          <button id="close-job-modal" style="position:absolute; top:45px; right:20px; background:transparent; border:none; color:var(--accent-secondary); font-size:1.5rem; cursor:pointer;">✕</button>
          <h3 id="modal-job-title" style="font-size:1.2rem; text-transform:uppercase; margin-bottom:8px; font-family:var(--font-header); color:#fff;">Position Application</h3>
          <p id="modal-job-meta" style="font-size:0.75rem; color:var(--text-muted); margin-bottom:24px; font-family:var(--font-header);"></p>
          
          <form id="job-apply-form">
            <input type="hidden" id="modal_job_id">
            <div class="form-group">
              <label class="form-label">$ applicant_full_name:</label>
              <input type="text" id="job_full_name" required class="form-control" placeholder="e.g. Jaspreet Singh">
            </div>
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">$ email_address:</label>
                <input type="email" id="job_email" required class="form-control" placeholder="e.g. jaspreet@creative.com">
              </div>
              <div class="form-group">
                <label class="form-label">$ contact_phone:</label>
                <input type="tel" id="job_phone" required class="form-control" placeholder="e.g. +91 9999999999">
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">$ resume_pdf_url:</label>
              <input type="url" id="job_resume" required class="form-control" placeholder="https://drive.google.com/file/...">
            </div>
            <div class="form-group">
              <label class="form-label">$ portfolio_url (optional):</label>
              <input type="url" id="job_portfolio" class="form-control" placeholder="https://behance.net/username">
            </div>
            <div class="form-group">
              <label class="form-label">$ motorculture_pitch:</label>
              <textarea id="job_letter" required class="form-control" placeholder="Explain your motorsport background, logistics skills, or staging experience..."></textarea>
            </div>
            <button type="submit" id="job-submit" class="btn btn-primary" style="width:100%;">[ TRANSMIT_DOSSIER ]</button>
            <div id="job-feedback" class="form-feedback"></div>
          </form>
        </div>
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
      <div class="terminal-window career-card animate-fade-in">
        <div class="terminal-header">
          <div class="terminal-dots">
            <span class="terminal-dot red"></span>
            <span class="terminal-dot yellow"></span>
            <span class="terminal-dot green"></span>
          </div>
          <span class="terminal-title">vacancy_${job.id.substring(0, 6)}.json</span>
        </div>
        <div class="terminal-body">
          <span class="career-dept">${job.type} • ${job.location}</span>
          <h3 class="career-title">${job.title}</h3>
          <p style="font-size:0.8rem; margin-bottom:20px; line-height:1.6;">${job.description}</p>
          <div class="career-meta">
            <span>Salary: ${job.salary || 'Varies'}</span>
          </div>
          <button class="btn btn-secondary apply-job-btn" data-id="${job.id}" data-title="${job.title}" data-meta="${job.type} • ${job.location}" style="padding:8px 16px; font-size:0.7rem; width:100%;">[ APPLY_NOW ]</button>
        </div>
      </div>
    `).join('');

    // Modal Logic Bindings
    const modal = document.getElementById('job-modal');
    const closeBtn = document.getElementById('close-job-modal');
    const closeDot = document.getElementById('close-job-modal-dot');
    const modalTitle = document.getElementById('modal-job-title');
    const modalMeta = document.getElementById('modal-job-meta');
    const jobIdInput = document.getElementById('modal_job_id');
    const jobForm = document.getElementById('job-apply-form');

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
    closeDot.onclick = handleClose;

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
      submit.textContent = 'TRANSMITTING DOSSIER...';
      feedback.style.display = 'none';

      // Check if it is a mock job
      if (jobId.startsWith('mock-')) {
        setTimeout(() => {
          feedback.textContent = 'Dossier received (Simulation Mode). Staging coordinator will review soon.';
          feedback.className = 'form-feedback success';
          submit.disabled = false;
          submit.textContent = '[ TRANSMIT_DOSSIER ]';
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
          feedback.textContent = 'Application transmitted successfully. Career specialists will email you shortly.';
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
        submit.textContent = '[ TRANSMIT_DOSSIER ]';
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
          <span class="section-label">editorial_arch.idx</span>
          <h1 class="hero-title" style="font-size:clamp(1.8rem, 5vw, 3.5rem); line-height:1;">Enicilion Blog</h1>
          <p style="margin-top:20px;">Technical summaries, engineering blueprints, event reviews, and structural photography chronicles.</p>
        </div>

        <div id="blog-loading" style="text-align:center; color:var(--text-secondary); margin:40px 0; font-family:var(--font-header);">QUERYING CHRONICLES...</div>
        
        <div class="terminal-window" id="blog-terminal" style="display:none;">
          <div class="terminal-header">
            <div class="terminal-dots">
              <span class="terminal-dot red"></span>
              <span class="terminal-dot yellow"></span>
              <span class="terminal-dot green"></span>
            </div>
            <span class="terminal-title">editorial_archive.idx</span>
          </div>
          <div class="terminal-body" style="padding:0;">
            <div id="blogs-container"></div>
          </div>
        </div>
      </div>
    </section>
  `;

  const loadingEl = document.getElementById('blog-loading');
  const blogTerminal = document.getElementById('blog-terminal');
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
    blogTerminal.style.display = 'block';
    blogsContainer.innerHTML = blogs.map((post, idx) => {
      const date = new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      return `
        <div style="cursor:pointer; padding: 24px; border-bottom: ${idx === blogs.length - 1 ? 'none' : '1px solid var(--border-color)'}; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:16px; transition:var(--transition);" 
             onmouseenter="this.style.background='rgba(0, 255, 102, 0.02)';" 
             onmouseleave="this.style.background='transparent';" 
             onclick="window.history.pushState({}, '', '/blog/${post.slug}'); window.handleRouting();">
          <div>
            <span style="font-family:var(--font-header); font-size:0.7rem; color:var(--accent-secondary);">${date} • log_post_${idx + 1}</span>
            <h3 style="margin:6px 0 0 0; font-size:1.15rem; color:#fff; font-family:var(--font-header);">${post.title}</h3>
          </div>
          <p style="font-size:0.75rem; color:var(--accent); font-family:var(--font-header);">[ READ_LOG_FILE ]</p>
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
        <a href="/blog" class="nav-link" style="margin-bottom:30px; display:inline-block; font-size:0.8rem; letter-spacing:0.05em; color:var(--accent); font-family:var(--font-header);">← BACK_TO_EDITORIAL_INDEX</a>
        
        <div id="post-loading" style="text-align:center; color:var(--text-secondary); margin:40px 0; font-family:var(--font-header);">DECODING CHRONICLE...</div>
        
        <div class="terminal-window" id="post-terminal" style="display:none;">
          <div class="terminal-header">
            <div class="terminal-dots">
              <span class="terminal-dot red"></span>
              <span class="terminal-dot yellow"></span>
              <span class="terminal-dot green"></span>
            </div>
            <span class="terminal-title" id="terminal-post-slug"></span>
          </div>
          <div class="terminal-body" style="padding:40px;">
            <h1 id="post-title" class="hero-title" style="font-size:clamp(1.5rem, 5vw, 2.5rem); line-height:1.1; margin-bottom:12px; text-transform:uppercase;"></h1>
            <div id="post-date" style="font-size:0.75rem; color:var(--text-muted); text-transform:uppercase; margin-bottom:32px; border-bottom:1px solid var(--border-color); padding-bottom:12px; font-family:var(--font-header);"></div>
            
            <div id="post-body" style="line-height:1.7; color:var(--text-secondary); font-size:0.9rem;" class="markdown-body"></div>
          </div>
        </div>
      </div>
    </section>
  `;

  const loadingEl = document.getElementById('post-loading');
  const postTerminal = document.getElementById('post-terminal');
  const slugTitleEl = document.getElementById('terminal-post-slug');
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
\\[f = \\frac{6000 \\times 8}{2 \\times 60} = 400\\text{ Hz}\\]
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
\\[\\alpha_{\\text{rear}} > \\alpha_{\\text{peak}}\\]
At this junction, lateral tire grip drops off, transitioning from static friction to dynamic sliding friction. The driver must balance this drop by throttle adjustments, regulating rear tire spin speed.

### Steering and Torque Balance
Balancing the drift requires a continuous adjustment of counter-steer torque. The front wheels must guide the vehicle's vector. The rotational torque is balanced as:
\\[\\tau = I \\cdot \\ddot{\\theta}\\]
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
    postTerminal.style.display = 'block';

    slugTitleEl.textContent = `${slug}.md`;
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
        <div class="terminal-window">
          <div class="terminal-header">
            <div class="terminal-dots">
              <span class="terminal-dot red"></span>
              <span class="terminal-dot yellow"></span>
              <span class="terminal-dot green"></span>
            </div>
            <span class="terminal-title">sec_authorization.exe</span>
          </div>
          <div class="terminal-body">
            <form id="login-form">
              <h2 class="hero-title" style="font-size:1.5rem; text-transform:uppercase; margin-bottom:8px; font-family:var(--font-header); color:#fff;">Sign In</h2>
              <p style="font-size:0.75rem; color:var(--text-muted); margin-bottom:24px; font-family:var(--font-header);">Enter credentials to load staging profile data.</p>
              
              <div class="form-group">
                <label class="form-label">$ user_email:</label>
                <input type="email" id="log_email" required class="form-control" placeholder="e.g. jaspreet@domain.com">
              </div>
              <div class="form-group" style="margin-bottom:30px;">
                <label class="form-label">$ secure_password:</label>
                <input type="password" id="log_password" required class="form-control" placeholder="••••••••">
              </div>

              <button type="submit" id="login-submit" class="btn btn-primary" style="width:100%;">[ INITIALIZE_SESSION ]</button>
              <div id="login-feedback" class="form-feedback"></div>

              <div style="margin-top:24px; text-align:center; font-size:0.8rem; color:var(--text-secondary); font-family:var(--font-header);">
                No active profile? <a href="/signup" style="color:var(--accent); font-weight:700;">register_account()</a>
              </div>
            </form>
          </div>
        </div>
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
      submit.textContent = 'CHECKING DOSSIER...';
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
          feedback.textContent = data.message || 'Credentials invalid. Terminated: 401 Unauthorized.';
          feedback.className = 'form-feedback error';
        }
      } catch (err) {
        feedback.textContent = 'Connection error. Auth handshake failed.';
        feedback.className = 'form-feedback error';
      } finally {
        submit.disabled = false;
        submit.textContent = '[ INITIALIZE_SESSION ]';
      }
    };
  }
}

// 8. Signup Page (/signup)
function renderSignup(container) {
  container.innerHTML = `
    <section class="section animate-fade-in" style="padding-top:140px; min-height:80vh; display:flex; align-items:center;">
      <div class="container" style="max-width:520px; width:100%;">
        <div class="terminal-window">
          <div class="terminal-header">
            <div class="terminal-dots">
              <span class="terminal-dot red"></span>
              <span class="terminal-dot yellow"></span>
              <span class="terminal-dot green"></span>
            </div>
            <span class="terminal-title">sec_registration.exe</span>
          </div>
          <div class="terminal-body">
            <form id="signup-form">
              <h2 class="hero-title" style="font-size:1.5rem; text-transform:uppercase; margin-bottom:8px; font-family:var(--font-header); color:#fff;">Create Profile</h2>
              <p style="font-size:0.75rem; color:var(--text-muted); margin-bottom:24px; font-family:var(--font-header);">Register user variables in the staging database.</p>
              
              <div class="form-group">
                <label class="form-label">$ full_name:</label>
                <input type="text" id="reg_full_name" required class="form-control" placeholder="e.g. Jaspreet Singh">
              </div>
              <div class="form-group">
                <label class="form-label">$ email_address:</label>
                <input type="email" id="reg_email" required class="form-control" placeholder="e.g. jaspreet@domain.com">
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">$ whatsapp_number:</label>
                  <input type="tel" id="reg_whatsapp" required class="form-control" placeholder="e.g. +91 9999999999">
                </div>
                <div class="form-group">
                  <label class="form-label">$ city:</label>
                  <input type="text" id="reg_city" required class="form-control" placeholder="e.g. Chandigarh">
                </div>
              </div>
              <div class="form-group">
                <label class="form-label">$ instagram_handle (optional):</label>
                <input type="text" id="reg_instagram" class="form-control" placeholder="e.g. @username">
              </div>
              <div class="form-group" style="margin-bottom:30px;">
                <label class="form-label">$ password_string:</label>
                <input type="password" id="reg_password" required minlength="6" class="form-control" placeholder="••••••••">
              </div>

              <button type="submit" id="signup-submit" class="btn btn-primary" style="width:100%;">[ CREATE_STAGING_PROFILE ]</button>
              <div id="signup-feedback" class="form-feedback"></div>

              <div style="margin-top:24px; text-align:center; font-size:0.8rem; color:var(--text-secondary); font-family:var(--font-header);">
                Already registered? <a href="/login" style="color:var(--accent); font-weight:700;">sign_in()</a>
              </div>
            </form>
          </div>
        </div>
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
      submit.textContent = 'REGISTERING IN DATABASE...';
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
          feedback.textContent = data.message || 'Registration failed. Check specifications.';
          feedback.className = 'form-feedback error';
        }
      } catch (err) {
        feedback.textContent = 'Connection error. hand_shake() failed.';
        feedback.className = 'form-feedback error';
      } finally {
        submit.disabled = false;
        submit.textContent = '[ CREATE_STAGING_PROFILE ]';
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
        <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid var(--border-color); padding-bottom:24px; margin-bottom:48px; flex-wrap:wrap; gap:20px;">
          <div>
            <span class="section-label">user_identity_card.cfg</span>
            <h1 class="hero-title" style="font-size:clamp(1.8rem, 5vw, 2.5rem); line-height:1; text-transform:uppercase;">${auth.user.full_name}</h1>
            <p style="font-size:0.8rem; color:var(--text-secondary); margin-top:8px; font-family:var(--font-header);">role_classification: <strong style="color:var(--accent-secondary); text-transform:uppercase;">${auth.user.role}</strong></p>
          </div>
          <div style="display:flex; gap:16px;">
            <a href="/tickets" class="btn btn-primary" style="padding:10px 20px; font-size:0.7rem;">[ MY_PASSES ]</a>
            <button id="logout-btn-profile" class="btn btn-secondary" style="padding:10px 20px; font-size:0.7rem;">[ LOGOUT ]</button>
          </div>
        </div>

        <div class="form-layout">
          <div>
            <h3 style="font-size:1.2rem; text-transform:uppercase; margin-bottom:20px; font-family:var(--font-header); color:#fff;">Registered Garage Machines</h3>
            <div id="vehicles-loading" style="color:var(--text-muted); font-size:0.8rem; font-family:var(--font-header);">$ loading garage_inventory.db...</div>
            <div id="vehicles-container" style="display:flex; flex-direction:column; gap:16px; margin-top:16px;"></div>
          </div>
          <div>
            <h3 style="font-size:1.2rem; text-transform:uppercase; margin-bottom:20px; font-family:var(--font-header); color:#fff;">Upcoming Staging</h3>
            <div class="terminal-window">
              <div class="terminal-header">
                <div class="terminal-dots">
                  <span class="terminal-dot red"></span>
                  <span class="terminal-dot yellow"></span>
                  <span class="terminal-dot green"></span>
                </div>
                <span class="terminal-title">grid_scheduler.dat</span>
              </div>
              <div class="terminal-body" style="text-align:center;">
                <h4 style="font-size:0.95rem; text-transform:uppercase; color:#fff; margin-bottom:12px; font-family:var(--font-header);">Motorscape 2026 Completed</h4>
                <p style="font-size:0.8rem; margin-bottom:20px; line-height:1.6;">The HopUp Chandigarh grid showcase has completed. Stay updated for future session schedules.</p>
                <a href="/event" class="btn btn-secondary" style="font-size:0.7rem; padding:8px 16px;">[ EVENT_RECAP ]</a>
              </div>
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
        <div style="background:var(--bg-secondary); border:1px solid var(--border-color); padding:16px; border-radius:var(--border-radius); display:flex; justify-content:space-between; align-items:center; font-family:var(--font-header);">
          <div>
            <h4 style="color:#fff; font-size:0.95rem; text-transform:uppercase; margin-bottom:4px;">${v.car.year} ${v.car.make} ${v.car.model}</h4>
            <p style="font-size:0.75rem; color:var(--text-muted);">Plate: ${v.car.vin}</p>
          </div>
          <span style="font-size:0.75rem; font-weight:700; letter-spacing:0.05em; text-transform:uppercase; color:${v.status === 'approved' ? '#00ff66' : v.status === 'rejected' ? '#ff0055' : '#f1c40f'}">[${v.status}]</span>
        </div>
      `).join('');
    } else {
      vehContainer.innerHTML = `
        <div style="border:1px dashed var(--border-color); padding:32px; border-radius:var(--border-radius); text-align:center; color:var(--text-muted); font-family:var(--font-header); font-size:0.8rem;">
          No machines registered in garage.
          <a href="/apply" style="color:var(--accent); font-weight:700; display:block; margin-top:12px;">register_vehicle() →</a>
        </div>
      `;
    }
  } catch (err) {
    vehLoading.style.display = 'none';
    vehContainer.innerHTML = `<div style="color:#ff0055; font-size:0.8rem; font-family:var(--font-header);">Failed to fetch garage inventory.</div>`;
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
      <div class="container" style="max-width:800px;">
        <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid var(--border-color); padding-bottom:24px; margin-bottom:48px;">
          <div>
            <span class="section-label">gate_audit.log</span>
            <h1 class="hero-title" style="font-size:2.2rem; line-height:1; text-transform:uppercase;">Active Passes</h1>
          </div>
          <a href="/profile" class="btn btn-secondary" style="font-size:0.7rem; padding:10px 16px;">[ PROFILE ]</a>
        </div>

        <div id="tickets-loading" style="text-align:center; color:var(--text-secondary); font-family:var(--font-header);">$ querying pass_manifest.dat...</div>
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
          <div class="terminal-window">
            <div class="terminal-header">
              <div class="terminal-dots">
                <span class="terminal-dot red"></span>
                <span class="terminal-dot yellow"></span>
                <span class="terminal-dot green"></span>
              </div>
              <span class="terminal-title">ticket_${ticket.ticketCode.substring(0,8)}.dat</span>
            </div>
            <div class="terminal-body" style="display:flex; justify-content:space-between; gap:24px; flex-wrap:wrap; position:relative;">
              <div style="flex:1;">
                <span style="font-family:var(--font-header); font-size:0.7rem; font-weight:700; color:var(--accent-secondary); letter-spacing:0.1em; text-transform:uppercase;">// ${ticket.tier.name}</span>
                <h3 style="font-size:1.35rem; color:#fff; text-transform:uppercase; margin:8px 0 12px; font-family:var(--font-header);">${ticket.event.name}</h3>
                <div style="display:flex; flex-direction:column; gap:6px; font-size:0.8rem; color:var(--text-secondary); font-family:var(--font-header);">
                  <div>📅 ${eventDate}</div>
                  <div>📍 ${ticket.event.location}</div>
                  <div style="margin-top:12px; font-size:0.7rem; color:var(--text-muted); text-transform:uppercase;">Code: ${ticket.ticketCode}</div>
                </div>
              </div>

              <div style="display:flex; flex-direction:column; justify-content:space-between; align-items:flex-end; min-width:140px; font-family:var(--font-header);">
                <span style="font-size:0.7rem; font-weight:700; text-transform:uppercase; padding:4px 8px; background:rgba(0, 255, 102, 0.05); border:1px solid #00ff66; color:#00ff66; border-radius:4px;">[${ticket.status}]</span>
                
                <!-- Simulated barcode -->
                <div style="text-align:center; margin-top:20px; width:100%;">
                  <div style="height:36px; background:repeating-linear-gradient(90deg, #fff, #fff 2px, #000 2px, #000 6px); border-radius:2px; margin-bottom:8px; opacity:0.8;"></div>
                  <a href="/api/ticket-pdf/${ticket.ticketCode}" target="_blank" class="btn btn-secondary" style="font-size:0.65rem; padding:6px 12px; width:100%; text-align:center;">[ DOWNLOAD_PDF ]</a>
                </div>
              </div>
            </div>
          </div>
        `;
      }).join('');
    } else {
      containerEl.innerHTML = `
        <div style="border:1px dashed var(--border-color); padding:48px; border-radius:var(--border-radius); text-align:center; color:var(--text-muted); font-family:var(--font-header); font-size:0.8rem;">
          No spectator passes found. 
          <p style="margin-top:12px; color:var(--text-muted);">Motorscape 2026 is concluded. Keep checking for upcoming events.</p>
        </div>
      `;
    }

  } catch (err) {
    loadingEl.style.display = 'none';
    containerEl.innerHTML = `<div style="color:#ff0055; text-align:center; font-family:var(--font-header); font-size:0.8rem;">Failed to query spectator registry.</div>`;
  }
}

// Fallback Route
function renderNotFound(container) {
  container.innerHTML = `
    <section class="section animate-fade-in" style="padding-top:200px; min-height:80vh; display:flex; align-items:center; text-align:center;">
      <div class="container" style="max-width:600px;">
        <span class="section-label" style="font-size:1.5rem; letter-spacing:0.3em; margin-bottom:20px; display:block;">404</span>
        <h1 class="hero-title" style="font-size:2.5rem; line-height:1; margin-bottom:24px; font-family:var(--font-display);">STAGE_ACCESS_BLOCKED</h1>
        <p style="margin-bottom:40px;">The staging lane you requested does not exist or has been closed. Re-route to the home grid.</p>
        <a href="/" class="btn btn-primary">[ RETURN_HOME ]</a>
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
    .replace(/^### (.*$)/gim, '<h3 style="color:#fff; font-size:1.1rem; margin:24px 0 12px; text-transform:uppercase; font-family:var(--font-header);"># $1</h3>')
    .replace(/^## (.*$)/gim, '<h2 style="color:#fff; font-size:1.3rem; margin:32px 0 16px; text-transform:uppercase; font-family:var(--font-header);">## $1</h2>')
    .replace(/^# (.*$)/gim, '<h1 style="color:#fff; font-size:1.5rem; margin:36px 0 20px; text-transform:uppercase; font-family:var(--font-header);">### $1</h1>')
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
