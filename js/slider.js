export default class Slider {
  constructor(options) {
    this.container = options.container;
    this.categoryId = options.categoryId;
    this.slidesToShow = options.slidesToShow || 6;
    this.slidesToScroll = options.slidesToScroll || 6;
    this.infinite = options.infinite !== false;
    this.animationDuration = options.animationDuration || 500;
    
    this.currentIndex = 0;
    this.isAnimating = false;
    
    this.init();
  }

  init() {
    this.track = this.container.querySelector('.slider-track');
    this.slides = Array.from(this.track.querySelectorAll('.slide:not(.clone)'));
    this.totalSlides = this.slides.length;
    this.maxIndex = Math.max(0, this.totalSlides - this.slidesToShow);
    
    if (this.infinite && this.totalSlides > this.slidesToShow) {
      this.setupInfiniteMode();
    }
    
    this.setSlideWidth();
    this.bindEvents();
    this.updateUI();
  }

  setupInfiniteMode() {
    // 앞뒤로 복제
    const clone = (slides, prepend = false) => {
      slides.forEach(slide => {
        const cloned = slide.cloneNode(true);
        cloned.classList.add('clone');
        this.track[prepend ? 'prepend' : 'append'](cloned);
      });
    };
    
    clone(this.slides.slice(-this.slidesToShow), true);  // 뒤 → 앞
    clone(this.slides.slice(0, this.slidesToShow));       // 앞 → 뒤
    
    this.currentIndex = this.slidesToShow;
    this.moveTo(this.currentIndex, false);
  }

  setSlideWidth() {
    const width = 100 / this.slidesToShow;
    this.track.querySelectorAll('.slide').forEach(slide => {
      slide.style.width = `${width}%`;
    });
  }

  bindEvents() {
    const prevBtn = this.container.querySelector('.slider-btn-prev');
    const nextBtn = this.container.querySelector('.slider-btn-next');
    
    if (prevBtn) prevBtn.onclick = () => this.prev();
    if (nextBtn) nextBtn.onclick = () => this.next();
    
    window.addEventListener('resize', () => {
      this.setSlideWidth();
      this.moveTo(this.currentIndex, false);
    });
  }

  prev() {
    if (this.isAnimating) return;
    
    const actualIndex = this.getActualIndex();
    let targetIndex = actualIndex - this.slidesToScroll;
    
    if (targetIndex < 0) {
      targetIndex = this.infinite && actualIndex === 0 ? this.maxIndex : 0;
    }
    
    this.slideTo(targetIndex, 'prev');
  }

  next() {
    if (this.isAnimating) return;
    
    const actualIndex = this.getActualIndex();
    let targetIndex = actualIndex + this.slidesToScroll;
    
    if (targetIndex > this.maxIndex) {
      targetIndex = this.infinite && actualIndex === this.maxIndex ? 0 : this.maxIndex;
    }
    
    this.slideTo(targetIndex, 'next');
  }

  slideTo(targetIndex, direction = 'next') {
    this.isAnimating = true;
    
    const actualIndex = this.getActualIndex();
    const finalIndex = this.infinite ? targetIndex + this.slidesToShow : targetIndex;
    
    // 무한 루프: 끝 → 처음, 처음 → 끝
    if (this.infinite) {
      if (direction === 'next' && actualIndex === this.maxIndex && targetIndex === 0) {
        // 마지막에서 처음으로: 오른쪽으로 계속 이동
        this.moveTo(this.currentIndex + this.slidesToShow, true);
      } else if (direction === 'prev' && actualIndex === 0 && targetIndex === this.maxIndex) {
        // 처음에서 마지막으로: 왼쪽으로 계속 이동
        this.moveTo(this.currentIndex - this.slidesToShow, true);
      } else {
        this.moveTo(finalIndex, true);
      }
    } else {
      this.moveTo(finalIndex, true);
    }
    
    setTimeout(() => {
      if (this.infinite) this.checkLoop(targetIndex);
      this.isAnimating = false;
      this.updateUI();
    }, this.animationDuration);
  }

  moveTo(index, animate = true) {
    this.track.style.transition = animate ? `transform ${this.animationDuration}ms ease-in-out` : 'none';
    this.track.style.transform = `translateX(-${index * (100 / this.slidesToShow)}%)`;
    this.currentIndex = index;
  }

  checkLoop(targetIndex) {
    const actualIndex = this.getActualIndex();
    
    // 오른쪽 끝을 넘어간 경우 (복제본 영역)
    if (actualIndex > this.maxIndex) {
      this.moveTo(targetIndex + this.slidesToShow, false);
    } 
    // 왼쪽 끝을 넘어간 경우 (복제본 영역)
    else if (actualIndex < 0) {
      this.moveTo(targetIndex + this.slidesToShow, false);
    }
  }

  getActualIndex() {
    return this.infinite ? this.currentIndex - this.slidesToShow : this.currentIndex;
  }

  updateUI() {
    this.updateButtons();
    this.updatePagination();
  }

  updateButtons() {
    const prevBtn = this.container.querySelector('.slider-btn-prev');
    const nextBtn = this.container.querySelector('.slider-btn-next');
    
    if (!this.infinite) {
      if (prevBtn) prevBtn.disabled = this.currentIndex <= 0;
      if (nextBtn) nextBtn.disabled = this.currentIndex >= this.maxIndex;
    }
  }

  updatePagination() {
    const pagination = this.container.querySelector('.pagination');
    if (!pagination) return;
    
    const actualIndex = this.getActualIndex();
    const pages = this.getPages();
    const currentPage = pages.findIndex((p, i) => 
      actualIndex >= p && (i === pages.length - 1 || actualIndex < pages[i + 1])
    );
    
    pagination.innerHTML = pages.map((pageIndex, i) => {
      const dot = document.createElement('span');
      dot.className = `pagination-dot${i === currentPage ? ' active' : ''}`;
      dot.onclick = () => this.slideTo(pageIndex);
      return dot.outerHTML;
    }).join('');
  }

  getPages() {
    const pages = [];
    for (let i = 0; i <= this.maxIndex; i += this.slidesToScroll) {
      pages.push(i);
    }
    if (pages[pages.length - 1] !== this.maxIndex) {
      pages.push(this.maxIndex);
    }
    return pages;
  }
}