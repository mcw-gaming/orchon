(function(exports) {
  'use strict';

  exports.openView = (view) => {
    var overlayMenu = document.getElementById('overlay-menu');
    overlayMenu.classList.remove('visible');

    var views = document.getElementById('views');
    views.classList.remove('hidden');

    var highlightedButton = document.querySelector('#overlay-menu-options ul .selected');
    if (highlightedButton) {
      highlightedButton.classList.remove('selected');
    }
    var open = document.querySelector('#views .view.visible');
    if (open) {
      open.classList.remove('visible');
    }

    var button = document.getElementById('overlay-menu-' + view.id);
    if (button) {
      button.classList.add('selected');
    }
    view.classList.add('visible');
  };
})(window);
