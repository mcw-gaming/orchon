(function(exports) {
  'use strict';

  const fs = require('fs');
  const { exec } = require('child_process');

  function runCommand(shellCommand) {
    exec(shellCommand, (error, stdout, stderr) => {
      if (error) {
        console.error(error);
      }
    });
  }

  var BACKGROUND_MUSIC = new Audio('resources/sounds/home_music.mp3');
  var LAUNCH_APP_SOUND = new Audio('resources/sounds/launch.wav');

  var home = document.getElementById('home');
  var appsContainer = document.getElementById('home-installed');
  window.openView(home);

  BACKGROUND_MUSIC.play();
  BACKGROUND_MUSIC.onended = () => {
    BACKGROUND_MUSIC.play();
  };
  function audioTicker() {
    requestAnimationFrame(audioTicker);

    if (home.classList.contains('visible')) {
      if (BACKGROUND_MUSIC.volume <= 1 && BACKGROUND_MUSIC.volume !== 1) {
        BACKGROUND_MUSIC.volume += 0.1;
      }
    } else {
      if (BACKGROUND_MUSIC.volume >= 0.1) {
        BACKGROUND_MUSIC.volume -= 0.1;
      }
    }
  }
  audioTicker();

  var homeButton = document.getElementById('overlay-menu-home');
  homeButton.addEventListener('click', () => {
    openView(home);
    exports.controller = {};
    refreshControls();

    var screen = document.getElementById('screen');
    screen.style.setProperty('--theme-color', null);
    screen.classList.remove('light');
  });

  fs.readdir('/opt/orchid/installed', (error, apps) => {
    if (error) {
      console.error(error);
    }

    apps.forEach((app) => {
      var manifestFile = fs.readFileSync('/opt/orchid/installed/' + app + '/manifest.json');
      var manifestJson = JSON.parse(manifestFile);

      var element = document.createElement('div');
      element.classList.add('card');
      element.addEventListener('click', () => {
        console.log('Running /opt/orchid/installed/' + app);
        runCommand('cd /opt/orchid/installed/' + app + '; ' + manifestJson.path + ' ' + manifestJson.arguments);
        LAUNCH_APP_SOUND.play();
      });
      appsContainer.appendChild(element);

      var keyart = document.createElement('img');
      keyart.classList.add('keyart');
      keyart.src = 'file:///opt/orchid/installed/' + app + manifestJson.keyart;
      element.appendChild(keyart);

      var content = document.createElement('div');
      content.classList.add('content');
      element.appendChild(content);

      var name = document.createElement('div');
      name.classList.add('name');
      name.textContent = manifestJson.name;
      content.appendChild(name);

      var description = document.createElement('div');
      description.classList.add('description');
      description.textContent = manifestJson.description;
      content.appendChild(description);
    });
  });
})(window);
