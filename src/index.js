// для того, чтобы на мобильных браузерах адресная строка не закрывала viewport
// Взято с сайта https://css-tricks.com/the-trick-to-viewport-units-on-mobile/
// First we get the viewport height and we multiple it by 1% to get a value for a vh unit
let vh = window.innerHeight * 0.01;
// Then we set the value in the --vh custom property to the root of the document
document.documentElement.style.setProperty('--vh', `${vh}px`);

// изменяем viewport под размер изменяемого окна
// We listen to the resize event
window.addEventListener('resize', () => {
  // We execute the same script as before
  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
});

// показывает ошибки (для мобильного браузера)
// window.onerror = function(msg, url, line) {
// 	this.alert(msg + '\n' + url + '\n' + line)
// 	return true
// }

import './scss/main.scss'

import Router from './js/Router'

Router.loadPage({page: 'login'})
