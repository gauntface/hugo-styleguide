const OVERLAY_SELECTOR = '.n-gs-c-grid-overlay';
const OVERLAY_BTN_SELECTOR = '.n-gs-c-grid-overlay__toggle';
const TOGGLE_CLASS = 'n-gs-c-grid-overlay--hidden';

class GridOverlay {
  private overlayElement: HTMLElement;

  constructor() {
    this.overlayElement = document.querySelector(OVERLAY_SELECTOR);
    const tes = document.querySelectorAll(OVERLAY_BTN_SELECTOR);
    for (const te of tes) {
      te.addEventListener('click', () => this.toggleOverlay());
    }
  }

  toggleOverlay() {
    this.overlayElement.classList.toggle(TOGGLE_CLASS);
  }
}

window.addEventListener('load', function() {
  if (!document.querySelector(OVERLAY_SELECTOR)) {
      return
  }
  new GridOverlay();
});