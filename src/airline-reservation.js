import HelptipManager from './HelptipManager';
import SnackbarManager from './SnackbarManager';
import './style/style.scss';
import { $ } from './util';

const MAX_RESERVABLE_ADULT_PASSENGER_COUNT = 3;
const ERROR_MESSAGE = {
  OVER_RESERVABLE_ADULT: '인원수는 0명에서 3명까지만 가능합니다',
};

// airline mission
document.addEventListener('DOMContentLoaded', () => {
  const $adultPassengerField = $('.adult-passenger-field');
  const helptipManager = new HelptipManager('.helptip-container', $adultPassengerField);

  const snackbarManager = new SnackbarManager();
  const $adultPassengerSpin = $('.adult-passenger-spin', $adultPassengerField);
  const $adultPassengerSpinInput = $('input', $adultPassengerSpin);
  const $ariaLivePolite = $('#aria-live-polite-message');
  const $ariaLiveAssertive = $('#aria-live-polite-message');

  // @TODO: 위의 element들 null check

  helptipManager.start(
    () => {
      $ariaLivePolite.textContent = '국제선 만 12세 이상, 국내선 만 13세 이상';
    },
    () => {
      $ariaLivePolite.textContent = '';
    },
  );

  $adultPassengerSpin.addEventListener('click', e => {
    if (!e.target) return;
    const { target: element } = e;
    const localName = element.localName;
    if (localName !== 'button') return;

    const step = Number(element.getAttribute('data-step'));
    if (step !== -1 && step !== 1) return;

    const value = parseInt($adultPassengerSpinInput.valueAsNumber, 10);

    const nextValue = value + step;
    if (nextValue < 0 || nextValue > 3) {
      snackbarManager.show(ERROR_MESSAGE.OVER_RESERVABLE_ADULT, () => ($ariaLivePolite.textContent = ''));
      $ariaLivePolite.textContent = ERROR_MESSAGE.OVER_RESERVABLE_ADULT;
      return;
    }

    $adultPassengerSpinInput.value = Math.max(0, Math.min(MAX_RESERVABLE_ADULT_PASSENGER_COUNT, nextValue));
    $ariaLivePolite.textContent = `성인 승객 추가 ${$adultPassengerSpinInput.value}`;
  });

  $adultPassengerSpinInput.addEventListener('input', e => {
    const { target } = e;
    if (!target) return;
    if (target.localName !== 'input') return;

    target.value = Number(target.value.replace(/[^0-9]/g, ''));

    let isProperRange = true;

    const min = target.getAttribute('min');
    const max = target.getAttribute('max');
    if (min !== null) {
      if (target.value < Number(min)) {
        isProperRange = false;
        target.value = min;
        snackbarManager.show(ERROR_MESSAGE.OVER_RESERVABLE_ADULT, () => ($ariaLiveAssertive.textContent = ''));
        $ariaLiveAssertive.textContent = ERROR_MESSAGE.OVER_RESERVABLE_ADULT;
      }
    }
    if (max !== null) {
      if (target.value > Number(max)) {
        isProperRange = false;
        snackbarManager.show(ERROR_MESSAGE.OVER_RESERVABLE_ADULT, () => ($ariaLiveAssertive.textContent = ''));
        $ariaLiveAssertive.textContent = ERROR_MESSAGE.OVER_RESERVABLE_ADULT;
        target.value = max;
      }
    }

    if (isProperRange) {
      $ariaLivePolite.textContent = `성인 승객 추가 ${target.value}`;
    }
  });
});
