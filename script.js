const header = document.querySelector('header');
const shrinkThreshold = 40;
const expandThreshold = 20;
let headerShrunk = false;
let ignoreHeaderShrink = false;

const updateHeaderSize = () => {
  if (!header || ignoreHeaderShrink) return;
  const scrollY = window.scrollY || window.pageYOffset;

  if (!headerShrunk && scrollY >= shrinkThreshold) {
    header.classList.add('shrink');
    headerShrunk = true;
  } else if (headerShrunk && scrollY <= expandThreshold) {
    header.classList.remove('shrink');
    headerShrunk = false;
  }
};

window.addEventListener('scroll', () => requestAnimationFrame(updateHeaderSize), { passive: true });
window.addEventListener('resize', () => requestAnimationFrame(updateHeaderSize));
document.addEventListener('DOMContentLoaded', () => {
  updateHeaderSize();
  initAccordionBehavior();
  initChapterSearch();
  initContributionCarousel();
});

const initContributionCarousel = () => {
  const carousel = document.querySelector('.contribution-carousel');
  if (!carousel) return;

  const slides = Array.from(carousel.querySelectorAll('.contribution-slide'));
  const dots = Array.from(carousel.querySelectorAll('.carousel-dot'));
  const prevButton = carousel.querySelector('.carousel-btn.prev');
  const nextButton = carousel.querySelector('.carousel-btn.next');

  if (!slides.length) return;

  let currentIndex = 0;

  const showSlide = (index) => {
    currentIndex = (index + slides.length) % slides.length;

    slides.forEach((slide, slideIndex) => {
      slide.classList.toggle('active', slideIndex === currentIndex);
    });

    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle('active', dotIndex === currentIndex);
    });
  };

  prevButton?.addEventListener('click', () => showSlide(currentIndex - 1));
  nextButton?.addEventListener('click', () => showSlide(currentIndex + 1));

  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => showSlide(index));
  });

  let autoRotate = setInterval(() => showSlide(currentIndex + 1), 5000);

  carousel.addEventListener('mouseenter', () => clearInterval(autoRotate));
  carousel.addEventListener('mouseleave', () => {
    autoRotate = setInterval(() => showSlide(currentIndex + 1), 5000);
  });

  showSlide(0);
};

const initChapterSearch = () => {
  const searchInput = document.getElementById('chapter-search');
  const tableBody = document.getElementById('chapter-table-body');

  if (!searchInput || !tableBody) return;

  const rows = Array.from(tableBody.querySelectorAll('tr'));

  const updateResults = () => {
    const query = searchInput.value.trim().toLowerCase();
    let visibleCount = 0;

    rows.forEach((row) => {
      const text = row.textContent.toLowerCase();
      const matches = text.includes(query);
      row.classList.toggle('is-hidden', !matches);
      if (matches) visibleCount += 1;
    });

    const existingEmptyState = tableBody.querySelector('.chapter-empty');
    if (existingEmptyState) existingEmptyState.remove();

    if (visibleCount === 0) {
      const emptyRow = document.createElement('tr');
      emptyRow.className = 'chapter-empty';
      emptyRow.innerHTML = '<td colspan="4">No chapters match your search yet.</td>';
      tableBody.appendChild(emptyRow);
    }
  };

  searchInput.addEventListener('input', updateResults);
  updateResults();
};

const initAccordionBehavior = () => {
  const teamToggles = document.querySelectorAll('.team-toggle');
  const deptToggles = document.querySelectorAll('.dept-toggle');

  const scrollIntoView = (element) => {
    if (!element) return;
    ignoreHeaderShrink = true;

    window.requestAnimationFrame(() => {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setTimeout(() => {
        ignoreHeaderShrink = false;
        updateHeaderSize();
      }, 500);
    });
  };

  teamToggles.forEach((toggle) => {
    toggle.addEventListener('change', () => {
      if (!toggle.checked) return;

      teamToggles.forEach((otherToggle) => {
        if (otherToggle !== toggle) {
          otherToggle.checked = false;
        }
      });

      const card = toggle.closest('.team-card');
      scrollIntoView(card);
    });
  });

  deptToggles.forEach((toggle) => {
    toggle.addEventListener('change', () => {
      if (!toggle.checked) return;

      deptToggles.forEach((otherToggle) => {
        if (otherToggle !== toggle) {
          otherToggle.checked = false;
        }
      });

      const card = toggle.closest('.department-card');
      scrollIntoView(card);
    });
  });
};
