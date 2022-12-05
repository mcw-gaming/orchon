(function(exports) {
  var overlayMenu = document.getElementById('overlay-menu');
  var overlayMenuOptions = document.getElementById('overlay-menu-options');
  var overlayMenuDeadzone = document.getElementById('overlay-menu-deadzone');
  var views = document.getElementById('views');

  overlayMenuDeadzone.addEventListener('click', () => {
    overlayMenu.classList.remove('visible');
    views.classList.remove('hidden');
  });

  exports.controller['power'] = () => {
    overlayMenu.classList.toggle('visible');
    views.classList.toggle('hidden');
  };
})(window);
