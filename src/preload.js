// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

document.addEventListener('DOMContentLoaded', () => {
  var style = document.createElement('style');
  style.innerHTML = `
    * {
      cursor: none !important;
    }
  `;
  document.head.appendChild(style);

  const Keyboard = window.SimpleKeyboard.default;
  const myKeyboard = new Keyboard({
    onChange: input => onChange(input)
  });

  function onChange(input) {
    var inputbox = document.querySelector("input[type=text]:focus");
    inputbox.value = input;
    console.log("Input changed", input);
    inputbox.onblur = () => {
      inputbox.focus();
    }
  }
});