const products = {
  berry: {
    small: {
      price: 'NPR 6 - 14',
      calories: '150',
      protein: '20g',
      desc: 'Single-serve cup pricing for plastic or paper packaging.'
    },
    large: {
      price: 'NPR 35 - 80',
      calories: '1,250',
      protein: '167g',
      desc: '1 liter container pricing based on plastic or paper tubs.'
    }
  },
  chocolate: {
    small: {
      price: 'NPR 6 - 14',
      calories: '160',
      protein: '20g',
      desc: 'Single-serve cup pricing for plastic or paper packaging.'
    },
    large: {
      price: 'NPR 35 - 80',
      calories: '1,330',
      protein: '167g',
      desc: '1 liter container pricing based on plastic or paper tubs.'
    }
  }
};

const nutritionData = {
  tads: { carbs: 12, protein: 20, fat: 6, sugar: 4, carbsVal: '12g', proteinVal: '20g', fatVal: '6g', sugarVal: '4g' },
  regular: { carbs: 32, protein: 3, fat: 15, sugar: 24, carbsVal: '32g', proteinVal: '3g', fatVal: '15g', sugarVal: '24g' }
};

let currentFlavour = 'berry';
let currentSize = 'small';
let isComparing = false;
let currentTheme = 'dark';

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  updateProductDisplay();
  initScrollReveal();
  initComparisonSlider();
  initStickyCTA();
  initFlavourKeyboardSupport();
});

function initTheme() {
  const savedTheme = localStorage.getItem('tads-theme');
  const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
  currentTheme = savedTheme || (prefersLight ? 'light' : 'dark');
  applyTheme(currentTheme);

  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  }
}

function toggleTheme() {
  currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
  applyTheme(currentTheme);
  localStorage.setItem('tads-theme', currentTheme);
}

function applyTheme(theme) {
  const isLight = theme === 'light';
  document.body.setAttribute('data-theme', theme);

  const themeToggle = document.getElementById('theme-toggle');
  const themeLabel = document.getElementById('theme-toggle-label');

  if (themeToggle) {
    themeToggle.setAttribute('aria-pressed', String(isLight));
    themeToggle.setAttribute('aria-label', isLight ? 'Switch to dark mode' : 'Switch to light mode');
  }

  if (themeLabel) {
    themeLabel.textContent = isLight ? 'Light' : 'Dark';
  }
}

function selectFlavour(flavour) {
  currentFlavour = flavour;
  document.body.setAttribute('data-flavour', flavour);

  document.querySelectorAll('.flavour-card').forEach((card) => {
    const isActive = card.dataset.colour === flavour;
    card.classList.toggle('active', isActive);
    card.setAttribute('aria-pressed', isActive);
  });

  updateProductDisplay();
}

function selectSize(size) {
  currentSize = size;

  document.querySelectorAll('.size-btn').forEach((btn) => {
    const isActive = btn.textContent.toLowerCase().includes(size === 'small' ? '120' : '1 l');
    btn.classList.toggle('active', isActive);
    btn.setAttribute('aria-checked', isActive);
  });

  updateProductDisplay();
}

function updateProductDisplay() {
  const product = products[currentFlavour][currentSize];
  const name = currentFlavour === 'berry' ? 'Berry Bliss' : 'Dark Chocolate';
  const sizeText = currentSize === 'small' ? '120 ml' : '1 L tub';

  document.getElementById('product-name').textContent = name;
  document.getElementById('product-desc').textContent = product.desc;
  document.getElementById('product-price').textContent = product.price;
  document.getElementById('product-calories').textContent = product.calories;
  document.getElementById('product-protein').textContent = product.protein;
  document.getElementById('sticky-product').textContent = `${name} - ${sizeText}`;
  document.getElementById('sticky-price').textContent = product.price;
}

function toggleComparison() {
  isComparing = !isComparing;
  const data = isComparing ? nutritionData.regular : nutritionData.tads;

  const thumb = document.getElementById('toggle-thumb');
  const track = document.getElementById('toggle-track');

  if (isComparing) {
    thumb.style.transform = 'translateX(24px)';
    thumb.style.background = 'var(--accent)';
    track.style.background = 'var(--accent-soft)';
  } else {
    thumb.style.transform = 'translateX(0)';
    thumb.style.background = 'var(--fg-muted)';
    track.style.background = 'var(--bg-elevated)';
  }

  document.getElementById('carbs-bar').style.width = `${data.carbs * 2}%`;
  document.getElementById('protein-bar').style.width = `${data.protein * 4}%`;
  document.getElementById('fat-bar').style.width = `${data.fat * 3}%`;
  document.getElementById('sugar-bar').style.width = `${data.sugar * 2}%`;

  document.getElementById('carbs-value').textContent = data.carbsVal;
  document.getElementById('protein-value').textContent = data.proteinVal;
  document.getElementById('fat-value').textContent = data.fatVal;
  document.getElementById('sugar-value').textContent = data.sugarVal;
}

function toggleFaq(button) {
  const item = button.closest('.faq-item');
  const isOpen = item.classList.contains('open');

  document.querySelectorAll('.faq-item').forEach((faqItem) => {
    faqItem.classList.remove('open');
    faqItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
  });

  if (!isOpen) {
    item.classList.add('open');
    button.setAttribute('aria-expanded', 'true');
  }
}

function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));
}

function initComparisonSlider() {
  const slider = document.getElementById('comparison-slider');
  const handle = document.getElementById('comparison-handle');
  const leftSide = document.getElementById('comparison-left');

  if (!slider || !handle || !leftSide) {
    return;
  }

  let isDragging = false;

  const updateSlider = (x) => {
    const rect = slider.getBoundingClientRect();
    let percent = ((x - rect.left) / rect.width) * 100;
    percent = Math.max(10, Math.min(90, percent));

    handle.style.left = `${percent}%`;
    leftSide.style.clipPath = `inset(0 ${100 - percent}% 0 0)`;
  };

  slider.addEventListener('mousedown', (event) => {
    isDragging = true;
    updateSlider(event.clientX);
  });

  document.addEventListener('mousemove', (event) => {
    if (isDragging) {
      updateSlider(event.clientX);
    }
  });

  document.addEventListener('mouseup', () => {
    isDragging = false;
  });

  slider.addEventListener('touchstart', (event) => {
    isDragging = true;
    updateSlider(event.touches[0].clientX);
  });

  slider.addEventListener('touchmove', (event) => {
    if (isDragging) {
      updateSlider(event.touches[0].clientX);
    }
  });

  slider.addEventListener('touchend', () => {
    isDragging = false;
  });
}

function initStickyCTA() {
  const cta = document.getElementById('sticky-cta');
  const hero = document.querySelector('section');

  if (!cta || !hero) {
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      cta.classList.toggle('visible', !entry.isIntersecting);
    });
  }, { threshold: 0 });

  observer.observe(hero);
}

function initFlavourKeyboardSupport() {
  document.querySelectorAll('.flavour-card').forEach((card) => {
    card.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        selectFlavour(card.dataset.colour);
      }
    });
  });
}

window.selectFlavour = selectFlavour;
window.selectSize = selectSize;
window.toggleComparison = toggleComparison;
window.toggleFaq = toggleFaq;
