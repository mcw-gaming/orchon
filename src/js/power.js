(function(exports) {
  var powerButton = document.getElementById('overlay-menu-power');

  powerButton.addEventListener('click', () => {
    console.log('press');
    setTimeout(() => {
      contextMenu([
        {
          type: 'button',
          l10nId: 'power-shutdown',
          icon: 'power',
          onclick: () => {}
        },
        {
          type: 'button',
          l10nId: 'power-restart',
          icon: 'reload',
          onclick: () => {}
        },
        {
          type: 'button',
          l10nId: 'power-suspend',
          icon: 'moon',
          onclick: () => {}
        },
        {
          type: 'separator'
        },
        {
          type: 'button',
          l10nId: 'power-desktop',
          icon: 'desktop',
          onclick: () => {}
        }
      ]);
    }, 100);
  });
})(window);
