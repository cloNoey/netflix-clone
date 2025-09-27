import HeaderModal from './modal.js';
import Slider from './slider.js';
import Like from './like.js';

class NetflixApp {
  constructor() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.init());
    } else {
      this.init();
    }
  }

  async init() {
    await this.loadMovieData();
    this.initModals();
    this.initSliders();
    this.initLikes();
  }

  async loadMovieData() {
    try {
      const response = await fetch('./data/movies.json');
      this.movieData = await response.json();
      this.renderCategories();
    } catch (error) {
      console.error('Failed to load movie data:', error);
    }
  }

  renderCategories() {
    const container = document.querySelector('.categories-container');
    container.innerHTML = ''; // 기존 내용 제거

    Object.entries(this.movieData.categories).forEach(([categoryId, category]) => {
      const section = this.createCategorySection(categoryId, category);
      container.appendChild(section);
    });
  }

  createCategorySection(categoryId, category) {
    const section = document.createElement('section');
    section.className = 'category-section';
    section.innerHTML = `
      <h2 class="category-title">${category.title}</h2>
      <div class="slider-container" data-slider-container data-category="${categoryId}" data-slides-to-show="6" data-slides-to-scroll="6">
        <button class="slider-btn slider-btn-prev" aria-label="이전">‹</button>
        <div class="slider">
          <div class="slider-track">
            ${this.createMovieCards(category.slides)}
          </div>
        </div>
        <button class="slider-btn slider-btn-next" aria-label="다음">›</button>
        <div class="pagination"></div>
      </div>
    `;
    return section;
  }

  createMovieCards(movieIds) {
    return movieIds.map(movieId => {
      const movie = this.movieData.movies[movieId];
      return `
        <div class="slide" data-movie-id="${movie.id}">
          <div class="card">
            <img src="${movie.imageUrl}" alt="${movie.title}">
            <div class="card-content">
              <h3>${movie.title}</h3>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  initModals() {
    const modals = [
      { trigger: '[data-modal-trigger="notification"]', id: 'notification-modal' },
      { trigger: '[data-modal-trigger="profile"]', id: 'profile-modal' }
    ];

    modals.forEach(({ trigger, id }) => {
      const el = document.querySelector(trigger);
      if (el) new HeaderModal({ trigger: el, modalId: id });
    });
  }

  initSliders() {
    document.querySelectorAll('[data-slider-container]').forEach(container => {
      new Slider({
        container,
        categoryId: container.dataset.category || container.id,
        slidesToShow: parseInt(container.dataset.slidesToShow) || 6,
        slidesToScroll: parseInt(container.dataset.slidesToScroll) || 6,
        infinite: container.dataset.infinite !== 'false',
        animationDuration: parseInt(container.dataset.animationDuration) || 500
      });
    });
  }

  initLikes() {
    document.querySelectorAll('.slide').forEach(slide => {
      new Like({
        container: slide,
        movieId: slide.dataset.movieId
      });
    });
  }
}

new NetflixApp();