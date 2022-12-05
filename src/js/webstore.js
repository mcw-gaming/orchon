(function(exports) {
  var webstore = document.getElementById('webstore');
  var webstoreButton = document.getElementById('overlay-menu-webstore');

  webstoreButton.addEventListener('click', () => {
    webstore.src = 'https://orchidfoss.github.io/webstore/index.html?#';
    openView(webstore);

    exports.controller['button1'] = () => {
      webstore.goBack();
    };
    refreshControls();
  });
})(window);
