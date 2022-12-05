(function(exports) {
  'use strict';

  exports.openView = (view) => {
    var open = document.querySelector('#views .view.visible');
    if (open) {
      open.classList.remove('visible');
    }

    view.classList.add('visible');
  };
})(window);
