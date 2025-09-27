export default class Like {
  constructor(options) {
    this.slide = options.container;
    this.movieId = options.movieId;
    this.isClone = this.slide.classList.contains('clone');
    
    // 전역 상태 초기화
    if (!window.netflixLikeState) {
      window.netflixLikeState = {
        likedMovies: new Set(),
        likeCounts: new Map()
      };
    }
    
    this.init();
  }

  init() {
    this.createLikeButton();
    this.createLikeCount();
    
    if (!this.isClone) {
      this.bindEvents();
    }
  }

  createLikeButton() {
    this.likeButton = document.createElement('button');
    this.likeButton.className = 'like-button';
    this.likeButton.innerHTML = '❤️';
    
    // 기존 좋아요 상태 반영
    if (window.netflixLikeState.likedMovies.has(this.movieId)) {
      this.likeButton.classList.add('liked');
    }

    this.slide.appendChild(this.likeButton);
  }

  createLikeCount() {
    this.likeCountElement = document.createElement('div');
    this.likeCountElement.className = 'like-count';
    
    // 초기 카운트 설정
    if (!window.netflixLikeState.likeCounts.has(this.movieId)) {
      window.netflixLikeState.likeCounts.set(this.movieId, 0);
    }
    
    this.updateLikeCountDisplay();
    this.slide.appendChild(this.likeCountElement);
  }

  updateLikeCountDisplay() {
    const count = window.netflixLikeState.likeCounts.get(this.movieId);
    this.likeCountElement.textContent = this.formatNumber(count);
  }

  formatNumber(num) {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  }

  bindEvents() {
    this.likeButton.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.toggleLike();
    });
  }

  toggleLike() {
    if (this.isClone) return;

    const currentCount = window.netflixLikeState.likeCounts.get(this.movieId);
    window.netflixLikeState.likeCounts.set(this.movieId, currentCount + 1);
    window.netflixLikeState.likedMovies.add(this.movieId);
    this.likeButton.classList.add('liked');

    // 모든 동일한 영화의 좋아요 상태와 카운트 업데이트
    this.updateAllInstances();
  }

  updateAllInstances() {
    // 모든 동일한 movieId를 가진 슬라이드 찾기
    const allSlides = document.querySelectorAll(`[data-movie-id="${this.movieId}"]`);
    
    allSlides.forEach(slide => {
      const likeButton = slide.querySelector('.like-button');
      const likeCount = slide.querySelector('.like-count');
      
      if (likeButton) {
        likeButton.classList.add('liked');
      }
      
      if (likeCount) {
        likeCount.textContent = this.formatNumber(
          window.netflixLikeState.likeCounts.get(this.movieId)
        );
      }
    });
  }
}