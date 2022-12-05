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

  exports.controller = {};
  exports.controller_hinted = {};
  var cursorPos = {
    x: 0,
    y: 0
  }
  var momentum = 1;

  var views = document.getElementById('views');
  var cursorElement = document.getElementById('cursor');
  function moveCursor(x, y) {
    cursorPos = {
      x: cursorPos.x + (x * momentum),
      y: cursorPos.y + (y * momentum)
    }
    momentum += 0.1;

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
    runCommand(`xdotool mousemove ${cursorPos.x + window.screenLeft} ${cursorPos.y + window.screenTop}`);

    if (x !== 0) {
      if (x >= 0) {
        cursorElement.style.transform = 'rotate(' + (momentum * 3) + 'deg)';
      } else {
        cursorElement.style.transform = 'rotate(' + ((momentum * 3) * -1) + 'deg)';
      }
    }

    if (y !== 0) {
      if (y >= 0) {
        cursorElement.style.transform = 'rotate(' + ((momentum * 3) * -1) + 'deg)';
      } else {
        cursorElement.style.transform = 'rotate(' + (momentum * 3) + 'deg)';
      }
    }
  }

  function stopCursor() {
    momentum = 1;
    cursorElement.style.transform = 'rotate(0deg)';
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
    runCommand(`xdotool mousedown ${key}`);
  }

  gameControl.on('connect', function(gamepad) {
    exports.refreshControls = () => {
      controller['l1'] = wheelUp;
      controller['r1'] = wheelDown;
      controller['l2'] = contextMenu;

      refreshControlTooltips();

      gamepad.after('power', controller_hinted['power']);
      gamepad.after('button1', controller_hinted['button1']);

      // Mouse controls
      gamepad.on('left1', () => moveCursor(-1, 0));
      gamepad.on('right1', () => moveCursor(1, 0));
      gamepad.on('up1', () => moveCursor(0, -1));
      gamepad.on('down1', () => moveCursor(0, 1));
      gamepad.on('left1 up1', () => moveCursor(-1, -1));
      gamepad.on('right1 up1', () => moveCursor(1, -1));
      gamepad.on('left1 down1', () => moveCursor(-1, 1));
      gamepad.on('right1 down1', () => moveCursor(1, 1));

      gamepad.after('left0', () => key('w'));
      gamepad.after('right0', () => key('a'));
      gamepad.after('up0', () => key('s'));
      gamepad.after('down0', () => key('d'));

      gamepad.after('left1', stopCursor);
      gamepad.after('right1', stopCursor);
      gamepad.after('up1', stopCursor);
      gamepad.after('down1', stopCursor);

      gamepad.on('l1', controller_hinted['l1']);
      gamepad.on('r1', controller_hinted['r1']);

      gamepad.after('l2', controller_hinted['l2']);
      gamepad.on('r2', clickStart);
      gamepad.after('r2', clickEnd);
    };

    refreshControls();
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
