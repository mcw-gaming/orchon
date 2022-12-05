const fs = require('fs');

(function(exports) {
  'use strict';

  const { exec } = require('child_process');

  function runCommand(shellCommand) {
    exec(shellCommand, (error, stdout, stderr) => {
      if (error) {
        console.error(error);
      }
    });
  }

  var home = document.getElementById('home');
  var appsContainer = document.getElementById('home-installed');

  home.classList.add('visible');

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
