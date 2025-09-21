export default class HeaderModal {
  constructor(options) {
    this.trigger = options.trigger;
    this.modalId = options.modalId;
    this.hideTimeout = null;
    
    this.init();
  }

  init() {
    this.createModal();
    this.bindEvents();
  }

  createModal() {
    this.modal = document.getElementById(this.modalId) || this.buildModal();
  }

  buildModal() {
    const modal = document.createElement('div');
    modal.id = this.modalId;
    modal.className = 'header-modal';
    modal.innerHTML = this.getContent();
    this.trigger.parentNode.appendChild(modal);
    return modal;
  }

  getContent() {
    const isNotification = this.modalId.includes('notification');
    
    return `
      <div class="modal-content">
        <h3>${isNotification ? '알림' : '프로필'}</h3>
        <ul class="${isNotification ? 'notification-list' : 'profile-menu'}">
          ${isNotification ? `
            <li>새로운 콘텐츠가 추가되었습니다.</li>
            <li>시청 중이던 콘텐츠가 업데이트되었습니다.</li>
          ` : `
            <li>계정 설정</li>
            <li>프로필 관리</li>
            <li>로그아웃</li>
          `}
        </ul>
      </div>
    `;
  }

  bindEvents() {
    this.trigger.addEventListener('mouseenter', () => this.show());
    this.trigger.addEventListener('mouseleave', () => this.scheduleHide());
    this.modal.addEventListener('mouseenter', () => this.cancelHide());
    this.modal.addEventListener('mouseleave', () => this.scheduleHide());
  }

  show() {
    this.cancelHide();
    this.modal.classList.add('show');
  }

  scheduleHide() {
    this.hideTimeout = setTimeout(() => this.hide(), 200);
  }

  cancelHide() {
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
      this.hideTimeout = null;
    }
  }

  hide() {
    this.modal.classList.remove('show');
  }
}