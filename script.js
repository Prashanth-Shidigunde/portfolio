// Configuration
const TOTAL_FRAMES = 140;
const FRAME_PATH = (index) =>
  `./ezgif-21793f97c03bafcb-jpg/ezgif-frame-${String(index).padStart(3, '0')}.jpg`;

// WhatsApp CTA Configuration (Enter phone number with country code e.g. "919876543210" or leave empty)
const WHATSAPP_NUMBER = "916304834605"; 
const WHATSAPP_MESSAGE = "Hi Pulse_Blend_Media, I have a custom requirement and would like to discuss my project.";

// DOM Elements
const canvas = document.getElementById('frame-canvas');
const ctx = canvas.getContext('2d', { alpha: false });
const loader = document.getElementById('loader');
const loaderBar = document.getElementById('loader-bar');

// Image Cache & State
const images = [];
let loadedCount = 0;
let targetFrameIndex = 0;
let currentFrameIndex = 0;
let lastRenderedFrame = -1;
const scrollLerpFactor = 0.15; // Smooth scroll inertia response speed

// Projects Data Structure (Easy to edit title, category, description, image, and link later)
const projectsData = [
  {
    id: "01",
    title: "Visual Story — 01",
    category: "VIDEO",
    description: "Creative video concept prepared as a placeholder for future work.",
    image: "", // Insert image URL here when available
    tag: "VIDEO",
    link: "#"
  },
  {
    id: "02",
    title: "Visual Study — 02",
    category: "PHOTO",
    description: "Photography and image-editing concept. Final project content will be added later.",
    image: "", // Insert image URL here when available
    tag: "PHOTO",
    link: "#"
  },
  {
    id: "03",
    title: "Production Story — 03",
    category: "SHOOTING",
    description: "Indoor and outdoor production concept reserved for a future project.",
    image: "", // Insert image URL here when available
    tag: "SHOOTING",
    link: "#"
  },
  {
    id: "04",
    title: "Digital Space — 04",
    category: "WEBSITE",
    description: "Website concept placeholder for a future digital experience.",
    image: "", // Insert image URL here when available
    tag: "WEBSITE",
    link: "#"
  },
  {
    id: "05",
    title: "Brand Direction — 05",
    category: "BRANDING",
    description: "Brand identity concept placeholder for upcoming creative work.",
    image: "", // Insert image URL here when available
    tag: "BRANDING",
    link: "#"
  },
  {
    id: "06",
    title: "Creative Frame — 06",
    category: "DESIGN",
    description: "Visual design exploration reserved for a future project.",
    image: "", // Insert image URL here when available
    tag: "DESIGN",
    link: "#"
  },
  {
    id: "07",
    title: "Motion Experiment — 07",
    category: "VIDEO",
    description: "Motion and editing experiment placeholder.",
    image: "", // Insert image URL here when available
    tag: "VIDEO",
    link: "#"
  },
  {
    id: "08",
    title: "Creative Concept — 08",
    category: "OTHER",
    description: "A flexible placeholder for a future creative project.",
    image: "", // Insert image URL here when available
    tag: "OTHER",
    link: "#"
  }
];

// Resize Canvas for High DPI
function resizeCanvas() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.floor(window.innerWidth * dpr);
  canvas.height = Math.floor(window.innerHeight * dpr);
  
  if (lastRenderedFrame >= 0) {
    renderFrame(lastRenderedFrame);
  }
}

// Calculate cover fit and render image. Returns true if successfully drawn.
function renderFrame(index) {
  const img = images[index];
  if (!img || !img.complete || img.naturalWidth === 0) {
    return false;
  }

  const canvasWidth = canvas.width;
  const canvasHeight = canvas.height;
  const imgWidth = img.naturalWidth;
  const imgHeight = img.naturalHeight;

  const imgRatio = imgWidth / imgHeight;
  const canvasRatio = canvasWidth / canvasHeight;

  let drawWidth, drawHeight, offsetX, offsetY;

  if (canvasRatio > imgRatio) {
    drawWidth = canvasWidth;
    drawHeight = canvasWidth / imgRatio;
    offsetX = 0;
    offsetY = (canvasHeight - drawHeight) / 2;
  } else {
    drawWidth = canvasHeight * imgRatio;
    drawHeight = canvasHeight;
    offsetX = (canvasWidth - drawWidth) / 2;
    offsetY = 0;
  }

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
  return true;
}

