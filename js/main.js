document.addEventListener('DOMContentLoaded', function () {
  var toggle = document.querySelector('.hamburger');
  var nav = document.querySelector('.main-nav');

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var isOpen = nav.classList.toggle('is-open');
      toggle.classList.toggle('is-open', isOpen);
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('is-open');
        toggle.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });

    document.addEventListener('click', function (event) {
      if (!nav.contains(event.target) && !toggle.contains(event.target)) {
        nav.classList.remove('is-open');
        toggle.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  var yearEl = document.querySelector('[data-year]');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // Hero carousel (Inicio)
  var heroCarousel = document.querySelector('[data-hero-carousel]');
  if (heroCarousel) {
    var slides = Array.prototype.slice.call(heroCarousel.querySelectorAll('.hero-slide'));
    var dotsWrap = heroCarousel.querySelector('.hero-dots');
    var current = 0;

    slides.forEach(function (_, i) {
      var dot = document.createElement('button');
      dot.setAttribute('aria-label', 'Ir al slide ' + (i + 1));
      if (i === 0) dot.classList.add('is-active');
      dot.addEventListener('click', function () { goTo(i); });
      dotsWrap.appendChild(dot);
    });

    function goTo(index) {
      slides[current].classList.remove('is-active');
      dotsWrap.children[current].classList.remove('is-active');
      current = (index + slides.length) % slides.length;
      slides[current].classList.add('is-active');
      dotsWrap.children[current].classList.add('is-active');
    }

    heroCarousel.querySelectorAll('[data-hero-arrow]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        goTo(current + parseInt(btn.getAttribute('data-hero-arrow'), 10));
      });
    });
  }

  // Cards carousel (Expansiones)
  document.querySelectorAll('[data-cards-arrow]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var track = document.getElementById(btn.getAttribute('data-cards-target'));
      if (!track) return;
      var dir = parseInt(btn.getAttribute('data-cards-arrow'), 10);
      track.scrollBy({ left: dir * 180, behavior: 'smooth' });
    });
  });
});
