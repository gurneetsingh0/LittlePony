const track = document.querySelector(".carousel-track");
const cards = document.querySelectorAll(".cards");
const viewport = document.querySelector(".carousel-viewport");
const nextBtn = document.querySelector(".arrow.right");
const prevBtn = document.querySelector(".arrow.left");

let index = 0;
let autoplayInterval = null;

const AUTOPLAY_DELAY = 6000;
const TRANSITION_SPEED = 600;
const SWIPE_THRESHOLD = 50;

track.style.transition = `transform ${TRANSITION_SPEED}ms ease-in-out`;

function updateSlide() {
  const cardWidth = cards[0].offsetWidth;
  const gap = parseFloat(getComputedStyle(track).gap) || 0;
  const moveX = index * (cardWidth + gap);

  track.style.transform = `translateX(-${moveX}px)`;
}

function startAutoplay() {
  stopAutoplay();
  autoplayInterval = setInterval(() => {
    index = (index + 1) % cards.length;
    updateSlide();
  }, AUTOPLAY_DELAY);
}

function stopAutoplay() {
  if (autoplayInterval) {
    clearInterval(autoplayInterval);
    autoplayInterval = null;
  }
}

function resetAutoplay() {
  startAutoplay();
}

nextBtn?.addEventListener("click", () => {
  index = (index + 1) % cards.length;
  updateSlide();
  resetAutoplay();
});

prevBtn?.addEventListener("click", () => {
  index = (index - 1 + cards.length) % cards.length;
  updateSlide();
  resetAutoplay();
});

cards.forEach((card) => {
  card.addEventListener("mouseenter", stopAutoplay);
  card.addEventListener("mouseleave", startAutoplay);
});

let startX = 0;
let isDragging = false;

viewport.addEventListener("touchstart", (e) => {
  startX = e.touches[0].clientX;
  isDragging = true;
  stopAutoplay();
});

viewport.addEventListener("touchend", (e) => {
  if (!isDragging) return;

  const endX = e.changedTouches[0].clientX;
  const diff = startX - endX;

  if (Math.abs(diff) > SWIPE_THRESHOLD) {
    if (diff > 0) {
      index = (index + 1) % cards.length;
    } else {
      index = (index - 1 + cards.length) % cards.length;
    }
    updateSlide();
  }

  isDragging = false;
  resetAutoplay();
});

updateSlide();
startAutoplay();

window.addEventListener("resize", updateSlide);