// Update scroll progress and target frame index
function updateScrollProgress() {
  const scrollTop = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;
  const docHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
  const maxScroll = Math.max(1, docHeight - window.innerHeight);
  const progress = Math.max(0, Math.min(1, scrollTop / maxScroll));
  targetFrameIndex = progress * (TOTAL_FRAMES - 1);
}

// Animation loop with linear interpolation (lerp)
function animate() {
  const diff = targetFrameIndex - currentFrameIndex;
  
  if (Math.abs(diff) > 0.0001) {
    currentFrameIndex += diff * scrollLerpFactor;
  } else {
    currentFrameIndex = targetFrameIndex;
  }

  const frameToRender = Math.min(
    TOTAL_FRAMES - 1,
    Math.max(0, Math.round(currentFrameIndex))
  );

  // Render if frame changed or previous draw attempt returned false
  if (frameToRender !== lastRenderedFrame) {
    if (renderFrame(frameToRender)) {
      lastRenderedFrame = frameToRender;
    }
  }

  requestAnimationFrame(animate);
}

// Preload Images
function preloadImages() {
  for (let i = 1; i <= TOTAL_FRAMES; i++) {
    const img = new Image();
    img.src = FRAME_PATH(i);
    
    img.onload = () => {
      loadedCount++;
      const progress = Math.floor((loadedCount / TOTAL_FRAMES) * 100);
      if (loaderBar) loaderBar.style.width = `${progress}%`;

      const targetIndex = Math.min(
        TOTAL_FRAMES - 1,
        Math.max(0, Math.round(currentFrameIndex))
      );
      
      if (i - 1 === targetIndex || lastRenderedFrame === -1) {
        if (renderFrame(targetIndex)) {
          lastRenderedFrame = targetIndex;
        }
      }

      if (loadedCount === TOTAL_FRAMES) {
        setTimeout(() => {
          if (loader) loader.classList.add('loaded');
        }, 150);
      }
    };

    img.onerror = () => {
      loadedCount++;
      if (loadedCount === TOTAL_FRAMES && loader) {
        loader.classList.add('loaded');
      }
    };

    images.push(img);
  }
}

// Render Project Cards dynamically from projectsData
function renderProjectCards(filter = 'ALL') {
  const container = document.getElementById('projects-grid');
  if (!container) return;

  const filteredProjects = filter === 'ALL'
    ? projectsData
    : projectsData.filter(p => p.category === filter);

  container.innerHTML = filteredProjects.map((project) => `
    <div class="project-card reveal-on-scroll is-visible" data-category="${project.category}" data-tilt>
      <div class="project-media-placeholder">
        ${project.image ? `<img src="${project.image}" alt="${project.title}" style="width:100%;height:100%;object-fit:cover;" />` : `
          <div class="placeholder-inner">
            <span class="placeholder-icon">✦</span>
            <span class="placeholder-text">MEDIA COMING SOON</span>
          </div>
        `}
      </div>
      <div class="project-info">
        <div class="project-meta">
          <span class="project-num">${project.id}</span>
          <span class="project-category-tag">${project.tag}</span>
        </div>
        <h3 class="project-title">${project.title}</h3>
        <p class="project-desc">${project.description}</p>
        <a href="${project.link}" class="project-view-btn">
          <span>VIEW PROJECT</span>
          <span>&rarr;</span>
        </a>
      </div>
    </div>
  `).join('');

  setup3DTilt();
}

