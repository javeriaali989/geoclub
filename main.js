// GeoClub - B2B Industrial Network Platform Logic

const marketplaceData = [
  {
    id: 'pv-inverter',
    category: 'products',
    tag: 'Solar equipment',
    image: 'https://images.unsplash.com/photo-1786913507836-ee983eac9351?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    title: '100 kW Commercial PV Inverter',
    description: 'Grid-ready three-phase inverter engineered for commercial energy systems.',
    company: 'Solis Industrial',
    location: 'Munich, Germany',
    verified: true
  },
  {
    id: 'substation-epc',
    category: 'services',
    tag: 'EPC Services',
    image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    title: 'Turnkey High-Voltage Substation EPC',
    description: 'Engineering, procurement, and construction for utility-scale grid interconnects.',
    company: 'Apex Engineering',
    location: 'Hamburg, Germany',
    verified: true
  },
  {
    id: 'scada-automation',
    category: 'software',
    tag: 'Industrial IoT',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    title: 'NexFlow SCADA & Asset Intelligence Platform',
    description: 'Real-time telemetry, predictive maintenance, and energy optimization suite.',
    company: 'Nexora Technologies',
    location: 'Singapore',
    verified: true
  }
];

// Document Ready
document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initMarketplace();
  initSearch();
  initModals();
  initOpportunityActions();
});

// ==========================================================================
// 1. Navigation & Mobile Menu
// ==========================================================================
function initNavigation() {
  const menuToggle = document.getElementById('menu-toggle-btn');
  const nav = document.getElementById('main-nav');

  if (menuToggle && nav) {
    menuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      nav.classList.toggle('nav--open');
    });

    document.addEventListener('click', (e) => {
      if (!nav.contains(e.target) && !menuToggle.contains(e.target)) {
        nav.classList.remove('nav--open');
      }
    });

    nav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', (e) => {
        nav.classList.remove('nav--open');

        // Check if category link (Products, Services, Software)
        const category = link.getAttribute('data-nav-category');
        if (category) {
          const tabBtn = document.querySelector(`.tabs .tab[data-category="${category}"]`);
          if (tabBtn) {
            tabBtn.click();
          }
        }

        // Check special actions (talent, newsroom)
        const action = link.getAttribute('data-nav-action');
        if (action === 'talent') {
          showToast('Industrial Jobs & Talent: Browse active engineering and procurement contracts below.');
        } else if (action === 'newsroom') {
          e.preventDefault();
          showToast('GeoClub Newsroom: Access market intelligence, energy reports, and network updates.');
        } else if (link.getAttribute('href') === '#') {
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      });
    });
  }

  // Active navigation highlight on scroll
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;
    sections.forEach((current) => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 100;
      const sectionId = current.getAttribute('id');
      const navLink = document.querySelector(`.nav a[href*="${sectionId}"]`);
      if (navLink) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          navLink.classList.add('active');
        } else {
          navLink.classList.remove('active');
        }
      }
    });
  });
}

// ==========================================================================
// 2. Marketplace Tabs & Filtering
// ==========================================================================
function initMarketplace() {
  const tabs = document.querySelectorAll('.tabs .tab');
  const container = document.getElementById('listing-container');

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => {
        t.classList.remove('tab--active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('tab--active');
      tab.setAttribute('aria-selected', 'true');

      const category = tab.getAttribute('data-category');
      renderMarketplace(category, container);
    });
  });

  // Attach event delegation for request quote buttons
  if (container) {
    container.addEventListener('click', (e) => {
      const btn = e.target.closest('.btn-request-quote');
      if (btn) {
        const product = btn.getAttribute('data-product');
        const company = btn.getAttribute('data-company');
        openQuoteModal(product, company);
      }
    });
  }
}

