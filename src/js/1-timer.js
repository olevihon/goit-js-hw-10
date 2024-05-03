// https://flatpickr.js.org/
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

// https://izitoast.marcelodolza.com/
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import '../css/iziToast-overwrite.css';

const refs = {
  pickerInput: document.querySelector('input[id="datetime-picker"]'),
  startBtn: document.querySelector('button[data-start]'),
  daysEl: document.querySelector('[data-days]'),
  hoursEl: document.querySelector('[data-hours]'),
  minsEl: document.querySelector('[data-minutes]'),
  secsEl: document.querySelector('[data-seconds]'),
};

let intervalId = null;
let userSelectedDate = null;

const pickerOptions = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    userSelectedDate = selectedDates[0];

    if (userSelectedDate < Date.now()) {
      setDisabled(refs.startBtn);
      showErrorMessage();
      return;
    }

    unsetDisabled(refs.startBtn);
  },
};

flatpickr(refs.pickerInput, pickerOptions);

const timer = {
  start() {
    let currentTime = Date.now();
    let deltaTime = userSelectedDate - currentTime;

    setDisabled(refs.startBtn);
    setDisabled(refs.pickerInput);
    updateClockface(convertMs(deltaTime));

    intervalId = setInterval(() => {
      currentTime = Date.now();
      deltaTime = userSelectedDate - currentTime;

      if (deltaTime < 0) {
        this.stop();
        return;
      }

      updateClockface(convertMs(deltaTime));
    }, 1000);
  },
  stop() {
    clearInterval(intervalId);
    unsetDisabled(refs.pickerInput);
  },
};

const onStart = e => {
  if (e.target.disabled) return;
  timer.start();
};

refs.startBtn.addEventListener('click', onStart);

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = addLeadingZero(Math.floor(ms / day));
  // Remaining hours
  const hours = addLeadingZero(Math.floor((ms % day) / hour));
  // Remaining minutes
  const minutes = addLeadingZero(Math.floor(((ms % day) % hour) / minute));
  // Remaining seconds
  const seconds = addLeadingZero(
    Math.floor((((ms % day) % hour) % minute) / second)
  );

  return { days, hours, minutes, seconds };
}

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

function updateClockface({ days, hours, minutes, seconds }) {
  refs.daysEl.textContent = days;
  refs.hoursEl.textContent = hours;
  refs.minsEl.textContent = minutes;
  refs.secsEl.textContent = seconds;
}

function setDisabled(el) {
  el.disabled = true;
}

function unsetDisabled(el) {
  el.disabled = false;
}

function showErrorMessage() {
  iziToast.error({
    message: 'Please choose a date in the future',
    position: 'topRight',
    transitionIn: 'fadeIn',
    transitionOut: 'fadeOut',
    animateInside: false,
  });
}
