/* ==========================================================================
   K ARCH ARCHITECTS - LUXURY DAY MODE STUDIO ENGINE (₹50k+ Agency Standard)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initPreloader();
  initHeader();
  initHeroSlider();
  initPortfolio();
  initPartners();
  initModals();
  initContactForm();
});

/* ==========================================================================
   1. SIGNATURE PRELOADER (Photo 2 & Video)
   ========================================================================== */
function initPreloader() {
  const preloader = document.getElementById('sitePreloader');
  const progressBar = document.getElementById('preloaderProgressBar');
  if (!preloader) return;

  let progress = 0;
  const startTime = Date.now();
  const duration = 1100;

  const interval = setInterval(() => {
    const elapsed = Date.now() - startTime;
    progress = Math.min(Math.round((elapsed / duration) * 100), 100);

    if (progressBar) progressBar.style.width = progress + '%';

    if (progress >= 100) {
      clearInterval(interval);
      setTimeout(() => {
        preloader.classList.add('fade-out');
      }, 200);
    }
  }, 25);

  preloader.addEventListener('click', () => {
    clearInterval(interval);
    preloader.classList.add('fade-out');
  });
}

/* ==========================================================================
   2. HEADER & CLEAN NAVIGATION
   ========================================================================== */
function initHeader() {
  const header = document.querySelector('.site-header');
  const mobileBtn = document.getElementById('mobileMenuBtn');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  if (mobileBtn && navMenu) {
    mobileBtn.addEventListener('click', () => {
      navMenu.classList.toggle('open');
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
      });
    });
  }
}

/* ==========================================================================
   3. HERO SLIDER
   ========================================================================== */
function initHeroSlider() {
  const slides = document.querySelectorAll('.hero-slide');
  const prevBtn = document.getElementById('heroPrev');
  const nextBtn = document.getElementById('heroNext');
  if (!slides.length) return;

  let currentSlide = 0;
  let slideInterval;

  function showSlide(index) {
    slides.forEach((s, i) => {
      s.classList.toggle('active', i === index);
    });
    currentSlide = index;
  }

  function nextSlide() {
    let next = (currentSlide + 1) % slides.length;
    showSlide(next);
  }

  function prevSlide() {
    let prev = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(prev);
  }

  if (nextBtn) nextBtn.addEventListener('click', () => {
    nextSlide();
    resetInterval();
  });

  if (prevBtn) prevBtn.addEventListener('click', () => {
    prevSlide();
    resetInterval();
  });

  function startInterval() {
    slideInterval = setInterval(nextSlide, 6500);
  }

  function resetInterval() {
    clearInterval(slideInterval);
    startInterval();
  }

  startInterval();
}

/* ==========================================================================
   4. PORTFOLIO ENGINE (Filter, Search, Load More, Modal)
   ========================================================================== */
let activeCategory = 'all';
let searchQuery = '';
let visibleCount = 9;

function initPortfolio() {
  renderPortfolio();

  const filterBtns = document.querySelectorAll('.portfolio-filters .filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeCategory = btn.dataset.category;
      visibleCount = 9;
      renderPortfolio();
    });
  });

  const searchInput = document.getElementById('portfolioSearch');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.toLowerCase().trim();
      visibleCount = 9;
      renderPortfolio();
    });
  }

  const loadMoreBtn = document.getElementById('loadMoreProjects');
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', () => {
      visibleCount += 9;
      renderPortfolio();
    });
  }
}

function getFilteredProjects() {
  if (typeof PORTFOLIO_PROJECTS === 'undefined') return [];

  return PORTFOLIO_PROJECTS.filter(p => {
    const matchesCat = activeCategory === 'all' || p.category === activeCategory;
    const matchesSearch = !searchQuery || 
      p.title.toLowerCase().includes(searchQuery) || 
      p.location.toLowerCase().includes(searchQuery) ||
      p.categoryName.toLowerCase().includes(searchQuery);
    return matchesCat && matchesSearch;
  });
}