function renderMarketplace(category, container) {
  if (!container) return;

  const filtered = category === 'all' 
    ? marketplaceData 
    : marketplaceData.filter((item) => item.category === category);

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="empty-listing" style="grid-column: 1 / -1; padding: 40px; text-align: center; border: 1px dashed var(--line); border-radius: 8px;">
        <strong style="color: var(--navy); display: block; margin-bottom: 6px;">No solutions found</strong>
        <span style="color: var(--muted); font-size: 12px;">We are verifying more suppliers in this category.</span>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map((item) => `
    <article class="listing-card" data-category="${item.category}">
      <div class="listing-card__image">
        <img alt="${escapeHtml(item.title)}" src="${item.image}" />
        <span>${escapeHtml(item.tag)}</span>
      </div>
      <div class="listing-card__body">
        <div class="verified">
          <svg aria-hidden="true" fill="none" height="15" viewBox="0 0 24 24" width="15">
            <g stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.7">
              <path d="m12 3 2.2 1.4 2.6-.1.9 2.4 2.1 1.6-.7 2.5.7 2.5-2.1 1.6-.9 2.4-2.6-.1L12 21l-2.2-1.8-2.6.1-.9-2.4-2.1-1.6.7-2.5-.7-2.5 2.1-1.6.9-2.4 2.6.1Z"></path>
              <path d="m9 12 2 2 4-4"></path>
            </g>
          </svg>
          Verified supplier
        </div>
        <h3>${escapeHtml(item.title)}</h3>
        <p>${escapeHtml(item.description)}</p>
        <div class="listing-card__company">
          <span>${escapeHtml(item.company)}</span>
          <small>${escapeHtml(item.location)}</small>
        </div>
        <button type="button" class="btn-request-quote" data-product="${escapeHtml(item.title)}" data-company="${escapeHtml(item.company)}">
          Request quote
          <svg aria-hidden="true" fill="none" height="16" viewBox="0 0 24 24" width="16">
            <g stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.7">
              <path d="M5 12h14m-5-5 5 5-5 5"></path>
            </g>
          </svg>
        </button>
      </div>
    </article>
  `).join('');
}

// ==========================================================================
// 3. Search Bar & Popular Tags
// ==========================================================================
function initSearch() {
  const searchInput = document.getElementById('search-input');
  const searchForm = document.getElementById('hero-search-form');
  const popularTags = document.querySelectorAll('.popular-tag');

  popularTags.forEach((tag) => {
    tag.addEventListener('click', () => {
      const text = tag.getAttribute('data-tag');
      if (searchInput) {
        searchInput.value = text;
        searchInput.focus();
        showToast(`Filtered for "${text}"`);
        // Smooth scroll to marketplace
        const marketplace = document.getElementById('marketplace');
        if (marketplace) {
          marketplace.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });

  if (searchForm) {
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const val = searchInput ? searchInput.value.trim() : '';
      if (val) {
        showToast(`Searching GeoClub network for: "${val}"`);
        const marketplace = document.getElementById('marketplace');
        if (marketplace) {
          marketplace.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        showToast('Please type a search query or select a category');
      }
    });
  }
}

// ==========================================================================
// 4. Modals (Quote, Post Opportunity, Auth)
// ==========================================================================
function initModals() {
  const closeButtons = document.querySelectorAll('[data-close-modal]');
  const backdrops = document.querySelectorAll('.modal-backdrop');

  closeButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      backdrops.forEach((b) => b.classList.remove('is-open'));
    });
  });

  backdrops.forEach((backdrop) => {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) {
        backdrop.classList.remove('is-open');
      }
    });
  });

  // Quote form submission
  const quoteForm = document.getElementById('quote-form');
  if (quoteForm) {
    quoteForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const prod = document.getElementById('quote-product').value;
      document.getElementById('quote-modal').classList.remove('is-open');
      showToast(`RFQ successfully submitted for "${prod}". Supplier notified!`);
      quoteForm.reset();
    });
  }

  // Opportunity form submission
  const oppForm = document.getElementById('opportunity-form');
  if (oppForm) {
    oppForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const title = document.getElementById('opp-title').value;
      const type = document.getElementById('opp-type').value;
      const region = document.getElementById('opp-region').value;

      document.getElementById('opportunity-modal').classList.remove('is-open');
      showToast(`Opportunity "${title}" published to global network!`);

      // Prepend opportunity card dynamically to the list
      const list = document.querySelector('.opportunity-list');
      if (list) {
        const newCard = document.createElement('article');
        newCard.className = 'opportunity-card';
        newCard.innerHTML = `
          <span class="opportunity-card__tag">${escapeHtml(type)}</span>
          <div>
            <small>${escapeHtml(type)} · Just posted</small>
            <h3>${escapeHtml(title)}</h3>
            <p>Your Organization <span></span> ${escapeHtml(region)}</p>
          </div>
          <button aria-label="View ${escapeHtml(title)}" type="button" class="btn-view-opp" data-title="${escapeHtml(title)}">
            <svg aria-hidden="true" fill="none" height="20" viewBox="0 0 24 24" width="20">
              <g stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.7">
                <path d="M5 12h14m-5-5 5 5-5 5"></path>
              </g>
            </svg>
          </button>
        `;
        list.prepend(newCard);
      }

      oppForm.reset();
    });
  }

  // Post Opportunity triggers
  const btnPostOpp = document.getElementById('btn-post-opportunity');
  const utilityPostBtn = document.getElementById('utility-post-btn');
  if (btnPostOpp) {
    btnPostOpp.addEventListener('click', () => {
      document.getElementById('opportunity-modal').classList.add('is-open');
    });
  }
  if (utilityPostBtn) {
    utilityPostBtn.addEventListener('click', (e) => {
      e.preventDefault();
      document.getElementById('opportunity-modal').classList.add('is-open');
    });
  }

  // Auth Modal triggers
  const signInBtn = document.getElementById('header-signin-btn');
  const joinBtn = document.getElementById('header-join-btn');
  const ctaSupplier = document.getElementById('cta-join-supplier');
  const ctaBuyer = document.getElementById('cta-join-buyer');

  if (signInBtn) {
    signInBtn.addEventListener('click', () => {
      openAuthModal('Sign In', 'Sign in to GeoClub', 'Access your verified industrial network workspace.');
    });
  }

  if (joinBtn) {
    joinBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openAuthModal('Create Account', 'Join GeoClub Free', 'Connect with verified buyers and suppliers across 142 countries.');
    });
  }

  if (ctaSupplier) {
    ctaSupplier.addEventListener('click', (e) => {
      e.preventDefault();
      openAuthModal('Supplier Registration', 'Join as a Verified Supplier', 'Put your products and services in front of active buyers.');
    });
  }

  if (ctaBuyer) {
    ctaBuyer.addEventListener('click', (e) => {
      e.preventDefault();
      openAuthModal('Buyer Registration', 'Join as a Qualified Buyer', 'Post RFQs and source directly from proven manufacturers.');
    });
  }

  const authForm = document.getElementById('auth-form');
  if (authForm) {
    authForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('auth-email').value;
      document.getElementById('auth-modal').classList.remove('is-open');
      showToast(`Welcome! Logged in as ${email}`);
      authForm.reset();
    });
  }

  // Language switch
  const langBtn = document.getElementById('lang-switch-btn');
  if (langBtn) {
    langBtn.addEventListener('click', () => {
      showToast('GeoClub supports English, German, Arabic, French, and Spanish.');
    });
  }
}

