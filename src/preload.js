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
});