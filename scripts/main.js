// Apple-Inspired Enhanced JavaScript

$(document).ready(function() {
  // Theme Toggle Functionality
  function initTheme() {
    const body = document.body;
    const themeToggle = document.getElementById('themeToggle');
    
    if (!themeToggle) {
      console.warn('Theme toggle button not found');
      return;
    }
    
    const themeIcon = themeToggle.querySelector('i');
    
    if (!themeIcon) {
      console.warn('Theme toggle icon not found');
      return;
    }
    
    // Get saved theme or default to dark
    const savedTheme = localStorage.getItem('preferred-theme') || 'dark';
    body.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme, themeIcon);
    
    // Theme toggle button click handler
    themeToggle.addEventListener('click', function() {
      const currentTheme = body.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      body.setAttribute('data-theme', newTheme);
      localStorage.setItem('preferred-theme', newTheme);
      updateThemeIcon(newTheme, themeIcon);
    });
  }
  
  function updateThemeIcon(theme, iconElement) {
    if (theme === 'dark') {
      iconElement.className = 'fa fa-moon-o';
      iconElement.setAttribute('aria-label', 'Switch to light mode');
    } else {
      iconElement.className = 'fa fa-sun-o';
      iconElement.setAttribute('aria-label', 'Switch to dark mode');
    }
  }

  function initHeroTypewriter() {
    const wrapper = document.getElementById('heroTypewriter');
    const tagline = document.querySelector('.hero-tagline');

    if (!wrapper || !tagline) {
      return;
    }

    const cursor = tagline.querySelector('.typewriter-cursor');
    const text = tagline.dataset.text || tagline.textContent.trim();

    if (!text) {
      return;
    }

    tagline.setAttribute('aria-live', 'polite');
    wrapper.textContent = '';

    let index = 0;

    function type() {
      if (index <= text.length) {
        wrapper.textContent = text.slice(0, index);
        index += 1;
        setTimeout(type, 45);
      } else if (cursor) {
        cursor.classList.add('typewriter-cursor--complete');
      }
    }

    setTimeout(type, 200);
  }

  function initPortfolioPreview() {
    const preview = document.getElementById('portfolioPreview');
    if (!preview) {
      return;
    }
 
    const previewImage = preview.querySelector('img');
    const portfolioItems = document.querySelectorAll('.portfolio-grid .portfolio-item');
    let hideTimeout = null;
    let isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    let activeItem = null;
 
    function showPreview(src, altText) {
      if (!src) {
        return;
      }
      previewImage.src = src;
      previewImage.alt = altText || 'Portfolio preview';
      preview.classList.add('visible');
      preview.setAttribute('aria-hidden', 'false');
      // Prevent body scroll when preview is visible on mobile
      if (isTouchDevice) {
        document.body.style.overflow = 'hidden';
      }
    }
 
    function hidePreview() {
      preview.classList.remove('visible');
      preview.setAttribute('aria-hidden', 'true');
      previewImage.removeAttribute('src');
      previewImage.alt = '';
      activeItem = null;
      // Restore body scroll
      if (isTouchDevice) {
        document.body.style.overflow = '';
      }
    }
 
    portfolioItems.forEach(item => {
      const img = item.querySelector('img');
      if (!img) {
        return;
      }
 
      // Desktop: hover events
      if (!isTouchDevice) {
        item.addEventListener('mouseenter', () => {
          if (hideTimeout) {
            clearTimeout(hideTimeout);
          }
          const fullSrc = img.dataset.full || img.src;
          showPreview(fullSrc, img.alt);
          activeItem = item;
        });
 
        item.addEventListener('mouseleave', () => {
          hideTimeout = setTimeout(hidePreview, 120);
        });
      } else {
        // Mobile/Tablet: touch events
        item.addEventListener('touchstart', (e) => {
          e.preventDefault();
          if (hideTimeout) {
            clearTimeout(hideTimeout);
          }
          const fullSrc = img.dataset.full || img.src;
          showPreview(fullSrc, img.alt);
          activeItem = item;
        }, { passive: false });
 
        item.addEventListener('click', (e) => {
          // Only trigger if not already showing (for tap to show)
          if (activeItem !== item) {
            e.preventDefault();
            const fullSrc = img.dataset.full || img.src;
            showPreview(fullSrc, img.alt);
            activeItem = item;
          }
        });
      }
    });
 
    // Desktop: keep preview visible when hovering over it
    if (!isTouchDevice) {
      preview.addEventListener('mouseenter', () => {
        if (hideTimeout) {
          clearTimeout(hideTimeout);
        }
      });
 
      preview.addEventListener('mouseleave', () => {
        hidePreview();
      });
    }
 
    // Close preview on click/tap
    preview.addEventListener('click', (e) => {
      // Only close if clicking the background, not the image
      if (e.target === preview) {
        hidePreview();
      }
    });
 
    // Close on touch outside (mobile)
    if (isTouchDevice) {
      preview.addEventListener('touchstart', (e) => {
        if (e.target === preview) {
          hidePreview();
        }
      });
    }
 
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') {
        hidePreview();
      }
    });
 
    window.addEventListener('scroll', hidePreview, { passive: true });
    
    // Handle orientation change
    window.addEventListener('orientationchange', () => {
      setTimeout(() => {
        if (preview.classList.contains('visible')) {
          // Refresh preview on orientation change
          const currentSrc = previewImage.src;
          if (currentSrc) {
            previewImage.src = '';
            setTimeout(() => {
              previewImage.src = currentSrc;
            }, 50);
          }
        }
      }, 100);
    });
  }
 
  // Initialize theme on page load
  initTheme();
  initHeroTypewriter();
  initPortfolioPreview();

  // Initialize AOS (Animate On Scroll)
  AOS.init({
    duration: 600,
    easing: 'ease-out-cubic',
    once: true,
    offset: 100
  });

  // Navbar scroll effect
  let lastScroll = 0;
  const navbar = $('#navbar');
  
  $(window).scroll(function() {
    const currentScroll = $(window).scrollTop();
    
    if (currentScroll > 50) {
      navbar.addClass('scrolled');
    } else {
      navbar.removeClass('scrolled');
    }
    
    lastScroll = currentScroll;
  });

  // Smooth scroll for navigation links
  $('a.smooth-scroll').on('click', function(event) {
    if (this.hash !== '') {
      event.preventDefault();
      const hash = this.hash;
      const target = $(hash);
      
      if (target.length) {
        $('html, body').animate({
          scrollTop: target.offset().top - 80
        }, 800, 'swing', function() {
          window.location.hash = hash;
        });
      }
    }
  });

  // Fade-in animation on scroll
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);

  // Observe all fade-in elements
  document.querySelectorAll('.fade-in').forEach(el => {
    observer.observe(el);
  });

  // Parallax effect for hero background
  $(window).scroll(function() {
    const scrolled = $(window).scrollTop();
    const parallaxElements = $('.parallax-element');
    
    parallaxElements.each(function() {
      const element = $(this);
      const speed = 0.5;
      const yPos = -(scrolled * speed);
      element.css('transform', `translate3d(0, ${yPos}px, 0)`);
    });
  });

  // Progress bar animation
  const progressBars = document.querySelectorAll('.progress-bar');
  const progressObserver = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const progressBar = entry.target;
        const width = progressBar.getAttribute('aria-valuenow') + '%';
        progressBar.style.width = width;
        progressObserver.unobserve(progressBar);
      }
    });
  }, { threshold: 0.3 });

  progressBars.forEach(bar => {
    progressObserver.observe(bar);
  });

  // Portfolio hover effects
  $('.portfolio-item').hover(
    function() {
      $(this).find('img').css('transform', 'scale(1.1)');
    },
    function() {
      $(this).find('img').css('transform', 'scale(1)');
    }
  );

  // Liquid glass hover effect
  $('.liquid-glass').hover(
    function() {
      $(this).css({
        'transform': 'translateY(-4px)',
        'box-shadow': '0 12px 48px 0 rgba(31, 38, 135, 0.2)'
      });
    },
    function() {
      $(this).css({
        'transform': 'translateY(0)',
        'box-shadow': '0 8px 32px 0 rgba(31, 38, 135, 0.1)'
      });
    }
  );

  // Button ripple effect
  $('.btn-primary, .btn-secondary').on('click', function(e) {
    const button = $(this);
    const ripple = $('<span class="ripple"></span>');
    const rect = this.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    ripple.css({
      width: size,
      height: size,
      left: x,
      top: y
    });
    
    button.append(ripple);
    
    setTimeout(() => {
      ripple.remove();
    }, 600);
  });

  // Smooth section transitions
  const sections = document.querySelectorAll('.section');
  const sectionObserver = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  });

  sections.forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'opacity 0.4s ease-out, transform 0.4s ease-out';
    sectionObserver.observe(section);
  });

  // Experience items stagger animation
  $('.experience-item').each(function(index) {
    $(this).css({
      'opacity': '0',
      'transform': 'translateX(-30px)',
      'transition': `opacity 0.4s ease-out ${index * 0.08}s, transform 0.4s ease-out ${index * 0.08}s`
    });
  });

  const experienceObserver = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        $(entry.target).css({
          'opacity': '1',
          'transform': 'translateX(0)'
        });
      }
    });
  }, { threshold: 0.2 });

  document.querySelectorAll('.experience-item').forEach(item => {
    experienceObserver.observe(item);
  });

  // Initialize carousel
  $('#referenceCarousel').carousel({
    interval: 5000,
    pause: 'hover'
  });

  // Mobile menu toggle
  $('.navbar-toggler').on('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    $(this).toggleClass('active');
    $('#navigation').toggleClass('show');
    $('body').toggleClass('menu-open');
  });

  // Close mobile menu on link click
  $('.nav-link').on('click', function() {
    if ($(window).width() < 992) {
      $('#navigation').removeClass('show');
      $('.navbar-toggler').removeClass('active');
      $('body').removeClass('menu-open');
    }
  });

  // Close mobile menu when clicking outside
  $(document).on('click', function(e) {
    if ($(window).width() < 992) {
      if (!$(e.target).closest('.navbar').length) {
        $('#navigation').removeClass('show');
        $('.navbar-toggler').removeClass('active');
        $('body').removeClass('menu-open');
      }
    }
  });

  // Add CSS for ripple effect
  if (!document.getElementById('ripple-styles')) {
    const style = document.createElement('style');
    style.id = 'ripple-styles';
    style.textContent = `
      .btn {
        position: relative;
        overflow: hidden;
      }
      .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
        pointer-events: none;
      }
      @keyframes ripple-animation {
        to {
          transform: scale(4);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }

  // Landscape optimization - adjust spacing for wide screens
  function adjustForLandscape() {
    if (window.innerWidth >= 1024 && window.innerHeight < window.innerWidth) {
      document.body.classList.add('landscape-mode');
    } else {
      document.body.classList.remove('landscape-mode');
    }
  }

  adjustForLandscape();
  $(window).on('resize orientationchange', adjustForLandscape);

  // Smooth page load
  $(window).on('load', function() {
    $('body').addClass('loaded');
    // Trigger initial fade-in for hero elements
    setTimeout(() => {
      $('.hero-content .fade-in').each(function(index) {
        const el = $(this);
        setTimeout(() => {
          el.addClass('visible');
        }, index * 100);
      });
    }, 100);
  });

  // Enhanced scroll performance
  let ticking = false;
  function updateOnScroll() {
    // Parallax updates
    const scrolled = window.pageYOffset;
    $('.parallax-element').each(function() {
      const speed = 0.5;
      const yPos = -(scrolled * speed);
      $(this).css('transform', `translate3d(0, ${yPos}px, 0)`);
    });
    
    ticking = false;
  }

  $(window).on('scroll', function() {
    if (!ticking) {
      window.requestAnimationFrame(updateOnScroll);
      ticking = true;
    }
  });

  // Add smooth transitions to all interactive elements
  $('a, button, .card, .portfolio-item').css({
    'transition': 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
  });
});
