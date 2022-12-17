(function(exports) {
  'use strict';

  var screen = document.getElementById('screen');
  var splashscreen = document.getElementById('splashscreen');

  document.addEventListener('DOMContentLoaded', () => {
    splashscreen.classList.add('visible');
  });

  window.addEventListener('load', () => {
    setTimeout(() => {
      splashscreen.classList.add('hidden');
      setTimeout(() => {
        screen.classList.add('loaded');
      }, 500);
    }, 2000);
  });
})(window);
