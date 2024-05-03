// https://izitoast.marcelodolza.com/
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import '../css/iziToast-overwrite.css';

const formEl = document.querySelector('.form');

const toastCommonOpts = {
  position: 'topRight',
  transitionIn: 'fadeIn',
  transitionOut: 'fadeOut',
  animateInside: false,
};

const onFormSubmit = e => {
  e.preventDefault();

  const form = e.currentTarget;
  const delay = form.delay.value;
  const state = form.state.value;

  const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      if (state === 'fulfilled') {
        resolve(`Fulfilled promise in ${delay}ms`);
      } else if (state === 'rejected') {
        reject(`Rejected promise in ${delay}ms`);
      }
    }, delay);
  });

  promise
    .then(result => {
      iziToast.success({
        message: result,
        ...toastCommonOpts,
      });
    })
    .catch(error => {
      iziToast.error({
        message: error,
        ...toastCommonOpts,
      });
    });
};

formEl.addEventListener('submit', onFormSubmit);
