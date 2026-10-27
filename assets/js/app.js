/**
 * Ahmed Karaly Portfolio - Interactive App & Studio Lighting Engine
 * High-performance vanilla JavaScript application
 */

(function () {
  'use strict';

  const data = window.PORTFOLIO_DATA;
  if (!data) {
    console.error('Portfolio data not found!');
    return;
  }

  // Application State
  const state = {
    lang: 'ar',
    category: 'all',
    search: '',
    page: 1,
    perPage: 24,
    activePreset: 'studio-noir',
    lighting: {
      brightness: 106,
      contrast: 112,
      saturation: 105,
      warmth: 0,
      vignette: 22,
      glowSpread: 32,
      glowColor: 'rgba(255, 255, 255, 0.16)',
      bg: 'radial-gradient(circle at 50% 45%, #2a2e38 0%, #121418 65%, #08090b 100%)'
    },
    modalProject: null,
    splitPercent: 50
  };

  // DOM Elements cache
  const dom = {
    body: document.body,
    projectsGrid: document.getElementById('projects-grid'),
    loadMoreBtn: document.getElementById('load-more-btn'),
    projectsCountDisplay: document.getElementById('projects-count-display'),
    searchInput: document.getElementById('search-input'),
    categoryTabs: document.querySelectorAll('.tab-btn'),
    presetBtns: document.querySelectorAll('.preset-chip-btn'),
    langBtns: document.querySelectorAll('.lang-btn'),
    // Sliders
    brightnessSlider: document.getElementById('slider-brightness'),
    contrastSlider: document.getElementById('slider-contrast'),
    saturationSlider: document.getElementById('slider-saturation'),
    vignetteSlider: document.getElementById('slider-vignette'),
    valBrightness: document.getElementById('val-brightness'),
    valContrast: document.getElementById('val-contrast'),
    valSaturation: document.getElementById('val-saturation'),
    valVignette: document.getElementById('val-vignette'),
    // Modal
    modal: document.getElementById('project-modal'),
    modalClose: document.getElementById('modal-close-btn'),
    modalTitle: document.getElementById('modal-title'),
    modalClient: document.getElementById('modal-client'),
    modalDesc: document.getElementById('modal-desc'),
    modalTags: document.getElementById('modal-tags'),
    modalStageWrapper: document.getElementById('modal-stage-wrapper'),
    modalEnhancedImg: document.getElementById('modal-enhanced-img'),
    modalRawImg: document.getElementById('modal-raw-img'),
    modalSplitCurtain: document.getElementById('modal-split-curtain'),
    modalSplitHandle: document.getElementById('modal-split-handle'),
    modalBehanceBtn: document.getElementById('modal-behance-btn'),
    modalDownloadBtn: document.getElementById('modal-download-btn'),
    modalApplyAllBtn: document.getElementById('modal-apply-all-btn'),
    // Modal Sliders
    modalBrightness: document.getElementById('modal-slider-brightness'),
    modalContrast: document.getElementById('modal-slider-contrast'),
    modalSaturation: document.getElementById('modal-slider-saturation'),
    modalValBrightness: document.getElementById('modal-val-brightness'),
    modalValContrast: document.getElementById('modal-val-contrast'),
    modalValSaturation: document.getElementById('modal-val-saturation'),
    // Marquee
    marqueeTrack: document.getElementById('marquee-track'),
    // Contact Form
    contactForm: document.getElementById('contact-form')
  };

  // Translations Dictionary
  const i18n = {
    ar: {
      brandTag: 'مهندس تصميم وإنتاج معارض ودعاية وإعلان',
      navHome: 'الرئيسية',
      navProjects: 'معرض الأعمال',
      navBooths: 'أجنحة المعارض',
      navTrophies: 'الدروع والتحف',
      navPackaging: 'المنتجات والتغليف',
      navAbout: 'نبذة عني',
      navCv: 'السيرة الذاتية',
      navStudio: 'مختبر الإضاءة',
      navContact: 'تواصل معي',
      heroBadge: 'متاح للتعاقد والمشاريع الجديدة 2026',
      heroSub: 'مهندس تصميم وانتاج أجنحة معارض 3D • دعاية واعلان ودروع تذكارية • استاندات عرض ونقاط البيع والتغليف',
      heroDesc: 'أكثر من 20 عام من الخبرة الإبداعية في تصميم وانتاج الدروع التذكارية أجنحة المعارض الدولية لكبرى الشركات والوزارات في مصر والسعودية والإمارات وقطر، مع إخراج بصري واقعي وضبط احترافي للإضاءة والمواد.',
      heroCtaBrowse: 'معرض المشاريع (118 عمل)',
      heroCtaWhatsapp: 'تواصل واتساب مباشر',
      heroCtaBehance: 'ملف بيهانس (Behance)',
      heroCtaCv: 'السيرة الذاتية (CV)',
      heroCtaStudio: 'مختبر ضبط الإضاءة',
      statProjects: 'عمل موثق على Behance',
      statExp: 'عاماً من الخبرة الإبداعية',
      statViews: 'مشاهدة لأعمال المعرض',
      statGCC: 'دول عربية وغربية',
      avatarBadge: 'كبار الشخصيات والمؤسسات',
      avatarSub: 'تنفيذ أجنحة دولية ودروع سيادية',
      avatarPill: 'ضبط إضاءة الاستوديو ✦',
      marqueeTitle: 'جهات حكومية وشركات عالمية موثوقة في الخليج ومصر',
      studioTitle: 'محرك ضبط إضاءة وخلفيات الاستوديو التفاعلي',
      studioDesc: 'تحكم في تباين وسطوع وهالة خلفية صور المشاريع بتقنية المعالجة اللحظية',
      sliderBrightness: 'السطوع (Brightness)',
      sliderContrast: 'التباين (Contrast)',
      sliderSaturation: 'تشبع الألوان (Saturation)',
      sliderVignette: 'الفوكس والظلال (Vignette)',
      worksTag: 'الأعمال والمنجزات',
      worksTitle: 'معرض المشاريع الشامل (118 عملاً)',
      worksDesc: 'تصفح أعمال أجنحة المعارض ثلاثية الأبعاد، الدروع والتحف التذكارية الفاخرة، ومنصات المنتجات التجارية.',
      tabAll: 'الكل',
      tabBooths: 'أجنحة المعارض والفعاليات',
      tabTrophies: 'الدروع والتحف التذكارية',
      tabPackaging: 'المنتجات وتصميم التغليف',
      tabFeatured: 'المشاريع الكبرى المميزة',
      searchPlaceholder: 'ابحث باسم المشروع أو العميل...',
      loadMore: 'عرض المزيد من المشاريع',
      showingText: 'يتم عرض {shown} من أصل {total} عملاً',
      btnPreview: 'معاينة وتفاصيل',
      btnTune: 'ضبط الإضاءة',
      behanceLink: 'عرض في Behance ↗',
      modalBefore: 'الأصلية بدون معالجة',
      modalAfter: 'بعد ضبط الإضاءة والخلفية',
      modalApplyAll: 'تطبيق هذا الضبط على كافة صور الموقع',
      modalDownload: 'تحميل الصورة مع معالجة الإضاءة',
      modalVisitBehance: 'مشاهدة المشروع كاملاً في Behance ↗',
      aboutTag: 'الخبرة والإمكانات',
      aboutTitle: 'أحمد قرعلي | الجمع بين العمارة 3D والصناعة الفاخرة',
      aboutDesc: 'أعمل مع شركة أوت بوكس (Outbox) لتصميم وتنفيذ الأجنحة والمعارض العالمية، وأمتلك خبرة عميقة في نمذجة المواد الدقيقة (الذهب، الكريستال، الأخشاب، الإضاءات المعمارية) لتحويل الأفكار إلى واقع مهيب.',
      feat1Title: 'تصميم وبناء الأجنحة 3D',
      feat1Desc: 'دراسة كاملة لتدفق الزوار، المناطق التفاعلية، شاشات العرض، وتوزيع الإضاءة الموجهة.',
      feat2Title: 'الدروع والتحف الملكية',
      feat2Desc: 'نحت ثلاثي الأبعاد لمعالم التراث والسيادة، صب المعادن النفيسة، وقواعد الرخام الطبيعي.',
      feat3Title: 'عروض نقاط البيع والتغليف',
      feat3Desc: 'تصميم منصات عرض لمنتجات كبرى الشركات العالمية مثل ستاربكس ولورباك وكرافت.',
      feat4Title: 'الإخراج الواقعي وضبط الإضاءة',
      feat4Desc: 'معالجة فيزيائية متقدمة للإضاءة والكاميرات وانعكاسات المواد في محركات الرندر الحديثة.',
      contactTag: 'ابدأ مشروعك القادم',
      contactTitle: 'دعنا نصنع لعلامتك التجارية حضوراً استثنائياً',
      contactDesc: 'سواء كنت تخطط لجناح معرض قادم، أو ترغب في تصميم دروع تذكارية لكبار ضيوفك، أنا هنا لتحويل رؤيتك إلى واقع.',
      contactPhone: 'الهاتف / واتساب',
      contactBehance: 'ملف بيهانس الرسمي',
      contactCompany: 'الشركة الحالية',
      contactCompanyVal: 'أوت بوكس للتصميم والإنتاج',
      formName: 'الاسم الكريم',
      formEmail: 'البريد الإلكتروني',
      formService: 'نوع الخدمة المطلوبة',
      serviceOption1: 'تصميم جناح معرض أو فعالية (3D Booth)',
      serviceOption2: 'تصميم وتصنيع دروع وتحف تذكارية (VIP Trophies)',
      serviceOption3: 'تصميم منصات عرض وتغليف منتجات (POS & Packaging)',
      serviceOption4: 'استشارة وتصميم عام',
      formMsg: 'تفاصيل المشروع / الاستفسار',
      formSubmit: 'إرسال واستشارة عبر واتساب 💬',
      footerRights: 'جميع الحقوق محفوظة © 2026 | المصمم أحمد قرعلي (Ahmed Karaly) - أوت بوكس'
    },
    en: {
      brandTag: 'مهندس تصميم وإنتاج معارض ودعاية وإعلان',
      navHome: 'Home',
      navProjects: 'Portfolio',
      navBooths: 'Booths & Pavilions',
      navTrophies: 'Trophies & Awards',
      navPackaging: 'Product & Packaging',
      navAbout: 'About',
      navCv: 'CV / Resume',
      navStudio: 'Studio Lab',
      navContact: 'Contact',
      heroBadge: 'Open for Select Projects 2026',
      heroSub: 'مهندس تصميم وانتاج أجنحة معارض 3D • دعاية واعلان ودروع تذكارية • استاندات عرض ونقاط البيع والتغليف',
      heroDesc: 'أكثر من 20 عام من الخبرة الإبداعية في تصميم وانتاج الدروع التذكارية أجنحة المعارض الدولية لكبرى الشركات والوزارات في مصر والسعودية والإمارات وقطر، مع إخراج بصري واقعي وضبط احترافي للإضاءة والمواد.',
      heroCtaBrowse: 'Projects Showcase (118 Works)',
      heroCtaWhatsapp: 'Direct WhatsApp Chat',
      heroCtaBehance: 'Behance Profile',
      heroCtaCv: 'Curriculum Vitae (CV)',
      heroCtaStudio: 'Studio Lighting Lab',
      statProjects: 'Verified Works on Behance',
      statExp: 'عاماً من الخبرة الإبداعية',
      statViews: 'Portfolio Total Views',
      statGCC: 'Countries & Global Brands',
      avatarBadge: 'VIP & Sovereign Clients',
      avatarSub: 'International pavilions & commemorative awards',
      avatarPill: 'Studio Lighting Stage ✦',
      marqueeTitle: 'Trusted by Premier Governments & Global Enterprises in the GCC & Egypt',
      studioTitle: 'Interactive Studio Lighting & Backdrop Engine',
      studioDesc: 'Fine-tune image brightness, contrast, vignette, and ambient aura in real-time',
      sliderBrightness: 'Brightness',
      sliderContrast: 'Contrast',
      sliderSaturation: 'Saturation',
      sliderVignette: 'Vignette & Focus',
      worksTag: 'Showcase & Works',
      worksTitle: 'Complete Works Gallery (118 Projects)',
      worksDesc: 'Explore bespoke 3D exhibition booths, prestigious luxury trophies, and FMCG brand display structures.',
      tabAll: 'All Works',
      tabBooths: 'Exhibition & Event Booths',
      tabTrophies: 'Luxury Trophies & Souvenirs',
      tabPackaging: 'Product & Display Design',
      tabFeatured: 'Flagship Projects',
      searchPlaceholder: 'Search by project name or client...',
      loadMore: 'Load More Projects',
      showingText: 'Showing {shown} of {total} projects',
      btnPreview: 'Preview & Specs',
      btnTune: 'Tune Lighting',
      behanceLink: 'View on Behance ↗',
      modalBefore: 'Raw Original Capture',
      modalAfter: 'Enhanced Studio Lighting',
      modalApplyAll: 'Apply this lighting to all portfolio images',
      modalDownload: 'Download Enhanced Image (Canvas Render)',
      modalVisitBehance: 'Open Full Project on Behance ↗',
      aboutTag: 'Expertise & Craft',
      aboutTitle: 'Ahmed Karaly | Merging 3D Architecture with Luxury Artistry',
      aboutDesc: 'Working with Outbox for global exhibition construction, blending deep mastery in physically accurate material modeling (gold, crystal, natural marble, architectural lighting) to turn ambitious concepts into awe-inspiring realities.',
      feat1Title: '3D Booth & Pavilion Architecture',
      feat1Desc: 'Complete visitor flow ergonomics, interactive tech zones, LED video walls, and custom directional lighting rigs.',
      feat2Title: 'Commemorative Trophies & Sovereign Gifts',
      feat2Desc: 'Precision 3D sculpting of cultural landmarks, fine metal casting, gold plating, and natural marble pedestals.',
      feat3Title: 'POS Retail & Structural Packaging',
      feat3Desc: 'High-impact retail promotional displays for global leaders including Starbucks, Lurpak, and Kraft Heinz.',
      feat4Title: 'Photorealistic Studio Lighting',
      feat4Desc: 'Advanced PBR shaders, HDRI studio rigs, custom IES profiles, and filmic tone-mapping.',
      contactTag: 'Initiate Your Project',
      contactTitle: 'Let’s Create an Extraordinary Brand Experience',
      contactDesc: 'Whether preparing for a major international expo or commissioning VIP sovereign gifts, I bring your grandest visions to life.',
      contactPhone: 'Phone / WhatsApp',
      contactBehance: 'Official Behance Profile',
      contactCompany: 'Current Studio',
      contactCompanyVal: 'Outbox Design & Production',
      formName: 'Your Full Name',
      formEmail: 'Email Address',
      formService: 'Required Service',
      serviceOption1: '3D Exhibition Booth & Pavilion',
      serviceOption2: 'Luxury Trophies & VIP Souvenirs',
      serviceOption3: 'POS Displays & Product Packaging',
      serviceOption4: 'Design Consultation & General Inquiries',
      formMsg: 'Project Scope / Requirements',
      formSubmit: 'Submit & Consult via WhatsApp 💬',
      footerRights: 'All Rights Reserved © 2026 | Designer Ahmed Karaly - Outbox Studio'
    }
  };

  // Initialize
  function init() {
    renderMarquee();
    updateCategoryCounts();
    renderProjects();
    bindEvents();
    applyGlobalLighting();
    applyLanguage(state.lang);
  }

  // Marquee rendering
  function renderMarquee() {
    if (!dom.marqueeTrack || !data.clients) return;
    const clientList = [...data.clients, ...data.clients]; // duplicate for seamless loop
    dom.marqueeTrack.innerHTML = clientList.map(c => `
      <div class="client-badge-item">
        <span class="client-badge-icon">${c.logo}</span>
        <span>${state.lang === 'ar' ? c.nameAr : c.name}</span>
      </div>
    `).join('');
  }

  // Update counter badges on tabs
  function updateCategoryCounts() {
    const allCount = data.projects.length;
    const boothsCount = data.projects.filter(p => p.category === 'booths').length;
    const trophiesCount = data.projects.filter(p => p.category === 'trophies').length;
    const prodCount = data.projects.filter(p => p.category === 'production').length;
    const featCount = data.projects.filter(p => p.featured).length;

    const setCounter = (id, count) => {
      const el = document.getElementById(id);
      if (el) el.textContent = count;
    };

    setCounter('count-all', allCount);
    setCounter('count-booths', boothsCount);
    setCounter('count-trophies', trophiesCount);
    setCounter('count-packaging', prodCount);
    setCounter('count-featured', featCount);
  }

  // Filter & Search Projects
  function getFilteredProjects() {
    return data.projects.filter(p => {
      // Category filter
      let matchesCat = true;
      if (state.category === 'booths') matchesCat = (p.category === 'booths');
      else if (state.category === 'trophies') matchesCat = (p.category === 'trophies');
      else if (state.category === 'production') matchesCat = (p.category === 'production');
      else if (state.category === 'featured') matchesCat = p.featured;

      if (!matchesCat) return false;

      // Search filter
      if (state.search.trim()) {
        const q = state.search.toLowerCase().trim();
        const hay = [
          p.name,
          p.titleAr,
          p.titleEn,
          p.clientAr,
          p.clientEn,
          ...(p.tags || [])
        ].join(' ').toLowerCase();
        return hay.includes(q);
      }

      return true;
    });
  }

  // Render Projects Grid
  function renderProjects() {
    if (!dom.projectsGrid) return;

    const filtered = getFilteredProjects();
    const visibleCount = state.page * state.perPage;
    const slice = filtered.slice(0, visibleCount);

    if (slice.length === 0) {
      dom.projectsGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem; color: var(--text-muted);">
          <div style="font-size: 3rem; margin-bottom: 1rem;">🔍</div>
          <h3 style="color: var(--text-primary); margin-bottom: 0.5rem;">${state.lang === 'ar' ? 'لم يتم العثور على مشاريع مطابقة' : 'No matching projects found'}</h3>
          <p>${state.lang === 'ar' ? 'جرب البحث بكلمات أخرى أو اختر تصنيفاً مختلفاً' : 'Try searching for different keywords or pick another category'}</p>
        </div>
      `;
      if (dom.loadMoreBtn) dom.loadMoreBtn.style.display = 'none';
      if (dom.projectsCountDisplay) dom.projectsCountDisplay.textContent = '';
      return;
    }

    dom.projectsGrid.innerHTML = slice.map((p, idx) => {
      const title = state.lang === 'ar' ? p.titleAr : p.titleEn;
      const client = state.lang === 'ar' ? p.clientAr : p.clientEn;
      const desc = state.lang === 'ar' ? p.descAr : p.descEn;
      const catLabel = state.lang === 'ar' ? p.categoryAr : p.categoryEn;

      return `
        <article class="project-card" data-id="${p.id}" data-index="${idx}">
          <div class="card-studio-stage">
            <div class="stage-ambient-glow"></div>
            <img 
              class="card-image-render" 
              src="${p.imageUrl}" 
              alt="${title}" 
              loading="lazy" 
              referrerpolicy="no-referrer"
              onerror="this.onerror=null; this.src='assets/images/avatar.jpg';"
            />
            <div class="card-badges-row">
              <span class="category-badge-pill ${p.featured ? 'badge-featured' : ''}">
                ${p.featured ? '★ ' : ''}${catLabel}
              </span>
            </div>
            <div class="card-action-overlay">
              <button class="overlay-btn overlay-btn-preview" onclick="window.AhmedKaralyApp.openModal(${p.id})">
                <span>👁️</span>
                <span>${i18n[state.lang].btnPreview}</span>
              </button>
              <button class="overlay-btn overlay-btn-studio" onclick="window.AhmedKaralyApp.openStudioModal(${p.id})">
                <span>🎛️</span>
                <span>${i18n[state.lang].btnTune}</span>
              </button>
            </div>
          </div>
          <div class="card-content">
            <h3 class="card-title">${title}</h3>
            <div class="card-client">
              <span>🏛️</span>
              <span>${client}</span>
            </div>
            <p class="card-desc">${desc}</p>
            <div class="card-tags">
              ${(p.tags || []).slice(0, 3).map(t => `<span class="card-tag-pill">#${t}</span>`).join('')}
              <a href="${p.url}" target="_blank" rel="noopener noreferrer" class="card-behance-link" title="Open in Behance">
                <span>Behance</span>
                <span>↗</span>
              </a>
            </div>
          </div>
        </article>
      `;
    }).join('');

    // Update pagination controls
    if (dom.loadMoreBtn) {
      if (visibleCount < filtered.length) {
        dom.loadMoreBtn.style.display = 'inline-flex';
      } else {
        dom.loadMoreBtn.style.display = 'none';
      }
    }

    if (dom.projectsCountDisplay) {
      const template = i18n[state.lang].showingText;
      dom.projectsCountDisplay.textContent = template
        .replace('{shown}', Math.min(visibleCount, filtered.length))
        .replace('{total}', filtered.length);
    }
  }

  // Apply Global Dynamic Lighting Variables to :root
  function applyGlobalLighting() {
    const root = document.documentElement;
    root.style.setProperty('--img-brightness', `${state.lighting.brightness}%`);
    root.style.setProperty('--img-contrast', `${state.lighting.contrast}%`);
    root.style.setProperty('--img-saturate', `${state.lighting.saturation}%`);
    root.style.setProperty('--img-warmth', `${state.lighting.warmth}%`);
    root.style.setProperty('--img-vignette-opacity', `${state.lighting.vignette / 100}`);
    root.style.setProperty('--img-glow-color', state.lighting.glowColor);
    root.style.setProperty('--img-glow-spread', `${state.lighting.glowSpread}px`);
    root.style.setProperty('--studio-bg', state.lighting.bg);

    // Sync input sliders if present
    if (dom.brightnessSlider) dom.brightnessSlider.value = state.lighting.brightness;
    if (dom.contrastSlider) dom.contrastSlider.value = state.lighting.contrast;
    if (dom.saturationSlider) dom.saturationSlider.value = state.lighting.saturation;
    if (dom.vignetteSlider) dom.vignetteSlider.value = state.lighting.vignette;

    if (dom.valBrightness) dom.valBrightness.textContent = `${state.lighting.brightness}%`;
    if (dom.valContrast) dom.valContrast.textContent = `${state.lighting.contrast}%`;
    if (dom.valSaturation) dom.valSaturation.textContent = `${state.lighting.saturation}%`;
    if (dom.valVignette) dom.valVignette.textContent = `${state.lighting.vignette}%`;
  }

  // Set Preset
  function setPreset(presetId) {
    const preset = data.presets[presetId];
    if (!preset) return;

    state.activePreset = presetId;
    state.lighting.brightness = preset.brightness;
    state.lighting.contrast = preset.contrast;
    state.lighting.saturation = preset.saturation;
    state.lighting.warmth = preset.warmth || 0;
    state.lighting.vignette = preset.vignette;
    state.lighting.glowColor = preset.glowColor;
    state.lighting.glowSpread = preset.glowSpread;
    state.lighting.bg = preset.bgGradient;

    // Highlight button
    dom.presetBtns.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.preset === presetId);
    });

    applyGlobalLighting();
  }

  // Open Lightbox / Studio Modal
  function openModal(projectId, isStudioMode = false) {
    const p = data.projects.find(x => x.id === projectId);
    if (!p) return;

    state.modalProject = p;
    const title = state.lang === 'ar' ? p.titleAr : p.titleEn;
    const client = state.lang === 'ar' ? p.clientAr : p.clientEn;
    const desc = state.lang === 'ar' ? p.descAr : p.descEn;

    dom.modalTitle.textContent = title;
    dom.modalClient.textContent = `🏛️ ${client}`;
    dom.modalDesc.textContent = desc;
    dom.modalEnhancedImg.src = p.imageUrl;
    dom.modalRawImg.src = p.imageUrl;
    dom.modalBehanceBtn.href = p.url;

    // Tags
    dom.modalTags.innerHTML = (p.tags || []).map(t => `<span class="card-tag-pill">#${t}</span>`).join('');

    // Sync modal sliders with current lighting
    if (dom.modalBrightness) dom.modalBrightness.value = state.lighting.brightness;
    if (dom.modalContrast) dom.modalContrast.value = state.lighting.contrast;
    if (dom.modalSaturation) dom.modalSaturation.value = state.lighting.saturation;
    if (dom.modalValBrightness) dom.modalValBrightness.textContent = `${state.lighting.brightness}%`;
    if (dom.modalValContrast) dom.modalValContrast.textContent = `${state.lighting.contrast}%`;
    if (dom.modalValSaturation) dom.modalValSaturation.textContent = `${state.lighting.saturation}%`;

    // Reset split curtain to 50%
    setSplitCurtain(50);

    dom.modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    dom.modal.classList.remove('active');
    document.body.style.overflow = '';
    state.modalProject = null;
  }

  // Interactive Split Curtain Dragging
  function setSplitCurtain(percent) {
    percent = Math.max(0, Math.min(100, percent));
    state.splitPercent = percent;
    if (dom.modalSplitCurtain) {
      dom.modalSplitCurtain.style.width = `${percent}%`;
    }
    if (dom.modalSplitHandle) {
      dom.modalSplitHandle.style.left = `${percent}%`;
    }
  }

  // Download Enhanced Render with Studio Lighting via HTML5 Canvas
  function downloadEnhancedCanvas() {
    if (!state.modalProject) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.referrerPolicy = 'no-referrer';
    img.src = state.modalProject.imageUrl;

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = img.naturalWidth || 1200;
      canvas.height = img.naturalHeight || 900;

      // Draw studio backdrop
      const grad = ctx.createRadialGradient(
        canvas.width * 0.5, canvas.height * 0.45, 10,
        canvas.width * 0.5, canvas.height * 0.45, canvas.width * 0.7
      );
      grad.addColorStop(0, '#2a2e38');
      grad.addColorStop(0.65, '#121418');
      grad.addColorStop(1, '#08090b');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Apply Filter
      ctx.filter = `brightness(${state.lighting.brightness}%) contrast(${state.lighting.contrast}%) saturate(${state.lighting.saturation}%) sepia(${state.lighting.warmth}%)`;

      // Draw image
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // Reset filter for vignette overlay
      ctx.filter = 'none';
      const vigGrad = ctx.createRadialGradient(
        canvas.width * 0.5, canvas.height * 0.5, canvas.width * 0.25,
        canvas.width * 0.5, canvas.height * 0.5, canvas.width * 0.65
      );
      vigGrad.addColorStop(0, 'rgba(0,0,0,0)');
      vigGrad.addColorStop(1, `rgba(0,0,0,${state.lighting.vignette / 100})`);
      ctx.fillStyle = vigGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Trigger download
      const link = document.createElement('a');
      link.download = `Ahmed_Karaly_${state.modalProject.name.replace(/\s+/g, '_')}_Studio_Enhanced.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    };

    img.onerror = () => {
      // Direct fallback to image link
      window.open(state.modalProject.imageUrl, '_blank');
    };
  }

  // Switch Language
  function applyLanguage(lang) {
    state.lang = lang;
    document.documentElement.lang = lang;
    document.body.dir = (lang === 'ar' ? 'rtl' : 'ltr');

    // Update active lang button
    dom.langBtns.forEach(btn => {
      btn.textContent = (lang === 'ar' ? 'English' : 'العربية');
    });

    const dict = i18n[lang];

    // Helper to translate by element ID or data-i18n attribute
    const updateText = (selector, text) => {
      const el = document.querySelector(selector);
      if (el) el.textContent = text;
    };

    updateText('.brand-tag', dict.brandTag);
    updateText('#nav-home', dict.navHome);
    updateText('#nav-projects', dict.navProjects);
    updateText('#nav-booths', dict.navBooths);
    updateText('#nav-trophies', dict.navTrophies);
    updateText('#nav-packaging', dict.navPackaging);
    updateText('#nav-about', dict.navAbout);
    updateText('#nav-cv-text', dict.navCv);
    updateText('#nav-studio', dict.navStudio);
    updateText('#nav-contact', dict.navContact);

    updateText('#hero-badge-text', dict.heroBadge);
    updateText('#hero-subtitle-text', dict.heroSub);
    updateText('#hero-desc-text', dict.heroDesc);
    updateText('#hero-cta-browse-text', dict.heroCtaBrowse);
    updateText('#hero-cta-whatsapp-text', dict.heroCtaWhatsapp);
    updateText('#hero-cta-behance-text', dict.heroCtaBehance);
    updateText('#hero-cta-cv', dict.heroCtaCv);
    updateText('#hero-cta-studio-text', dict.heroCtaStudio);

    updateText('#stat-label-projects', dict.statProjects);
    updateText('#stat-label-exp', dict.statExp);
    updateText('#stat-label-views', dict.statViews);
    updateText('#stat-label-gcc', dict.statGCC);

    updateText('#avatar-badge-title', dict.avatarBadge);
    updateText('#avatar-badge-sub', dict.avatarSub);
    updateText('#avatar-pill-text', dict.avatarPill);

    updateText('#clients-heading', dict.marqueeTitle);
    updateText('#studio-engine-title', dict.studioTitle);
    updateText('#studio-engine-desc', dict.studioDesc);

    updateText('#label-brightness', dict.sliderBrightness);
    updateText('#label-contrast', dict.sliderContrast);
    updateText('#label-saturation', dict.sliderSaturation);
    updateText('#label-vignette', dict.sliderVignette);

    updateText('#works-tag', dict.worksTag);
    updateText('#works-title', dict.worksTitle);
    updateText('#works-desc', dict.worksDesc);

    updateText('#tab-text-all', dict.tabAll);
    updateText('#tab-text-booths', dict.tabBooths);
    updateText('#tab-text-trophies', dict.tabTrophies);
    updateText('#tab-text-packaging', dict.tabPackaging);
    updateText('#tab-text-featured', dict.tabFeatured);

    if (dom.searchInput) dom.searchInput.placeholder = dict.searchPlaceholder;
    if (dom.loadMoreBtn) dom.loadMoreBtn.textContent = dict.loadMore;

    updateText('#split-label-before', dict.modalBefore);
    updateText('#split-label-after', dict.modalAfter);
    updateText('#modal-apply-all-btn', dict.modalApplyAll);
    updateText('#modal-download-btn', dict.modalDownload);
    updateText('#modal-behance-btn', dict.modalVisitBehance);

    updateText('#about-tag', dict.aboutTag);
    updateText('#about-title', dict.aboutTitle);
    updateText('#about-desc', dict.aboutDesc);
    updateText('#feat1-title', dict.feat1Title);
    updateText('#feat1-desc', dict.feat1Desc);
    updateText('#feat2-title', dict.feat2Title);
    updateText('#feat2-desc', dict.feat2Desc);
    updateText('#feat3-title', dict.feat3Title);
    updateText('#feat3-desc', dict.feat3Desc);
    updateText('#feat4-title', dict.feat4Title);
    updateText('#feat4-desc', dict.feat4Desc);

    updateText('#contact-tag', dict.contactTag);
    updateText('#contact-title', dict.contactTitle);
    updateText('#contact-desc', dict.contactDesc);
    updateText('#contact-phone-label', dict.contactPhone);
    updateText('#contact-behance-label', dict.contactBehance);
    updateText('#contact-company-label', dict.contactCompany);
    updateText('#contact-company-val', dict.contactCompanyVal);

    updateText('#label-form-name', dict.formName);
    updateText('#label-form-email', dict.formEmail);
    updateText('#label-form-service', dict.formService);
    updateText('#label-form-msg', dict.formMsg);
    updateText('#btn-form-submit', dict.formSubmit);
    updateText('#footer-rights-text', dict.footerRights);

    // Re-render marquee and grid with new language
    renderMarquee();
    renderProjects();
  }

  // Event Listeners
  function bindEvents() {
    // Scroll header styling
    window.addEventListener('scroll', () => {
      const header = document.querySelector('.site-header');
      if (header) {
        header.classList.toggle('scrolled', window.scrollY > 40);
      }
    });

    // Preset buttons
    dom.presetBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        setPreset(btn.dataset.preset);
      });
    });

    // Language toggle
    dom.langBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        applyLanguage(state.lang === 'ar' ? 'en' : 'ar');
      });
    });

    // Category Tabs
    dom.categoryTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        dom.categoryTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        state.category = tab.dataset.category;
        state.page = 1; // reset pagination
        renderProjects();
      });
    });

    // Search input
    if (dom.searchInput) {
      dom.searchInput.addEventListener('input', (e) => {
        state.search = e.target.value;
        state.page = 1;
        renderProjects();
      });
    }

    // Load More Button
    if (dom.loadMoreBtn) {
      dom.loadMoreBtn.addEventListener('click', () => {
        state.page++;
        renderProjects();
      });
    }

    // Quick Sliders in Studio Bar
    const bindSlider = (slider, key, valEl) => {
      if (!slider) return;
      slider.addEventListener('input', (e) => {
        const val = parseInt(e.target.value, 10);
        state.lighting[key] = val;
        if (valEl) valEl.textContent = `${val}%`;
        applyGlobalLighting();
      });
    };

    bindSlider(dom.brightnessSlider, 'brightness', dom.valBrightness);
    bindSlider(dom.contrastSlider, 'contrast', dom.valContrast);
    bindSlider(dom.saturationSlider, 'saturation', dom.valSaturation);
    bindSlider(dom.vignetteSlider, 'vignette', dom.valVignette);

    // Modal Sliders
    const bindModalSlider = (slider, key, valEl) => {
      if (!slider) return;
      slider.addEventListener('input', (e) => {
        const val = parseInt(e.target.value, 10);
        state.lighting[key] = val;
        if (valEl) valEl.textContent = `${val}%`;
        applyGlobalLighting();
      });
    };

    bindModalSlider(dom.modalBrightness, 'brightness', dom.modalValBrightness);
    bindModalSlider(dom.modalContrast, 'contrast', dom.modalValContrast);
    bindModalSlider(dom.modalSaturation, 'saturation', dom.modalValSaturation);

    // Modal Close
    if (dom.modalClose) dom.modalClose.addEventListener('click', closeModal);
    if (dom.modal) {
      dom.modal.addEventListener('click', (e) => {
        if (e.target === dom.modal) closeModal();
      });
    }

    // CV Modal Backdrop Close
    const cvModalEl = document.getElementById('cv-modal');
    if (cvModalEl) {
      cvModalEl.addEventListener('click', (e) => {
        if (e.target === cvModalEl) closeCvModal();
      });
    }

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (dom.modal && dom.modal.classList.contains('active')) closeModal();
        if (cvModalEl && cvModalEl.classList.contains('active')) closeCvModal();
      }
    });

    // Modal Split Curtain Dragging
    if (dom.modalStageWrapper) {
      let isDragging = false;

      const handleMove = (clientX) => {
        const rect = dom.modalStageWrapper.getBoundingClientRect();
        const offsetX = clientX - rect.left;
        const percent = (offsetX / rect.width) * 100;
        setSplitCurtain(percent);
      };

      dom.modalStageWrapper.addEventListener('mousedown', (e) => {
        isDragging = true;
        handleMove(e.clientX);
      });

      window.addEventListener('mousemove', (e) => {
        if (isDragging) handleMove(e.clientX);
      });

      window.addEventListener('mouseup', () => {
        isDragging = false;
      });

      // Touch events
      dom.modalStageWrapper.addEventListener('touchstart', (e) => {
        if (e.touches.length > 0) handleMove(e.touches[0].clientX);
      }, { passive: true });

      dom.modalStageWrapper.addEventListener('touchmove', (e) => {
        if (e.touches.length > 0) handleMove(e.touches[0].clientX);
      }, { passive: true });
    }

    // Modal Download button
    if (dom.modalDownloadBtn) {
      dom.modalDownloadBtn.addEventListener('click', downloadEnhancedCanvas);
    }

    // Modal Apply to All button
    if (dom.modalApplyAllBtn) {
      dom.modalApplyAllBtn.addEventListener('click', () => {
        applyGlobalLighting();
        const origText = dom.modalApplyAllBtn.textContent;
        dom.modalApplyAllBtn.textContent = state.lang === 'ar' ? '✓ تم تطبيق الإعدادات بنجاح!' : '✓ Applied Successfully!';
        setTimeout(() => {
          dom.modalApplyAllBtn.textContent = origText;
        }, 2000);
      });
    }

    // Contact Form to WhatsApp
    if (dom.contactForm) {
      dom.contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('form-name')?.value || '';
        const email = document.getElementById('form-email')?.value || '';
        const service = document.getElementById('form-service')?.value || '';
        const msg = document.getElementById('form-msg')?.value || '';

        const whatsappText = `مرحباً أ. أحمد قرعلي،%0Aأنا ${encodeURIComponent(name)} (${encodeURIComponent(email)}).%0Aأرغب في الاستفسار عن: ${encodeURIComponent(service)}.%0Aتفاصيل المشروع: ${encodeURIComponent(msg)}`;
        const whatsappUrl = `https://wa.me/201030771069?text=${whatsappText}`;
        window.open(whatsappUrl, '_blank');
      });
    }

    // Mobile nav toggle
    const mobileToggle = document.getElementById('mobile-toggle');
    const navLinksContainer = document.getElementById('nav-links');
    if (mobileToggle && navLinksContainer) {
      mobileToggle.addEventListener('click', () => {
        const isOpen = navLinksContainer.style.display === 'flex';
        navLinksContainer.style.display = isOpen ? 'none' : 'flex';
        if (!isOpen) {
          navLinksContainer.style.flexDirection = 'column';
          navLinksContainer.style.position = 'absolute';
          navLinksContainer.style.top = '74px';
          navLinksContainer.style.left = '0';
          navLinksContainer.style.right = '0';
          navLinksContainer.style.background = '#0a0c10';
          navLinksContainer.style.padding = '1.5rem';
          navLinksContainer.style.borderBottom = '1px solid var(--border-subtle)';
        }
      });

      // Close mobile menu when clicking any nav link
      navLinksContainer.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
          if (window.innerWidth <= 768) {
            navLinksContainer.style.display = 'none';
          }
        });
      });
    }
  }

  // Public API exposed for onclick handlers
  
  function openCvModal() {
    const cvModal = document.getElementById('cv-modal');
    if (cvModal) {
      cvModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeCvModal() {
    const cvModal = document.getElementById('cv-modal');
    if (cvModal) {
      cvModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  window.AhmedKaralyApp = {
    openCvModal,
    closeCvModal,
    openModal,
    openStudioModal: (id) => openModal(id, true),
    closeModal,
    setPreset,
    applyLanguage
  };

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