function openQuoteModal(productTitle, companyName) {
  const modal = document.getElementById('quote-modal');
  const inputProd = document.getElementById('quote-product');
  const subtitle = document.getElementById('quote-modal-subtitle');

  if (modal && inputProd) {
    inputProd.value = `${productTitle} (${companyName})`;
    if (subtitle) {
      subtitle.textContent = `Direct RFQ sent to ${companyName}. Verified response within 24h.`;
    }
    modal.classList.add('is-open');
  }
}

function openAuthModal(eyebrow, title, subtitle) {
  const modal = document.getElementById('auth-modal');
  if (modal) {
    document.getElementById('auth-modal-eyebrow').textContent = eyebrow;
    document.getElementById('auth-modal-title').textContent = title;
    document.getElementById('auth-modal-subtitle').textContent = subtitle;
    modal.classList.add('is-open');
  }
}

// ==========================================================================
// 5. Opportunity Details Action
// ==========================================================================
function initOpportunityActions() {
  document.addEventListener('click', (e) => {
    const oppBtn = e.target.closest('.btn-view-opp');
    if (oppBtn) {
      const title = oppBtn.getAttribute('data-title');
      showToast(`Opening specifications for "${title}"`);
    }

    const compLink = e.target.closest('.company-link');
    if (compLink) {
      e.preventDefault();
      const company = compLink.getAttribute('data-company');
      openAuthModal('Verified Profile', `${company} Profile`, 'Sign in or join free to view complete audit, certifications, and project history.');
    }
  });
}

// ==========================================================================
// 6. Toast Notification Helper
// ==========================================================================
function showToast(message) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <svg aria-hidden="true" fill="none" height="16" viewBox="0 0 24 24" width="16" stroke="#42a8df" stroke-width="2">
      <path stroke-linecap="round" stroke-linejoin="round" d="M12 3 5 6v5c0 5 3 8 7 10 4-2 7-5 7-10V6Z"></path>
      <path stroke-linecap="round" stroke-linejoin="round" d="m9 12 2 2 4-4"></path>
    </svg>
    <span>${escapeHtml(message)}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.transition = 'opacity 0.3s, transform 0.3s';
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
}
