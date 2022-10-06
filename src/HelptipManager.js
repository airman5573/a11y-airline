import { $ } from './util';

class HelptipManager {
  #helptipTrigger = null;
  #helptipElement = null;

  constructor(containerSelector = 'helptip-container', $parent = document) {
    const $container = $(containerSelector, $parent);
    if (!$container) throw new Error('Helptip Container가 없습니다');
    this.#helptipTrigger = $('.helptip-trigger', $container);
    this.#helptipElement = $('.helptip', $container);
    this.#check();
  }

  start() {
    this.#check();
    window.addEventListener('click', this.#clickOutsideHandler);
    this.#helptipTrigger.addEventListener('click', this.#eventHandler);
  }

  end() {
    window.removeEventListener('click', this.#clickOutsideHandler);
    this.#helptipTrigger.removeEventListener('click', this.#eventHandler);
  }

  #clickOutsideHandler = e => {
    this.#check();
    const isIncluded = e.path.some(el => el === this.#helptipTrigger || el === this.#helptipElement);
    if (isIncluded) return;
    this.#hide();
  };

  #eventHandler = () => {
    this.#toggle();
  };

  #toggle() {
    this.#check();
    this.#isHidden() ? this.#show() : this.#hide();
  }

  #isHidden() {
    return !this.#helptipElement.classList.contains('show');
  }

  #show() {
    this.#check();
    this.#helptipElement.classList.add('show');
  }

  #hide() {
    this.#check();
    this.#helptipElement.classList.remove('show');
  }

  #check() {
    if (this.#helptipElement === null || this.#helptipTrigger === null) {
      throw new Error('helptip selector를 다시 확인해 주세요');
    }
  }
}

export default HelptipManager;