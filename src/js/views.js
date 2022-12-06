(function(exports) {
  'use strict';

  exports.openView = (view) => {
    var overlayMenu = document.getElementById('overlay-menu');
    overlayMenu.classList.remove('visible');

    var views = document.getElementById('views');
    views.classList.remove('hidden');

    var open = document.querySelector('#views .view.visible');
    if (open) {
      open.classList.remove('visible');
    }

    view.classList.add('visible');
  };
})(window);