function renderPortfolio() {
  const grid = document.getElementById('portfolioGrid');
  const loadMoreBtn = document.getElementById('loadMoreProjects');
  const countLabel = document.getElementById('projectCountLabel');
  if (!grid) return;

  const filtered = getFilteredProjects();
  const toShow = filtered.slice(0, visibleCount);

  if (countLabel) {
    countLabel.textContent = `Showing ${toShow.length} of ${filtered.length} Projects`;
  }

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px;">
        <h3 style="margin-bottom: 8px;">No projects found</h3>
        <p style="color: var(--text-muted);">Try adjusting your search criteria or category filter.</p>
      </div>
    `;
    if (loadMoreBtn) loadMoreBtn.style.display = 'none';
    return;
  }

  grid.innerHTML = toShow.map(project => `
    <article class="project-card" onclick="openProjectModal(${project.id})">
      <div class="project-thumb">
        <span class="project-badge-tag">${project.badge || project.type}</span>
        <img src="${project.image || project.originalImage}" alt="${project.title}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80'">
      </div>
      <div class="project-info">
        <h3 class="project-title">${project.title}</h3>
        <div class="project-location">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
          <span>${project.location}</span>
        </div>
        <div class="project-meta-row">
          <span>${project.categoryName}</span>
          <span style="color: var(--accent-color); font-weight: 600;">${project.status || 'Iconic Landmark'}</span>
        </div>
      </div>
    </article>
  `).join('');

  if (loadMoreBtn) {
    loadMoreBtn.style.display = visibleCount < filtered.length ? 'inline-flex' : 'none';
  }
}

/* ==========================================================================
   5. INTERACTIVE CATEGORIZED WORK PARTNERS & CLIENTS (User's Screenshots)
   ========================================================================== */
let activePartnerTab = 'clients';

function initPartners() {
  const tabs = document.querySelectorAll('.partner-tab-btn');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      activePartnerTab = tab.dataset.category;
      renderPartners();
    });
  });

  renderPartners();
}

function renderPartners() {
  const grid = document.getElementById('categorizedPartnersGrid');
  if (!grid || typeof PARTNERS_DATABASE === 'undefined') return;

  let itemsToRender = [];

  if (activePartnerTab === 'all') {
    Object.keys(PARTNERS_DATABASE).forEach(cat => {
      PARTNERS_DATABASE[cat].items.forEach(item => {
        itemsToRender.push({ ...item, category: PARTNERS_DATABASE[cat].badge });
      });
    });
  } else if (activePartnerTab === 'environmental_landscape') {
    ['environmental', 'landscape'].forEach(cat => {
      if (PARTNERS_DATABASE[cat]) {
        PARTNERS_DATABASE[cat].items.forEach(item => {
          itemsToRender.push({ ...item, category: PARTNERS_DATABASE[cat].badge });
        });
      }
    });
  } else if (PARTNERS_DATABASE[activePartnerTab]) {
    itemsToRender = PARTNERS_DATABASE[activePartnerTab].items.map(item => ({
      ...item,
      category: PARTNERS_DATABASE[activePartnerTab].badge
    }));
  }

  grid.innerHTML = itemsToRender.map(partner => `
    <div class="partner-card-box">
      <span class="partner-badge-chip">${partner.category}</span>
      <div class="partner-img-wrapper">
        <img src="${partner.image}" alt="${partner.name}" loading="lazy" onerror="this.parentElement.innerHTML='<div style=\'font-weight:700;color:#333;\'>${partner.name}</div>'">
      </div>
      <div class="partner-name-caption">${partner.name}</div>
    </div>
  `).join('');
}

/* ==========================================================================
   6. PROJECT MODAL (LIGHTBOX)
   ========================================================================== */
window.openProjectModal = function(id) {
  if (typeof PORTFOLIO_PROJECTS === 'undefined') return;
  const project = PORTFOLIO_PROJECTS.find(p => p.id === id);
  if (!project) return;

  const modal = document.getElementById('projectModal');
  const modalContent = document.getElementById('projectModalContent');
  if (!modal || !modalContent) return;

  modalContent.innerHTML = `
    <div style="display: grid; grid-template-columns: 1.2fr 1fr; gap: 32px; align-items: start;">
      <div style="border-radius: var(--radius-sm); overflow: hidden; background: #000; border: 1px solid var(--border-subtle); box-shadow: var(--shadow-md);">
        <img src="${project.image || project.originalImage}" alt="${project.title}" style="width: 100%; height: auto; max-height: 500px; object-fit: contain;" onerror="this.src='https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80'">
      </div>
      <div>
        <span class="section-label">${project.categoryName}</span>
        <h2 style="font-size: 2rem; margin-bottom: 10px;">${project.title}</h2>
        <div style="display: flex; align-items: center; gap: 8px; color: var(--accent-color); margin-bottom: 18px; font-weight: 600;">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
          <span>${project.location}</span>
        </div>
        
        <p style="color: var(--text-secondary); line-height: 1.7; margin-bottom: 24px;">
          Designed by <strong>K Arch Architects</strong>, under Principal Architect Ar. Pravin Eknath Khade. Seamlessly harmonizing high-rise structural aesthetics with Mumbai's climatological parameters.
        </p>

        <div style="background: var(--bg-tertiary); border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); padding: 20px; margin-bottom: 24px;">
          <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid var(--border-subtle); font-size: 0.9rem;">
            <span style="color: var(--text-muted);">Typology</span>
            <span style="font-weight: 600;">${project.type || 'High-Rise Residential'}</span>
          </div>
          <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid var(--border-subtle); font-size: 0.9rem;">
            <span style="color: var(--text-muted);">Principal Architect</span>
            <span style="font-weight: 600;">Ar. Pravin Eknath Khade</span>
          </div>
          <div style="display: flex; justify-content: space-between; padding: 8px 0; font-size: 0.9rem;">
            <span style="color: var(--text-muted);">Execution Status</span>
            <span style="font-weight: 600; color: var(--accent-color);">${project.status || 'Completed Landmark'}</span>
          </div>
        </div>

        <div style="display: flex; gap: 14px; flex-wrap: wrap;">
          <button class="btn-primary" onclick="inquireProject('${project.title}')">
            <span>Inquire About Similar Project</span>
          </button>
          <a href="https://wa.me/919820000000?text=Hello%20K%20Arch%20Architects,%20I%20am%20interested%20in%20${encodeURIComponent(project.title)}" target="_blank" class="btn-outline" style="border-color: #25d366; color: #25d366;">
            <span>WhatsApp Connect</span>
          </a>
        </div>
      </div>
    </div>
  `;

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
};

window.inquireProject = function(projectName) {
  closeAllModals();
  const contactSection = document.getElementById('contact');
  if (contactSection) {
    contactSection.scrollIntoView({ behavior: 'smooth' });
    const subjectField = document.getElementById('contactSubject');
    if (subjectField) {
      subjectField.value = `Inquiry regarding ${projectName}`;
    }
  }
};

/* ==========================================================================
   7. MODALS
   ========================================================================== */
function initModals() {
  const closeBtns = document.querySelectorAll('.modal-close-btn');
  const overlays = document.querySelectorAll('.modal-overlay');

  closeBtns.forEach(btn => btn.addEventListener('click', closeAllModals));
  overlays.forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeAllModals();
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAllModals();
  });

  const bookBtns = document.querySelectorAll('[data-open-modal="bookingModal"]');
  const bookingModal = document.getElementById('bookingModal');

  bookBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (bookingModal) {
        bookingModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });
}

function closeAllModals() {
  document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
  document.body.style.overflow = '';
}

/* ==========================================================================
   8. CONTACT FORM SUBMISSION
   ========================================================================== */
function initContactForm() {
  const contactForm = document.getElementById('mainContactForm');
  const bookingForm = document.getElementById('bookingConsultForm');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      alert("Thank you! Your architectural inquiry has been sent to Ar. Pravin Khade and the team. We will revert within 24 hours.");
      contactForm.reset();
    });
  }

  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      alert("Consultation scheduled! We will contact you to confirm your slot.");
      closeAllModals();
      bookingForm.reset();
    });
  }
}