// Category Filter Controller
function setupProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const selectedFilter = btn.getAttribute('data-filter');
      
      const grid = document.getElementById('projects-grid');
      if (grid) {
        grid.style.opacity = '0';
        grid.style.transform = 'translateY(10px)';
        grid.style.transition = 'opacity 0.25s ease, transform 0.25s ease';

        setTimeout(() => {
          renderProjectCards(selectedFilter);
          grid.style.opacity = '1';
          grid.style.transform = 'translateY(0)';
        }, 250);
      }
    });
  });
}

// Intersection Observer for Scroll Reveals
function setupScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      }
    });
  }, { threshold: 0.1 });

  revealElements.forEach((el) => observer.observe(el));
}

// Active Nav Link Observer
function setupActiveNavObserver() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  window.addEventListener('scroll', () => {
    let current = 'home';
    const scrollPosition = window.scrollY + 250;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      if (href === `#${current}` || (href === '#work' && current === 'work')) {
        link.classList.add('active');
      }
    });
  }, { passive: true });
}

// 3D Tilt interaction for cards
function setup3DTilt() {
  const cards = document.querySelectorAll('.service-card[data-tilt], .project-card[data-tilt]');

  cards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = (y - centerY) / 20;
      const rotateY = (centerX - x) / 20;

      card.style.transform = `translateY(-10px) scale(1.02) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

// Mobile Navigation Menu Controller
function setupMobileMenu() {
  const toggleBtn = document.getElementById('mobile-menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  let backdrop = document.querySelector('.nav-backdrop');

  if (!backdrop) {
    backdrop = document.createElement('div');
    backdrop.className = 'nav-backdrop';
    document.body.appendChild(backdrop);
  }

  function closeMenu() {
    if (toggleBtn) toggleBtn.classList.remove('open');
    if (navLinks) navLinks.classList.remove('mobile-open');
    if (backdrop) backdrop.classList.remove('active');
    document.body.style.overflow = '';
  }

  function openMenu() {
    if (toggleBtn) toggleBtn.classList.add('open');
    if (navLinks) navLinks.classList.add('mobile-open');
    if (backdrop) backdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  if (toggleBtn) {
    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = navLinks && navLinks.classList.contains('mobile-open');
      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    });
  }

  if (backdrop) {
    backdrop.addEventListener('click', closeMenu);
  }

  if (navLinks) {
    const links = navLinks.querySelectorAll('a');
    links.forEach(link => {
      link.addEventListener('click', closeMenu);
    });
  }

  window.addEventListener('resize', () => {
    if (window.innerWidth > 1024) {
      closeMenu();
    }
  });
}

// Reusable Testimonials Data Structure (With optional video field support)
// Reusable Testimonials Data Structure (6 Placeholders with optional video support)
const testimonialsData = [
  {
    id: 1,
    num: "01",
    name: "Alex Rivera",
    role: "Founder, Apex Visuals",
    quote: "Pulse_Blend_Media completely transformed our brand assets. The video editing and motion graphics elevated our product launch to a whole new level.",
    rating: 5,
    video: ""
  },
  {
    id: 2,
    num: "02",
    name: "Samantha Chen",
    role: "Content Director, Lumina Media",
    quote: "The editing was sharp, fast, and incredibly creative. Communication was seamless, and every single revision request was handled with precision.",
    rating: 5,
    video: ""
  },
  {
    id: 3,
    num: "03",
    name: "David Kormendi",
    role: "E-Commerce Founder",
    quote: "From concept storyboard to final color grading, the visual storytelling was top tier. Our conversion rates increased significantly after publishing.",
    rating: 5,
    video: ""
  },
  {
    id: 4,
    num: "04",
    name: "Elena Rostova",
    role: "Brand Strategist, Vanguard Studio",
    quote: "Working with Pulse_Blend_Media was effortless. Their ability to catch brand nuances and translate them into stunning visual content is rare.",
    rating: 5,
    video: ""
  },
  {
    id: 5,
    num: "05",
    name: "Marcus Vance",
    role: "Creative Lead, NextGen Tech",
    quote: "Very thoughtful creative work with a strong sense of visual balance, pacing, and atmosphere. Delivered ahead of deadline with exceptional quality.",
    rating: 5,
    video: ""
  },
  {
    id: 6,
    num: "06",
    name: "Priya Sharma",
    role: "Marketing Director, Horizon Agency",
    quote: "Pulse_Blend_Media understood our direction quickly and delivered high-converting ad creatives that exceeded all our performance benchmarks.",
    rating: 5,
    video: ""
  }
];

// Testimonials Carousel Controller (3 Cards per Slide, 2 Slides Total, 3s Auto-rotation, Infinite Loop)
function setupTestimonialsCarousel() {
  const container = document.getElementById('testimonial-cards-wrapper');
  const dotsContainer = document.getElementById('carousel-dots');
  const prevBtn = document.getElementById('carousel-prev');
  const nextBtn = document.getElementById('carousel-next');
  const carouselPanel = document.querySelector('.testimonials-glass-panel') || document.getElementById('testimonial-carousel');

  if (!container || !testimonialsData.length) return;

  // Reset any hardcoded inline height on the outer glass panel
  if (carouselPanel) {
    carouselPanel.style.height = '';
  }

  // Group into slides of 3 items each
  const itemsPerSlide = 3;
  const slidesData = [];
  for (let i = 0; i < testimonialsData.length; i += itemsPerSlide) {
    slidesData.push(testimonialsData.slice(i, i + itemsPerSlide));
  }

  let currentIndex = 0;
  let autoTimer = null;
  let isVideoPlaying = false;
  let touchStartX = 0;
  let touchEndX = 0;

  // Render Slide Pages into Wrapper
  container.innerHTML = slidesData.map((slideItems, slideIdx) => `
    <div class="testimonial-slide-page ${slideIdx === 0 ? 'active-slide' : ''}" data-slide="${slideIdx}">
      <div class="testimonial-cards-grid">
        ${slideItems.map((item) => `
          <div class="testimonial-card">
            <div class="testimonial-card-top">
              <span class="testimonial-num">${item.num}</span>
              <div class="testimonial-stars">${'★'.repeat(item.rating)}</div>
            </div>

            ${item.video ? `
              <div class="testimonial-card-video">
                <video src="${item.video}" controls playsinline preload="metadata"></video>
              </div>
            ` : ''}

            <blockquote class="testimonial-quote">
              "${item.quote}"
            </blockquote>

            <div class="testimonial-author">
              <div class="author-avatar">
                <span>${item.name.split(' ').map(n => n[0]).join('').substring(0, 2)}</span>
              </div>
              <div class="author-meta">
                <h4 class="author-name">${item.name}</h4>
                <span class="author-role">${item.role}</span>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `).join('');

  // Render Pagination Dots
  if (dotsContainer) {
    dotsContainer.innerHTML = slidesData.map((_, i) => `
      <button class="carousel-dot ${i === 0 ? 'active' : ''}" data-index="${i}" aria-label="Go to slide ${i + 1}"></button>
    `).join('');
  }

  const slides = container.querySelectorAll('.testimonial-slide-page');
  const dots = dotsContainer ? dotsContainer.querySelectorAll('.carousel-dot') : [];

  // Listen for video playback inside cards
  const cardVideos = container.querySelectorAll('video');
  cardVideos.forEach(v => {
    v.addEventListener('play', () => {
      isVideoPlaying = true;
      pauseAutoTimer();
    });
    v.addEventListener('pause', () => {
      isVideoPlaying = false;
      resetAutoTimer();
    });
    v.addEventListener('ended', () => {
      isVideoPlaying = false;
      resetAutoTimer();
    });
  });

  function updateCarouselState() {
    container.style.transform = `translateX(-${currentIndex * 100}%)`;

    slides.forEach((slide, i) => {
      if (i === currentIndex) {
        slide.classList.add('active-slide');
      } else {
        slide.classList.remove('active-slide');
      }
    });

    dots.forEach((dot, i) => {
      if (i === currentIndex) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });

    // Dynamic height calculation so active slide content determines carousel track height without clipping panel
    const activeSlide = slides[currentIndex];
    const trackContainer = document.querySelector('.testimonial-carousel-container');
    if (activeSlide && trackContainer) {
      const h = activeSlide.offsetHeight;
      if (h > 0) {
        trackContainer.style.height = `${h}px`;
      }
    }
  }

  window.addEventListener('resize', () => {
    updateCarouselState();
  });

  function goToSlide(index) {
    currentIndex = (index + slidesData.length) % slidesData.length;
    updateCarouselState();
    resetAutoTimer();
  }

  function nextSlide() {
    if (isVideoPlaying) return;
    currentIndex = (currentIndex + 1) % slidesData.length;
    updateCarouselState();
  }

  function prevSlide() {
    if (isVideoPlaying) return;
    currentIndex = (currentIndex - 1 + slidesData.length) % slidesData.length;
    updateCarouselState();
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      prevSlide();
      resetAutoTimer();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      nextSlide();
      resetAutoTimer();
    });
  }

  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      const idx = parseInt(dot.getAttribute('data-index'), 10);
      goToSlide(idx);
    });
  });

  // Touch Swipe Handlers
  if (carouselPanel) {
    carouselPanel.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      pauseAutoTimer();
    }, { passive: true });

    carouselPanel.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
      resetAutoTimer();
    }, { passive: true });

    // Pause on Mouse Hover & Keyboard Focus
    carouselPanel.addEventListener('mouseenter', pauseAutoTimer);
    carouselPanel.addEventListener('mouseleave', resetAutoTimer);
    carouselPanel.addEventListener('focusin', pauseAutoTimer);
    carouselPanel.addEventListener('focusout', resetAutoTimer);
  }

  function handleSwipe() {
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        nextSlide();
        resetAutoTimer();
      } else {
        prevSlide();
        resetAutoTimer();
      }
    }
  }

  function startAutoTimer() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (isVideoPlaying) return;
    pauseAutoTimer();
    autoTimer = setInterval(nextSlide, 3000); // EXACTLY 3 SECONDS
  }

  function pauseAutoTimer() {
    if (autoTimer) {
      clearInterval(autoTimer);
      autoTimer = null;
    }
  }

  function resetAutoTimer() {
    pauseAutoTimer();
    startAutoTimer();
  }

  updateCarouselState();
  startAutoTimer();
}

