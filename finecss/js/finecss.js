(function () {
  'use strict';

  var FineCSS = window.FineCSS || {};

  var focusableSelector =
    'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';
  var openDropdown = null;
  var activeModal = null;
  var modalLastFocus = null;
  var carouselInstances = new WeakMap();
  var scrollspyInstances = [];
  var scrollspyTick = false;

  /* Dropdown helpers */
  function initDropdowns() {
    var dropdowns = document.querySelectorAll('[data-fc="dropdown"]');
    dropdowns.forEach(function (dropdown) {
      var toggle = dropdown.querySelector('[data-fc-toggle="dropdown"]');
      var menu =
        dropdown.querySelector('[data-fc-menu]') ||
        dropdown.querySelector('[role="menu"]');
      if (toggle) {
        toggle.setAttribute('aria-haspopup', 'true');
        toggle.setAttribute('aria-expanded', 'false');
      }
      if (menu) {
        menu.setAttribute('role', menu.getAttribute('role') || 'menu');
        menu.setAttribute('aria-hidden', 'true');
      }
    });
  }

  function setDropdownState(toggle, menu, open) {
    if (!toggle || !menu) {
      return;
    }
    menu.classList.toggle('is-open', open);
    menu.setAttribute('aria-hidden', open ? 'false' : 'true');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    openDropdown = open
      ? { toggle: toggle, menu: menu, container: toggle.closest('[data-fc="dropdown"]') }
      : null;
  }

  function closeDropdowns() {
    if (openDropdown) {
      setDropdownState(openDropdown.toggle, openDropdown.menu, false);
    }
  }

  function toggleDropdown(toggle) {
    if (!toggle) {
      return;
    }
    var targetSelector = toggle.dataset.fcTarget;
    var target = targetSelector ? document.querySelector(targetSelector) : null;
    var container =
      toggle.closest('[data-fc="dropdown"]') ||
      (target && target.closest('[data-fc="dropdown"]'));
    if (!container) {
      return;
    }
    var menu =
      target ||
      container.querySelector('[data-fc-menu]') ||
      container.querySelector('ul') ||
      container;
    if (!menu) {
      return;
    }
    if (openDropdown && openDropdown.menu !== menu) {
      closeDropdowns();
    }
    var isOpen = menu.classList.contains('is-open');
    setDropdownState(toggle, menu, !isOpen);
  }

  /* Modal helpers */
  function initModals() {
    document.addEventListener('keydown', function (event) {
      if (!activeModal) {
        return;
      }
      if (event.key === 'Escape') {
        event.preventDefault();
        closeModal(activeModal);
      }
      if (event.key === 'Tab') {
        trapModalFocus(event);
      }
    });
  }

  function trapModalFocus(event) {
    if (!activeModal) {
      return;
    }
    var focusable = Array.from(activeModal.querySelectorAll(focusableSelector));
    if (!focusable.length) {
      event.preventDefault();
      return;
    }
    var first = focusable[0];
    var last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  function openModal(modal) {
    if (!modal || modal.hasAttribute('data-fc-disabled')) {
      return;
    }
    modal.setAttribute('aria-hidden', 'false');
    modal.classList.add('is-open');
    modal.dataset.finecssOpen = 'true';
    modalLastFocus = document.activeElement;
    activeModal = modal;
    document.body.classList.add('fc-modal-open');
    var focusable = Array.from(modal.querySelectorAll(focusableSelector));
    (focusable[0] || modal).focus();
  }

  function closeModal(modal) {
    if (!modal || modal !== activeModal) {
      return;
    }
    modal.setAttribute('aria-hidden', 'true');
    modal.classList.remove('is-open');
    delete modal.dataset.finecssOpen;
    activeModal = null;
    document.body.classList.remove('fc-modal-open');
    if (modalLastFocus) {
      modalLastFocus.focus();
      modalLastFocus = null;
    }
  }

  /* Carousel helpers */
  function initCarousels() {
    var carousels = document.querySelectorAll('[data-fc="carousel"]');
    carousels.forEach(function (carousel) {
      if (!carousel.hasAttribute('tabindex')) {
        carousel.setAttribute('tabindex', '0');
      }
      var slides = Array.from(carousel.querySelectorAll('[data-fc-slide]'));
      if (!slides.length) {
        return;
      }
      var interval = parseInt(carousel.dataset.fcInterval, 10) || 0;
      var indicators = Array.from(
        carousel.querySelectorAll('[data-fc-indicator]')
      );
      var instance = {
        carousel: carousel,
        slides: slides,
        indicators: indicators,
        current: 0,
        interval: interval,
        timer: null,
      };
      carouselInstances.set(carousel, instance);
      slides.forEach(function (slide, index) {
        slide.setAttribute('role', 'group');
        slide.setAttribute('aria-roledescription', 'slide');
        slide.dataset.fcIndex = index;
      });
      showCarouselSlide(instance, 0);
      if (interval > 0) {
        startCarouselAutoplay(instance);
      }
      carousel.addEventListener('keydown', function (event) {
        if (event.key === 'ArrowRight') {
          event.preventDefault();
          goCarousel(instance, 1);
        } else if (event.key === 'ArrowLeft') {
          event.preventDefault();
          goCarousel(instance, -1);
        }
      });
    });
  }

  function showCarouselSlide(instance, index) {
    if (!instance) {
      return;
    }
    var safeIndex =
      ((index % instance.slides.length) + instance.slides.length) %
      instance.slides.length;
    instance.slides.forEach(function (slide, slideIndex) {
      var isActive = slideIndex === safeIndex;
      slide.classList.toggle('is-active', isActive);
      slide.setAttribute('aria-hidden', isActive ? 'false' : 'true');
      slide.hidden = !isActive;
    });
    instance.indicators.forEach(function (indicator, indicatorIndex) {
      var isActive = indicatorIndex === safeIndex;
      indicator.classList.toggle('is-active', isActive);
      indicator.setAttribute('aria-current', isActive ? 'true' : 'false');
    });
    instance.current = safeIndex;
  }

  function goCarousel(instance, delta) {
    if (!instance) {
      return;
    }
    showCarouselSlide(instance, instance.current + delta);
    resetCarouselAutoplay(instance);
  }

  function handleCarouselAction(carousel, action, slideTo) {
    if (!carousel) {
      return;
    }
    var instance = carouselInstances.get(carousel);
    if (!instance) {
      return;
    }
    if (action === 'next') {
      goCarousel(instance, 1);
    } else if (action === 'prev') {
      goCarousel(instance, -1);
    } else if (!isNaN(slideTo)) {
      showCarouselSlide(instance, slideTo);
      resetCarouselAutoplay(instance);
    }
  }

  function startCarouselAutoplay(instance) {
    if (!instance || instance.interval <= 0) {
      return;
    }
    instance.timer = setInterval(function () {
      goCarousel(instance, 1);
    }, instance.interval);
  }

  function resetCarouselAutoplay(instance) {
    if (!instance || instance.interval <= 0) {
      return;
    }
    if (instance.timer) {
      clearInterval(instance.timer);
    }
    startCarouselAutoplay(instance);
  }

  /* Toast helpers */
  function initToasts() {
    var toasts = document.querySelectorAll('[data-fc="toast"]');
    toasts.forEach(function (toast) {
      if (toast.classList.contains('is-visible')) {
        scheduleToastHide(toast);
      }
    });
  }

  function scheduleToastHide(toast) {
    if (!toast) {
      return;
    }
    clearToastTimer(toast);
    var delay = parseInt(toast.dataset.fcDelay, 10);
    delay = isNaN(delay) ? 5000 : delay;
    if (toast.dataset.fcAutohide !== 'false') {
      toast.__finecssTimer = setTimeout(function () {
        hideToast(toast);
      }, delay);
    }
  }

  function clearToastTimer(toast) {
    if (toast && toast.__finecssTimer) {
      clearTimeout(toast.__finecssTimer);
      toast.__finecssTimer = null;
    }
  }

  function showToast(toast) {
    if (!toast) {
      return;
    }
    toast.classList.add('is-visible');
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    scheduleToastHide(toast);
  }

  function hideToast(toast) {
    if (!toast) {
      return;
    }
    toast.classList.remove('is-visible');
    toast.removeAttribute('aria-live');
    clearToastTimer(toast);
  }

  /* Scrollspy helpers */
  function initScrollspy() {
    scrollspyInstances = [];
    var spies = document.querySelectorAll('[data-fc="scrollspy"]');
    spies.forEach(function (spy) {
      var offset = parseInt(spy.dataset.fcOffset, 10) || 0;
      var links = Array.from(spy.querySelectorAll('a[href^="#"]'));
      var items = links.map(function (link) {
        var href = link.getAttribute('href') || '';
        if (!href.startsWith('#')) {
          return null;
        }
        var target = document.querySelector(href);
        return target ? { link: link, target: target } : null;
      });
      var filtered = items.filter(Boolean);
      if (filtered.length) {
        scrollspyInstances.push({ offset: offset, items: filtered });
      }
    });
    updateScrollspy();
    window.addEventListener('scroll', onScrollSpyScroll);
    window.addEventListener('resize', updateScrollspy);
  }

  function onScrollSpyScroll() {
    if (!scrollspyTick) {
      scrollspyTick = true;
      requestAnimationFrame(function () {
        updateScrollspy();
        scrollspyTick = false;
      });
    }
  }

  function updateScrollspy() {
    var scrollTop = window.scrollY || window.pageYOffset;
    scrollspyInstances.forEach(function (instance) {
      var activeItem = null;
      instance.items.forEach(function (item) {
        var targetTop =
          item.target.getBoundingClientRect().top +
          window.scrollY -
          instance.offset;
        if (scrollTop >= targetTop) {
          activeItem = item;
        }
      });
      instance.items.forEach(function (item) {
        var isActive = item === activeItem;
        item.link.classList.toggle('is-active', isActive);
        if (isActive) {
          item.link.setAttribute('aria-current', 'true');
        } else {
          item.link.removeAttribute('aria-current');
        }
      });
    });
  }

  /* Event delegation */
  function handleDocumentClick(event) {
    var toggle = event.target.closest('[data-fc-toggle]');
    if (toggle) {
      var type = toggle.dataset.fcToggle;
      var targetSelector = toggle.dataset.fcTarget;
      var action = toggle.dataset.fcAction;
      var slideTo = parseInt(toggle.dataset.fcSlideTo, 10);
      var target = targetSelector
        ? document.querySelector(targetSelector)
        : null;

      if (toggle.tagName === 'A') {
        event.preventDefault();
      }

      switch (type) {
        case 'dropdown':
          toggleDropdown(toggle);
          break;
        case 'modal':
          openModal(target);
          break;
        case 'toast':
          showToast(target);
          break;
        case 'carousel':
          var carousel = target || toggle.closest('[data-fc="carousel"]');
          handleCarouselAction(carousel, action, slideTo);
          break;
        default:
          break;
      }
      return;
    }

    var dismiss = event.target.closest('[data-fc-dismiss]');
    if (dismiss) {
      var dismissTarget = dismiss.dataset.fcDismiss;
      if (dismissTarget === 'modal') {
        var modal = dismiss.closest('[data-fc="modal"]');
        closeModal(modal);
      }
      if (dismissTarget === 'toast') {
        var toast = dismiss.closest('[data-fc="toast"]');
        hideToast(toast);
      }
      return;
    }

    if (openDropdown && !event.target.closest('[data-fc="dropdown"]')) {
      closeDropdowns();
    }
  }

  function handleDocumentKeydown(event) {
    if (activeModal) {
      return;
    }
    if (event.key === 'Escape') {
      closeDropdowns();
    }
    if (
      event.key === 'Enter' ||
      event.key === ' ' ||
      event.key === 'Spacebar'
    ) {
      var toggle = event.target.closest('[data-fc-toggle]');
      if (toggle && toggle.dataset.fcToggle === 'dropdown') {
        event.preventDefault();
        toggleDropdown(toggle);
      }
    }
  }

  /* Public API */
  FineCSS.init = function () {
    initDropdowns();
    initModals();
    initCarousels();
    initToasts();
    initScrollspy();
    document.addEventListener('click', handleDocumentClick);
    document.addEventListener('keydown', handleDocumentKeydown);
  };

  FineCSS.showToast = showToast;

  if (!window.FineCSS) {
    window.FineCSS = FineCSS;
  }
})();
