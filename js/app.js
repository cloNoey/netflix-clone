import HeaderModal from './modal.js';
import Slider from './slider.js';

class NetflixApp {
  constructor() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.init());
    } else {
      this.init();
    }
  }

  init() {
    this.initModals();
    this.initSliders();
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
}

new NetflixApp();