// WhatsApp CTA Setup Helper
function setupWhatsAppCTA() {
  const whatsappBtns = document.querySelectorAll('.service-btn.whatsapp-btn');
  const encodedMsg = encodeURIComponent(WHATSAPP_MESSAGE);
  const targetUrl = WHATSAPP_NUMBER 
    ? `https://wa.me/${WHATSAPP_NUMBER.replace(/[^0-9]/g, '')}?text=${encodedMsg}`
    : `https://wa.me/?text=${encodedMsg}`;

  whatsappBtns.forEach((btn) => {
    btn.setAttribute('href', targetUrl);
    btn.setAttribute('target', '_blank');
    btn.setAttribute('rel', 'noopener noreferrer');
  });
}

// Contact Form Controller & Mailto Handler
function setupContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const nameInput = document.getElementById('contact-name');
  const phoneInput = document.getElementById('contact-phone');
  const emailInput = document.getElementById('contact-email');
  const serviceInput = document.getElementById('contact-service');
  const methodInput = document.getElementById('contact-method');
  const budgetInput = document.getElementById('contact-budget');
  const detailsInput = document.getElementById('contact-details');
  const successMsg = document.getElementById('contact-success-msg');

  const errorName = document.getElementById('error-name');
  const errorPhone = document.getElementById('error-phone');
  const errorEmail = document.getElementById('error-email');
  const errorService = document.getElementById('error-service');
  const errorDetails = document.getElementById('error-details');

  function clearErrors() {
    [nameInput, phoneInput, emailInput, serviceInput, detailsInput].forEach(el => {
      if (el) el.classList.remove('input-error');
    });
    [errorName, errorPhone, errorEmail, errorService, errorDetails].forEach(el => {
      if (el) el.textContent = '';
    });
  }

  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  }

  function validatePhone(phone) {
    const clean = phone.replace(/[^0-9+]/g, '');
    return clean.length >= 7;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    clearErrors();

    let isValid = true;

    // Name Validation
    const nameVal = nameInput ? nameInput.value.trim() : '';
    if (!nameVal) {
      if (errorName) errorName.textContent = 'Please enter your full name.';
      if (nameInput) nameInput.classList.add('input-error');
      isValid = false;
    }

    // Phone Validation
    const phoneVal = phoneInput ? phoneInput.value.trim() : '';
    if (!phoneVal) {
      if (errorPhone) errorPhone.textContent = 'Please enter your phone number.';
      if (phoneInput) phoneInput.classList.add('input-error');
      isValid = false;
    } else if (!validatePhone(phoneVal)) {
      if (errorPhone) errorPhone.textContent = 'Please enter a valid phone number.';
      if (phoneInput) phoneInput.classList.add('input-error');
      isValid = false;
    }

    // Email Validation
    const emailVal = emailInput ? emailInput.value.trim() : '';
    if (!emailVal) {
      if (errorEmail) errorEmail.textContent = 'Please enter your email address.';
      if (emailInput) emailInput.classList.add('input-error');
      isValid = false;
    } else if (!validateEmail(emailVal)) {
      if (errorEmail) errorEmail.textContent = 'Please enter a valid email address.';
      if (emailInput) emailInput.classList.add('input-error');
      isValid = false;
    }

    // Service Validation
    const serviceVal = serviceInput ? serviceInput.value : '';
    if (!serviceVal) {
      if (errorService) errorService.textContent = 'Please select a service requirement.';
      if (serviceInput) serviceInput.classList.add('input-error');
      isValid = false;
    }

    // Details Validation
    const detailsVal = detailsInput ? detailsInput.value.trim() : '';
    if (!detailsVal) {
      if (errorDetails) errorDetails.textContent = 'Please describe your project details.';
      if (detailsInput) detailsInput.classList.add('input-error');
      isValid = false;
    } else if (detailsVal.length < 5) {
      if (errorDetails) errorDetails.textContent = 'Please provide a little more detail about your project.';
      if (detailsInput) detailsInput.classList.add('input-error');
      isValid = false;
    }

    if (!isValid) return;

    const contactMethodVal = methodInput ? methodInput.value : 'Email';
    const budgetVal = budgetInput ? budgetInput.value : 'Not specified';

    // Construct Mailto Link
    const recipient = "onestarprashanth@gmail.com";
    const subject = "New Project Enquiry — Pulse_Blend_Media";
    const bodyLines = [
      `Name: ${nameVal}`,
      `Phone: ${phoneVal}`,
      `Email: ${emailVal}`,
      `Service Required: ${serviceVal}`,
      `Project Details: ${detailsVal}`,
      `Preferred Contact Method: ${contactMethodVal}`,
      `Budget: ${budgetVal}`
    ];

    const bodyText = bodyLines.join('\n');
    const mailtoUrl = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyText)}`;

    // Trigger mailto client
    window.location.href = mailtoUrl;

    // Show Success Glass Banner
    if (successMsg) {
      successMsg.style.display = 'block';
      successMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });

  // Clear errors on input focus/change
  [nameInput, phoneInput, emailInput, serviceInput, detailsInput].forEach(input => {
    if (input) {
      input.addEventListener('input', () => {
        input.classList.remove('input-error');
        const errSpan = document.getElementById(`error-${input.name}`);
        if (errSpan) errSpan.textContent = '';
      });
      input.addEventListener('change', () => {
        input.classList.remove('input-error');
        const errSpan = document.getElementById(`error-${input.name}`);
        if (errSpan) errSpan.textContent = '';
      });
    }
  });
}

// Legal Documents Content Data
const LEGAL_DOCUMENTS = {
  terms: {
    title: "Terms & Conditions",
    html: `
      <div class="legal-last-updated">Last updated: September 11, 2026</div>
      <h4>1. Introduction</h4>
      <p>Welcome to Pulse_Blend_Media. By accessing or engaging our creative services (including video editing, photography, shooting, website design, and skill instruction), you agree to be bound by these Terms & Conditions.</p>

      <h4>2. Services</h4>
      <p>Pulse_Blend_Media provides digital creative services as outlined in project estimates, proposals, or service agreements. Specific deliverables, deadlines, and project milestones will be defined for each custom project.</p>

      <h4>3. Booking & Confirmation</h4>
      <p>Project bookings and shooting schedules are confirmed upon agreement of scope and receipt of any agreed advance deposit or written confirmation.</p>

      <h4>4. Pricing & Payment</h4>
      <p>Pricing for services is based on agreed project scope. Payment terms will be specified in individual project invoices or agreements. Final deliverables are released upon full payment completion.</p>

      <h4>5. Revisions</h4>
      <p>Projects include reasonable revision rounds as specified in individual project scopes. Additional major scope changes outside initial agreements may be subject to custom adjustments.</p>

      <h4>6. Project Delivery</h4>
      <p>Deliverables will be provided in digital formats agreed upon prior to project commencement. Timelines are subject to prompt receipt of required client assets and feedback.</p>

      <h4>7. Cancellation & Refunds</h4>
      <p>Cancellation policies and deposit refunds depend on the stage of project execution and resource allocation. Terms for early termination will be handled transparently on a case-by-case basis.</p>

      <h4>8. Client Responsibilities</h4>
      <p>Clients agree to provide accurate project information, necessary brand assets, permissions, and timely communication required for project completion.</p>

      <h4>9. Intellectual Property</h4>
      <p>Upon final payment, full rights to custom final deliverables are transferred to the client. Pulse_Blend_Media retains ownership of underlying proprietary tools, templates, and pre-existing assets.</p>

      <h4>10. Use of Portfolio Work</h4>
      <p>Unless explicitly agreed otherwise in writing, Pulse_Blend_Media reserves the right to display completed work in studio portfolios, website showcases, and promotional materials.</p>

      <h4>11. Third-Party Materials</h4>
      <p>Clients are responsible for ensuring licensing rights for any third-party media, fonts, audio tracks, or assets supplied to Pulse_Blend_Media for project integration.</p>

      <h4>12. Limitation of Liability</h4>
      <p>Pulse_Blend_Media will not be liable for indirect, incidental, or consequential damages arising from service usage or delivery delays beyond reasonable control.</p>

      <h4>13. Changes to Services or Terms</h4>
      <p>We reserve the right to update these Terms & Conditions as services evolve. Revised terms take effect upon posting to the website.</p>

      <h4>14. Contact Information</h4>
      <p>For questions about these Terms & Conditions, contact: <a href="mailto:onestarprashanth@gmail.com" style="color: var(--cyan-bright);">onestarprashanth@gmail.com</a></p>
    `
  },
  privacy: {
    title: "Privacy Policy",
    html: `
      <div class="legal-last-updated">Last updated: September 11, 2026</div>
      <h4>1. Information Collected</h4>
      <p>We collect personal information that you voluntarily provide when filling out our contact form or communicating with us. This includes your Name, Phone Number, Email Address, Preferred Contact Method, Budget Range, and Project Details.</p>

      <h4>2. How Information Is Used</h4>
      <p>Your information is used strictly to respond to project enquiries, discuss creative scopes, provide estimates, and deliver requested services.</p>

      <h4>3. Information Storage & Security</h4>
      <p>We implement reasonable technical and organizational measures to safeguard your personal information against unauthorized access, disclosure, or misuse.</p>

      <h4>4. Data Sharing & Third Parties</h4>
      <p>Pulse_Blend_Media does not sell, rent, trade, or share your personal information with third parties for marketing purposes.</p>

      <h4>5. Contact Requests & Communications</h4>
      <p>By submitting your contact details, you permit us to reach out via Email, Phone, or WhatsApp regarding your specific project request.</p>

      <h4>6. User Rights</h4>
      <p>You have the right to request access to, correction of, or deletion of any personal information we hold about you by emailing us.</p>

      <h4>7. Contact Information</h4>
      <p>If you have questions regarding this Privacy Policy, please email: <a href="mailto:onestarprashanth@gmail.com" style="color: var(--cyan-bright);">onestarprashanth@gmail.com</a></p>
    `
  },
  cookie: {
    title: "Cookie Policy",
    html: `
      <div class="legal-last-updated">Last updated: September 11, 2026</div>
      <h4>1. What Are Cookies</h4>
      <p>Cookies are small text files stored on your device when you visit a website. They help improve user experience, maintain preferences, and enable core site functions.</p>

      <h4>2. Essential Cookies</h4>
      <p>Our website uses essential session mechanism cookies necessary for basic site navigation, smooth scroll state, and theme rendering.</p>

      <h4>3. Analytics & Third-Party Cookies</h4>
      <p>We currently do not employ invasive tracking or advertising cookies. Any third-party embedded content (such as video elements) operates under respective platform policies.</p>

      <h4>4. Managing Cookies</h4>
      <p>You can adjust your web browser settings to block or delete cookies at any time. Note that disabling essential cookies may impact certain interactive features.</p>

      <h4>5. Policy Updates</h4>
      <p>This Cookie Policy may be updated periodically to reflect changes in functionality or legal standards.</p>

      <h4>6. Contact Information</h4>
      <p>For questions about our Cookie Policy, reach out to: <a href="mailto:onestarprashanth@gmail.com" style="color: var(--cyan-bright);">onestarprashanth@gmail.com</a></p>
    `
  }
};

// Footer & Legal Modal Controller
function setupFooterAndLegalModals() {
  // Back to top button
  const backToTopBtn = document.getElementById('back-to-top');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Dynamic Copyright Year
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // Legal Modal Elements
  const overlay = document.getElementById('legal-modal-overlay');
  const modalTitle = document.getElementById('modal-title');
  const modalBody = document.getElementById('modal-body-content');
  const closeBtn = document.getElementById('modal-close-btn');

  function openLegalModal(type) {
    const doc = LEGAL_DOCUMENTS[type];
    if (!doc || !overlay || !modalTitle || !modalBody) return;

    modalTitle.textContent = doc.title;
    modalBody.innerHTML = doc.html;
    overlay.classList.add('active');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeLegalModal() {
    if (!overlay) return;
    overlay.classList.remove('active');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // Attach modal trigger listeners
  const triggers = document.querySelectorAll('.legal-modal-trigger');
  triggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const type = trigger.dataset.legal;
      openLegalModal(type);
    });
  });

  // Modal Close Listeners
  if (closeBtn) closeBtn.addEventListener('click', closeLegalModal);
  if (overlay) {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeLegalModal();
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay && overlay.classList.contains('active')) {
      closeLegalModal();
    }
  });

  // Check URL Hash on page load for direct legal link routes
  const hash = window.location.hash;
  if (hash === '#terms-and-conditions') openLegalModal('terms');
  else if (hash === '#privacy-policy') openLegalModal('privacy');
  else if (hash === '#cookie-policy') openLegalModal('cookie');
}

// Initialize
function init() {
  window.addEventListener('resize', resizeCanvas);
  window.addEventListener('scroll', updateScrollProgress, { passive: true });

  resizeCanvas();
  updateScrollProgress();
  preloadImages();
  renderProjectCards('ALL');
  setupProjectFilters();
  setupScrollReveal();
  setupActiveNavObserver();
  setupMobileMenu();
  setupTestimonialsCarousel();
  setupWhatsAppCTA();
  setupContactForm();
  setupFooterAndLegalModals();
  setup3DTilt();
  requestAnimationFrame(animate);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
