(function(exports) {
  var screen = document.getElementById('screen');
  var webstore = document.getElementById('webstore');
  var webstoreButton = document.getElementById('overlay-menu-webstore');

  webstoreButton.addEventListener('click', () => {
    webstore.src = 'https://orchidfoss.github.io/webstore/';
    webstore.addEventListener('did-change-theme-color', (evt) => {
      console.log(evt);
      screen.style.setProperty('--theme-color', evt.themeColor);
      if (lightOrDark(evt.themeColor) == 'light') {
        screen.classList.add('light');
      } else {
        screen.classList.remove('light');
      }
    });
    webstore.preload = 'preload.js';
    openView(webstore);

    exports.controller = {};
    exports.controller['button1'] = () => {
      webstore.goBack();
    };
    refreshControls();
  });
})(window);
