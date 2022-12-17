(function(exports) {
  'use strict';

  const { exec } = require('child_process');
  const { ipcRenderer } = require('electron');

  function runCommand(shellCommand) {
    exec(shellCommand, (error, stdout, stderr) => {
      if (error) {
        console.error(error);
      }
    });
  }

  var isGameOpen = false;
  exports.controller = {};
  exports.controller_hinted = {};
  var cursorPos = {
    x: (window.innerWidth / 2),
    y: (window.innerHeight / 2)
  }
  var lastCursorPos = {
    x: (window.innerWidth / 2),
    y: (window.innerHeight / 2)
  }

  var views = document.getElementById('views');
  var cursorElement = document.getElementById('cursor');
  var overlayMenu = document.getElementById('overlay-menu');
  var views = document.getElementById('views');

  function moveCursor(gamepad) {
    var x = parseFloat(gamepad.axeValues[1][0]) * (window.devicePixelRatio * 24);
    var y = parseFloat(gamepad.axeValues[1][1]) * (window.devicePixelRatio * 24);

    cursorPos = {
      x: cursorPos.x + x,
      y: cursorPos.y + y
    }

    if (cursorPos.x <= 0) {
      cursorPos.x = 0;
    }
    if (cursorPos.y <= 0) {
      cursorPos.y = 0;
    }

    if (cursorPos.x >= window.innerWidth) {
      cursorPos.x = window.innerWidth;
    }
    if (cursorPos.y >= window.innerHeight) {
      cursorPos.y = window.innerHeight;
    }

    cursorElement.style.left = cursorPos.x + 'px';
    cursorElement.style.top = cursorPos.y + 'px';
    if (lastCursorPos !== cursorPos) {
      if (x !== 0 || y !== 0) {
        runCommand(`xdotool mousemove ${cursorPos.x + window.screenLeft} ${cursorPos.y + window.screenTop}`);
      }
      lastCursorPos = cursorPos;
    }
  }

  // Mouse
  function clickStart() {
    runCommand('xdotool mousedown 1');
  }
  function clickEnd() {
    runCommand('xdotool mouseup 1');
  }
  function contextMenu() {
    runCommand('xdotool click 3');
  }
  function wheelUp() {
    runCommand('xdotool click 4');
  }
  function wheelDown() {
    runCommand('xdotool click 5');
  }

  // Keyboard
  function key(key) {
    runCommand(`xdotool key ${key}`);
  }

  exports.triggerHaptics = (duration, power, gamepad = gameControl.gamepads['0']) => {
    gamepad.hapticActuator.playEffect('dual-rumble', {
      startDelay: 0,
      duration: duration,
      weakMagnitude: power,
      strongMagnitude: power,
    });
  };

  gameControl.on('connect', function(gamepad) {
    OrchidNotification.send({
      icon: 'images/system_256.png',
      title: navigator.mozL10n.get('controller-paired')
    });

    exports.refreshControls = () => {
      exports.controller['power'] = () => {
        overlayMenu.classList.toggle('visible');
        views.classList.toggle('hidden');

        if (isGameOpen) {
          if (overlayMenu.classList.contains('visible')) {
            ipcRenderer.send('orchidgamedeck-focus');
          } else {
            ipcRenderer.send('orchidgamedeck-blur');
          }
        } else {
          ipcRenderer.send('orchidgamedeck-focus');
        }
        triggerHaptics(100, 1);
      };

      controller['l1'] = wheelUp;
      controller['r1'] = wheelDown;
      controller['l2'] = contextMenu;

      refreshControlTooltips();

      gamepad.after('power', controller_hinted['power']);
      gamepad.after('button1', controller_hinted['button1']);

      // Mouse controls
      window.addEventListener('gc.analog.start', function(event) {
        var stick = event.detail;
        console.log(stick);
      });

      function animate() {
        requestAnimationFrame(animate);

        moveCursor(gamepad);
      }
      animate();

      gamepad.after('left0', () => key('w'));
      gamepad.after('right0', () => key('a'));
      gamepad.after('up0', () => key('s'));
      gamepad.after('down0', () => key('d'));

      gamepad.on('l1', controller_hinted['l1']);
      gamepad.on('r1', controller_hinted['r1']);

      gamepad.after('l2', controller_hinted['l2']);
      gamepad.on('r2', clickStart);
      gamepad.after('r2', clickEnd);
    };

    refreshControls();
  });

  gameControl.on('disconnect', function(gamepad) {
    OrchidNotification.send({
      icon: 'images/system_256.png',
      title: navigator.mozL10n.get('controller-unpaired')
    });
  });

  var controllerHints = document.getElementById('controller-hints');
  exports.refreshControlTooltips = () => {
    controllerHints.innerHTML = '';

    var entries = Object.entries(controller);
    entries.forEach((entry) => {
      var element = document.createElement('div');
      element.classList.add('controller-hint');
      if (entry[0] == 'power') {
        element.classList.add('menu');
        controllerHints.appendChild(element);
      } else {
        setTimeout(() => {
          controllerHints.appendChild(element);
        });
      }

      var icon = document.createElement('img');
      icon.classList.add('icon');
      switch (entry[0]) {
        case 'l1':
          icon.src = 'assets/xbox/XboxSeriesX_LB.png';
          break;

        case 'r1':
          icon.src = 'assets/xbox/XboxSeriesX_RB.png';
          break;

        case 'l2':
          icon.src = 'assets/xbox/XboxSeriesX_LT.png';
          break;

        case 'r2':
          icon.src = 'assets/xbox/XboxSeriesX_RT.png';
          break;

        case 'power':
          icon.src = 'assets/xbox/XboxSeriesX_Menu.png';
          break;

        case 'button1':
          icon.src = 'assets/xbox/XboxSeriesX_B.png';
          break;
      }
      element.appendChild(icon);

      var title = document.createElement('div');
      title.classList.add('title');
      title.dataset.l10nId = 'controllerHint-' + entry[0];
      element.appendChild(title);

      exports.controller_hinted[entry[0]] = () => {
        exports.controller[entry[0]]();
        element.classList.add('active');
        setTimeout(() => {
          element.classList.remove('active');
        }, 200);
      };
    });
  };
})(window);
