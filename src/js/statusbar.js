(function(exports) {
  'use strict';

  exports.EnglishToArabicNumerals = function EnglishToArabicNumerals(
    numberString
  ) {
    var arabicNumerals = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
    if (document.dir == "rtl") {
      return numberString
        .toLocaleString(navigator.mozL10n.language.code)
        .replace(/[0-9]/g, function (w) {
          return arabicNumerals[+w];
        });
    } else {
      return numberString;
    }
  };

  var time = document.getElementById('statusbar-time');
  var date = new Date();

  setInterval(() => {
    time.textContent = EnglishToArabicNumerals(date.toLocaleTimeString(navigator.language, {
      hour12: true,
      hour: 'numeric',
      minute: 'numeric'
    }));
  }, 500);
})(window);
