import './style/normolize.css';
import './style/style.css';
import './style/style.scss';
import './style/media.css';
import { templateEngine } from './lib/templating-engine';
import { hourItemTamplate } from './lib/hourItemTamplate';

import Swal from '../node_modules/sweetalert2/dist/sweetalert2.js';
import '../node_modules/sweetalert2/dist/sweetalert2.css';

const radioButtons = document.querySelectorAll('.set-time__radio');
const body = document;
const menu = document.querySelectorAll('.menu');
const selectMenu = document.querySelectorAll('.menu__list');
let timeTitle = document.querySelector('.top__title');
let timeAlarm = null;
const setAlarmButton = document.querySelector('.container__btn');
const valueAlarm = document.querySelectorAll('.set-time__value');
const bottom = document.querySelector('.bottom');

let toggleAlarm = true;
let ringtone = new Audio('./files/ringtone2.mp3');

setInterval(() => {
  let data = new Date();
  let hours = data.getHours();
  let minutes = data.getMinutes();
  let seconds = data.getSeconds();
  hours = hours < 10 ? '0' + hours : hours;
  minutes = minutes < 10 ? '0' + minutes : minutes;
  seconds = seconds < 10 ? '0' + seconds : seconds;
  timeTitle.textContent = `${hours}:${minutes}:${seconds}`;
  if (timeAlarm === `${hours}:${minutes}:${seconds}`) {
    ringtone.play();
    ringtone.loop = true;
  }
});

for (let i = 0; i <= 23; i++) {
  i = i < 10 ? '0' + i : i;
  selectMenu[0].appendChild(templateEngine(hourItemTamplate(i)));
}

for (let i = 0; i <= 59; i++) {
  i = i < 10 ? '0' + i : i;
  selectMenu[1].appendChild(templateEngine(hourItemTamplate(i)));
}

body.addEventListener('mousedown', (e) => {
  const targetElement = e.target;
  if (targetElement.classList.contains('menu__item')) {
    targetElement
      .closest('.set-time')
      .querySelector('.set-time__value').textContent =
      targetElement.textContent;
    hideMenu();
    return;
  }

  if (
    !targetElement.closest('.set-time') ||
    targetElement.classList.contains('set-time')
  ) {
    hideMenu();
    return;
  }

  const radioButton = targetElement.previousElementSibling;
  if (radioButton.checked) {
    return;
  }
  if (!radioButton.checked) {
    hideMenu();
    return;
  }
});

radioButtons.forEach((radioButton) => {
  radioButton.addEventListener('click', showMenu);
});

setAlarmButton.addEventListener('click', setAlarm);

function setAlarm() {
  const hoursAlarm = valueAlarm[0].textContent;
  const minutesAlarm = valueAlarm[1].textContent;
  timeAlarm = `${hoursAlarm}:${minutesAlarm}:00`;
  if (hoursAlarm.includes('????????') || minutesAlarm.includes('????????????')) {
    Swal.fire({
      title: '??????',
      text: '???????????????????? ?????????????? ??????????, ?????????? ?????????????? ??????????????????.',
      icon: 'warning',
      confirmButtonText: 'Ok',
    });
    return;
  }
  if (toggleAlarm) {
    radioButtons.forEach((radioButton) => {
      radioButton.removeEventListener('click', showMenu);
    });
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: false,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
      },
    });
    Toast.fire({
      icon: 'success',
      title: `???? ???????????? ?????????????????? ???? ${hoursAlarm}:${minutesAlarm}`,
    });
    setAlarmButton.textContent = '???????????????? ??????????????????';
    bottom.classList.add('bottom_opacity');
    toggleAlarm = false;
  } else {
    radioButtons.forEach((radioButton) => {
      ringtone.pause();
      ringtone.currentTime = 0;
      radioButton.addEventListener('click', showMenu);
    });
    setAlarmButton.textContent = '?????????????? ??????????????????';
    valueAlarm[0].textContent = '????????';
    valueAlarm[1].textContent = '????????????';
    bottom.classList.remove('bottom_opacity');
    toggleAlarm = true;
  }
}

function showMenu(e) {
  const targetElement = e.target;
  const parentElement = targetElement.closest('.set-time');
  const menu = parentElement.querySelector('.menu');
  menu.classList.toggle('menu_active');
}

function hideMenu() {
  menu.forEach((element) => {
    element.classList.remove('menu_active');
  });
}
