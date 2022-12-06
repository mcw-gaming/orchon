(function(exports) {
  'use strict';

  var NOTIFY_SHOW = new Audio('resources/sounds/notifier_show.wav');
  var NOTIFY_HIDE = new Audio('resources/sounds/notifier_hide.wav');

  var notificationToaster = document.getElementById('notification');
  var notificationIcon = document.getElementById('notification-icon');
  var notificationTitle = document.getElementById('notification-title');
  var notificationDetail = document.getElementById('notification-detail');

  exports.OrchidNotification = {
    send: function on_send({ icon, title, detail } = { icon: 'images/system_256.png', title: 'Notification', detail: '' }) {
      notificationToaster.classList.add('visible');
      NOTIFY_SHOW.play();
      triggerHaptics(50);

      notificationIcon.src = icon || 'images/system_256.png';
      notificationTitle.textContent = title;
      notificationDetail.innerText = detail || '';

      setTimeout(() => {
        notificationToaster.classList.remove('visible');
        NOTIFY_HIDE.play();
      }, 3000);
    }
  };
})(window);
