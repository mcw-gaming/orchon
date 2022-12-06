(function(exports) {
  'use strict';

  var screen = document.getElementById('screen');

  var browser = document.getElementById('browser');
  var browserButton = document.getElementById('overlay-menu-browser');
  browserButton.addEventListener('click', () => {
    OrchidBrowser.init();
    openView(browser);

    exports.controller = {};
    exports.controller['button1'] = () => {
      OrchidBrowser.selected.webview.goBack();
    };
    refreshControls();
  });

  var tabList = document.getElementById('browser-tab-list');
  var newTabButton = document.getElementById('browser-newtab');
  var navbar = document.getElementById('browser-navbar');
  var webviews = document.getElementById('browser-webviews');

  var backButton = document.getElementById('browser-navbar-back');
  var forwardButton = document.getElementById('browser-navbar-forward');
  var reloadButton = document.getElementById('browser-navbar-reload');
  var homeButton = document.getElementById('browser-navbar-home');
  var profileButton = document.getElementById('browser-navbar-profile');
  var profileAvatar = document.getElementById('browser-navbar-profile-avatar');
  var optionsButton = document.getElementById('browser-navbar-options');

  var urlbar = document.getElementById('browser-urlbar');
  var security = document.getElementById('browser-urlbar-security');
  var urlbarInput = document.getElementById('browser-urlbar-input');
  var goButton = document.getElementById('browser-urlbar-go');
  var bookmarkButton = document.getElementById('browser-urlbar-bookmark');

  var OrchidBrowser = {
    startPageUrl: 'https://orchidfoss.github.io/start/',
    searchUrl: 'https://www.google.com/search?q=',
    selected: {
      webview: null,
      tab: null
    },

    init: function ob_init() {
      OrchidBrowser.newTab({ selected: true });

      if (OrchidServices.isUserLoggedIn()) {
        OrchidServices.getWithUpdate('profile/' + OrchidServices.userId(), (data) => {
          if (data) {
            profileAvatar.src = data.profile_picture;
          }
        });
      }

      newTabButton.addEventListener('click', OrchidBrowser);
      backButton.addEventListener('click', OrchidBrowser);
      forwardButton.addEventListener('click', OrchidBrowser);
      reloadButton.addEventListener('click', OrchidBrowser);
      homeButton.addEventListener('click', OrchidBrowser);
      profileButton.addEventListener('click', OrchidBrowser);
      optionsButton.addEventListener('click', OrchidBrowser);

      urlbar.addEventListener('submit', OrchidBrowser);
    },

    newTab: function ob_newTab({ selected } = { selected: true }) {
      var webview = document.createElement('webview');
      webview.classList.add('webview');
      webview.src = OrchidBrowser.startPageUrl;
      webview.addEventListener('will-navigate', (evt) => {
        urlbarInput.value = evt.url;
      });
      webview.preload = 'preload.js';
      webviews.appendChild(webview);

      var tab = document.createElement('li');
      tab.classList.add('tab');
      tab.addEventListener('click', () => {
        OrchidBrowser.focus(webview, tab);
      });
      tabList.appendChild(tab);

      var favicon = document.createElement('img');
      favicon.classList.add('favicon');
      favicon.onerror = () => {
        favicon.src = 'images/default.svg';
      };
      webview.addEventListener('page-favicon-updated', (evt) => {
        favicon.src = evt.favicons[0];
      });
      tab.appendChild(favicon);

      var title = document.createElement('div');
      title.classList.add('title');
      webview.addEventListener('page-title-updated', (evt) => {
        title.textContent = evt.title;
      });
      tab.appendChild(title);

      var closeButton = document.createElement('button');
      closeButton.classList.add('close-button');
      closeButton.dataset.icon = 'close';
      closeButton.addEventListener('click', () => {
        OrchidBrowser.close(webviews, tab);
      });
      tab.appendChild(closeButton);

      if (selected) {
        OrchidBrowser.focus(webview, tab);
      }
    },

    focus: function ob_focus(webview, tab) {
      if (OrchidBrowser.selected.webview) {
        OrchidBrowser.selected.webview.classList.remove('selected');
      }
      if (OrchidBrowser.selected.tab) {
        OrchidBrowser.selected.tab.classList.remove('selected');
      }

      webview.classList.add('selected');
      tab.classList.add('selected');

      OrchidBrowser.selected.webview = webview;
      OrchidBrowser.selected.tab = tab;
    },

    close: function ob_close(webview, tab) {
      var nearWebview = (webview.previousElementSibling || document.querySelector('.webviews .webview'));
      var nearTab = (tab.previousElementSibling || document.querySelector('.tab-list .tab'));

      if (nearWebview || nearTab) {
        OrchidBrowser.focus(nearWebview, nearTab);
      }

      if (webview) {
        webview.remove();
      }
      if (tab) {
        tab.remove();
      }
    },

    handleEvent: function ob_handleEvent(evt) {
      var currentWebview = OrchidBrowser.selected.webview;

      switch (evt.type) {
        case 'click':
          switch (evt.target) {
            case newTabButton:
              OrchidBrowser.newTab({ selected: true });
              break;

            case backButton:
              currentWebview.goBack();
              break;

            case forwardButton:
              currentWebview.goForward();
              break;

            case reloadButton:
              currentWebview.reload();
              break;

            case homeButton:
              currentWebview.src = OrchidBrowser.startPageUrl;
              break;

            case profileButton:
              currentWebview.src = 'https://orchidfoss.github.io/profile/?user_id=' + OrchidServices.userId();
              break;

            case optionsButton:
              break;
          }
          break;

        case 'submit':
          evt.preventDefault();
          const isValidUrl = urlString => {
            if (!urlString.includes(' ') && (urlString.includes('.') || urlString.includes(':'))) {
              return 'short-url';
            } else if (!urlString.includes(' ') && (urlString.includes('.') || urlString.includes(':')) && urlString.includes('://')) {
              return 'full-url';
            } else {
              return 'string';
            }
          }

          if (isValidUrl(urlbarInput.value) == 'full-url') {
            currentWebview.src = encodeURI(urlbarInput.value);
          } else if (isValidUrl(urlbarInput.value) == 'short-url') {
            currentWebview.src = 'https://' + encodeURI(urlbarInput.value);
          } else {
            currentWebview.src = OrchidBrowser.searchUrl + encodeURI(urlbarInput.value);
          }
          break;
      }
    }
  }
})(window);
